import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Transformer Loading Calculator                                      */
/*  For open pit mine electricians — portable substations, haul truck   */
/*  shops, crushers, conveyors, and surface facilities.                 */
/* ------------------------------------------------------------------ */

type TabKey = 'loading' | 'derating' | 'life' | 'sizing'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'loading', label: 'Loading Analysis' },
  { key: 'derating', label: 'Temp & Derating' },
  { key: 'life', label: 'Life Expectancy' },
  { key: 'sizing', label: 'Sizing Guide' },
]

/* ------------------------------------------------------------------ */
/*  Constants & Data                                                    */
/* ------------------------------------------------------------------ */

const STANDARD_MINE_KVA = [75, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500] as const

const SQRT3 = Math.sqrt(3)

/** Derating factors for ambient temperature above 30 deg C */
const AMBIENT_DERATING_TABLE: { tempC: number; factor: number; note: string }[] = [
  { tempC: 30, factor: 1.00, note: 'Rated — standard nameplate conditions' },
  { tempC: 35, factor: 0.975, note: 'Mild summer day at pit surface' },
  { tempC: 40, factor: 0.95, note: 'Hot summer — common in open pit operations' },
  { tempC: 45, factor: 0.925, note: 'Extreme heat — near crusher/conveyor drives' },
  { tempC: 50, factor: 0.90, note: 'Enclosed or poorly ventilated portable substation' },
  { tempC: 55, factor: 0.875, note: 'Severe — consider forced cooling or load shedding' },
  { tempC: 60, factor: 0.85, note: 'Critical — reduce load immediately' },
]

/** Altitude derating: 0.4% per 100m above 1000m */
const ALTITUDE_DERATING_TABLE: { altitudeM: number; factor: number; note: string }[] = [
  { altitudeM: 0, factor: 1.000, note: 'Sea level' },
  { altitudeM: 500, factor: 1.000, note: 'Below threshold — no derating' },
  { altitudeM: 1000, factor: 1.000, note: 'Base elevation — derating starts above here' },
  { altitudeM: 1500, factor: 0.980, note: '2% derating' },
  { altitudeM: 2000, factor: 0.960, note: '4% derating' },
  { altitudeM: 2500, factor: 0.940, note: '6% derating — high-altitude mining' },
  { altitudeM: 3000, factor: 0.920, note: '8% derating' },
  { altitudeM: 3500, factor: 0.900, note: '10% derating — extreme elevation' },
]

/** IEEE C57.91 aging data: loading % vs per-unit life and multiplier */
const LIFE_AGING_TABLE: {
  loadPct: number
  hotSpotRiseC: number
  hotSpotTotalC: number
  perUnitAging: number
  lifeMultiplier: string
  note: string
}[] = [
  { loadPct: 50, hotSpotRiseC: 35, hotSpotTotalC: 65, perUnitAging: 0.0004, lifeMultiplier: '2500x', note: 'Very light load — extremely long life' },
  { loadPct: 70, hotSpotRiseC: 52, hotSpotTotalC: 82, perUnitAging: 0.018, lifeMultiplier: '56x', note: 'Light load — excellent life expectancy' },
  { loadPct: 80, hotSpotRiseC: 59, hotSpotTotalC: 89, perUnitAging: 0.073, lifeMultiplier: '14x', note: 'Moderate — well within limits' },
  { loadPct: 90, hotSpotRiseC: 68, hotSpotTotalC: 98, perUnitAging: 0.282, lifeMultiplier: '3.5x', note: 'Good loading — normal life' },
  { loadPct: 100, hotSpotRiseC: 78, hotSpotTotalC: 108, perUnitAging: 0.865, lifeMultiplier: '1.15x', note: 'Full rated load — near normal life' },
  { loadPct: 110, hotSpotRiseC: 92, hotSpotTotalC: 122, perUnitAging: 4.93, lifeMultiplier: '0.20x', note: '5x accelerated aging — limit duration' },
  { loadPct: 120, hotSpotRiseC: 106, hotSpotTotalC: 136, perUnitAging: 23.4, lifeMultiplier: '0.043x', note: '~23x accelerated aging — short term only' },
  { loadPct: 130, hotSpotRiseC: 120, hotSpotTotalC: 150, perUnitAging: 95.0, lifeMultiplier: '0.011x', note: '~95x aging — emergency only, monitor closely' },
  { loadPct: 140, hotSpotRiseC: 135, hotSpotTotalC: 165, perUnitAging: 340.0, lifeMultiplier: '0.003x', note: 'Extreme damage — immediate risk of failure' },
  { loadPct: 150, hotSpotRiseC: 150, hotSpotTotalC: 180, perUnitAging: 1050.0, lifeMultiplier: '<0.001x', note: 'CRITICAL — insulation breakdown imminent' },
]

/** Standard transformer sizes with mine applications */
interface SizingEntry {
  kva: number
  typicalPrimary: string
  typicalSecondary: string
  typicalApplication: string
  flaSecondary600V: string
  flaSecondary4160V: string
  weight: string
  notes: string
}

const SIZING_GUIDE_DATA: SizingEntry[] = [
  {
    kva: 75,
    typicalPrimary: '4160V',
    typicalSecondary: '600V',
    typicalApplication: 'Small tool trailers, temporary lighting, welding outlets at blast pattern',
    flaSecondary600V: '72A',
    flaSecondary4160V: '10A',
    weight: '~700 kg',
    notes: 'Single-phase also common at this size for welding power',
  },
  {
    kva: 150,
    typicalPrimary: '4160V',
    typicalSecondary: '600V',
    typicalApplication: 'Drill power supply, small pump stations, mine dewatering at bench level',
    flaSecondary600V: '144A',
    flaSecondary4160V: '21A',
    weight: '~1,100 kg',
    notes: 'Common for portable drill power on skid mounts',
  },
  {
    kva: 225,
    typicalPrimary: '4160V',
    typicalSecondary: '600V',
    typicalApplication: 'Small conveyor drives, auxiliary equipment at crusher station',
    flaSecondary600V: '217A',
    flaSecondary4160V: '31A',
    weight: '~1,500 kg',
    notes: 'Portable substation for haul road lighting circuits',
  },
  {
    kva: 300,
    typicalPrimary: '4160V / 13.8kV',
    typicalSecondary: '600V',
    typicalApplication: 'Medium conveyor drives, tire shop, lube bay, mine dry buildings',
    flaSecondary600V: '289A',
    flaSecondary4160V: '42A',
    weight: '~1,900 kg',
    notes: 'Good general-purpose size for surface buildings',
  },
  {
    kva: 500,
    typicalPrimary: '4160V / 13.8kV',
    typicalSecondary: '600V',
    typicalApplication: 'Haul truck shop, primary crusher auxiliary, wash bay, fuel station',
    flaSecondary600V: '481A',
    flaSecondary4160V: '69A',
    weight: '~2,800 kg',
    notes: 'Most popular size for open pit mine portable substations',
  },
  {
    kva: 750,
    typicalPrimary: '4160V / 13.8kV',
    typicalSecondary: '600V',
    typicalApplication: 'Large shop facilities, shovel feed, conveyor transfer stations',
    flaSecondary600V: '722A',
    flaSecondary4160V: '104A',
    weight: '~3,800 kg',
    notes: 'Requires crane or heavy haul for relocation',
  },
  {
    kva: 1000,
    typicalPrimary: '13.8kV / 44kV',
    typicalSecondary: '4160V / 600V',
    typicalApplication: 'Main crusher drive, large conveyor systems, primary mill feed',
    flaSecondary600V: '962A',
    flaSecondary4160V: '139A',
    weight: '~5,200 kg',
    notes: 'Permanent pad-mount typical; oil-filled with DGA schedule',
  },
  {
    kva: 1500,
    typicalPrimary: '13.8kV / 44kV',
    typicalSecondary: '4160V / 600V',
    typicalApplication: 'Main process plant feed, large shovel power, primary substation',
    flaSecondary600V: '1443A',
    flaSecondary4160V: '208A',
    weight: '~7,500 kg',
    notes: 'Usually permanent installation with concrete pad and containment',
  },
  {
    kva: 2000,
    typicalPrimary: '44kV / 13.8kV',
    typicalSecondary: '4160V / 600V',
    typicalApplication: 'Main pit substation, process plant main, SAG/ball mill feed',
    flaSecondary600V: '1925A',
    flaSecondary4160V: '277A',
    weight: '~10,000 kg',
    notes: 'Forced-oil cooling (OFAF) common at this size',
  },
  {
    kva: 2500,
    typicalPrimary: '44kV / 13.8kV',
    typicalSecondary: '4160V',
    typicalApplication: 'Main mine substation, utility interconnection transformer',
    flaSecondary600V: '2406A',
    flaSecondary4160V: '347A',
    weight: '~12,500 kg',
    notes: 'Primary relay protection mandatory; oil containment required',
  },
]

/** Voltage combos common in Ontario mining */
interface VoltageCombo {
  primary: string
  secondary: string
  application: string
  cecNotes: string
}

const VOLTAGE_COMBOS: VoltageCombo[] = [
  {
    primary: '44 kV',
    secondary: '13.8 kV / 4160V',
    application: 'Utility feed to mine main substation. Steps down to MV distribution.',
    cecNotes: 'CEC Rule 36 — high-voltage installations. Relay protection required.',
  },
  {
    primary: '13.8 kV',
    secondary: '4160V',
    application: 'Main mine distribution to pit substations, crusher/conveyor feeds, large motor starters.',
    cecNotes: 'CEC Rule 36 — medium-voltage. Ground fault protection per Ontario Reg. 854.',
  },
  {
    primary: '4160V',
    secondary: '600V',
    application: 'Portable pit substations, shop buildings, haul truck bays, surface equipment.',
    cecNotes: 'CEC Rule 26-252 — transformer protection. Max 300% primary fuse for Z > 6%.',
  },
  {
    primary: '600V',
    secondary: '120/208V',
    application: 'Dry-type step-down for lighting, controls, receptacles, instrumentation.',
    cecNotes: 'CEC Rule 26-252(2) — primary protection max 300%. Secondary optional if primary protects.',
  },
  {
    primary: '600V',
    secondary: '347/600V (wye)',
    application: 'Lighting transformers for HID lighting towers on haul roads, processing plant high-bay.',
    cecNotes: 'CEC Rule 30 — lighting circuits. 347V lighting common in Canadian industrial.',
  },
  {
    primary: '4160V',
    secondary: '600V (resistance grounded)',
    application: 'Portable power centers with integral ground fault protection for trailing cable equipment.',
    cecNotes: 'Ground fault protection at 100mA per Ontario Mining Regulation (O.Reg 854).',
  },
]

/** CEC/NEC transformer protection rules */
interface ProtectionRule {
  condition: string
  primaryMax: string
  secondaryMax: string
  notes: string
}

const PROTECTION_RULES: ProtectionRule[] = [
  {
    condition: 'Z > 6%, primary fuse only',
    primaryMax: '300% rated primary current',
    secondaryMax: 'Not required',
    notes: 'CEC 26-252(1): Most common for mine portable substations (Z = 5.75% typical)',
  },
  {
    condition: 'Z > 6%, primary & secondary',
    primaryMax: '300% rated primary current',
    secondaryMax: '125% rated secondary current',
    notes: 'CEC 26-252(2): Provides better secondary protection but more coordination effort',
  },
  {
    condition: 'Z <= 6%, primary fuse only',
    primaryMax: '200% rated primary current',
    secondaryMax: 'Not required',
    notes: 'Lower impedance units need tighter primary protection',
  },
  {
    condition: 'Over 1000V primary',
    primaryMax: 'Per CEC Rule 26-252(5)',
    secondaryMax: 'Per secondary voltage class',
    notes: 'Medium-voltage transformers: relay protection with CTs preferred over fuses',
  },
  {
    condition: 'Dry-type, 600V class',
    primaryMax: '250% rated primary current',
    secondaryMax: '125% or 167% rated secondary current',
    notes: 'CEC 26-252 for dry-type transformers used in shop/office step-down',
  },
]

/** Load diversity factors for mine operations */
interface DiversityFactor {
  application: string
  factor: number
  notes: string
}

const DIVERSITY_FACTORS: DiversityFactor[] = [
  { application: 'Haul truck shop (multiple bays)', factor: 0.65, notes: 'Not all bays active simultaneously; stagger heavy repairs' },
  { application: 'Welding receptacles (6+ outlets)', factor: 0.50, notes: 'Intermittent duty; CEC demand factor for welders' },
  { application: 'Conveyor system (multiple drives)', factor: 0.85, notes: 'Most drives run simultaneously; allow for starting current' },
  { application: 'Crusher station (primary + auxiliary)', factor: 0.80, notes: 'Main crusher continuous; ancillary equipment cycled' },
  { application: 'Mine lighting (pit perimeter)', factor: 0.90, notes: 'Most lights on together during dark operations; stagger startup' },
  { application: 'Office / dry building', factor: 0.70, notes: 'Standard commercial diversity applies' },
  { application: 'Drill pattern (multiple rigs)', factor: 0.60, notes: 'Drills cycle independently; rarely all at full load' },
  { application: 'Pump station (duplex/triplex)', factor: 0.75, notes: 'Lead/lag operation; one pump always standby' },
  { application: 'Electric rope shovel', factor: 0.95, notes: 'Near-continuous heavy loading during production shifts' },
  { application: 'Batch plant / concrete', factor: 0.70, notes: 'Cyclic loading — mixing, conveying, water pumps' },
]

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                    */
/* ------------------------------------------------------------------ */

/** Calculate FLA from kVA and voltage (3-phase) */
function calcFLA(kva: number, voltageKV: number): number {
  return kva / (SQRT3 * voltageKV)
}

/** Ambient temperature derating: 2.5% per 5 deg C above 30 */
function calcAmbientDerating(ambientC: number): number {
  if (ambientC <= 30) return 1.0
  const excessC = ambientC - 30
  const derating = 1.0 - (excessC / 5) * 0.025
  return Math.max(derating, 0.5)
}

/** Altitude derating: 0.4% per 100m above 1000m */
function calcAltitudeDerating(altitudeM: number): number {
  if (altitudeM <= 1000) return 1.0
  const excessM = altitudeM - 1000
  const derating = 1.0 - (excessM / 100) * 0.004
  return Math.max(derating, 0.5)
}

/** IEEE C57.91 per-unit aging acceleration factor for 65 deg C rise transformers */
function calcPerUnitAging(hotSpotC: number): number {
  return Math.exp((hotSpotC - 110) / 6.328)
}

/** Estimate hot spot temperature from loading and ambient */
function calcHotSpot(loadingPct: number, ambientC: number): number {
  const ratedHotSpotRise = 78
  const loadPU = loadingPct / 100
  const hotSpotRise = ratedHotSpotRise * Math.pow(loadPU, 1.6)
  return ambientC + hotSpotRise
}

/** Format number with fixed decimals */
function fmt(n: number, decimals: number = 1): string {
  if (!isFinite(n)) return '—'
  return n.toFixed(decimals)
}

/** Get loading bar color */
function getLoadingColor(pct: number): string {
  if (pct < 80) return '#4ade80'
  if (pct <= 100) return '#fbbf24'
  return '#ef4444'
}

/** Get loading status label */
function getLoadingStatus(pct: number): string {
  if (pct < 50) return 'Light load'
  if (pct < 80) return 'Normal loading'
  if (pct < 100) return 'Heavy loading'
  if (pct <= 110) return 'Moderate overload'
  if (pct <= 130) return 'Severe overload'
  return 'CRITICAL OVERLOAD'
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 8, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', paddingBottom: 4, scrollbarWidth: 'none',
}
const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 48, padding: '0 16px', borderRadius: 24,
  fontSize: 13, fontWeight: 600, border: '2px solid var(--divider)',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
}
const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)', color: '#000',
  border: '2px solid var(--primary)',
}

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', padding: '14px',
}

const cardElevated: React.CSSProperties = {
  background: 'var(--surface-elevated)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)', padding: '14px',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 16,
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text)',
  fontFamily: 'var(--font-mono)', outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontSize: 16,
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text)',
  fontFamily: 'var(--font-mono)', outline: 'none',
  boxSizing: 'border-box',
  appearance: 'none' as const,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23888\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  paddingRight: 32,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
  marginBottom: 4, display: 'block',
}

const monoValue: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)',
}

const noteBox: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
  borderLeft: '3px solid var(--primary)',
}

const warningBox: React.CSSProperties = {
  background: 'rgba(239,68,68,0.08)', border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
  fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
  borderLeft: '3px solid #ef4444',
}

const gridRow: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
}

const resultRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
  padding: '8px 0', borderBottom: '1px solid var(--divider)',
}

const tableHeader: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: 0.5, padding: '8px 10px',
  borderBottom: '2px solid var(--divider)', textAlign: 'left',
}

const tableCell: React.CSSProperties = {
  fontSize: 13, padding: '8px 10px', color: 'var(--text)',
  borderBottom: '1px solid var(--divider)', verticalAlign: 'top',
}

const tableCellMono: React.CSSProperties = {
  fontSize: 13, padding: '8px 10px', color: 'var(--text)',
  borderBottom: '1px solid var(--divider)', verticalAlign: 'top',
  fontFamily: 'var(--font-mono)', fontWeight: 600,
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function TransformerLoadingPage() {
  const [tab, setTab] = useState<TabKey>('loading')

  /* ---- Loading Analysis state ---- */
  const [selectedKva, setSelectedKva] = useState('500')
  const [customKva, setCustomKva] = useState('')
  const [primaryVoltage, setPrimaryVoltage] = useState('4160')
  const [secondaryVoltage, setSecondaryVoltage] = useState('600')
  const [loadInputMode, setLoadInputMode] = useState<'amps' | 'kw'>('amps')
  const [loadValue, setLoadValue] = useState('')

  /* ---- Derating state ---- */
  const [deratingKva, setDeratingKva] = useState('500')
  const [ambientTemp, setAmbientTemp] = useState('30')
  const [altitude, setAltitude] = useState('300')

  /* ---- Life Expectancy state ---- */
  const [lifeLoadingPct, setLifeLoadingPct] = useState('100')
  const [lifeAmbientTemp, setLifeAmbientTemp] = useState('30')
  const [lifeDurationHrs, setLifeDurationHrs] = useState('8760')

  /* ================================================================ */
  /*  Loading Analysis Calculations                                    */
  /* ================================================================ */
  const kvaRating = selectedKva === 'custom'
    ? parseFloat(customKva) || 0
    : parseFloat(selectedKva) || 0
  const priV = parseFloat(primaryVoltage) || 0
  const secV = parseFloat(secondaryVoltage) || 0
  const loadVal = parseFloat(loadValue) || 0

  let actualLoadKva = 0
  if (loadVal > 0 && secV > 0) {
    if (loadInputMode === 'amps') {
      actualLoadKva = (loadVal * secV * SQRT3) / 1000
    } else {
      actualLoadKva = loadVal // kW input — assume PF~1 for conservative kVA
    }
  }

  const loadingPct = kvaRating > 0 ? (actualLoadKva / kvaRating) * 100 : 0
  const remainingKva = kvaRating - actualLoadKva
  const remainingAmps = secV > 0 ? (remainingKva * 1000) / (SQRT3 * secV) : 0
  const primaryFLA = priV > 0 ? calcFLA(kvaRating, priV / 1000) : 0
  const secondaryFLA = secV > 0 ? calcFLA(kvaRating, secV / 1000) : 0
  const actualPrimaryCurrent = priV > 0 ? calcFLA(actualLoadKva, priV / 1000) : 0
  const actualSecondaryCurrent = secV > 0 ? calcFLA(actualLoadKva, secV / 1000) : 0
  const hasLoadingInputs = kvaRating > 0 && loadVal > 0 && secV > 0

  /* ================================================================ */
  /*  Derating Calculations                                            */
  /* ================================================================ */
  const deratingKvaVal = parseFloat(deratingKva) || 0
  const ambientTempVal = parseFloat(ambientTemp) || 30
  const altitudeVal = parseFloat(altitude) || 0
  const ambientFactor = calcAmbientDerating(ambientTempVal)
  const altitudeFactor = calcAltitudeDerating(altitudeVal)
  const combinedFactor = ambientFactor * altitudeFactor
  const deratedCapacity = deratingKvaVal * combinedFactor
  const deratedFLA600 = calcFLA(deratedCapacity, 0.6)
  const hasDeratingInputs = deratingKvaVal > 0

  /* ================================================================ */
  /*  Life Expectancy Calculations                                     */
  /* ================================================================ */
  const lifeLoadVal = parseFloat(lifeLoadingPct) || 100
  const lifeAmbientVal = parseFloat(lifeAmbientTemp) || 30
  const lifeDurationVal = parseFloat(lifeDurationHrs) || 8760
  const hotSpotTemp = calcHotSpot(lifeLoadVal, lifeAmbientVal)
  const perUnitAging = calcPerUnitAging(hotSpotTemp)
  const equivalentAgingHrs = perUnitAging * lifeDurationVal
  const normalLifeYears = 20.55 // IEEE C57.91: ~180,000 hrs
  const normalLifeHrs = normalLifeYears * 8760
  const lossOfLifePct = (equivalentAgingHrs / normalLifeHrs) * 100
  const expectedLifeYears = normalLifeYears / perUnitAging

  /* ================================================================ */
  /*  Render                                                            */
  /* ================================================================ */

  return (
    <>
      <Header title="Transformer Loading" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ---- Tab pills ---- */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB 1: LOADING ANALYSIS                                      */}
        {/* ============================================================ */}
        {tab === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionLabel}>Transformer Rating</div>

            {/* kVA Selection */}
            <div>
              <label style={labelStyle}>Transformer kVA Rating</label>
              <select
                style={selectStyle}
                value={selectedKva}
                onChange={e => setSelectedKva(e.target.value)}
              >
                {STANDARD_MINE_KVA.map(s => (
                  <option key={s} value={String(s)}>{s} kVA</option>
                ))}
                <option value="custom">Custom Size...</option>
              </select>
            </div>

            {selectedKva === 'custom' && (
              <div>
                <label style={labelStyle}>Custom kVA Rating</label>
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputStyle}
                  placeholder="Enter kVA..."
                  value={customKva}
                  onChange={e => setCustomKva(e.target.value)}
                />
              </div>
            )}

            {/* Voltage Inputs */}
            <div style={gridRow}>
              <div>
                <label style={labelStyle}>Primary Voltage (V)</label>
                <select
                  style={selectStyle}
                  value={primaryVoltage}
                  onChange={e => setPrimaryVoltage(e.target.value)}
                >
                  <option value="44000">44,000V (44kV)</option>
                  <option value="13800">13,800V (13.8kV)</option>
                  <option value="4160">4,160V</option>
                  <option value="2400">2,400V</option>
                  <option value="600">600V</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Secondary Voltage (V)</label>
                <select
                  style={selectStyle}
                  value={secondaryVoltage}
                  onChange={e => setSecondaryVoltage(e.target.value)}
                >
                  <option value="4160">4,160V</option>
                  <option value="2400">2,400V</option>
                  <option value="600">600V</option>
                  <option value="480">480V</option>
                  <option value="208">208V</option>
                  <option value="120">120V</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--divider)', marginTop: 4 }} />

            <div style={sectionLabel}>Connected Load</div>

            {/* Load Input Mode Toggle */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={loadInputMode === 'amps' ? pillActive : pillBase}
                onClick={() => setLoadInputMode('amps')}
              >
                Load in Amps
              </button>
              <button
                style={loadInputMode === 'kw' ? pillActive : pillBase}
                onClick={() => setLoadInputMode('kw')}
              >
                Load in kW
              </button>
            </div>

            <div>
              <label style={labelStyle}>
                {loadInputMode === 'amps'
                  ? 'Total Connected Load (Amps at secondary voltage)'
                  : 'Total Connected Load (kW)'}
              </label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                placeholder={loadInputMode === 'amps' ? 'Enter amps...' : 'Enter kW...'}
                value={loadValue}
                onChange={e => setLoadValue(e.target.value)}
              />
            </div>

            {/* Rated FLA Display */}
            {kvaRating > 0 && (
              <div style={cardElevated}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                  RATED FULL LOAD AMPS ({kvaRating} kVA)
                </div>
                <div style={resultRow}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Primary FLA ({(priV / 1000).toFixed(1)} kV)
                  </span>
                  <span style={monoValue}>{fmt(primaryFLA, 1)} A</span>
                </div>
                <div style={{ ...resultRow, borderBottom: 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Secondary FLA ({secV < 1000 ? secV + 'V' : (secV / 1000).toFixed(1) + ' kV'})
                  </span>
                  <span style={monoValue}>{fmt(secondaryFLA, 1)} A</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  FLA = kVA / ({'\√'}3 {'×'} kV)
                </div>
              </div>
            )}

            {/* Loading Results */}
            {hasLoadingInputs && (
              <>
                {/* Visual Loading Bar */}
                <div style={card}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: 8,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                      TRANSFORMER LOADING
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800,
                      color: getLoadingColor(loadingPct),
                    }}>
                      {fmt(loadingPct, 1)}%
                    </span>
                  </div>

                  {/* Bar background */}
                  <div style={{
                    width: '100%', height: 28, background: 'var(--surface-hover)',
                    borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative',
                  }}>
                    {/* Fill bar */}
                    <div style={{
                      width: `${Math.min((loadingPct / 150) * 100, 100)}%`,
                      height: '100%',
                      background: getLoadingColor(loadingPct),
                      borderRadius: 'var(--radius-sm)',
                      transition: 'width 0.3s ease, background 0.3s ease',
                      opacity: 0.85,
                    }} />
                    {/* 80% marker line */}
                    <div style={{
                      position: 'absolute', left: `${(80 / 150) * 100}%`, top: 0, bottom: 0,
                      width: 2, background: 'var(--text-tertiary)', opacity: 0.4,
                    }} />
                    {/* 100% marker line */}
                    <div style={{
                      position: 'absolute', left: `${(100 / 150) * 100}%`, top: 0, bottom: 0,
                      width: 2, background: 'var(--text-tertiary)', opacity: 0.4,
                    }} />
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: 4, fontSize: 11, color: 'var(--text-tertiary)',
                  }}>
                    <span>0%</span>
                    <span style={{ marginLeft: '40%' }}>80%</span>
                    <span>100%</span>
                    <span>150%</span>
                  </div>

                  <div style={{
                    marginTop: 8, fontSize: 14, fontWeight: 700, textAlign: 'center',
                    color: getLoadingColor(loadingPct),
                  }}>
                    {getLoadingStatus(loadingPct)}
                  </div>
                </div>

                {/* Overload Warning */}
                {loadingPct > 100 && (
                  <div style={warningBox}>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#ef4444' }}>
                      {'\⚠'} OVERLOAD WARNING
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Transformer is loaded to {fmt(loadingPct, 1)}% of rated capacity.
                      {loadingPct > 130
                        ? ' Immediate action required — risk of insulation failure and catastrophic damage. Shed loads now.'
                        : loadingPct > 110
                          ? ' Limit duration to avoid accelerated aging. Monitor oil temperature and winding temperature closely.'
                          : ' Short-term overload may be acceptable per IEEE C57.91 but monitor temperatures.'
                      }
                    </div>
                  </div>
                )}

                {/* Detailed Results Card */}
                <div style={cardElevated}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                    LOADING DETAIL
                  </div>
                  <div style={resultRow}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Actual Load</span>
                    <span style={monoValue}>{fmt(actualLoadKva, 1)} kVA</span>
                  </div>
                  <div style={resultRow}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Rated Capacity</span>
                    <span style={monoValue}>{fmt(kvaRating, 0)} kVA</span>
                  </div>
                  <div style={resultRow}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>% Loading</span>
                    <span style={{ ...monoValue, color: getLoadingColor(loadingPct) }}>
                      {fmt(loadingPct, 1)}%
                    </span>
                  </div>
                  <div style={resultRow}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Remaining Capacity</span>
                    <span style={{ ...monoValue, color: remainingKva >= 0 ? '#4ade80' : '#ef4444' }}>
                      {fmt(remainingKva, 1)} kVA
                    </span>
                  </div>
                  <div style={resultRow}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Remaining (Amps @ sec.)</span>
                    <span style={{ ...monoValue, color: remainingAmps >= 0 ? '#4ade80' : '#ef4444' }}>
                      {fmt(remainingAmps, 1)} A
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--divider)', marginTop: 8, paddingTop: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      ACTUAL CURRENTS
                    </div>
                    <div style={resultRow}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        Primary Current (per phase)
                      </span>
                      <span style={monoValue}>{fmt(actualPrimaryCurrent, 1)} A</span>
                    </div>
                    <div style={{ ...resultRow, borderBottom: 'none' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        Secondary Current (per phase)
                      </span>
                      <span style={monoValue}>{fmt(actualSecondaryCurrent, 1)} A</span>
                    </div>
                  </div>
                </div>

                {/* Formula Display */}
                <div style={{ ...noteBox, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Formulas Used:</div>
                  <div>%Loading = (Actual kVA / Rated kVA) {'×'} 100</div>
                  <div>
                    %Loading = ({fmt(actualLoadKva, 1)} / {fmt(kvaRating, 0)}) {'×'} 100 = {fmt(loadingPct, 1)}%
                  </div>
                  <div style={{ marginTop: 4 }}>FLA = kVA / ({'\√'}3 {'×'} kV)</div>
                  {loadInputMode === 'amps' && (
                    <div>
                      Load kVA = (A {'×'} V {'×'} {'\√'}3) / 1000
                      = ({fmt(loadVal, 1)} {'×'} {secV} {'×'} 1.732) / 1000
                      = {fmt(actualLoadKva, 1)} kVA
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mining Notes */}
            <div style={{ ...card, borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                OPEN PIT MINE LOADING NOTES
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18, fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                <li>Portable substations on skids are common in open pit mines and get moved as the pit develops</li>
                <li>Monitor loading closely during peak production shifts — shovel operators and haul trucks drive demand</li>
                <li>Summer ambient temps reduce effective capacity — plan for worst-case 40{'\°'}C conditions</li>
                <li>Keep loading below 80% for continuous duty to allow headroom for motor starting transients</li>
                <li>Check loading with clamp meter at secondary mains during peak shift (typically day shift)</li>
                <li>Record loading readings in substation log for trending and planning</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: TEMP RISE & DERATING                                  */}
        {/* ============================================================ */}
        {tab === 'derating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionLabel}>Ambient Temperature & Altitude Derating</div>

            <div style={noteBox}>
              Transformers are rated at 30{'\°'}C ambient and up to 1000m altitude. Open pit mines
              in summer can easily reach 35{'\–'}40{'\°'}C at surface level, and even higher near engines
              and enclosed substations. High-altitude mine sites must also derate for reduced air density.
            </div>

            {/* Inputs */}
            <div>
              <label style={labelStyle}>Transformer kVA Rating</label>
              <select
                style={selectStyle}
                value={deratingKva}
                onChange={e => setDeratingKva(e.target.value)}
              >
                {STANDARD_MINE_KVA.map(s => (
                  <option key={s} value={String(s)}>{s} kVA</option>
                ))}
              </select>
            </div>

            <div style={gridRow}>
              <div>
                <label style={labelStyle}>Ambient Temperature ({'\°'}C)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputStyle}
                  placeholder="30"
                  value={ambientTemp}
                  onChange={e => setAmbientTemp(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Altitude (metres)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputStyle}
                  placeholder="300"
                  value={altitude}
                  onChange={e => setAltitude(e.target.value)}
                />
              </div>
            </div>

            {/* Derated Results */}
            {hasDeratingInputs && (
              <div style={cardElevated}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                  DERATED CAPACITY
                </div>
                <div style={resultRow}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Nameplate Rating</span>
                  <span style={monoValue}>{fmt(deratingKvaVal, 0)} kVA</span>
                </div>
                <div style={resultRow}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Temperature Factor ({fmt(ambientTempVal, 0)}{'\°'}C)
                  </span>
                  <span style={{ ...monoValue, color: ambientFactor < 1 ? '#fbbf24' : '#4ade80' }}>
                    {fmt(ambientFactor * 100, 1)}%
                  </span>
                </div>
                <div style={resultRow}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Altitude Factor ({fmt(altitudeVal, 0)} m)
                  </span>
                  <span style={{ ...monoValue, color: altitudeFactor < 1 ? '#fbbf24' : '#4ade80' }}>
                    {fmt(altitudeFactor * 100, 1)}%
                  </span>
                </div>
                <div style={resultRow}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Combined Derating Factor</span>
                  <span style={{ ...monoValue, color: combinedFactor < 0.95 ? '#fbbf24' : '#4ade80' }}>
                    {fmt(combinedFactor * 100, 1)}%
                  </span>
                </div>
                <div style={{ ...resultRow, borderBottom: 'none' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Effective Capacity</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800,
                    color: 'var(--primary)',
                  }}>
                    {fmt(deratedCapacity, 0)} kVA
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Derated FLA at 600V:{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {fmt(deratedFLA600, 1)} A
                  </span>
                  {' \• '}
                  Capacity lost:{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ef4444' }}>
                    {fmt(deratingKvaVal - deratedCapacity, 0)} kVA
                  </span>
                </div>
              </div>
            )}

            {/* High Temperature Warning */}
            {ambientTempVal > 40 && (
              <div style={warningBox}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: '#ef4444' }}>
                  {'\⚠'} HIGH AMBIENT TEMPERATURE
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  Ambient temperature of {fmt(ambientTempVal, 0)}{'\°'}C exceeds the typical open pit summer
                  maximum of 40{'\°'}C. Verify temperature measurement location is representative.
                  Consider forced-air cooling, shade structures, or load reduction.
                </div>
              </div>
            )}

            {/* Ambient Temperature Derating Table */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                AMBIENT TEMPERATURE DERATING TABLE
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Temp ({'\°'}C)</th>
                      <th style={tableHeader}>Factor</th>
                      <th style={tableHeader}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AMBIENT_DERATING_TABLE.map(r => (
                      <tr key={r.tempC} style={{
                        background: r.tempC === Math.round(ambientTempVal)
                          ? 'rgba(99,102,241,0.12)' : 'transparent',
                      }}>
                        <td style={tableCellMono}>{r.tempC}{'\°'}C</td>
                        <td style={{
                          ...tableCellMono,
                          color: r.factor < 0.95 ? '#fbbf24' : r.factor < 1 ? 'var(--text)' : '#4ade80',
                        }}>
                          {(r.factor * 100).toFixed(1)}%
                        </td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>
                          {r.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Derating: ~2.5% per 5{'\°'}C above 30{'\°'}C rated ambient
              </div>
            </div>

            {/* Altitude Derating Table */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                ALTITUDE DERATING TABLE
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Altitude (m)</th>
                      <th style={tableHeader}>Factor</th>
                      <th style={tableHeader}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALTITUDE_DERATING_TABLE.map(r => (
                      <tr key={r.altitudeM} style={{
                        background: Math.abs(r.altitudeM - altitudeVal) < 250
                          ? 'rgba(99,102,241,0.12)' : 'transparent',
                      }}>
                        <td style={tableCellMono}>{r.altitudeM.toLocaleString()} m</td>
                        <td style={{
                          ...tableCellMono,
                          color: r.factor < 0.97 ? '#fbbf24' : r.factor < 1 ? 'var(--text)' : '#4ade80',
                        }}>
                          {(r.factor * 100).toFixed(1)}%
                        </td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>
                          {r.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Derating: 0.4% per 100m above 1000m base altitude
              </div>
            </div>

            {/* Formula Box */}
            <div style={{ ...noteBox, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Derating Formulas:</div>
              <div>Temp Factor = 1.0 - ((T_ambient - 30) / 5) {'×'} 0.025</div>
              <div>Alt Factor = 1.0 - ((Alt_m - 1000) / 100) {'×'} 0.004</div>
              <div>{'\ \ '}(applies only above 1000m)</div>
              <div>Derated kVA = Nameplate kVA {'×'} Temp Factor {'×'} Alt Factor</div>
            </div>

            {/* Mining Notes */}
            <div style={{ ...card, borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                OPEN PIT MINE DERATING CONSIDERATIONS
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18, fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                <li>Measure ambient temperature at the transformer, not the weather station — pit bottom can be 5{'\–'}10{'\°'}C warmer</li>
                <li>Enclosed portable substations trap heat — check internal ambient with data logger</li>
                <li>Oil-filled transformers need regular DGA (Dissolved Gas Analysis) testing — quarterly for critical units</li>
                <li>Dust buildup on radiators reduces cooling capacity — schedule cleaning with pit wash trucks</li>
                <li>Summer heat + peak production = worst-case loading scenario — plan capacity for this combination</li>
                <li>Consider top-oil temperature indicator alarms: 85{'\°'}C warning, 95{'\°'}C trip</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: LIFE EXPECTANCY                                       */}
        {/* ============================================================ */}
        {tab === 'life' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionLabel}>Hot Spot Temperature & Aging — IEEE C57.91</div>

            <div style={noteBox}>
              Transformer insulation degrades exponentially with temperature. Per IEEE C57.91, the
              per-unit aging rate doubles for approximately every 6{'\°'}C rise above the rated hot spot
              temperature of 110{'\°'}C (for 65{'\°'}C rise class). Sustained overloading dramatically reduces
              transformer life.
            </div>

            {/* Inputs */}
            <div style={gridRow}>
              <div>
                <label style={labelStyle}>Loading (%)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputStyle}
                  placeholder="100"
                  value={lifeLoadingPct}
                  onChange={e => setLifeLoadingPct(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Ambient Temp ({'\°'}C)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  style={inputStyle}
                  placeholder="30"
                  value={lifeAmbientTemp}
                  onChange={e => setLifeAmbientTemp(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Duration at this loading (hours)</label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                placeholder="8760 (1 year)"
                value={lifeDurationHrs}
                onChange={e => setLifeDurationHrs(e.target.value)}
              />
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                8760 = 1 year {'\•'} 2190 = 3 months {'\•'} 720 = 1 month {'\•'} 168 = 1 week {'\•'} 12 = one shift
              </div>
            </div>

            {/* Results */}
            <div style={cardElevated}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                AGING ANALYSIS
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading</span>
                <span style={{ ...monoValue, color: getLoadingColor(lifeLoadVal) }}>
                  {fmt(lifeLoadVal, 0)}%
                </span>
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Ambient Temperature</span>
                <span style={monoValue}>{fmt(lifeAmbientVal, 0)}{'\°'}C</span>
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Calculated Hot Spot Temp</span>
                <span style={{
                  ...monoValue,
                  color: hotSpotTemp > 140 ? '#ef4444' : hotSpotTemp > 110 ? '#fbbf24' : '#4ade80',
                }}>
                  {fmt(hotSpotTemp, 1)}{'\°'}C
                </span>
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Per-Unit Aging Rate</span>
                <span style={{
                  ...monoValue,
                  color: perUnitAging > 10 ? '#ef4444' : perUnitAging > 1 ? '#fbbf24' : '#4ade80',
                }}>
                  {perUnitAging < 0.01 ? perUnitAging.toExponential(2) : fmt(perUnitAging, 2)}x
                </span>
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Equivalent Aging Hours</span>
                <span style={monoValue}>
                  {equivalentAgingHrs > 1000000
                    ? equivalentAgingHrs.toExponential(2)
                    : fmt(equivalentAgingHrs, 0)} hrs
                </span>
              </div>
              <div style={resultRow}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loss of Normal Life</span>
                <span style={{
                  ...monoValue,
                  color: lossOfLifePct > 10 ? '#ef4444' : lossOfLifePct > 1 ? '#fbbf24' : '#4ade80',
                }}>
                  {lossOfLifePct < 0.01
                    ? lossOfLifePct.toExponential(2)
                    : fmt(lossOfLifePct, 3)}%
                </span>
              </div>
              <div style={{ ...resultRow, borderBottom: 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  Expected Life at this Loading
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800,
                  color: expectedLifeYears < 5 ? '#ef4444'
                    : expectedLifeYears < 15 ? '#fbbf24' : '#4ade80',
                }}>
                  {expectedLifeYears > 100 ? '>100' : fmt(expectedLifeYears, 1)} years
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                Normal insulation life: ~180,000 hours (~20.5 years) per IEEE C57.91
              </div>
            </div>

            {/* Accelerated Aging Warning */}
            {perUnitAging > 5 && (
              <div style={warningBox}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: '#ef4444' }}>
                  {'\⚠'} ACCELERATED AGING WARNING
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  At {fmt(lifeLoadVal, 0)}% loading with {fmt(lifeAmbientVal, 0)}{'\°'}C ambient, the
                  transformer is aging at {fmt(perUnitAging, 1)}x the normal rate. Hot spot temperature
                  of {fmt(hotSpotTemp, 1)}{'\°'}C
                  {hotSpotTemp > 140
                    ? ' exceeds safe limits — risk of immediate insulation failure. Reduce load immediately.'
                    : hotSpotTemp > 120
                      ? ' is dangerously high. Limit overload duration and monitor winding temperature.'
                      : ' is elevated. Plan to reduce loading as soon as practical.'}
                </div>
              </div>
            )}

            {/* Aging Reference Table */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                LOADING vs. AGING RATE — IEEE C57.91 (65{'\°'}C Rise, 30{'\°'}C Ambient)
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Load %</th>
                      <th style={tableHeader}>Hot Spot</th>
                      <th style={tableHeader}>Aging Rate</th>
                      <th style={tableHeader}>Life Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIFE_AGING_TABLE.map(r => {
                      const isHighlighted = Math.abs(r.loadPct - lifeLoadVal) < 5
                      const rowColor = r.loadPct <= 100 ? '#4ade80'
                        : r.loadPct <= 120 ? '#fbbf24' : '#ef4444'
                      return (
                        <tr key={r.loadPct} style={{
                          background: isHighlighted
                            ? 'rgba(99,102,241,0.12)' : 'transparent',
                        }}>
                          <td style={{ ...tableCellMono, color: rowColor, fontWeight: 800 }}>
                            {r.loadPct}%
                          </td>
                          <td style={tableCellMono}>
                            {r.hotSpotTotalC}{'\°'}C
                          </td>
                          <td style={{ ...tableCellMono, color: rowColor }}>
                            {r.perUnitAging < 0.01
                              ? r.perUnitAging.toExponential(1)
                              : r.perUnitAging.toFixed(r.perUnitAging < 1 ? 3 : 1)}x
                          </td>
                          <td style={{ ...tableCellMono, fontSize: 12 }}>
                            {r.lifeMultiplier}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Life Factor: multiplier vs. normal rated life. 1.0x = 20.5 years. Lower = shorter life.
              </div>
            </div>

            {/* Key takeaway cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{
                ...card, textAlign: 'center', borderTop: '3px solid #fbbf24',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>110% Load</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800,
                  color: '#fbbf24', margin: '4px 0',
                }}>
                  ~5x Aging
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>~4 year life</div>
              </div>
              <div style={{
                ...card, textAlign: 'center', borderTop: '3px solid #ef4444',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>120% Load</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800,
                  color: '#ef4444', margin: '4px 0',
                }}>
                  ~23x Aging
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>~11 month life</div>
              </div>
              <div style={{
                ...card, textAlign: 'center', borderTop: '3px solid #ef4444',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>130% Load</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800,
                  color: '#ef4444', margin: '4px 0',
                }}>
                  ~95x Aging
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>~79 day life</div>
              </div>
              <div style={{
                ...card, textAlign: 'center', borderTop: '3px solid #4ade80',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>80% Load</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800,
                  color: '#4ade80', margin: '4px 0',
                }}>
                  0.07x Aging
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>~290 year life</div>
              </div>
            </div>

            {/* IEEE C57.91 Formula */}
            <div style={{ ...noteBox, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                IEEE C57.91 Aging Formula:
              </div>
              <div>Per-unit aging = e^(({'\θ'}_HS - 110) / 6.328)</div>
              <div style={{ marginTop: 4 }}>Where:</div>
              <div>{'\ \ '}{'\θ'}_HS = Hot spot temperature ({'\°'}C)</div>
              <div>{'\ \ '}110{'\°'}C = Reference hot spot for 65{'\°'}C rise class</div>
              <div>{'\ \ '}6.328 = Aging constant (doubling every ~6.3{'\°'}C)</div>
              <div style={{ marginTop: 4 }}>
                Equivalent aging hours = Per-unit aging {'×'} Actual hours
              </div>
              <div>Loss of life % = Equivalent hours / 180,000 hrs {'×'} 100</div>
            </div>

            {/* Mining Life Notes */}
            <div style={{ ...card, borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                MINE TRANSFORMER LIFE MANAGEMENT
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18, fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                <li>Oil-filled transformers need regular DGA testing to detect insulation breakdown gases early</li>
                <li>Key DGA gases: Hydrogen (partial discharge), Acetylene (arcing), Ethylene (severe overheating)</li>
                <li>Trending DGA results is more valuable than single readings — track quarterly at minimum</li>
                <li>Portable substations in pit have shorter life due to vibration, dust, and thermal cycling</li>
                <li>Budget for transformer replacement at 15{'\–'}20 years in mine environment vs 25{'\–'}30 for utility</li>
                <li>Emergency overloading is sometimes necessary — document duration and notify maintenance planning</li>
                <li>Winding temperature indicators (WTI) are critical — calibrate annually and set alarm/trip points</li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: SIZING GUIDE                                          */}
        {/* ============================================================ */}
        {tab === 'sizing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionLabel}>Quick Sizing Reference for Open Pit Mines</div>

            {/* Standard Sizes Reference */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                STANDARD TRANSFORMER SIZES — MINE APPLICATIONS
              </div>
              {SIZING_GUIDE_DATA.map(s => (
                <div key={s.kva} style={{
                  borderBottom: '1px solid var(--divider)', padding: '12px 0',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800,
                      color: 'var(--primary)',
                    }}>
                      {s.kva.toLocaleString()} kVA
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{s.weight}</span>
                  </div>
                  <div style={{
                    fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 6,
                  }}>
                    {s.typicalApplication}
                  </div>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '3px 12px', fontSize: 12,
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Primary: </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)',
                      }}>
                        {s.typicalPrimary}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Secondary: </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)',
                      }}>
                        {s.typicalSecondary}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>FLA @600V: </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)',
                      }}>
                        {s.flaSecondary600V}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>FLA @4160V: </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)',
                      }}>
                        {s.flaSecondary4160V}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-secondary)', marginTop: 4,
                    fontStyle: 'italic', lineHeight: 1.4,
                  }}>
                    {s.notes}
                  </div>
                </div>
              ))}
            </div>

            {/* Voltage Combos — Ontario Mining */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                COMMON VOLTAGE COMBINATIONS — ONTARIO MINING
              </div>
              {VOLTAGE_COMBOS.map((vc, i) => (
                <div key={i} style={{
                  borderBottom: i < VOLTAGE_COMBOS.length - 1
                    ? '1px solid var(--divider)' : 'none',
                  padding: '10px 0',
                }}>
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--primary)', fontSize: 14,
                    }}>
                      {vc.primary}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>{'\→'}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--text)', fontSize: 14,
                    }}>
                      {vc.secondary}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 4,
                  }}>
                    {vc.application}
                  </div>
                  <div style={{
                    fontSize: 12, background: 'var(--surface-hover)', borderRadius: 4,
                    padding: '5px 8px', color: 'var(--text-secondary)', lineHeight: 1.3,
                  }}>
                    <strong style={{ color: 'var(--text)' }}>Code:</strong> {vc.cecNotes}
                  </div>
                </div>
              ))}
            </div>

            {/* CEC Transformer Protection Rules */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                TRANSFORMER PROTECTION — CEC RULE 26-252
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Condition</th>
                      <th style={tableHeader}>Primary Max</th>
                      <th style={tableHeader}>Secondary Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROTECTION_RULES.map((r, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>
                          {r.condition}
                        </td>
                        <td style={{ ...tableCellMono, fontSize: 12 }}>{r.primaryMax}</td>
                        <td style={{ ...tableCellMono, fontSize: 12 }}>{r.secondaryMax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Per Canadian Electrical Code, Section 26. Always verify with current edition.
              </div>
            </div>

            {/* Protection Rule Detail Notes */}
            {PROTECTION_RULES.map((r, i) => (
              <div key={i} style={{
                fontSize: 12, background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)', padding: '8px 12px',
                color: 'var(--text-secondary)', lineHeight: 1.4,
                borderLeft: '3px solid var(--divider)',
              }}>
                <strong style={{ color: 'var(--text)' }}>{r.condition}:</strong> {r.notes}
              </div>
            ))}

            {/* Load Diversity Factors Table */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                LOAD DIVERSITY FACTORS — MINE APPLICATIONS
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Application</th>
                      <th style={tableHeader}>Factor</th>
                      <th style={tableHeader}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DIVERSITY_FACTORS.map((d, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>
                          {d.application}
                        </td>
                        <td style={{
                          ...tableCellMono,
                          color: d.factor >= 0.85 ? '#fbbf24' : '#4ade80',
                        }}>
                          {(d.factor * 100).toFixed(0)}%
                        </td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>
                          {d.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Apply diversity factor to total connected load to estimate actual demand for sizing.
              </div>
            </div>

            {/* Quick Sizing Formula */}
            <div style={{ ...noteBox, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Quick Sizing Method:
              </div>
              <div>1. Sum all connected loads (kVA or convert from HP/kW)</div>
              <div>2. Apply diversity factor for application type</div>
              <div>3. Apply growth factor (typically 1.15{'\–'}1.25 for mine expansion)</div>
              <div>4. Select next standard size above calculated kVA</div>
              <div>5. Verify loading is below 80% for continuous duty</div>
              <div style={{ marginTop: 4 }}>
                Required kVA = Connected Load {'×'} Diversity {'×'} Growth Factor
              </div>
              <div style={{ marginTop: 4 }}>
                HP to kVA: kVA = (HP {'×'} 0.746) / (PF {'×'} Eff)
              </div>
              <div>Typical motor PF = 0.85, Eff = 0.90</div>
              <div>
                kVA per HP {'\≈'} 0.746 / (0.85 {'×'} 0.90) {'\≈'} 0.975 kVA/HP
              </div>
            </div>

            {/* Sizing Tips */}
            <div style={{ ...card, borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                TRANSFORMER SIZING TIPS FOR OPEN PIT MINES
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18, fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                <li>Always size for the mine plan — pits expand, loads grow, new equipment arrives</li>
                <li>500 kVA is the most versatile portable substation size for general pit use</li>
                <li>Consider voltage drop on long trailing cables when sizing — may need larger transformer</li>
                <li>Electric rope shovels often need dedicated substations (750{'\–'}2000 kVA depending on size)</li>
                <li>Haul truck shops with multiple bays can use diversity — not all bays do heavy work at once</li>
                <li>Allow 15{'\–'}25% growth factor for future mine expansion when sizing permanent substations</li>
                <li>Oil containment (110% of oil volume) is required under environmental regulations</li>
                <li>Portable substations should be on stable, level ground away from blast zones</li>
                <li>For temporary installations, verify ground grid connectivity at the new location</li>
                <li>Coordinate with mine planning for power line routing away from future pit wall positions</li>
              </ul>
            </div>

            {/* Maintenance Reminders */}
            <div style={{
              ...card, background: 'rgba(99,102,241,0.06)',
              borderLeft: '3px solid var(--primary)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                GENERAL TRANSFORMER MAINTENANCE REMINDERS
              </div>
              <ul style={{
                margin: 0, paddingLeft: 18, fontSize: 13,
                color: 'var(--text-secondary)', lineHeight: 1.7,
              }}>
                <li>Oil-filled: DGA quarterly for critical, annually for others. Moisture &lt; 20 ppm in oil.</li>
                <li>Check silica gel breather — pink = saturated, replace immediately</li>
                <li>Inspect bushings for cracks, oil leaks, and contamination (flashover risk)</li>
                <li>Test tap changer operation (NLTC) during planned shutdowns</li>
                <li>Verify cooling fans and pumps operate on temperature relays</li>
                <li>Megger primary and secondary windings annually — trend results</li>
                <li>Turns ratio test after any suspected fault or protection operation</li>
                <li>Keep vegetation and combustible materials clear — CEC requires 3m minimum clearance</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
