import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  High-Pot & Megger Testing Guide                                    */
/*  For open pit mine electricians — IEEE 43, NETA, ANSI/NEMA          */
/* ------------------------------------------------------------------ */

type TabKey = 'ir' | 'pi' | 'hipot' | 'transformer' | 'motor'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ir', label: 'IR Testing' },
  { key: 'pi', label: 'Polarization Index' },
  { key: 'hipot', label: 'Hi-Pot Testing' },
  { key: 'transformer', label: 'Transformer' },
  { key: 'motor', label: 'Motor Testing' },
]

/* ------------------------------------------------------------------ */
/*  IR Testing Data                                                    */
/* ------------------------------------------------------------------ */

interface TestVoltageRow {
  equipRating: string
  testVoltage: string
  minIR: string
}

const testVoltageTable: TestVoltageRow[] = [
  { equipRating: '< 250V', testVoltage: '500 VDC', minIR: '0.5 MΩ' },
  { equipRating: '250V \– 600V', testVoltage: '1,000 VDC', minIR: '1.0 MΩ' },
  { equipRating: '601V \– 5,000V', testVoltage: '2,500 VDC', minIR: '5.0 MΩ' },
  { equipRating: '4,160V (typical mine)', testVoltage: '5,000 VDC', minIR: '5.16 MΩ' },
  { equipRating: '5,001V \– 15,000V', testVoltage: '5,000 VDC', minIR: '15.0 MΩ' },
  { equipRating: '15,001V \– 25,000V', testVoltage: '5,000 VDC', minIR: '25.0 MΩ' },
  { equipRating: '> 25,000V', testVoltage: '5,000 \– 10,000 VDC', minIR: '100.0 MΩ' },
]

interface TempCorrectionRow {
  tempC: number
  tempF: number
  factor: number
}

const tempCorrectionTable: TempCorrectionRow[] = [
  { tempC: 0, tempF: 32, factor: 0.0625 },
  { tempC: 5, tempF: 41, factor: 0.088 },
  { tempC: 10, tempF: 50, factor: 0.125 },
  { tempC: 15, tempF: 59, factor: 0.177 },
  { tempC: 20, tempF: 68, factor: 0.25 },
  { tempC: 25, tempF: 77, factor: 0.354 },
  { tempC: 30, tempF: 86, factor: 0.5 },
  { tempC: 35, tempF: 95, factor: 0.707 },
  { tempC: 40, tempF: 104, factor: 1.0 },
  { tempC: 45, tempF: 113, factor: 1.414 },
  { tempC: 50, tempF: 122, factor: 2.0 },
  { tempC: 55, tempF: 131, factor: 2.828 },
  { tempC: 60, tempF: 140, factor: 4.0 },
  { tempC: 65, tempF: 149, factor: 5.656 },
  { tempC: 70, tempF: 158, factor: 8.0 },
  { tempC: 75, tempF: 167, factor: 11.314 },
]

const irProcedure: string[] = [
  'Perform LOTO and verify de-energization. Follow mine site safe work procedures.',
  'Disconnect equipment from all power sources. Open disconnects, remove fuses.',
  'Disconnect surge arresters, capacitors, and any sensitive electronics.',
  'Short all conductors to ground and discharge for at least 4x the test duration or 1 minute minimum.',
  'Remove grounds. Connect megger leads: LINE to conductor under test, EARTH to ground/frame.',
  'Record ambient temperature at the test location (critical for open pit conditions).',
  'Apply test voltage for 1 minute (60 seconds). Record the reading at 60 seconds.',
  'For PI testing, continue to 10 minutes (record 1-min and 10-min values).',
  'After testing, discharge the winding: short test leads to ground for at least 4x the test duration.',
  'Record results with date, temperature, humidity, equipment ID, and test voltage.',
]

/* ------------------------------------------------------------------ */
/*  Polarization Index Data                                            */
/* ------------------------------------------------------------------ */

interface PIClassRow {
  insClass: string
  minPI: number
  condition: string
}

const piClassTable: PIClassRow[] = [
  { insClass: 'Class A (105\°C)', minPI: 1.5, condition: 'Minimum acceptable for Class A insulation' },
  { insClass: 'Class B (130\°C)', minPI: 2.0, condition: 'Minimum acceptable for Class B insulation' },
  { insClass: 'Class F (155\°C)', minPI: 2.0, condition: 'Minimum acceptable for Class F insulation' },
  { insClass: 'Class H (180\°C)', minPI: 2.0, condition: 'Minimum acceptable for Class H insulation' },
]

interface PICondition {
  piRange: string
  condition: string
  action: string
  color: string
}

const piConditionTable: PICondition[] = [
  { piRange: '< 1.0', condition: 'Dangerous', action: 'Do NOT energize. Insulation critically degraded. Full rewind or replacement required.', color: '#ff3c3c' },
  { piRange: '1.0 \– 1.5', condition: 'Questionable', action: 'Investigate further. Possible moisture contamination. Consider drying/baking. Retest after treatment.', color: '#ff8c00' },
  { piRange: '1.5 \– 2.0', condition: 'Acceptable (Class A only)', action: 'Marginal for Class B/F/H. Acceptable for Class A only. Monitor trend closely.', color: '#ffd700' },
  { piRange: '2.0 \– 4.0', condition: 'Good', action: 'Insulation in good condition. Normal service. Continue routine testing schedule.', color: '#4ade80' },
  { piRange: '> 4.0', condition: 'Excellent', action: 'Insulation in excellent condition. No concerns. If extremely high (>8), may indicate brittle/dry insulation in very old motors.', color: '#4ade80' },
]

/* ------------------------------------------------------------------ */
/*  Hi-Pot Testing Data                                                */
/* ------------------------------------------------------------------ */

interface HiPotVoltageRow {
  equipClass: string
  ratedVoltage: string
  factoryTest: string
  maintenanceTest: string
}

const hiPotVoltageTable: HiPotVoltageRow[] = [
  { equipClass: 'LV Motors \≤ 600V', ratedVoltage: '600V', factoryTest: '2,200 VDC (2×600+1000)', maintenanceTest: '1,320 VDC (60%)' },
  { equipClass: 'LV Motors 480V', ratedVoltage: '480V', factoryTest: '1,960 VDC (2×480+1000)', maintenanceTest: '1,176 VDC (60%)' },
  { equipClass: 'MV Motors 4,160V', ratedVoltage: '4,160V', factoryTest: '10,120 VDC (2×4160+1800)', maintenanceTest: '6,072 VDC (60%)' },
  { equipClass: 'MV Cable 5kV', ratedVoltage: '5,000V', factoryTest: '25,000 VDC', maintenanceTest: '15,000 VDC (60%)' },
  { equipClass: 'MV Cable 15kV', ratedVoltage: '15,000V', factoryTest: '55,000 VDC', maintenanceTest: '33,000 VDC (60%)' },
  { equipClass: 'MV Cable 25kV', ratedVoltage: '25,000V', factoryTest: '80,000 VDC', maintenanceTest: '48,000 VDC (60%)' },
  { equipClass: 'Transformer \≤ 600V', ratedVoltage: '600V', factoryTest: '2,200 VAC / 3,100 VDC', maintenanceTest: '1,860 VDC (60%)' },
  { equipClass: 'Transformer 4,160V', ratedVoltage: '4,160V', factoryTest: '19,000 VAC / 26,800 VDC', maintenanceTest: '16,080 VDC (60%)' },
]

interface LeakageLimit {
  equipType: string
  acceptableUA: string
  notes: string
}

const leakageLimits: LeakageLimit[] = [
  { equipType: 'Motors \≤ 600V', acceptableUA: '< 50 \µA', notes: 'Current should stabilize and not increase over test duration' },
  { equipType: 'Motors 2,300V \– 6,900V', acceptableUA: '< 100 \µA', notes: 'Typical for mine shovel and drill motors in good condition' },
  { equipType: 'MV Cables (5kV class)', acceptableUA: '< 10 \µA/1000ft', notes: 'Per unit length; total depends on cable run' },
  { equipType: 'MV Cables (15kV class)', acceptableUA: '< 20 \µA/1000ft', notes: 'Monitor for increasing trend during test' },
  { equipType: 'Transformers', acceptableUA: '< 100 \µA', notes: 'Depends on MVA rating; compare to factory test data' },
]

const dischargeSteps: string[] = [
  'Reduce test voltage to zero gradually (do not abruptly remove).',
  'Connect a discharge resistor (typically 5kΩ/kV of test voltage) across the specimen.',
  'Wait a minimum of 4 times the test duration before touching any conductors.',
  'For cables: discharge through 1\–5 MΩ bleed resistor for at least 1 minute per kV of test voltage.',
  'Verify zero voltage with a voltmeter rated for the test voltage before removing leads.',
  'Apply a final hard ground (shorting bar) to all tested conductors.',
  'NEVER assume equipment is discharged — always verify with a rated instrument.',
]

/* ------------------------------------------------------------------ */
/*  Transformer Testing Data                                           */
/* ------------------------------------------------------------------ */

interface TTRRow {
  test: string
  method: string
  acceptable: string
  notes: string
}

const transformerTests: TTRRow[] = [
  { test: 'Turns Ratio (TTR)', method: 'Apply voltage to one winding, measure induced voltage on other winding', acceptable: '\±0.5% of nameplate ratio', notes: 'Test all taps. Deviations indicate shorted turns or tap changer issues.' },
  { test: 'Winding Resistance', method: 'DC resistance measurement using Kelvin bridge or micro-ohmmeter', acceptable: 'Within 2% between phases; within 5% of factory data', notes: 'Correct for temperature. Indicates loose connections, broken strands.' },
  { test: 'Power Factor / Dissipation Factor', method: 'Apply AC voltage, measure watts loss and reactive component', acceptable: 'New: < 0.5%. In service: < 2.0%', notes: 'Compare to factory test. Trending is critical. Higher = contamination.' },
  { test: 'Insulation Resistance (Megger)', method: 'DC voltage applied between windings and ground', acceptable: 'IEEE 43: 1 MΩ per kV rated +1 MΩ', notes: 'Test HV-to-LV, HV-to-GND, LV-to-GND. Temperature correct.' },
  { test: 'Excitation Current', method: 'Energize one winding, measure exciting current per phase', acceptable: 'Balanced within 5% between phases; compare to factory data', notes: 'Detects core defects, shorted turns. Unbalanced readings indicate problems.' },
  { test: 'SFRA (Sweep Frequency Response)', method: 'Inject frequency-swept signal, compare transfer function response', acceptable: 'Match baseline or factory fingerprint within defined corridors', notes: 'Detects winding movement, core displacement. Required after transport or blasting events.' },
]

interface DGARow {
  gas: string
  faultType: string
  normalPPM: string
  cautionPPM: string
  warningPPM: string
}

const dgaTable: DGARow[] = [
  { gas: 'Hydrogen (H\₂)', faultType: 'Partial discharge / corona', normalPPM: '< 100', cautionPPM: '100 \– 700', warningPPM: '> 700' },
  { gas: 'Methane (CH\₄)', faultType: 'Low-temp thermal fault (150\–300\°C)', normalPPM: '< 120', cautionPPM: '120 \– 400', warningPPM: '> 400' },
  { gas: 'Ethane (C\₂H\₆)', faultType: 'Low-temp thermal fault (300\–700\°C)', normalPPM: '< 65', cautionPPM: '65 \– 100', warningPPM: '> 100' },
  { gas: 'Ethylene (C\₂H\₄)', faultType: 'High-temp thermal fault (>700\°C)', normalPPM: '< 50', cautionPPM: '50 \– 200', warningPPM: '> 200' },
  { gas: 'Acetylene (C\₂H\₂)', faultType: 'Arcing / very high temp', normalPPM: '< 1', cautionPPM: '1 \– 35', warningPPM: '> 35' },
  { gas: 'Carbon Monoxide (CO)', faultType: 'Cellulose (paper) degradation', normalPPM: '< 350', cautionPPM: '350 \– 570', warningPPM: '> 570' },
  { gas: 'Carbon Dioxide (CO\₂)', faultType: 'Cellulose degradation (with CO)', normalPPM: '< 2,500', cautionPPM: '2,500 \– 4,000', warningPPM: '> 4,000' },
  { gas: 'Oxygen (O\₂)', faultType: 'Seal integrity indicator', normalPPM: '< 3,500', cautionPPM: 'N/A', warningPPM: '> 7,000' },
]

interface OilTestRow {
  test: string
  standard: string
  newOil: string
  serviceableOil: string
  rejectOil: string
}

const oilTestTable: OilTestRow[] = [
  { test: 'Dielectric Breakdown (kV)', standard: 'ASTM D1816 (1mm gap)', newOil: '\≥ 30 kV', serviceableOil: '\≥ 25 kV', rejectOil: '< 25 kV' },
  { test: 'Dielectric Breakdown (kV)', standard: 'ASTM D877 (2.5mm gap)', newOil: '\≥ 30 kV', serviceableOil: '\≥ 26 kV', rejectOil: '< 26 kV' },
  { test: 'Moisture Content (ppm)', standard: 'ASTM D1533', newOil: '< 10 ppm', serviceableOil: '< 35 ppm (\≤69kV)', rejectOil: '> 35 ppm' },
  { test: 'Acidity (mg KOH/g)', standard: 'ASTM D974', newOil: '< 0.03', serviceableOil: '< 0.20', rejectOil: '> 0.20' },
  { test: 'Interfacial Tension (mN/m)', standard: 'ASTM D971', newOil: '\≥ 40', serviceableOil: '\≥ 25', rejectOil: '< 25' },
  { test: 'Power Factor (%)', standard: 'ASTM D924', newOil: '< 0.05%', serviceableOil: '< 0.5% (25\°C)', rejectOil: '> 0.5%' },
  { test: 'Color', standard: 'ASTM D1500', newOil: '0.5 \– 1.0', serviceableOil: '< 3.5', rejectOil: '> 3.5' },
]

/* ------------------------------------------------------------------ */
/*  Motor Testing Data                                                 */
/* ------------------------------------------------------------------ */

interface MotorTestRow {
  test: string
  what: string
  procedure: string
  acceptable: string
  miningNote: string
}

const motorTests: MotorTestRow[] = [
  {
    test: 'Surge Comparison',
    what: 'Detects turn-to-turn shorts, ground faults, and winding symmetry issues',
    procedure: 'Apply identical voltage surges to each phase pair. Compare reflected waveforms on oscilloscope.',
    acceptable: 'Waveforms should overlay within 5% (EAR). Identical patterns across all phase pairs.',
    miningNote: 'Critical for shovel hoist and crowd motors that see frequent overloads and reversals.',
  },
  {
    test: 'Rotor Bar Test',
    what: 'Detects broken or cracked rotor bars in squirrel cage motors',
    procedure: 'Growler test (static): rotate rotor slowly, look for induced vibration over bar joints. OR single-phase rotor test: apply reduced voltage, measure current variation as rotor is slowly turned.',
    acceptable: 'Even current draw across all rotor positions. Current variation < 5% indicates intact bars.',
    miningNote: 'Crusher and conveyor drive motors are prone to broken rotor bars from heavy starting loads.',
  },
  {
    test: 'Bearing Insulation',
    what: 'Verifies insulated bearings are preventing shaft currents',
    procedure: 'Measure resistance across bearing insulation (shaft to frame) with megger at 500V DC.',
    acceptable: '> 1 MΩ for insulated bearings. < 10 kΩ indicates failed insulation.',
    miningNote: 'VFD-driven motors and large generators require insulated bearings to prevent EDM damage.',
  },
  {
    test: 'Vibration Analysis',
    what: 'Running test to detect mechanical and electrical faults',
    procedure: 'Measure velocity (mm/s or in/s) and acceleration at DE and NDE bearings in horizontal, vertical, and axial planes.',
    acceptable: 'ISO 10816: Velocity < 4.5 mm/s (0.18 in/s) for rigid mount, < 7.1 mm/s for flexible. Alert at 1.5× baseline.',
    miningNote: 'Dust and vibration from blasting increase bearing wear. Baseline after installation, recheck monthly on shovels.',
  },
  {
    test: 'Current Signature Analysis (CSA)',
    what: 'Running test to detect rotor and air gap issues from stator current waveform',
    procedure: 'Capture stator current waveform with high-resolution analyzer. FFT analysis looking for sideband frequencies around line frequency.',
    acceptable: 'Sidebands at f\ₗ \± 2sf\ₗ should be > 54 dB below fundamental (healthy). 48\–54 dB = 1 broken bar, < 40 dB = multiple bars.',
    miningNote: 'Non-invasive test for running equipment. Use on drag chain conveyors and pump motors between shutdowns.',
  },
  {
    test: 'Temperature Rise Test',
    what: 'Verifies motor does not exceed insulation class temperature limits under load',
    procedure: 'Run motor at rated load until thermal equilibrium (typically 4\–8 hours). Measure winding temperature by resistance method or embedded RTD/thermocouple.',
    acceptable: 'Class B: 80\°C rise over 40\°C ambient. Class F: 105\°C rise. Class H: 125\°C rise.',
    miningNote: 'Open pit ambient can exceed 40\°C in summer — derate motors or use Class F/H insulation for all mine equipment.',
  },
]

interface TestScheduleRow {
  equipment: string
  irPI: string
  surge: string
  vibration: string
  notes: string
}

const testScheduleTable: TestScheduleRow[] = [
  { equipment: 'Shovel Hoist/Crowd/Swing Motors', irPI: 'Monthly', surge: 'Quarterly', vibration: 'Monthly', notes: 'Extreme duty cycle. High reversal count. Priority testing.' },
  { equipment: 'Shovel Propel Motors', irPI: 'Monthly', surge: 'Semi-annual', vibration: 'Monthly', notes: 'Exposed to dust, shock loads during propel.' },
  { equipment: 'Drill Rotation Motors', irPI: 'Monthly', surge: 'Quarterly', vibration: 'Monthly', notes: 'High vibration environment. Check coupling alignment.' },
  { equipment: 'Crusher Motors', irPI: 'Quarterly', surge: 'Semi-annual', vibration: 'Monthly', notes: 'Heavy starting loads. Check rotor bars regularly.' },
  { equipment: 'Conveyor Drive Motors', irPI: 'Quarterly', surge: 'Annual', vibration: 'Quarterly', notes: 'Exposed to dust and moisture. Check belt alignment effect.' },
  { equipment: 'Pump Motors', irPI: 'Quarterly', surge: 'Annual', vibration: 'Quarterly', notes: 'Dewatering pumps may run submerged — check seals.' },
  { equipment: 'Haul Truck Wheel Motors', irPI: 'Per service', surge: 'Annual', vibration: 'Per service', notes: 'Test during scheduled maintenance. Check traction motor brushes.' },
  { equipment: 'Substation Transformers', irPI: 'Semi-annual', surge: 'N/A', vibration: 'Annual', notes: 'DGA/oil testing annually. After blasting events or transport.' },
  { equipment: 'Portable Power Centers', irPI: 'Quarterly', surge: 'N/A', vibration: 'N/A', notes: 'Test after every relocation. Inspect cable entries.' },
  { equipment: 'Generators (standby)', irPI: 'Semi-annual', surge: 'Annual', vibration: 'Semi-annual', notes: 'Test before and after seasonal storage.' },
]

interface FailureModeRow {
  mode: string
  cause: string
  detection: string
  prevention: string
}

const failureModes: FailureModeRow[] = [
  { mode: 'Insulation Breakdown', cause: 'Thermal aging, moisture ingress, contamination from dust and oil mist, voltage spikes from VFD or switching', detection: 'IR/PI trending downward, hi-pot failure, surge test asymmetry', prevention: 'Regular IR/PI testing, space heaters when idle, VFD output filters, keep enclosures sealed' },
  { mode: 'Bearing Failure', cause: 'Overgreasing, undergreasing, contamination from pit dust, shaft currents from VFD, misalignment', detection: 'Vibration analysis (high-frequency), temperature rise, current signature changes', prevention: 'Proper lubrication schedule, shaft grounding rings, laser alignment after install' },
  { mode: 'Broken Rotor Bars', cause: 'Frequent starts/stops (shovels, crushers), high inertia loads, thermal cycling, manufacturing defects', detection: 'Current signature analysis (sidebands), growler test, increased slip at load', prevention: 'Limit starts per hour, soft starters or VFD starting, proper motor sizing' },
  { mode: 'Winding Contamination', cause: 'Dust ingress (open pit), moisture from rain/humidity swings, oil/grease leaks onto windings', detection: 'Low IR readings, low PI (< 1.5), visual inspection showing deposits', prevention: 'Sealed enclosures (TEFC/TENV), positive pressurization, regular cleaning during shutdowns' },
  { mode: 'Phase Imbalance / Single Phasing', cause: 'Blown fuse, loose connection, contactor failure, cable damage from mobile equipment', detection: 'Current imbalance > 2% between phases, excessive heating, tripping on overload', prevention: 'Phase loss relays, current monitoring, torque-check connections quarterly' },
  { mode: 'Cable Failure (trailing)', cause: 'Mechanical damage from equipment running over cables, UV degradation, repeated flexing at reeling drum', detection: 'IR testing, hi-pot testing, visual inspection of jacket condition', prevention: 'Cable reeling systems, proper cable handling training, regular visual inspections each shift' },
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 48,
  padding: '0 16px',
  borderRadius: 24,
  fontSize: 13,
  fontWeight: 600,
  border: '2px solid var(--divider)',
  background: 'transparent',
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

const dangerCard: React.CSSProperties = {
  ...card,
  border: '1px solid rgba(255, 60, 60, 0.3)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 56,
  padding: '0 16px',
  background: 'var(--surface-elevated)',
  border: '2px solid var(--divider)',
  borderRadius: 'var(--radius)',
  fontSize: 16,
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
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

/* ------------------------------------------------------------------ */
/*  IR Calculator Logic                                                */
/* ------------------------------------------------------------------ */

function getTempCorrectionFactor(tempC: number): number {
  // IEEE 43 standard: resistance doubles for every 10 deg C decrease
  // Correction to 40 deg C reference: factor = 2^((40-T)/10)
  // This halves the resistance for every 10 deg C above reference
  return Math.pow(2, (40 - tempC) / 10)
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TestingGuidePage() {
  const [tab, setTab] = useState<TabKey>('ir')

  // IR Calculator state
  const [irRatedKV, setIrRatedKV] = useState('')
  const [irMeasured, setIrMeasured] = useState('')
  const [irTemp, setIrTemp] = useState('')

  // Compute IR results
  const irResult = (() => {
    const kv = parseFloat(irRatedKV)
    const measured = parseFloat(irMeasured)
    const temp = parseFloat(irTemp)
    if (!kv || !measured || isNaN(temp)) return null
    const factor = getTempCorrectionFactor(temp)
    const corrected = measured * factor
    const minimum = kv + 1 // IEEE 43: 1 MΩ/kV + 1 MΩ
    const pass = corrected >= minimum
    return { corrected: Math.round(corrected * 100) / 100, minimum, factor: Math.round(factor * 1000) / 1000, pass }
  })()

  // PI Calculator state
  const [piOneMin, setPiOneMin] = useState('')
  const [piTenMin, setPiTenMin] = useState('')

  const piResult = (() => {
    const one = parseFloat(piOneMin)
    const ten = parseFloat(piTenMin)
    if (!one || !ten || one <= 0) return null
    const pi = ten / one
    let condition: string
    let color: string
    if (pi < 1.0) { condition = 'Dangerous'; color = '#ff3c3c' }
    else if (pi < 1.5) { condition = 'Questionable'; color = '#ff8c00' }
    else if (pi < 2.0) { condition = 'Acceptable (Class A only)'; color = '#ffd700' }
    else if (pi < 4.0) { condition = 'Good'; color = '#4ade80' }
    else { condition = 'Excellent'; color = '#4ade80' }
    return { pi: Math.round(pi * 100) / 100, condition, color }
  })()

  return (
    <>
      <Header title="Hi-Pot & Megger Guide" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Danger banner */}
        <div style={{
          background: 'rgba(255, 60, 60, 0.12)',
          border: '1px solid rgba(255, 60, 60, 0.4)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{'\⚠'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            <strong style={{ color: '#ff3c3c' }}>HI-POT TESTING USES LETHAL VOLTAGES.</strong> Always follow
            LOTO and safe work procedures. Ensure all personnel are clear of the test area. Only qualified
            workers may perform these tests. Follow your mine site&apos;s specific test procedures and permits.
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
        {/*  TAB 1: IR Testing                                           */}
        {/* ============================================================ */}
        {tab === 'ir' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Insulation Resistance (Megger) Testing</div>

            {/* Overview card */}
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                What Is IR Testing?
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Insulation Resistance (IR) testing, commonly called &quot;Meggering,&quot; applies a DC voltage to
                electrical insulation and measures the resulting leakage current to determine insulation resistance
                in Megohms (M&Omega;). It is the most fundamental insulation test for motors, cables, transformers,
                and switchgear in mining operations. Per IEEE 43, minimum acceptable IR = <strong style={{ color: 'var(--text)' }}>1 M&Omega; per kV of rated voltage + 1 M&Omega;</strong>.
              </div>
            </div>

            {/* Test Voltages Table */}
            <div style={sectionHeading}>Test Voltages by Equipment Rating</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Equipment Rating</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Test Voltage</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Min IR (IEEE 43)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testVoltageTable.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600 }}>{r.equipRating}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{r.testVoltage}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.minIR}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Temperature Correction Table */}
            <div style={sectionHeading}>Temperature Correction Factors (to 40&deg;C Reference)</div>
            <div style={{
              ...card,
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              Open pit mines experience wide ambient temperature swings (&minus;40&deg;C winter to +45&deg;C summer).
              IR readings <strong style={{ color: 'var(--text)' }}>must</strong> be corrected to 40&deg;C reference per IEEE 43.
              Corrected IR = Measured IR &times; Correction Factor. Resistance roughly <strong style={{ color: 'var(--text)' }}>doubles for every 10&deg;C decrease</strong> in temperature.
            </div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Temp (&deg;C)</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Temp (&deg;F)</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Correction Factor</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Multiply Measured By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tempCorrectionTable.map((r, i) => (
                      <tr key={i} style={{
                        background: r.tempC === 40 ? 'rgba(78, 205, 196, 0.1)' : i % 2 ? 'var(--surface-elevated)' : 'transparent',
                      }}>
                        <td style={{ ...tableCell, textAlign: 'center', fontWeight: r.tempC === 40 ? 700 : 400, color: r.tempC === 40 ? 'var(--primary)' : 'var(--text)' }}>
                          {r.tempC}&deg;C
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', color: 'var(--text-secondary)' }}>{r.tempF}&deg;F</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>
                          {r.factor}
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          &times; {r.factor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div style={sectionHeading}>Test Procedure</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {irProcedure.map((step, i) => (
                <div key={i} style={{
                  ...card,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  borderLeft: i === 0 ? '4px solid #ff3c3c' : '4px solid var(--divider)',
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: i === 0 ? 'rgba(255, 60, 60, 0.15)' : 'var(--surface-elevated)',
                    color: i === 0 ? '#ff3c3c' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* IR Calculator */}
            <div style={sectionHeading}>IR Calculator</div>
            <div style={{
              ...card,
              background: 'var(--surface-elevated)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Enter values to calculate corrected IR and pass/fail
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Equipment Rated Voltage (kV)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 4.16"
                  value={irRatedKV}
                  onChange={e => setIrRatedKV(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Measured IR (M&Omega;)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 150"
                  value={irMeasured}
                  onChange={e => setIrMeasured(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Ambient Temperature (&deg;C)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 20"
                  value={irTemp}
                  onChange={e => setIrTemp(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {irResult && (
                <div style={{
                  marginTop: 8,
                  padding: 14,
                  borderRadius: 'var(--radius)',
                  background: irResult.pass ? 'rgba(78, 205, 128, 0.12)' : 'rgba(255, 60, 60, 0.12)',
                  border: `1px solid ${irResult.pass ? 'rgba(78, 205, 128, 0.4)' : 'rgba(255, 60, 60, 0.4)'}`,
                }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: irResult.pass ? '#4ade80' : '#ff3c3c',
                    marginBottom: 8,
                  }}>
                    {irResult.pass ? 'PASS' : 'FAIL'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      <strong>Correction Factor (to 40&deg;C):</strong>{' '}
                      <span style={{ fontFamily: 'var(--font-mono)' }}>&times; {irResult.factor}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      <strong>Corrected IR:</strong>{' '}
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                        {irResult.corrected} M&Omega;
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      <strong>Minimum Required (IEEE 43):</strong>{' '}
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{irResult.minimum} M&Omega;</span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 6 }}>
                        (1 M&Omega;/kV + 1 M&Omega;)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mining notes */}
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Open Pit Mining Notes
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Temperature correct ALL readings. A 20&deg;C reading at &minus;20&deg;C appears 16&times; higher than it would at 40&deg;C reference.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Trending is more valuable than any single reading. Record results in equipment logbook every time.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Test cables after blasting events or any relocation of portable equipment.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Humidity affects readings significantly. Morning readings in open pit may differ from afternoon.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Shovel trailing cables: test at each splice point individually to isolate degradation.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Polarization Index                                   */}
        {/* ============================================================ */}
        {tab === 'pi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Polarization Index (PI) Testing</div>

            {/* Overview */}
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                What Is the Polarization Index?
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The Polarization Index (PI) is the ratio of the 10-minute insulation resistance reading to the
                1-minute reading, taken at the same test voltage. Unlike a single IR reading, PI is
                <strong style={{ color: 'var(--text)' }}> largely independent of temperature</strong>, making it
                especially valuable for open pit mining where ambient temperatures vary widely. PI reveals the
                quality and condition of insulation beyond what a single IR value can show.
              </div>
              <div style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-elevated)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Formula
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  PI = R<sub>10min</sub> / R<sub>1min</sub>
                </div>
              </div>
            </div>

            {/* How PI works */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                What PI Tells You
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Good insulation absorbs current over time as dipoles align (polarization). The IR reading
                increases steadily from 1 minute to 10 minutes, giving a PI &gt; 2.0. Contaminated or moist
                insulation conducts a constant leakage current, so the reading does not climb &mdash; the PI
                stays near 1.0. Very dry, brittle insulation may give an extremely high PI (&gt; 8) with very
                high absolute IR &mdash; this can indicate aged insulation that may crack under mechanical stress.
              </div>
            </div>

            {/* Acceptable PI by Class */}
            <div style={sectionHeading}>Minimum PI by Insulation Class (IEEE 43)</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-elevated)' }}>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Insulation Class</th>
                    <th style={{ ...tableHeader, textAlign: 'center' }}>Min PI</th>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {piClassTable.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                      <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600 }}>{r.insClass}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700, fontSize: 16 }}>
                        {r.minPI}
                      </td>
                      <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>{r.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PI Condition Table */}
            <div style={sectionHeading}>PI Interpretation Guide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {piConditionTable.map((r, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: `4px solid ${r.color}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: 16,
                      color: r.color,
                      minWidth: 70,
                    }}>
                      {r.piRange}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      {r.condition}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {r.action}
                  </div>
                </div>
              ))}
            </div>

            {/* PI Test Procedure */}
            <div style={sectionHeading}>How to Perform a PI Test</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Follow full LOTO procedure. Disconnect equipment and discharge all stored energy.',
                'Connect megger leads: LINE to winding under test, EARTH to frame/ground.',
                'Select appropriate test voltage (same as IR test voltage for equipment rating).',
                'Start the test and start timing. Do NOT interrupt the test once started.',
                'Record the IR value at exactly 1 minute (R\₁).',
                'Continue the test without interruption for a full 10 minutes.',
                'Record the IR value at exactly 10 minutes (R\₁\₀).',
                'Calculate PI = R\₁\₀ / R\₁. Compare to minimum values for insulation class.',
                'Discharge windings: short to ground for at least 4× the test duration (40 minutes).',
                'Record all values with date, equipment ID, ambient conditions.',
              ].map((step, i) => (
                <div key={i} style={{
                  ...card,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--surface-elevated)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* PI Calculator */}
            <div style={sectionHeading}>PI Calculator</div>
            <div style={{
              ...card,
              background: 'var(--surface-elevated)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Enter your 1-minute and 10-minute readings
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  1-Minute Reading (M&Omega;)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 500"
                  value={piOneMin}
                  onChange={e => setPiOneMin(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  10-Minute Reading (M&Omega;)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 1500"
                  value={piTenMin}
                  onChange={e => setPiTenMin(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {piResult && (
                <div style={{
                  marginTop: 8,
                  padding: 14,
                  borderRadius: 'var(--radius)',
                  background: piResult.pi >= 2.0 ? 'rgba(78, 205, 128, 0.12)' : piResult.pi >= 1.5 ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255, 60, 60, 0.12)',
                  border: `1px solid ${piResult.color}40`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 32,
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: piResult.color,
                    }}>
                      {piResult.pi}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {piResult.condition}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {piResult.pi < 1.0 && 'Do NOT energize this equipment. Insulation is critically degraded. Investigate moisture, contamination, or physical damage.'}
                    {piResult.pi >= 1.0 && piResult.pi < 1.5 && 'Insulation is questionable. Consider drying/baking the winding. Retest after treatment. Do not put into service without further investigation.'}
                    {piResult.pi >= 1.5 && piResult.pi < 2.0 && 'Acceptable for Class A insulation only. Marginal for modern insulation systems (Class B/F/H). Monitor trend closely.'}
                    {piResult.pi >= 2.0 && piResult.pi < 4.0 && 'Insulation is in good condition. Continue routine testing schedule and record for trend analysis.'}
                    {piResult.pi >= 4.0 && 'Insulation is in excellent condition. Continue normal testing schedule.'}
                  </div>
                </div>
              )}
            </div>

            {/* Common PI Issues */}
            <div style={sectionHeading}>Common Issues &amp; Troubleshooting</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { issue: 'Low PI (< 1.5)', causes: 'Moisture absorption into winding insulation (common after rain/snow in open pit), conductive contamination from mine dust, oil mist, or carbon deposits.', fix: 'Dry the motor: use space heaters, reduced-voltage baking, or vacuum drying. Clean windings with approved solvent. Retest after drying.' },
                { issue: 'PI close to 1.0', causes: 'Severe moisture saturation, flooded winding (dewatering pump failure), heavy conductive contamination throughout.', fix: 'Extended drying required. If PI does not improve after thorough drying, winding may be physically damaged. Inspect visually, consider rewind.' },
                { issue: 'Very high PI (> 8.0)', causes: 'Extremely dry, aged insulation (Class A in old equipment). While high IR is good, brittle insulation can crack under thermal or mechanical stress.', fix: 'Not necessarily a problem. Inspect for visible cracks. Consider surge comparison test to check for turn-to-turn shorts that may not show on IR/PI.' },
                { issue: 'IR reading unstable/jumping', causes: 'Loose connections, surface contamination, inadequate discharge before test, electromagnetic interference from nearby equipment.', fix: 'Check all connections. Clean insulation surfaces. Ensure full discharge before restarting test. Move away from running equipment if possible.' },
              ].map((item, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: `4px solid ${i < 2 ? '#ff3c3c' : i === 2 ? '#ffd700' : '#ff8c00'}`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.issue}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                    <strong style={{ color: 'var(--text)' }}>Causes:</strong> {item.causes}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text)' }}>Action:</strong> {item.fix}
                  </div>
                </div>
              ))}
            </div>

            {/* Mining note */}
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Open Pit Mining Notes
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Shovel hoist, crowd, and swing motors see extreme reversing duty and need monthly PI testing.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Drill motors vibrate constantly &mdash; PI testing helps detect insulation breakdown before failure.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  PI is temperature-independent, making it ideal for open pit where ambient varies from &minus;40&deg;C to +45&deg;C.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Always record both the 1-min and 10-min absolute values along with the PI ratio for trending.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Hi-Pot Testing                                       */}
        {/* ============================================================ */}
        {tab === 'hipot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>DC Hi-Pot (High Potential) Testing</div>

            {/* Danger warning */}
            <div style={{
              ...dangerCard,
              background: 'rgba(255, 60, 60, 0.08)',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{'\☠'}</span>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
                <strong style={{ color: '#ff3c3c' }}>LETHAL VOLTAGES.</strong> Hi-pot testing uses voltages
                up to 80,000 VDC. Death or serious injury will result from contact. Establish a barricaded test
                area. All personnel must be clear. Only qualified, authorized workers may perform hi-pot testing.
                Ensure proper discharge after EVERY test.
              </div>
            </div>

            {/* Overview */}
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                What Is Hi-Pot Testing?
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                A DC hi-pot (high potential) test applies a voltage significantly higher than the equipment&apos;s
                normal operating voltage to stress-test the insulation. It verifies that insulation can withstand
                transient overvoltages (switching surges, lightning) that occur in service. There are two levels:
                <strong style={{ color: 'var(--text)' }}> Factory test</strong> (full voltage, new equipment) and
                <strong style={{ color: 'var(--text)' }}> Maintenance test</strong> (60% of factory, for in-service equipment).
              </div>
              <div style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-elevated)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Factory Test (equipment &le; 600V)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    2 &times; Rated + 1,000V
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--divider)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Maintenance Test
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    60% of Factory Test
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--divider)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Acceptance Test Duration
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                    1 minute
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--divider)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Maintenance Test Duration
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>
                    5 minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Test Voltage Table */}
            <div style={sectionHeading}>Test Voltages by Equipment Class</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Equipment Class</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Rated</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Factory Test</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Maint. Test (60%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiPotVoltageTable.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 12 }}>{r.equipClass}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.ratedVoltage}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{r.factoryTest}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#ffd700', fontWeight: 600, fontSize: 12 }}>{r.maintenanceTest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leakage Current Limits */}
            <div style={sectionHeading}>Leakage Current Limits</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Equipment Type</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Acceptable Leakage</th>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leakageLimits.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 12 }}>{r.equipType}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>{r.acceptableUA}</td>
                        <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety Precautions */}
            <div style={sectionHeading}>Safety Precautions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { title: 'Barricade the Test Area', detail: 'Establish a physical barricade around the test area with caution tape and warning signs. No one enters the barricade during testing. Post a visible warning light.', critical: true },
                { title: 'All Personnel Clear', detail: 'Verify all personnel are outside the barricade before applying test voltage. Maintain visual contact with all test leads. Use a spotter if test area is large.', critical: true },
                { title: 'Use Grounding Stick', detail: 'After every test, discharge the specimen using an approved grounding stick (hot stick with ground lead). Apply the grounding stick before approaching the equipment.', critical: true },
                { title: 'Verify Discharge', detail: 'After grounding, verify zero voltage with a voltmeter rated for the test voltage. Never trust a single discharge — cables and windings can hold charge for hours.', critical: true },
                { title: 'Communication', detail: 'Maintain clear communication between the test operator and any assistants. Use radios if needed. Agree on start/stop signals before beginning.', critical: false },
                { title: 'Weather Conditions', detail: 'Do not perform hi-pot testing in rain, snow, fog, or when humidity is excessive. Moisture on surfaces will cause surface flashover and invalid results.', critical: false },
                { title: 'Emergency Procedures', detail: 'Have emergency response plan ready. Know location of nearest AED and first aid kit. Ensure at least two people are present during testing.', critical: true },
              ].map((item, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: `4px solid ${item.critical ? '#ff3c3c' : 'var(--divider)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.title}</span>
                    {item.critical && (
                      <span style={{ ...badge, color: '#ff3c3c', background: 'rgba(255,60,60,0.1)', fontSize: 10, fontFamily: 'inherit' }}>
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Discharge Procedure */}
            <div style={sectionHeading}>Discharge Procedure After Testing</div>
            <div style={{
              ...dangerCard,
              background: 'rgba(255, 60, 60, 0.05)',
              padding: '10px 14px',
              marginBottom: 4,
              fontSize: 13,
              color: '#ff3c3c',
              fontWeight: 600,
            }}>
              NEVER skip discharge. Cables and windings store charge that can kill even after the test set is turned off.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dischargeSteps.map((step, i) => (
                <div key={i} style={{
                  ...card,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  borderLeft: i === dischargeSteps.length - 1 ? '4px solid #ff3c3c' : '4px solid var(--divider)',
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--surface-elevated)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* Mining notes */}
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Open Pit Mining Notes
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Hi-pot trailing cables after every relocation or blasting event near cable routes.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Do not hi-pot cables with damaged jackets &mdash; repair first, then test. Surface moisture will cause flashover.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  For mine cables, step-voltage test is preferred: apply 25%, 50%, 75%, then 100% of test voltage in steps, recording leakage at each level.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Record leakage current vs. time curve. Rising leakage during test indicates insulation distress &mdash; abort test.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Transformer Testing                                  */}
        {/* ============================================================ */}
        {tab === 'transformer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Transformer Testing</div>

            {/* Overview */}
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                Transformer Testing Overview
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Transformers in mining operations endure vibration from blasting, temperature extremes, and frequent
                load cycling. A comprehensive test program includes electrical tests (turns ratio, winding resistance,
                insulation resistance, power factor), oil analysis (DGA, dielectric strength), and advanced diagnostics
                (SFRA). Testing should follow NETA MTS standards and IEEE C57 guidelines.
              </div>
            </div>

            {/* Transformer Tests Table */}
            <div style={sectionHeading}>Electrical &amp; Diagnostic Tests</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {transformerTests.map((t, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: '4px solid var(--primary)',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                    {t.test}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Method:</strong> {t.method}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Acceptable:</strong>{' '}
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.acceptable}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Notes:</strong> {t.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DGA Interpretation */}
            <div style={sectionHeading}>Dissolved Gas Analysis (DGA) Interpretation</div>
            <div style={{
              ...card,
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 0,
            }}>
              DGA is the single most important diagnostic tool for oil-filled transformers. Gases dissolved in
              transformer oil indicate the type and severity of internal faults. Values below are typical limits
              per IEEE C57.104.
            </div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Gas</th>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Fault Type</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Normal</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ffd700' }}>Caution</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ff3c3c' }}>Warning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dgaTable.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 12 }}>{r.gas}</td>
                        <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>{r.faultType}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#4ade80', fontSize: 12 }}>{r.normalPPM}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#ffd700', fontSize: 12 }}>{r.cautionPPM}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#ff3c3c', fontSize: 12 }}>{r.warningPPM}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key DGA Ratios */}
            <div style={sectionHeading}>Key DGA Ratio Analysis</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { ratio: 'C\₂H\₂ / C\₂H\₄ > 1', meaning: 'Arcing fault', detail: 'Acetylene only forms at extremely high temperatures (>700\°C). If acetylene exceeds ethylene, arcing is occurring. Investigate immediately.' },
                { ratio: 'C\₂H\₄ / C\₂H\₆ > 1', meaning: 'High-temperature thermal fault', detail: 'Ethylene is generated at higher temperatures than ethane. Ratio > 1 suggests hotspot above 700\°C. Check connections and core.' },
                { ratio: 'CH\₄ / H\₂ > 1', meaning: 'Thermal fault', detail: 'Methane dominant over hydrogen indicates thermal decomposition rather than partial discharge. Check oil circulation.' },
                { ratio: 'CO\₂ / CO > 7', meaning: 'Normal aging', detail: 'Healthy ratio for cellulose (paper) insulation aging. Values dropping below 3 indicate accelerated paper degradation.' },
              ].map((item, i) => (
                <div key={i} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--primary)',
                      background: 'var(--surface-elevated)',
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}>
                      {item.ratio}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.meaning}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Oil Testing */}
            <div style={sectionHeading}>Oil Dielectric &amp; Quality Testing</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Test</th>
                      <th style={{ ...tableHeader, textAlign: 'left', fontSize: 10 }}>Standard</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#4ade80' }}>New Oil</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ffd700' }}>Serviceable</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ff3c3c' }}>Reject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oilTestTable.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 11 }}>{r.test}</td>
                        <td style={{ ...tableCell, color: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>{r.standard}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#4ade80', fontSize: 11 }}>{r.newOil}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#ffd700', fontSize: 11 }}>{r.serviceableOil}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', color: '#ff3c3c', fontSize: 11 }}>{r.rejectOil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SFRA */}
            <div style={sectionHeading}>Sweep Frequency Response Analysis (SFRA)</div>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                When to Perform SFRA
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                SFRA compares the electrical response of a transformer winding across a range of frequencies to a
                baseline or factory fingerprint. Changes in the response indicate mechanical movement or deformation
                of windings, which cannot be detected by any other electrical test.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'After any through-fault event (protection operated)',
                  'After transport or relocation of the transformer',
                  'After nearby blasting events (critical in open pit mines)',
                  'After seismic activity',
                  'As part of commissioning (establish baseline fingerprint)',
                  'When DGA indicates arcing or high-energy discharge',
                  'When turns ratio test shows deviations',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14, lineHeight: 1.6 }}>{'\•'}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insulation Resistance of Windings */}
            <div style={sectionHeading}>Winding Insulation Resistance Tests</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-elevated)' }}>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Test Configuration</th>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Energize</th>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Ground</th>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Guard</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { config: 'HV Winding to Ground', energize: 'HV winding (all phases shorted)', ground: 'Core + frame + tank', guard: 'LV winding (shorted)' },
                    { config: 'LV Winding to Ground', energize: 'LV winding (all phases shorted)', ground: 'Core + frame + tank', guard: 'HV winding (shorted)' },
                    { config: 'HV to LV', energize: 'HV winding (all phases shorted)', ground: 'LV winding (shorted)', guard: 'Core + frame + tank' },
                  ].map((r, i) => (
                    <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                      <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{r.config}</td>
                      <td style={{ ...tableCell, color: 'var(--primary)', fontSize: 12 }}>{r.energize}</td>
                      <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>{r.ground}</td>
                      <td style={{ ...tableCell, color: 'var(--text-tertiary)', fontSize: 12 }}>{r.guard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mining notes */}
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Open Pit Mining Notes
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Test transformers after blasting events, especially portable substations near active mining faces.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  SFRA baseline should be taken immediately after installation &mdash; before any blasting occurs nearby.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  DGA sampling on mine transformers should be quarterly minimum due to vibration and load cycling.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Check oil level and breather condition frequently &mdash; dust can clog silica gel breathers rapidly in pit conditions.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  After relocating a portable substation, allow oil to settle for 24 hours before performing oil dielectric test.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Motor Testing                                        */}
        {/* ============================================================ */}
        {tab === 'motor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Motor Testing Procedures</div>

            {/* Overview */}
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                Motor Testing for Mining Operations
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Mining motors face extreme conditions: heavy starting loads, frequent reversals (shovels), continuous
                vibration, dust contamination, and wide temperature swings. A comprehensive test program combines
                offline tests (IR/PI, surge comparison, hi-pot) with online tests (vibration, current signature,
                temperature) to predict failures before they cause unplanned downtime. Shovel downtime can cost
                $10,000+ per hour &mdash; testing pays for itself.
              </div>
            </div>

            {/* Motor-Specific Tests */}
            <div style={sectionHeading}>Motor-Specific Tests</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {motorTests.map((t, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: '4px solid var(--primary)',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                    {t.test}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>What it detects:</strong> {t.what}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Procedure:</strong> {t.procedure}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Acceptable:</strong>{' '}
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.acceptable}</span>
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#ff8c00',
                      lineHeight: 1.6,
                      padding: '6px 10px',
                      background: 'rgba(255, 140, 0, 0.08)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <strong>Mining:</strong> {t.miningNote}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testing Schedule */}
            <div style={sectionHeading}>Recommended Testing Schedule for Mine Motors</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-elevated)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Equipment</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>IR/PI</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Surge</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Vibration</th>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testScheduleTable.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600, fontSize: 12 }}>{r.equipment}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--primary)' }}>{r.irPI}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.surge}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.vibration}</td>
                        <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 11 }}>{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Failure Modes */}
            <div style={sectionHeading}>Common Failure Modes in Mining</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {failureModes.map((f, i) => (
                <div key={i} style={{
                  ...card,
                  borderLeft: `4px solid ${i < 2 ? '#ff3c3c' : '#ff8c00'}`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                    {f.mode}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Cause:</strong> {f.cause}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Detection:</strong> {f.detection}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text)' }}>Prevention:</strong> {f.prevention}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vibration severity chart */}
            <div style={sectionHeading}>Vibration Severity (ISO 10816)</div>
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-elevated)' }}>
                    <th style={{ ...tableHeader, textAlign: 'left' }}>Classification</th>
                    <th style={{ ...tableHeader, textAlign: 'center' }}>Velocity (mm/s)</th>
                    <th style={{ ...tableHeader, textAlign: 'center' }}>Velocity (in/s)</th>
                    <th style={{ ...tableHeader, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cls: 'Good', mms: '< 2.8', ins: '< 0.11', status: 'Normal', color: '#4ade80' },
                    { cls: 'Acceptable', mms: '2.8 \– 7.1', ins: '0.11 \– 0.28', status: 'Satisfactory', color: '#ffd700' },
                    { cls: 'Alert', mms: '7.1 \– 18', ins: '0.28 \– 0.71', status: 'Unsatisfactory', color: '#ff8c00' },
                    { cls: 'Danger', mms: '> 18', ins: '> 0.71', status: 'Unacceptable', color: '#ff3c3c' },
                  ].map((r, i) => (
                    <tr key={i} style={{ background: i % 2 ? 'var(--surface-elevated)' : 'transparent' }}>
                      <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 600 }}>{r.cls}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.mms}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.ins}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: r.color }}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CSA frequency analysis */}
            <div style={sectionHeading}>Current Signature Analysis &mdash; Frequency Guide</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { freq: 'f\ₗ \± 2sf\ₗ', fault: 'Broken rotor bars', detail: 'Sidebands at line frequency \± 2×slip×line frequency. Amplitude indicates severity. s = slip = (sync speed - actual speed) / sync speed.' },
                { freq: '2 × f\ₗ', fault: 'Eccentricity / air gap variation', detail: 'Twice line frequency component increases with non-uniform air gap. Static eccentricity from misaligned stator; dynamic from bent shaft.' },
                { freq: 'f\ₗ \± f\ᵣ', fault: 'Rotor mechanical fault', detail: 'Line frequency modulated by rotational frequency. Indicates mechanical imbalance, misalignment, or bearing fault.' },
                { freq: 'High-frequency slots', fault: 'Stator winding issues', detail: 'Slot harmonics at n×(number of slots)×f\ᵣ \± f\ₗ. Changes from baseline indicate winding movement or short circuits.' },
              ].map((item, i) => (
                <div key={i} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--primary)',
                      background: 'var(--surface-elevated)',
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}>
                      {item.freq}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.fault}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Mining notes */}
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Open Pit Mining Notes
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Shovel motors (hoist, crowd, swing, propel) see the most extreme duty &mdash; test monthly minimum.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Keep detailed records and trend all readings. A single reading is a snapshot; the trend tells the story.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Use space heaters on idle motors (especially during seasonal shutdowns) to prevent moisture absorption.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Temperature rise tests should account for open pit ambient &mdash; a motor at 40&deg;C ambient has
                  less thermal margin than the same motor at 20&deg;C.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  VFD-driven motors need shaft grounding rings and bearing insulation checks every 6 months.
                </li>
                <li style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  After a motor rewind, perform full acceptance testing: IR/PI, surge comparison, hi-pot, vibration baseline.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer reference */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> IEEE 43 (Insulation Resistance Testing),
          IEEE C57.104 (DGA), NETA MTS (Maintenance Testing Specifications), ANSI/NEMA MG-1 (Motors),
          ISO 10816 (Vibration), ASTM D1816/D877 (Oil Testing), CSA Z463 (Maintenance of Electrical Systems).
          This tool provides reference information only and does not replace qualified engineering analysis or
          your mine site&apos;s specific test procedures.
        </div>
      </div>
    </>
  )
}
