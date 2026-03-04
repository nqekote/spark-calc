import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Ground Fault Calculator — Open Pit Mine Electrical Systems         */
/*  HRG systems, NGR sizing, GCM reference, grounding system testing   */
/*  References: CEC, O.Reg 854, IEEE 142, IEEE 242                    */
/* ------------------------------------------------------------------ */

type TabKey = 'gf-current' | 'ngr-sizing' | 'gcm' | 'ground-testing'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'gf-current', label: 'GF Current Calc' },
  { key: 'ngr-sizing', label: 'NGR Sizing' },
  { key: 'gcm', label: 'Ground Check' },
  { key: 'ground-testing', label: 'Ground Testing' },
]

/* ------------------------------------------------------------------ */
/*  Common NGR Presets                                                  */
/* ------------------------------------------------------------------ */

interface NGRPreset {
  voltage: number
  faultCurrentA: number
  ngrOhms: number
  powerW: number
  typicalUse: string
}

const ngrPresets: NGRPreset[] = [
  { voltage: 600, faultCurrentA: 25, ngrOhms: 13.86, powerW: 8660, typicalUse: 'Portable mine power centers, shovel trailing cables' },
  { voltage: 600, faultCurrentA: 50, ngrOhms: 6.93, powerW: 17320, typicalUse: 'Surface 600V distribution, larger feeders' },
  { voltage: 600, faultCurrentA: 100, ngrOhms: 3.46, powerW: 34640, typicalUse: 'High-capacity 600V systems (less common in mining)' },
  { voltage: 4160, faultCurrentA: 5, ngrOhms: 480.5, powerW: 12010, typicalUse: 'Sensitive mine MV distribution, long feeders' },
  { voltage: 4160, faultCurrentA: 10, ngrOhms: 240.0, powerW: 24020, typicalUse: 'Standard mine MV distribution' },
  { voltage: 4160, faultCurrentA: 25, ngrOhms: 96.0, powerW: 60040, typicalUse: 'Higher capacity MV mine feeders, large shovels' },
  { voltage: 13800, faultCurrentA: 5, ngrOhms: 1593.0, powerW: 39840, typicalUse: 'Mine main substation incoming distribution' },
  { voltage: 13800, faultCurrentA: 10, ngrOhms: 796.0, powerW: 79670, typicalUse: 'Mine main substation, utility tie' },
  { voltage: 13800, faultCurrentA: 25, ngrOhms: 319.0, powerW: 199180, typicalUse: 'Large mine substations, high-capacity feeders' },
]

/* ------------------------------------------------------------------ */
/*  Standard NGR Values Table                                           */
/* ------------------------------------------------------------------ */

interface StandardNGR {
  voltage: string
  typicalR: string
  faultLimit: string
  duration: string
  application: string
}

const standardNGRValues: StandardNGR[] = [
  { voltage: '480V', typicalR: '13.9 \Ω', faultLimit: '20A', duration: '10 sec', application: 'Small industrial systems' },
  { voltage: '600V', typicalR: '13.9 \Ω', faultLimit: '25A', duration: '10 sec', application: 'Open pit mine power centers' },
  { voltage: '600V', typicalR: '6.9 \Ω', faultLimit: '50A', duration: '10 sec', application: 'Mine surface distribution' },
  { voltage: '2400V', typicalR: '139.0 \Ω', faultLimit: '10A', duration: '10 sec', application: 'Legacy mine distribution' },
  { voltage: '4160V', typicalR: '240.0 \Ω', faultLimit: '10A', duration: '10 sec', application: 'Standard mine MV distribution' },
  { voltage: '4160V', typicalR: '96.0 \Ω', faultLimit: '25A', duration: '10 sec', application: 'Large open pit shovel feeders' },
  { voltage: '13800V', typicalR: '796.0 \Ω', faultLimit: '10A', duration: '10 sec', application: 'Mine main substation' },
  { voltage: '13800V', typicalR: '319.0 \Ω', faultLimit: '25A', duration: '10 sec', application: 'High-capacity mine feeders' },
]

/* ------------------------------------------------------------------ */
/*  NGR Duration Ratings                                                */
/* ------------------------------------------------------------------ */

interface DurationRating {
  duration: string
  seconds: number
  sizeFactor: number
  notes: string
}

const durationRatings: DurationRating[] = [
  { duration: '10 seconds', seconds: 10, sizeFactor: 1.0, notes: 'Most common for mine HRG systems. Ground fault relay trips within 10 sec.' },
  { duration: '1 minute', seconds: 60, sizeFactor: 2.45, notes: 'Where relay coordination requires longer clearing. Larger physical size.' },
  { duration: '10 minutes', seconds: 600, sizeFactor: 7.75, notes: 'Extended time for alarm-only systems. Significantly larger NGR.' },
  { duration: 'Continuous', seconds: Infinity, sizeFactor: 14.0, notes: 'Rare in mining. Used where fault may persist (alarm only, no trip).' },
]

/* ------------------------------------------------------------------ */
/*  GCM Troubleshooting Data                                            */
/* ------------------------------------------------------------------ */

interface GCMFault {
  fault: string
  symptoms: string[]
  causes: string[]
  remedy: string[]
  severity: 'high' | 'medium' | 'low'
}

const gcmFaults: GCMFault[] = [
  {
    fault: 'Broken Pilot Wire',
    symptoms: [
      'GCM relay trips immediately on cable connection',
      'Continuity test shows open circuit on pilot conductor',
      'Equipment will not start or trips on startup',
    ],
    causes: [
      'Mechanical damage to trailing cable from haul trucks',
      'Cable reel wear point at entry to equipment',
      'Poor splice connection at cable coupler',
      'Cable crushed by equipment tracks or tires',
    ],
    remedy: [
      'Megger cable to locate fault area',
      'Inspect cable at known wear points (reel, coupler, ground contact)',
      'Repair or replace damaged cable section',
      'Verify continuity end-to-end after repair',
      'Test GCM relay operation before re-energizing',
    ],
    severity: 'high',
  },
  {
    fault: 'High Resistance Ground Fault',
    symptoms: [
      'Intermittent GCM trips under load or movement',
      'Ground fault relay indication on power center',
      'Megger shows low but not zero insulation resistance',
    ],
    causes: [
      'Water ingress into cable splice or coupler',
      'Damaged insulation from abrasion on pit floor',
      'Contaminated coupler pins (mud, carbon dust)',
      'Partial insulation breakdown from overheating',
    ],
    remedy: [
      'Megger each conductor to ground individually',
      'Inspect all couplers for moisture and contamination',
      'Clean and dry coupler contacts',
      'Check cable for visible damage or hot spots',
      'Replace cable section if insulation resistance below 1 M\Ω',
    ],
    severity: 'high',
  },
  {
    fault: 'False Trips from Moisture',
    symptoms: [
      'GCM trips during rain or after washdown',
      'Trips clear after drying but recur',
      'Multiple pieces of equipment affected simultaneously',
    ],
    causes: [
      'Water accumulation in junction boxes or couplers',
      'Condensation in equipment enclosures (temperature change)',
      'Damaged cable jacket allowing water tracking',
      'Spring thaw causing standing water in cable trays',
    ],
    remedy: [
      'Inspect and dry all junction boxes and couplers',
      'Apply dielectric grease to coupler contacts',
      'Install drain holes in junction boxes per mine practice',
      'Use heat shrink or cold shrink on cable repairs',
      'Consider seasonal GCM sensitivity adjustment (with engineering approval)',
    ],
    severity: 'medium',
  },
  {
    fault: 'GCM Relay Failure',
    symptoms: [
      'GCM does not trip on known ground fault',
      'Pilot wire test shows relay not responding',
      'Inconsistent relay behavior',
    ],
    causes: [
      'Relay coil failure or contact welding',
      'Power supply issue to GCM relay',
      'Incorrect relay settings after maintenance',
      'Vibration damage from mining equipment',
    ],
    remedy: [
      'Perform GCM relay functional test per manufacturer procedure',
      'Verify relay power supply voltage',
      'Check and record relay settings against commissioning values',
      'Replace relay if functional test fails',
      'Document test results per O.Reg 854 requirements',
    ],
    severity: 'high',
  },
  {
    fault: 'Nuisance Trips During Equipment Startup',
    symptoms: [
      'GCM trips when motor starts or load changes',
      'Trips occur with large VFD-driven equipment',
      'Problem worse with longer trailing cables',
    ],
    causes: [
      'Capacitive charging current on long cables exceeds GCM threshold',
      'VFD common-mode noise coupling to ground conductor',
      'Incorrect GCM relay time delay setting',
      'Cable capacitance imbalance',
    ],
    remedy: [
      'Verify GCM relay time delay is adequate (typically 0.1-0.5 sec)',
      'Check cable capacitance values against relay specifications',
      'Install common-mode choke on VFD output if applicable',
      'Consult relay manufacturer for settings with VFD loads',
    ],
    severity: 'low',
  },
]

/* ------------------------------------------------------------------ */
/*  Ground Testing Reference Data                                       */
/* ------------------------------------------------------------------ */

interface TestMethod {
  method: string
  description: string
  equipment: string
  procedure: string[]
  acceptableLimits: string
  miningNotes: string
}

const testMethods: TestMethod[] = [
  {
    method: 'Fall-of-Potential (3-Point)',
    description: 'Standard method for measuring ground electrode resistance. Uses two auxiliary electrodes placed in a straight line away from the electrode under test.',
    equipment: 'Megger DET series, AEMC 6471, or Fluke 1625-2 ground tester',
    procedure: [
      'Disconnect ground electrode from system',
      'Drive current stake (C2) at least 10x the electrode depth away',
      'Drive potential stake (P2) at 62% of the distance to C2',
      'Connect ground tester leads: C1 and P1 to electrode under test',
      'Take reading at 62% position (this gives true resistance)',
      'Move P2 to 52% and 72% positions to verify (readings should agree within 10%)',
      'If readings vary >10%, increase C2 distance and repeat',
    ],
    acceptableLimits: 'Mine substations: <1\Ω | Distribution poles: <5\Ω | Equipment grounds: <25\Ω',
    miningNotes: 'In open pit mines, rocky terrain may require longer electrode spacings. Bentonite slurry in drill holes improves electrode contact. Test in summer and winter to establish seasonal range.',
  },
  {
    method: 'Clamp-On (Stakeless)',
    description: 'Non-disconnection method using a clamp-on ground resistance tester. Measures the resistance of a single ground electrode in a multi-grounded system.',
    equipment: 'Fluke 1630-2, AEMC 6417, Megger DET14C clamp-on tester',
    procedure: [
      'Verify system has multiple parallel ground paths (required for this method)',
      'Clamp tester around the ground conductor of the electrode under test',
      'Ensure clamp is fully closed and conductor centered in jaw',
      'Read ground resistance directly from display',
      'Compare to previous readings to trend changes',
      'Method reads individual electrode resistance in parallel network',
    ],
    acceptableLimits: 'Individual electrode: <25\Ω | System (paralleled): <1\Ω for substations',
    miningNotes: 'Very useful in open pit mines for routine testing without disconnecting grounds. Cannot be used on isolated single electrodes. Ideal for checking ground grid integrity around shovels and crusher substations.',
  },
  {
    method: 'Soil Resistivity (Wenner 4-Pin)',
    description: 'Measures average soil resistivity at a specific depth to design grounding systems. Uses four equally-spaced electrodes.',
    equipment: 'Megger DET2/2, AEMC 6470-B, or equivalent 4-terminal tester',
    procedure: [
      'Drive 4 stakes in a straight line with equal spacing "a"',
      'Spacing "a" determines test depth (test measures to depth = a)',
      'Connect tester: C1-P1-P2-C2 from left to right',
      'Take reading (\ρ = 2\πaR where R is the reading)',
      'Repeat with different spacings to profile resistivity vs. depth',
      'Use multiple directions if terrain is variable (open pit benches)',
    ],
    acceptableLimits: 'Design data \— not a pass/fail test. Typical values: rocky soil 1000-5000 \Ω\·m, clay 25-70 \Ω\·m, gravel 600-1000 \Ω\·m',
    miningNotes: 'Open pit ore body and waste rock have widely varying resistivity. Test on multiple benches and in different seasons. Frozen ground resistivity can exceed 10,000 \Ω\·m \— critical for winter ground fault protection.',
  },
]

interface GroundRef {
  item: string
  requirement: string
  reference: string
}

const groundingReferences: GroundRef[] = [
  { item: 'Mine substation ground grid', requirement: '\≤1 \Ω resistance to remote earth', reference: 'IEEE 80, O.Reg 854 s.159' },
  { item: 'Portable equipment ground', requirement: 'Equipment grounding conductor continuous to source', reference: 'CEC 10-600, O.Reg 854 s.160' },
  { item: 'Trailing cable ground conductor', requirement: 'Monitored by GCM, resistance <1 \Ω end-to-end', reference: 'O.Reg 854 s.160(2)' },
  { item: 'Ground fault relay', requirement: 'Required on all mine distribution, trip <0.5 sec', reference: 'O.Reg 854 s.160(1)' },
  { item: 'Grounding electrode conductor', requirement: 'Per CEC Table 10, min #6 AWG Cu', reference: 'CEC 10-114' },
  { item: 'Step potential limit', requirement: '\≤50V RMS for 1 second (70 kg person)', reference: 'IEEE 80-2013 Table 9' },
  { item: 'Touch potential limit', requirement: '\≤50V RMS for 1 second', reference: 'IEEE 80-2013 Table 10' },
  { item: 'Bonding jumper at service', requirement: 'Sized per CEC Table 16', reference: 'CEC 10-614' },
  { item: 'Shovel/drill ground rod', requirement: '<25 \Ω individual, system <5 \Ω with grid', reference: 'Mine site specification' },
  { item: 'Seasonal testing', requirement: 'Test in worst-case season (winter for open pit)', reference: 'IEEE 81, Mine practice' },
]

interface TestEquipment {
  name: string
  type: string
  use: string
  range: string
}

const testEquipmentList: TestEquipment[] = [
  { name: 'Megger DET2/2', type: '4-terminal ground tester', use: 'Fall-of-potential, soil resistivity', range: '0.01\Ω to 20k\Ω' },
  { name: 'Fluke 1625-2', type: '4-terminal ground tester', use: 'Fall-of-potential, selective measurement', range: '0.001\Ω to 300k\Ω' },
  { name: 'Fluke 1630-2', type: 'Clamp-on ground tester', use: 'Stakeless ground resistance', range: '0.025\Ω to 1500\Ω' },
  { name: 'AEMC 6417', type: 'Clamp-on ground tester', use: 'Multi-ground systems testing', range: '0.01\Ω to 1500\Ω' },
  { name: 'Megger MIT485', type: 'Insulation resistance tester', use: 'Cable insulation testing (Megger)', range: '0.01 M\Ω to 20 G\Ω' },
  { name: 'Megger DLRO-10', type: 'Micro-ohmmeter', use: 'Bonding connection resistance', range: '0.1\µ\Ω to 2000\Ω' },
  { name: 'Dranetz HDPQ', type: 'Power quality analyzer', use: 'Ground current monitoring', range: 'N/A' },
]

/* ------------------------------------------------------------------ */
/*  Cable Impedance Data (approximate, for ground fault paths)          */
/* ------------------------------------------------------------------ */

interface CableImpedance {
  size: string
  rDCohmsPerKm: number
  label: string
}

const cableImpedances: CableImpedance[] = [
  { size: '14', rDCohmsPerKm: 10.30, label: '14 AWG' },
  { size: '12', rDCohmsPerKm: 6.49, label: '12 AWG' },
  { size: '10', rDCohmsPerKm: 4.07, label: '10 AWG' },
  { size: '8', rDCohmsPerKm: 2.56, label: '8 AWG' },
  { size: '6', rDCohmsPerKm: 1.61, label: '6 AWG' },
  { size: '4', rDCohmsPerKm: 1.02, label: '4 AWG' },
  { size: '2', rDCohmsPerKm: 0.641, label: '2 AWG' },
  { size: '1', rDCohmsPerKm: 0.508, label: '1 AWG' },
  { size: '1/0', rDCohmsPerKm: 0.403, label: '1/0 AWG' },
  { size: '2/0', rDCohmsPerKm: 0.319, label: '2/0 AWG' },
  { size: '3/0', rDCohmsPerKm: 0.253, label: '3/0 AWG' },
  { size: '4/0', rDCohmsPerKm: 0.201, label: '4/0 AWG' },
  { size: '250', rDCohmsPerKm: 0.171, label: '250 kcmil' },
  { size: '350', rDCohmsPerKm: 0.122, label: '350 kcmil' },
  { size: '500', rDCohmsPerKm: 0.0854, label: '500 kcmil' },
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                       */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  paddingBottom: 4,
  marginTop: 12,
  WebkitOverflowScrolling: 'touch',
}

const pillBase: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 'var(--radius-lg)',
  border: '2px solid var(--divider)',
  background: 'var(--surface)',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
}

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: 'var(--primary)',
  color: '#000',
  border: '2px solid var(--primary)',
}

const sectionHeading: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 48,
  padding: '0 14px',
  background: 'var(--surface-elevated)',
  border: '2px solid var(--divider)',
  borderRadius: 'var(--radius)',
  fontSize: 16,
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  display: 'block',
}

const resultBox: React.CSSProperties = {
  background: 'var(--surface-elevated)',
  border: '2px solid var(--primary)',
  borderRadius: 'var(--radius)',
  padding: 16,
}

const resultLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.3,
}

const resultValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: 'var(--primary)',
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.2,
}

const resultUnit: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginLeft: 4,
}

const tableCell: React.CSSProperties = {
  padding: '10px 8px',
  fontSize: 13,
  borderBottom: '1px solid var(--divider)',
  lineHeight: 1.4,
}

const tableHeader: React.CSSProperties = {
  ...tableCell,
  fontWeight: 700,
  color: 'var(--primary)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.3,
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--surface-elevated)',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--primary)',
  fontFamily: 'var(--font-mono)',
}

const noteBox: React.CSSProperties = {
  background: 'rgba(255, 193, 7, 0.08)',
  border: '1px solid rgba(255, 193, 7, 0.25)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.6,
}

const dangerBox: React.CSSProperties = {
  background: 'rgba(255, 60, 60, 0.08)',
  border: '1px solid rgba(255, 60, 60, 0.3)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  fontSize: 13,
  color: 'var(--text)',
  lineHeight: 1.6,
}

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                    */
/* ------------------------------------------------------------------ */

function fmt(n: number, decimals: number): string {
  if (!isFinite(n)) return '\—'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function getSeverityColor(severity: 'high' | 'medium' | 'low'): string {
  if (severity === 'high') return '#f87171'
  if (severity === 'medium') return '#fbbf24'
  return '#4ade80'
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function GroundFaultPage() {
  const [tab, setTab] = useState<TabKey>('gf-current')

  /* ---- GF Current Calc state ---- */
  const [gfSystemVoltage, setGfSystemVoltage] = useState('600')
  const [gfNgrResistance, setGfNgrResistance] = useState('')
  const [gfCableSize, setGfCableSize] = useState('4/0')
  const [gfCableLength, setGfCableLength] = useState('')
  const [gfGroundResistance, setGfGroundResistance] = useState('1')
  const [gfArcingPct, setGfArcingPct] = useState('50')

  /* ---- NGR Sizing state ---- */
  const [ngrVoltage, setNgrVoltage] = useState('4160')
  const [ngrDesiredCurrent, setNgrDesiredCurrent] = useState('10')
  const [ngrDuration, setNgrDuration] = useState('10')

  /* ---- GF Current Calculations ---- */
  const gfV = parseFloat(gfSystemVoltage)
  const gfRngr = parseFloat(gfNgrResistance)
  const gfLen = parseFloat(gfCableLength)
  const gfRgnd = parseFloat(gfGroundResistance)
  const gfArc = parseFloat(gfArcingPct)

  const gfVln = !isNaN(gfV) && gfV > 0 ? gfV / Math.sqrt(3) : NaN

  // Cable resistance from table
  const gfCableData = cableImpedances.find(c => c.size === gfCableSize)
  const gfRcable = gfCableData && !isNaN(gfLen) && gfLen > 0
    ? (gfCableData.rDCohmsPerKm * gfLen) / 1000
    : 0

  const gfHasInputs = !isNaN(gfVln) && gfVln > 0 && !isNaN(gfRngr) && gfRngr > 0
  const gfTotalR = gfRngr + gfRcable + (!isNaN(gfRgnd) ? gfRgnd : 0)
  const gfIbolted = gfHasInputs ? gfVln / gfTotalR : NaN
  const gfIarcing = gfHasInputs && !isNaN(gfArc) ? gfIbolted * (gfArc / 100) : NaN

  /* ---- NGR Sizing Calculations ---- */
  const ngrV = parseFloat(ngrVoltage)
  const ngrI = parseFloat(ngrDesiredCurrent)
  const ngrDur = parseFloat(ngrDuration)

  const ngrVln = !isNaN(ngrV) && ngrV > 0 ? ngrV / Math.sqrt(3) : NaN
  const ngrR = !isNaN(ngrVln) && !isNaN(ngrI) && ngrI > 0 ? ngrVln / ngrI : NaN
  const ngrP = !isNaN(ngrVln) && !isNaN(ngrI) ? ngrVln * ngrI : NaN
  const ngrEnergy = !isNaN(ngrP) && !isNaN(ngrDur) ? ngrP * ngrDur : NaN

  // Duration factor for physical size estimate
  const durationEntry = durationRatings.find(d => d.seconds === ngrDur) || durationRatings[0]

  return (
    <>
      <Header title="Ground Fault Calculator" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Mining context banner */}
        <div style={{
          background: 'rgba(255, 193, 7, 0.08)',
          border: '1px solid rgba(255, 193, 7, 0.25)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{'\⚠'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            <strong>Open Pit Mine Ground Fault Protection.</strong> O.Reg 854 requires ground fault
            protection on all mine power distribution systems. HRG systems limit fault current to
            prevent arc flash hazards at the fault point while maintaining system operation for
            orderly shutdown.
          </div>
        </div>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB 1: GF Current Calculator                                */}
        {/* ============================================================ */}
        {tab === 'gf-current' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Ground Fault Current — HRG System</div>

            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                In a high-resistance grounded (HRG) system, ground fault current is limited by the Neutral
                Grounding Resistor (NGR). The formula is:
              </div>
              <div style={{
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--primary)',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                I<sub>GF</sub> = V<sub>L-N</sub> / (R<sub>NGR</sub> + R<sub>cable</sub> + R<sub>ground</sub>)
              </div>
            </div>

            {/* System Voltage */}
            <div>
              <label style={labelStyle}>System Voltage (V<sub>L-L</sub>)</label>
              <select
                style={selectStyle}
                value={gfSystemVoltage}
                onChange={e => setGfSystemVoltage(e.target.value)}
              >
                <option value="480">480V</option>
                <option value="600">600V</option>
                <option value="2400">2400V</option>
                <option value="4160">4160V</option>
                <option value="13800">13800V</option>
              </select>
              {!isNaN(gfVln) && (
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  V<sub>L-N</sub> = {fmt(gfVln, 1)} V
                </div>
              )}
            </div>

            {/* NGR Resistance */}
            <div>
              <label style={labelStyle}>NGR Resistance ({'\Ω'})</label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                value={gfNgrResistance}
                onChange={e => setGfNgrResistance(e.target.value)}
                placeholder="e.g. 13.86"
              />
              {/* Quick-set buttons for common values */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {ngrPresets
                  .filter(p => p.voltage === gfV)
                  .map(p => (
                    <button
                      key={p.ngrOhms}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--divider)',
                        background: parseFloat(gfNgrResistance) === p.ngrOhms
                          ? 'var(--primary)' : 'var(--surface)',
                        color: parseFloat(gfNgrResistance) === p.ngrOhms
                          ? '#000' : 'var(--text-secondary)',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setGfNgrResistance(String(p.ngrOhms))}
                    >
                      {p.ngrOhms}{'\Ω'} ({p.faultCurrentA}A)
                    </button>
                  ))}
              </div>
            </div>

            {/* Cable Size */}
            <div>
              <label style={labelStyle}>Ground Conductor Size</label>
              <select
                style={selectStyle}
                value={gfCableSize}
                onChange={e => setGfCableSize(e.target.value)}
              >
                {cableImpedances.map(c => (
                  <option key={c.size} value={c.size}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Cable Length */}
            <div>
              <label style={labelStyle}>Cable Length (meters, one-way)</label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                value={gfCableLength}
                onChange={e => setGfCableLength(e.target.value)}
                placeholder="e.g. 300"
              />
              {gfRcable > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  R<sub>cable</sub> = {fmt(gfRcable, 4)} {'\Ω'}
                </div>
              )}
            </div>

            {/* Ground Resistance */}
            <div>
              <label style={labelStyle}>Ground Path Resistance ({'\Ω'})</label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                value={gfGroundResistance}
                onChange={e => setGfGroundResistance(e.target.value)}
                placeholder="e.g. 1"
              />
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                Typically 0.5-5{'\Ω'} for mine grounding grids. Higher in winter (frozen ground).
              </div>
            </div>

            {/* Arcing Fault Percentage */}
            <div>
              <label style={labelStyle}>Arcing Fault Factor (%)</label>
              <select
                style={selectStyle}
                value={gfArcingPct}
                onChange={e => setGfArcingPct(e.target.value)}
              >
                <option value="40">40% (conservative low)</option>
                <option value="50">50% (typical)</option>
                <option value="60">60% (high estimate)</option>
              </select>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                Arcing ground faults are typically 40-60% of bolted fault current due to arc impedance.
              </div>
            </div>

            {/* Results */}
            {gfHasInputs && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={sectionHeading}>Results</div>

                {/* Bolted fault */}
                <div style={resultBox}>
                  <div style={resultLabel}>Bolted Ground Fault Current</div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={resultValue}>{fmt(gfIbolted, 2)}</span>
                    <span style={resultUnit}>A</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6,
                    fontFamily: 'var(--font-mono)', lineHeight: 1.6,
                  }}>
                    I<sub>GF</sub> = {fmt(gfVln, 1)} / ({fmt(gfRngr, 2)} + {fmt(gfRcable, 4)} + {fmt(!isNaN(gfRgnd) ? gfRgnd : 0, 2)}) = {fmt(gfIbolted, 2)} A
                  </div>
                </div>

                {/* Arcing fault */}
                {!isNaN(gfIarcing) && (
                  <div style={{ ...resultBox, borderColor: '#fbbf24' }}>
                    <div style={resultLabel}>Arcing Ground Fault Current ({gfArcingPct}%)</div>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ ...resultValue, color: '#fbbf24' }}>{fmt(gfIarcing, 2)}</span>
                      <span style={resultUnit}>A</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                      I<sub>arc</sub> = {fmt(gfIbolted, 2)} {'\×'} {gfArcingPct}% = {fmt(gfIarcing, 2)} A
                    </div>
                  </div>
                )}

                {/* Impedance breakdown */}
                <div style={card}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                    Impedance Breakdown
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { label: 'NGR Resistance', value: gfRngr, pct: (gfRngr / gfTotalR) * 100 },
                      { label: 'Cable Resistance', value: gfRcable, pct: (gfRcable / gfTotalR) * 100 },
                      { label: 'Ground Path', value: !isNaN(gfRgnd) ? gfRgnd : 0, pct: ((!isNaN(gfRgnd) ? gfRgnd : 0) / gfTotalR) * 100 },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                            {fmt(item.value, 4)} {'\Ω'} ({fmt(item.pct, 1)}%)
                          </span>
                        </div>
                        <div style={{
                          height: 6,
                          borderRadius: 3,
                          background: 'var(--surface)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min(item.pct, 100)}%`,
                            background: 'var(--primary)',
                            borderRadius: 3,
                            transition: 'width 0.3s',
                          }} />
                        </div>
                      </div>
                    ))}
                    <div style={{
                      borderTop: '1px solid var(--divider)',
                      paddingTop: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      <span style={{ color: 'var(--text)' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {fmt(gfTotalR, 4)} {'\Ω'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GF Relay verification */}
                <div style={{
                  ...card,
                  borderLeft: gfIarcing >= 5 ? '4px solid #4ade80' : '4px solid #f87171',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    Ground Fault Relay Verification
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {gfIarcing >= 5 ? (
                      <>
                        Arcing fault current of <strong style={{ color: '#4ade80' }}>{fmt(gfIarcing, 1)}A</strong> should
                        be sufficient for reliable ground fault relay pickup. Typical relay pickup settings are 2-5A for
                        HRG systems. Verify relay pickup is set below the minimum arcing fault current.
                      </>
                    ) : (
                      <>
                        <strong style={{ color: '#f87171' }}>Warning:</strong> Arcing fault current
                        of <strong>{fmt(gfIarcing, 1)}A</strong> may be too low for reliable relay pickup.
                        Review GF relay sensitivity settings or consider lower NGR resistance.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Common NGR presets reference */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Common NGR Values for Open Pit Mining
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Voltage</th>
                      <th style={tableHeader}>I<sub>GF</sub></th>
                      <th style={tableHeader}>R<sub>NGR</sub></th>
                      <th style={tableHeader}>Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ngrPresets.map((p, i) => (
                      <tr
                        key={i}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setGfSystemVoltage(String(p.voltage))
                          setGfNgrResistance(String(p.ngrOhms))
                        }}
                      >
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {p.voltage}V
                        </td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>
                          {p.faultCurrentA}A
                        </td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>
                          {p.ngrOhms}{'\Ω'}
                        </td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>
                          {p.typicalUse}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>
                Tap a row to load values into the calculator.
              </div>
            </div>

            <div style={noteBox}>
              <strong>Mining Note:</strong> In HRG systems, the NGR limits fault current to a safe level
              (typically 25-50A for 600V, 5-25A for 4160V). This prevents dangerous arc flash at the fault
              point, which is critical for trailing cable faults in open pit operations. The system can
              continue operating on a single ground fault, allowing orderly shutdown of mobile equipment.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: NGR Sizing                                           */}
        {/* ============================================================ */}
        {tab === 'ngr-sizing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Neutral Grounding Resistor Sizing</div>

            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                Size the NGR to limit ground fault current to a desired level.
                The NGR must dissipate the fault energy for the rated duration without damage.
              </div>
              <div style={{
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--primary)',
                fontWeight: 600,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                <div>R<sub>NGR</sub> = V<sub>L-N</sub> / I<sub>fault</sub></div>
                <div>P<sub>NGR</sub> = V<sub>L-N</sub> {'\×'} I<sub>fault</sub></div>
              </div>
            </div>

            {/* System Voltage */}
            <div>
              <label style={labelStyle}>System Voltage (V<sub>L-L</sub>)</label>
              <select
                style={selectStyle}
                value={ngrVoltage}
                onChange={e => setNgrVoltage(e.target.value)}
              >
                <option value="480">480V</option>
                <option value="600">600V</option>
                <option value="2400">2400V</option>
                <option value="4160">4160V</option>
                <option value="13800">13800V</option>
              </select>
              {!isNaN(ngrVln) && (
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  V<sub>L-N</sub> = {fmt(ngrVln, 1)} V
                </div>
              )}
            </div>

            {/* Desired Fault Current */}
            <div>
              <label style={labelStyle}>Desired Fault Current Limit (A)</label>
              <input
                type="number"
                inputMode="decimal"
                style={inputStyle}
                value={ngrDesiredCurrent}
                onChange={e => setNgrDesiredCurrent(e.target.value)}
                placeholder="e.g. 10"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {[5, 10, 15, 25, 50].map(a => (
                  <button
                    key={a}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--divider)',
                      background: ngrDesiredCurrent === String(a) ? 'var(--primary)' : 'var(--surface)',
                      color: ngrDesiredCurrent === String(a) ? '#000' : 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setNgrDesiredCurrent(String(a))}
                  >
                    {a}A
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Rating */}
            <div>
              <label style={labelStyle}>NGR Duration Rating</label>
              <select
                style={selectStyle}
                value={ngrDuration}
                onChange={e => setNgrDuration(e.target.value)}
              >
                <option value="10">10 seconds (standard mine)</option>
                <option value="60">1 minute</option>
                <option value="600">10 minutes</option>
                <option value="Infinity">Continuous</option>
              </select>
            </div>

            {/* Results */}
            {!isNaN(ngrR) && !isNaN(ngrP) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={sectionHeading}>NGR Specifications</div>

                <div style={resultBox}>
                  <div style={resultLabel}>Required NGR Resistance</div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={resultValue}>{fmt(ngrR, 2)}</span>
                    <span style={resultUnit}>{'\Ω'}</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    R = {fmt(ngrVln, 1)} / {ngrDesiredCurrent} = {fmt(ngrR, 2)} {'\Ω'}
                  </div>
                </div>

                <div style={{ ...resultBox, borderColor: '#fbbf24' }}>
                  <div style={resultLabel}>Power Rating</div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ ...resultValue, color: '#fbbf24' }}>
                      {ngrP >= 1000 ? fmt(ngrP / 1000, 2) : fmt(ngrP, 0)}
                    </span>
                    <span style={resultUnit}>{ngrP >= 1000 ? 'kW' : 'W'}</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    P = {fmt(ngrVln, 1)} {'\×'} {ngrDesiredCurrent} = {fmt(ngrP, 0)} W
                  </div>
                </div>

                {!isNaN(ngrEnergy) && isFinite(ngrEnergy) && (
                  <div style={{ ...resultBox, borderColor: 'var(--text-secondary)' }}>
                    <div style={resultLabel}>Energy per Fault Event ({durationEntry.duration})</div>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ ...resultValue, color: 'var(--text)', fontSize: 22 }}>
                        {ngrEnergy >= 1000000 ? fmt(ngrEnergy / 1000000, 2) : ngrEnergy >= 1000 ? fmt(ngrEnergy / 1000, 1) : fmt(ngrEnergy, 0)}
                      </span>
                      <span style={resultUnit}>
                        {ngrEnergy >= 1000000 ? 'MJ' : ngrEnergy >= 1000 ? 'kJ' : 'J'}
                      </span>
                    </div>
                  </div>
                )}

                {/* NGR Order Summary */}
                <div style={{
                  ...card,
                  borderLeft: '4px solid var(--primary)',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                    NGR Order Specifications
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'System Voltage', value: `${ngrVoltage}V L-L (${fmt(ngrVln, 0)}V L-N)` },
                      { label: 'Resistance', value: `${fmt(ngrR, 2)} \Ω` },
                      { label: 'Current Rating', value: `${ngrDesiredCurrent}A` },
                      { label: 'Power Rating', value: `${fmt(ngrP, 0)} W (${fmt(ngrP / 1000, 2)} kW)` },
                      { label: 'Duration', value: durationEntry.duration },
                      { label: 'Size Factor', value: `${durationEntry.sizeFactor}\× (relative to 10 sec)` },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Duration Ratings Reference */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                NGR Duration Ratings
              </div>
              {durationRatings.map(d => (
                <div key={d.duration} style={{
                  padding: '10px 0',
                  borderBottom: '1px solid var(--divider)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{d.duration}</span>
                    <span style={badge}>Size: {d.sizeFactor}{'\×'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {d.notes}
                  </div>
                </div>
              ))}
            </div>

            {/* Standard NGR Values Table */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Standard NGR Values
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Voltage</th>
                      <th style={tableHeader}>R ({'\Ω'})</th>
                      <th style={tableHeader}>I<sub>limit</sub></th>
                      <th style={tableHeader}>Duration</th>
                      <th style={tableHeader}>Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardNGRValues.map((row, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.voltage}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.typicalR}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.faultLimit}</td>
                        <td style={{ ...tableCell, fontSize: 12 }}>{row.duration}</td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{row.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regulatory note */}
            <div style={dangerBox}>
              <strong style={{ color: '#f87171' }}>O.Reg 854 Requirement:</strong> Ontario Regulation 854
              (Mines and Mining Plants) requires ground fault protection on all mine power distribution
              systems. Section 160 mandates that every electrical installation in a mine must have ground
              fault protection that will de-energize the circuit within 0.5 seconds. The NGR must be rated
              for the system voltage and designed to limit fault current to the relay pickup threshold.
            </div>

            <div style={noteBox}>
              <strong>Mining Note:</strong> When ordering an NGR for an open pit mine, specify the operating
              environment: outdoor installation, ambient temperature range (-40{'\°'}C to +40{'\°'}C typical
              for Northern Ontario), and IP/NEMA rating for weather exposure. Stainless steel resistor elements
              are preferred for mine environments due to corrosion resistance from dust and moisture.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Ground Check Monitor                                 */}
        {/* ============================================================ */}
        {tab === 'gcm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Ground Check Monitor (GCM) Systems</div>

            {/* GCM Overview */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                What is a GCM?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                A Ground Check Monitor continuously monitors the integrity of the grounding conductor in
                trailing cables used on mobile mining equipment (shovels, drills, haul trucks, etc.).
                The GCM uses a low-voltage pilot circuit through a dedicated pilot wire or the ground
                conductor itself to verify continuity. If the ground path is broken or its resistance
                exceeds the trip threshold, the GCM relay trips the contactor, de-energizing the equipment.
              </div>
            </div>

            {/* GCM Circuit Description */}
            <div style={{
              ...card,
              borderLeft: '4px solid var(--primary)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                GCM Circuit Operation
              </div>
              <div style={{
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text)',
                lineHeight: 2.0,
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}>
{`POWER CENTER                TRAILING CABLE              EQUIPMENT
\┌\─\─\─\─\─\─\─\─\─\─\─\─\┐              \┌\─\─\─\─\─\─\─\─\─\─\─\─\┐          \┌\─\─\─\─\─\─\─\─\─\─\─\─\┐
\│  GCM Relay \│   Pilot    \│  L1 \─\─\─\─\─\─\─\─\│\─\─\─\►\│   Motor    \│
\│  \┌\─\─\─\─\─\─\┐ \│   Wire     \│  L2 \─\─\─\─\─\─\─\─\│\─\─\─\►\│   Load     \│
\│  \│ Coil \│ \│\─\─\─\─\─\─\─\─\─\│  L3 \─\─\─\─\─\─\─\─\│\─\─\─\►\│            \│
\│  \└\─\─\┬\─\─\─\┘ \│\─\─\─\─\►    \│  GND\─\─\─\─\─\─\─\─\│\─\─\─\─\│\─\─Ground   \│
\│     \│     \│   Pilot   \│  PILOT\─\─\─\─\─\─\│\─\─\─\─\│\─\─\┐        \│
\│     \│     \│\─\─\─\─\◄    \│             \│    \│  \│ R     \│
\│  \┌\─\─\┴\─\─\─\┐ \│         \└\─\─\─\─\─\─\─\─\─\─\─\─\─\┘    \│  \│(end)  \│
\│  \│ Trip  \│ \│                             \│  \│ loop  \│
\│  \│ Cont. \│ \│                             \└\─\─\┘       \│
\└\─\─\┴\─\─\─\─\─\─\┴\─\┘                             \└\─\─\─\─\─\─\─\─\─\─\─\─\┘`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
                The GCM relay sends a low-voltage signal through the pilot wire to the equipment end, where
                a resistance (R) loops the signal back through the ground conductor. If the pilot wire or
                ground conductor is broken, or if the loop resistance exceeds the trip point, the relay
                de-energizes the contactor.
              </div>
            </div>

            {/* GCM Settings */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Typical GCM Settings
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { param: 'Pilot Wire Voltage', value: '24-48V DC (low energy)', notes: 'Safe for personnel contact' },
                  { param: 'Trip Resistance', value: '25-50 \Ω (adjustable)', notes: 'Set based on cable length and temperature' },
                  { param: 'Trip Time', value: '<0.1 sec (instantaneous)', notes: 'Ground fault = immediate de-energize' },
                  { param: 'Ground Continuity', value: '<1 \Ω end-to-end (typical)', notes: 'Includes cable + connections' },
                  { param: 'End Resistance (R)', value: '120-680 \Ω (equipment end)', notes: 'Creates the monitoring loop' },
                  { param: 'Time Delay Option', value: '0.1-0.5 sec (motor start)', notes: 'Prevents nuisance trips on VFD startup' },
                ].map(row => (
                  <div key={row.param} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--divider)',
                    gap: 2,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.param}</span>
                      <span style={badge}>{row.value}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{row.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting */}
            <div style={sectionHeading}>GCM Troubleshooting Guide</div>

            {gcmFaults.map(fault => (
              <div key={fault.fault} style={{
                ...card,
                borderLeft: `4px solid ${getSeverityColor(fault.severity)}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: getSeverityColor(fault.severity),
                    flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    {fault.fault}
                  </div>
                  <span style={{
                    ...badge,
                    background: `${getSeverityColor(fault.severity)}22`,
                    color: getSeverityColor(fault.severity),
                    marginLeft: 'auto',
                  }}>
                    {fault.severity}
                  </span>
                </div>

                {/* Symptoms */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.3 }}>
                    Symptoms
                  </div>
                  {fault.symptoms.map((s, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                      paddingLeft: 16, position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--text-tertiary)' }}>{'\•'}</span>
                      {s}
                    </div>
                  ))}
                </div>

                {/* Causes */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.3 }}>
                    Common Causes
                  </div>
                  {fault.causes.map((c, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                      paddingLeft: 16, position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#fbbf24' }}>{'\▶'}</span>
                      {c}
                    </div>
                  ))}
                </div>

                {/* Remedy */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.3 }}>
                    Remedy
                  </div>
                  <div style={{
                    background: 'var(--surface-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    {fault.remedy.map((r, i) => (
                      <div key={i} style={{
                        fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                        paddingLeft: 20, position: 'relative',
                      }}>
                        <span style={{
                          position: 'absolute', left: 0,
                          color: '#4ade80', fontWeight: 700, fontSize: 12,
                        }}>
                          {i + 1}.
                        </span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* O.Reg 854 Requirements */}
            <div style={{
              ...card,
              borderLeft: '4px solid #f87171',
              background: 'rgba(255, 60, 60, 0.04)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                O.Reg 854 Section 160 Requirements
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Every electrical installation at a mine shall be protected against ground faults by a ground fault protection system [s.160(1)]',
                  'Trailing cables shall have a continuous grounding conductor monitored by a ground check circuit [s.160(2)]',
                  'The ground check monitor shall de-energize the trailing cable if the grounding conductor circuit is interrupted [s.160(2)]',
                  'Ground fault relays shall be tested at intervals not exceeding 6 months [s.160(3)]',
                  'Records of all ground fault relay tests shall be kept at the mine site [s.160(4)]',
                  'The ground fault protection system shall de-energize the circuit within 0.5 seconds [s.160(1)]',
                ].map((req, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                    paddingLeft: 20, position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0,
                      color: '#f87171', fontWeight: 700,
                    }}>{'\§'}</span>
                    {req}
                  </div>
                ))}
              </div>
            </div>

            {/* GCM Testing Procedure */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                GCM Functional Test Procedure
              </div>
              <div style={{
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
              }}>
                {[
                  'De-energize and LOTO the equipment per mine procedure',
                  'Disconnect trailing cable at the equipment coupler',
                  'Verify GCM relay trips (open ground path test)',
                  'Reconnect cable and verify GCM relay resets',
                  'Apply known resistance across pilot wire to test trip threshold',
                  'Verify trip time is within specification (<0.1 sec typical)',
                  'Inject simulated ground fault to verify GF relay pickup',
                  'Record all test results with date, tester name, and equipment ID',
                  'Post test sticker on equipment with next test due date',
                ].map((step, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: 'var(--text)', lineHeight: 1.8,
                    paddingLeft: 28, position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', left: 0,
                      width: 20, height: 20,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#000',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      top: 2,
                    }}>
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div style={noteBox}>
              <strong>Mining Note:</strong> In open pit mines, trailing cables are subject to extreme mechanical
              stress from equipment movement, haul truck traffic, and cable reel operation. The GCM is the last
              line of defense against electrocution from a damaged ground conductor. Always verify GCM operation
              before connecting any trailing cable. Many mine sites require a GCM test at the start of every shift.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Grounding System Testing                             */}
        {/* ============================================================ */}
        {tab === 'ground-testing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Grounding System Testing</div>

            {/* Test Methods */}
            {testMethods.map(method => (
              <div key={method.method} style={{
                ...card,
                borderLeft: '4px solid var(--primary)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                  {method.method}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                  {method.description}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.3 }}>
                  Equipment
                </div>
                <div style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 12,
                }}>
                  {method.equipment}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.3 }}>
                  Procedure
                </div>
                <div style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  marginBottom: 12,
                }}>
                  {method.procedure.map((step, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', lineHeight: 1.7,
                      paddingLeft: 24, position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0,
                        color: 'var(--primary)', fontWeight: 700, fontSize: 12,
                      }}>
                        {i + 1}.
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.3 }}>
                  Acceptable Limits
                </div>
                <div style={{
                  background: 'rgba(74, 222, 128, 0.08)',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 12,
                }}>
                  {method.acceptableLimits}
                </div>

                <div style={{
                  background: 'rgba(255, 193, 7, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: 'var(--text)' }}>Mining:</strong> {method.miningNotes}
                </div>
              </div>
            ))}

            {/* Step and Touch Potential */}
            <div style={{
              ...card,
              borderLeft: '4px solid #f87171',
              background: 'rgba(255, 60, 60, 0.04)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                Step and Touch Potential Limits
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                During a ground fault, voltage gradients appear on the earth surface around the grounding
                electrode. These gradients can be lethal if step potential (voltage between feet) or touch
                potential (voltage between hand and feet) exceeds safe limits.
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Parameter</th>
                      <th style={tableHeader}>Limit</th>
                      <th style={tableHeader}>Duration</th>
                      <th style={tableHeader}>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { param: 'Touch Potential (50 kg)', limit: '116V', duration: '1.0 sec', ref: 'IEEE 80 Table 9' },
                      { param: 'Touch Potential (70 kg)', limit: '157V', duration: '1.0 sec', ref: 'IEEE 80 Table 10' },
                      { param: 'Step Potential (50 kg)', limit: '367V', duration: '1.0 sec', ref: 'IEEE 80 Table 9' },
                      { param: 'Step Potential (70 kg)', limit: '497V', duration: '1.0 sec', ref: 'IEEE 80 Table 10' },
                      { param: 'Touch Potential (50 kg)', limit: '72V', duration: '3.0 sec', ref: 'IEEE 80' },
                      { param: 'Step Potential (50 kg)', limit: '229V', duration: '3.0 sec', ref: 'IEEE 80' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.param}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: '#f87171', fontWeight: 700 }}>{row.limit}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.duration}</td>
                        <td style={{ ...tableCell, fontSize: 11, color: 'var(--text-tertiary)' }}>{row.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
                Step potential is particularly dangerous near mine substations during a ground fault. Workers
                should be trained to shuffle their feet (no large steps) when near energized ground faults.
                Open pit mine substations must have a properly designed ground grid with adequate coverage.
              </div>
            </div>

            {/* Grounding Requirements Reference */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Mine Grounding Requirements
              </div>
              {groundingReferences.map((ref, i) => (
                <div key={i} style={{
                  padding: '10px 0',
                  borderBottom: i < groundingReferences.length - 1 ? '1px solid var(--divider)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                    {ref.item}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {ref.requirement}
                  </div>
                  <div style={{ ...badge, alignSelf: 'flex-start' }}>
                    {ref.reference}
                  </div>
                </div>
              ))}
            </div>

            {/* Test Equipment */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Test Equipment Reference
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Model</th>
                      <th style={tableHeader}>Type</th>
                      <th style={tableHeader}>Use</th>
                      <th style={tableHeader}>Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testEquipmentList.map((eq, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{eq.name}</td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{eq.type}</td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{eq.use}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{eq.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ground Grid Resistance Calculation */}
            <div style={{
              ...card,
              borderLeft: '4px solid var(--primary)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                Ground Grid Resistance Estimation
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                For a ground grid with total buried conductor length L in soil of resistivity {'\ρ'}:
              </div>
              <div style={{
                background: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--primary)',
                fontWeight: 600,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                <div>R<sub>grid</sub> = {'\ρ'} / (4r) + {'\ρ'} / L</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>
                  where r = {'\√'}(A/{'\π'}) = equivalent radius of grid area A
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
                This is the Schwarz/Laurent formula (IEEE 80). For open pit mine substations, the target
                is typically {'<'}1{'\Ω'}. Achieving this in rocky, high-resistivity soil may require ground
                enhancement (bentonite, chemical rods, or counterpoise conductors extending into lower benches).
              </div>
            </div>

            {/* Seasonal Variation */}
            <div style={{
              ...card,
              borderLeft: '4px solid #60a5fa',
              background: 'rgba(96, 165, 250, 0.04)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                Seasonal Variation in Open Pit Mines
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                Ground resistance in open pit mines varies significantly with season:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { season: 'Summer', factor: '1.0\× (baseline)', color: '#4ade80', notes: 'Best conditions. Moist soil, unfrozen ground. Ideal time for baseline testing.' },
                  { season: 'Fall', factor: '1.2-1.5\×', color: '#fbbf24', notes: 'Drying soil increases resistance. Ground starting to freeze on surface.' },
                  { season: 'Winter', factor: '3-10\×+', color: '#f87171', notes: 'Frozen ground dramatically increases resistance. Frost depth 1-2m in Northern Ontario. Ground rods below frost line critical.' },
                  { season: 'Spring', factor: '0.8-1.2\×', color: '#60a5fa', notes: 'Thawing and moisture reduce resistance. Spring runoff can temporarily improve grounding. Watch for frost heave damage to ground connections.' },
                ].map(s => (
                  <div key={s.season} style={{
                    background: 'var(--surface-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    borderLeft: `3px solid ${s.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{s.season}</span>
                      <span style={{
                        ...badge,
                        color: s.color,
                        background: `${s.color}18`,
                      }}>{s.factor}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {s.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mining-Specific Ground Testing Notes */}
            <div style={noteBox}>
              <strong>Open Pit Mining Ground Testing Best Practices:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {[
                  'Test all mine substation grounds annually per IEEE 81, with additional tests after major ground disturbance (blasting near substations)',
                  'Maintain records of ground resistance readings with seasonal notation for trend analysis',
                  'Ground rods must extend below maximum frost depth (typically 1.5-2.0m in Northern Ontario)',
                  'Shovel and drill ground rods may need to be re-driven when equipment moves to new bench levels',
                  'Use clamp-on testers for routine monthly checks to avoid disconnecting grounds from energized systems',
                  'After blasting operations near substations, re-test ground grid to verify conductor integrity',
                  'Consider ground enhancement (Chem-Rod, bentonite, ground enhancement material) in rocky waste dumps',
                ].map((note, i) => (
                  <div key={i} style={{ paddingLeft: 16, position: 'relative', fontSize: 13, lineHeight: 1.6 }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--text-tertiary)' }}>{'\•'}</span>
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div style={dangerBox}>
              <strong style={{ color: '#f87171' }}>Safety Warning:</strong> Never disconnect a ground
              conductor from an energized system to test ground resistance. Always de-energize and follow
              LOTO procedures before disconnecting any grounding connections. Use clamp-on ground testers
              for testing on energized multi-ground systems. Step potential hazards exist near ground fault
              locations {'\—'} approach with caution and use proper PPE.
            </div>
          </div>
        )}

      </div>
    </>
  )
}
