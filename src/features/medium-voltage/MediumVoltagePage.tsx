import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ------------------------------------------------------------------ */
/*  Medium Voltage Systems — Comprehensive Reference                   */
/*  CEC Part I, CSA M421, IEEE C37, Ontario Reg. 854                  */
/*  For Ontario electrical & mining apprentices                        */
/* ------------------------------------------------------------------ */

type TabKey = 'basics' | 'equipment' | 'cable' | 'transformers' | 'protection' | 'safety' | 'mining'

const tabItems: { key: TabKey; label: string }[] = [
  { key: 'basics', label: 'MV Basics' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'cable', label: 'Cable' },
  { key: 'transformers', label: 'Transformers' },
  { key: 'protection', label: 'Protection' },
  { key: 'safety', label: 'Safety' },
  { key: 'mining', label: 'Mining MV' },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Basics                                                    */
/* ------------------------------------------------------------------ */

interface CommonVoltage {
  voltage: string
  system: string
  application: string
  cecClass: string
  color: string
}

const commonVoltages: CommonVoltage[] = [
  { voltage: '4.16 kV', system: '4160/2400V 3-phase', application: 'Large motors, underground mine distribution, industrial plant primary', cecClass: 'MV', color: '#ff6b6b' },
  { voltage: '13.8 kV', system: '13800/7970V 3-phase', application: 'Utility primary distribution, large industrial feeds, mine surface primary', cecClass: 'MV', color: '#ff9f43' },
  { voltage: '27.6 kV', system: '27600/16000V 3-phase', application: 'Rural utility distribution (Ontario standard), overhead lines', cecClass: 'MV', color: '#ffd700' },
  { voltage: '34.5 kV', system: '34500/19920V 3-phase', application: 'Subtransmission, wind farm collector systems, long feeders', cecClass: 'MV', color: '#54a0ff' },
  { voltage: '44 kV', system: '44000/25400V 3-phase', application: 'Subtransmission, large mine surface feeds, Hydro One distribution', cecClass: 'MV', color: '#5f27cd' },
]

interface SingleLineConcept {
  symbol: string
  name: string
  description: string
}

const singleLineConcepts: SingleLineConcept[] = [
  { symbol: '\u2500\u2502\u2500', name: 'Bus', description: 'Main power distribution conductor, typically colour-coded by voltage level' },
  { symbol: '\u2500/\u2500', name: 'Disconnect Switch', description: 'Visible-break isolation device, no interrupting rating under load' },
  { symbol: '\u2500[\u00D7]\u2500', name: 'Circuit Breaker', description: 'Fault interrupting device with trip unit, rated in kA interrupting capacity' },
  { symbol: '\u2500|\u203E|\u2500', name: 'Fuse', description: 'Overcurrent device, current-limiting or expulsion type at MV' },
  { symbol: '(CT)', name: 'Current Transformer', description: 'Steps down current for metering and protection relays (e.g., 600:5A)' },
  { symbol: '(PT)', name: 'Potential Transformer', description: 'Steps down voltage for metering and relaying (e.g., 13800:120V)' },
  { symbol: '\u0394/Y', name: 'Transformer', description: 'Shows winding configuration: Delta primary, Wye secondary is most common' },
  { symbol: '\u23DA', name: 'Ground', description: 'System grounding point, may be solid, resistance, or reactance grounded' },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Equipment                                                 */
/* ------------------------------------------------------------------ */

interface SwitchgearType {
  name: string
  standard: string
  voltage: string
  features: string[]
  applications: string[]
  color: string
}

const switchgearTypes: SwitchgearType[] = [
  {
    name: 'Metal-Clad Switchgear',
    standard: 'IEEE C37.20.2 / CSA C22.2 No. 31',
    voltage: 'Up to 38 kV',
    features: [
      'Drawout breakers on rails',
      'All live parts enclosed in grounded metal',
      'Separate compartments for breaker, bus, cable',
      'Automatic shutters when breaker withdrawn',
      'Interlocks prevent improper operation',
    ],
    applications: ['Utility substations', 'Large industrial plants', 'Mine surface switchgear rooms', 'Data center primary distribution'],
    color: '#ff6b6b',
  },
  {
    name: 'Metal-Enclosed Switchgear',
    standard: 'IEEE C37.20.3 / CSA C22.2 No. 31',
    voltage: 'Up to 38 kV',
    features: [
      'Fixed or drawout breakers',
      'Not all compartments separately enclosed',
      'May use load-break switches instead of breakers',
      'Less expensive than metal-clad',
      'Adequate for many industrial applications',
    ],
    applications: ['Industrial plant feeders', 'Commercial primary distribution', 'Smaller substations', 'Generator switchgear'],
    color: '#ffd700',
  },
  {
    name: 'Pad-Mounted Switchgear',
    standard: 'IEEE C37.74',
    voltage: 'Up to 38 kV',
    features: [
      'Outdoor rated, tamper-resistant enclosure',
      'Loop feed or radial configurations',
      'Load-break switches and fault interrupters',
      'Front-accessible for confined spaces',
      'Oil or SF6 insulated options',
    ],
    applications: ['Underground residential distribution (URD)', 'Commercial parks', 'Wind farm collector stations', 'Campus distribution'],
    color: '#54a0ff',
  },
]

interface BreakerType {
  name: string
  medium: string
  voltage: string
  interrupting: string
  advantages: string[]
  disadvantages: string[]
}

const breakerTypes: BreakerType[] = [
  {
    name: 'Vacuum Circuit Breaker',
    medium: 'Vacuum (10\u207B\u2076 to 10\u207B\u2078 torr)',
    voltage: '4.16 kV to 38 kV',
    interrupting: 'Up to 63 kA',
    advantages: ['Minimal maintenance', 'Long mechanical life (10,000+ operations)', 'No gas handling', 'Fast reclosing capable', 'Environmentally friendly', 'Compact size'],
    disadvantages: ['Current chopping at low currents', 'Voltage escalation possible', 'Requires surge protection for motors', 'Contact erosion over time'],
  },
  {
    name: 'SF6 Circuit Breaker',
    medium: 'Sulfur Hexafluoride gas',
    voltage: '13.8 kV to 800 kV',
    interrupting: 'Up to 80 kA',
    advantages: ['Excellent dielectric strength', 'Self-restoring insulation', 'Quiet operation', 'Good for outdoor installations', 'High interrupting ratings'],
    disadvantages: ['SF6 is a potent greenhouse gas (GWP 23,500)', 'Requires gas monitoring', 'Toxic decomposition products', 'Temperature limitations', 'Environmental regulations increasing'],
  },
  {
    name: 'Oil Circuit Breaker',
    medium: 'Mineral oil',
    voltage: '4.16 kV to 345 kV',
    interrupting: 'Up to 50 kA',
    advantages: ['Proven technology', 'Oil provides both insulation and arc quenching', 'Robust design'],
    disadvantages: ['Fire and explosion risk', 'Environmental oil spill concern', 'Large and heavy', 'Frequent oil testing required', 'Being phased out in favour of vacuum/SF6'],
  },
]

interface FuseType {
  name: string
  type: string
  rating: string
  characteristics: string[]
}

const mvFuseTypes: FuseType[] = [
  { name: 'Current-Limiting Fuse (CLF)', type: 'Backup / General purpose', rating: 'Up to 36 kV, 400A', characteristics: ['Limits let-through energy (I\u00B2t)', 'Very fast operation on high faults', 'No external flame or gas', 'Used inside switchgear', 'Must be replaced after operation'] },
  { name: 'Expulsion Fuse (Bay-O-Net)', type: 'Dropout / Cutout', rating: 'Up to 38 kV, 200A', characteristics: ['Arc expelled externally', 'Visible open indication (dropout)', 'Used on pole-top cutouts', 'Lower fault interrupting than CLF', 'Replaceable fuse link'] },
  { name: 'Electronic Fuse', type: 'Solid-state sensing', rating: 'Up to 38 kV, 200A', characteristics: ['Adjustable trip curves', 'Ground fault detection built-in', 'Communication capable', 'Higher cost but more versatile', 'Eliminates nuisance fuse operations'] },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Cable                                                     */
/* ------------------------------------------------------------------ */

interface CableInsulation {
  type: string
  fullName: string
  tempRating: string
  emergencyTemp: string
  advantages: string[]
  disadvantages: string[]
  color: string
}

const cableInsulations: CableInsulation[] = [
  {
    type: 'XLPE',
    fullName: 'Cross-Linked Polyethylene',
    tempRating: '90\u00B0C continuous',
    emergencyTemp: '130\u00B0C emergency / 250\u00B0C short circuit',
    advantages: ['Lower dielectric losses', 'Lower capacitance', 'Lighter weight', 'No lead sheath needed', 'Good moisture resistance', 'Most common for new installations'],
    disadvantages: ['More susceptible to water treeing', 'Cannot be recycled easily', 'Harder to field-repair', 'Requires careful installation temp (>0\u00B0C)'],
    color: '#54a0ff',
  },
  {
    type: 'EPR',
    fullName: 'Ethylene Propylene Rubber',
    tempRating: '90\u00B0C continuous (105\u00B0C available)',
    emergencyTemp: '130\u00B0C emergency / 250\u00B0C short circuit',
    advantages: ['More flexible than XLPE', 'Better moisture resistance', 'Easier splicing', 'Better for reeling/trailing cables', 'Good for mining applications', 'Can install at lower temperatures'],
    disadvantages: ['Higher dielectric losses than XLPE', 'Higher capacitance', 'Slightly more expensive', 'Thicker insulation wall required'],
    color: '#ff9f43',
  },
  {
    type: 'TR-XLPE',
    fullName: 'Tree-Retardant Cross-Linked Polyethylene',
    tempRating: '90\u00B0C continuous',
    emergencyTemp: '130\u00B0C emergency / 250\u00B0C short circuit',
    advantages: ['Enhanced water tree resistance', 'Extended cable life in wet conditions', 'Same electrical properties as XLPE', 'Preferred for direct buried installations'],
    disadvantages: ['Slightly higher cost than standard XLPE', 'Same flexibility limitations as XLPE'],
    color: '#5f27cd',
  },
]

interface ShieldType {
  name: string
  description: string
  application: string
}

const shieldTypes: ShieldType[] = [
  { name: 'Copper Tape Shield', description: 'Helically wrapped copper tape, 0.064mm (2.5 mil) minimum. Overlap provides continuous metallic path.', application: 'Standard for most MV cables, direct buried or in duct. Provides fault current return path.' },
  { name: 'Wire Shield (Concentric)', description: 'Helically applied bare copper wires over insulation shield. Typically #14 AWG wires.', application: 'Common in utility URD cables. Good for direct buried — wires act as neutral.' },
  { name: 'Longitudinally Corrugated (LC) Shield', description: 'Corrugated copper or aluminum tape applied longitudinally with overlap.', application: 'Heavy-duty applications, industrial plant cables, mining. Higher fault current capability.' },
  { name: 'UniShield\u00AE', description: 'Combination of copper wires applied concentrically to serve as both shield and neutral.', application: 'Utility distribution, reduces separate neutral conductor requirement.' },
]

interface TerminationType {
  name: string
  type: string
  features: string[]
  application: string
}

const terminationTypes: TerminationType[] = [
  { name: 'Heat Shrink Termination', type: 'Indoor / Outdoor', features: ['Torch-applied shrink tubing', 'Stress control tubing underneath', 'Skirts for outdoor creepage distance', 'Proven reliability', 'Requires heat gun / torch'], application: 'Most common field-applied termination. Available for all MV voltage classes.' },
  { name: 'Cold Shrink Termination', type: 'Indoor / Outdoor', features: ['Pre-stretched EPDM rubber', 'Pull-tab removal — no heat required', 'Constant radial pressure', 'Faster installation', 'Good for confined spaces'], application: 'Preferred where open flame is prohibited (mines, petrochemical). No special tools needed.' },
  { name: 'Stress Cone (Geometric)', type: 'Indoor', features: ['Precisely shaped insulation shield cutback', 'Controls electric field stress at shield edge', 'May be hand-wrapped or premolded', 'Critical for cable longevity'], application: 'Required at every MV cable termination point. Built into modern termination kits.' },
  { name: 'Separable Connector (Elbow)', type: 'Deadfront', features: ['200A or 600A loadbreak rated', 'Fully shielded and submersible', 'Test point for fault location', 'Can be operated under load', 'Parking bushing for de-energized end'], application: 'Pad-mount transformers, switchgear. Allows safe, dead-front cable connections.' },
]

interface CableTest {
  name: string
  fullName: string
  voltage: string
  duration: string
  purpose: string
  notes: string
  color: string
}

const cableTests: CableTest[] = [
  { name: 'Hi-Pot DC', fullName: 'High Potential DC Test', voltage: 'Typically 3\u00D7 rated voltage DC', duration: '15 minutes', purpose: 'Acceptance test for new cable. Detects gross defects in insulation.', notes: 'DC testing is declining for aged XLPE — can worsen water trees. IEEE 400 recommends VLF for aged cable.', color: '#ff6b6b' },
  { name: 'VLF', fullName: 'Very Low Frequency (0.1 Hz)', voltage: 'Typically 3\u00D7 Uo (phase-to-ground)', duration: '15-60 minutes', purpose: 'Withstand test for new and aged cable. Better detection of water trees than DC.', notes: 'Preferred over DC for aged XLPE cable. Sinusoidal or cosine-rectangular waveform. Portable equipment available.', color: '#ffd700' },
  { name: 'Tan Delta', fullName: 'Dissipation Factor (Tan \u03B4)', voltage: 'Multiple voltage steps (0.5Uo to 2Uo)', duration: '~30 minutes', purpose: 'Diagnostic test — assesses insulation condition without damaging it.', notes: 'Measures dielectric losses at each voltage step. Increasing tan \u03B4 with voltage indicates water treeing. Non-destructive.', color: '#54a0ff' },
  { name: 'Partial Discharge', fullName: 'PD Testing (online or offline)', voltage: 'At or near operating voltage', duration: 'Variable', purpose: 'Locates voids, contamination, and defects in insulation and accessories.', notes: 'Can pinpoint defect location along cable length. Online PD testing possible during normal operation.', color: '#5f27cd' },
  { name: 'Megger / IR', fullName: 'Insulation Resistance', voltage: '2500V or 5000V DC', duration: '1-10 minutes', purpose: 'Quick field check of insulation integrity. Not a definitive pass/fail.', notes: 'Minimum 1 M\u03A9/kV + 1 M\u03A9. Temperature-correct readings. Record trend over time. Use PI (Polarization Index) for motors.', color: '#4ade80' },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Transformers                                              */
/* ------------------------------------------------------------------ */

interface TransformerType {
  name: string
  cooling: string
  insulation: string
  voltageRange: string
  sizeRange: string
  features: string[]
  application: string
  color: string
}

const transformerTypes: TransformerType[] = [
  {
    name: 'Pad-Mount Transformer',
    cooling: 'OA (ONAN) — Oil/Air natural',
    insulation: 'Mineral oil',
    voltageRange: '4.16 kV to 34.5 kV primary',
    sizeRange: '75 kVA to 10 MVA',
    features: ['Tamper-resistant enclosure', 'Front-accessible', 'Loop feed capable', 'Deadfront connectors', 'Ground-level installation'],
    application: 'Underground residential distribution, commercial complexes, campuses',
    color: '#54a0ff',
  },
  {
    name: 'Substation Transformer (Oil)',
    cooling: 'OA/FA or OA/FA/FA',
    insulation: 'Mineral oil or FR3 natural ester',
    voltageRange: '4.16 kV to 230 kV',
    sizeRange: '500 kVA to 100+ MVA',
    features: ['Tank-mounted radiators or coolers', 'Buchholz relay', 'Tap changers (OLTC/NLTC)', 'Conservator tank or nitrogen blanket', 'Oil level and temperature gauges'],
    application: 'Utility substations, mine surface substations, large industrial plants',
    color: '#ff6b6b',
  },
  {
    name: 'Dry-Type Transformer',
    cooling: 'AN or AF (air natural / forced)',
    insulation: 'Cast resin (VPI) or open-wound',
    voltageRange: 'Up to 34.5 kV primary',
    sizeRange: '15 kVA to 20 MVA',
    features: ['No oil — reduced fire risk', 'Indoor installation without vault', 'Lower BIL than oil-filled', 'Fan cooling for additional capacity', 'Easier permitting in buildings'],
    application: 'Indoor substations, high-rise buildings, hospitals, mine underground (where approved)',
    color: '#ffd700',
  },
  {
    name: 'Mine Portable Substation',
    cooling: 'OA or dry type',
    insulation: 'Oil or cast resin',
    voltageRange: '4.16 kV to 13.8 kV primary',
    sizeRange: '150 kVA to 5 MVA',
    features: ['Skid or wheel mounted', 'Integrated MV switch + fuses', 'Ground fault protection built-in', 'Ground check monitor included', 'Trailing cable connections'],
    application: 'Underground mine portable power centers, advancing development headings',
    color: '#ff9f43',
  },
]

interface BILRating {
  systemVoltage: string
  bilKv: string
  chopped: string
  application: string
}

const bilRatings: BILRating[] = [
  { systemVoltage: '600V Class', bilKv: '10', chopped: '11', application: 'Low voltage distribution' },
  { systemVoltage: '1.2 kV', bilKv: '30', chopped: '33', application: 'Low voltage systems' },
  { systemVoltage: '2.4 kV', bilKv: '45', chopped: '50', application: 'Small industrial distribution' },
  { systemVoltage: '4.16 kV', bilKv: '60', chopped: '66', application: 'Mine distribution, industrial primary' },
  { systemVoltage: '4.16 kV', bilKv: '75', chopped: '83', application: 'Mine distribution, exposed locations' },
  { systemVoltage: '8.32 kV', bilKv: '95', chopped: '105', application: 'Utility distribution' },
  { systemVoltage: '13.8 kV', bilKv: '95', chopped: '105', application: 'Distribution (standard)' },
  { systemVoltage: '13.8 kV', bilKv: '110', chopped: '121', application: 'Distribution (exposed / high lightning)' },
  { systemVoltage: '25 kV', bilKv: '125', chopped: '138', application: 'Rural distribution' },
  { systemVoltage: '25 kV', bilKv: '150', chopped: '165', application: 'Rural distribution (exposed)' },
  { systemVoltage: '34.5 kV', bilKv: '150', chopped: '165', application: 'Subtransmission (standard)' },
  { systemVoltage: '34.5 kV', bilKv: '200', chopped: '220', application: 'Subtransmission (exposed)' },
  { systemVoltage: '46 kV', bilKv: '200', chopped: '220', application: 'Subtransmission (standard)' },
  { systemVoltage: '46 kV', bilKv: '250', chopped: '275', application: 'Subtransmission (exposed)' },
  { systemVoltage: '69 kV', bilKv: '350', chopped: '385', application: 'Transmission' },
]

interface CoolingClass {
  designation: string
  modernCode: string
  description: string
  ratingBoost: string
}

const coolingClasses: CoolingClass[] = [
  { designation: 'OA', modernCode: 'ONAN', description: 'Oil Natural, Air Natural — no pumps or fans', ratingBoost: 'Base rating (100%)' },
  { designation: 'OA/FA', modernCode: 'ONAN/ONAF', description: 'Base + forced air cooling (fans on radiators)', ratingBoost: 'Stage 1: ~133% of base' },
  { designation: 'OA/FA/FA', modernCode: 'ONAN/ONAF/ONAF', description: 'Base + two stages of forced air cooling', ratingBoost: 'Stage 2: ~167% of base' },
  { designation: 'OA/FA/FOA', modernCode: 'ONAN/ONAF/ODAF', description: 'Base + forced air + forced oil & forced air', ratingBoost: 'Stage 2: ~167% of base' },
  { designation: 'FOA', modernCode: 'ODAF', description: 'Forced Oil, Forced Air — pumps and fans required', ratingBoost: 'Full rating requires all cooling' },
  { designation: 'FOW', modernCode: 'ODWF', description: 'Forced Oil, Water Forced — oil/water heat exchanger', ratingBoost: 'Full rating requires water supply' },
  { designation: 'AA', modernCode: 'ANAN', description: 'Dry type — Air Natural, Air Natural', ratingBoost: 'Base rating (100%)' },
  { designation: 'AA/FA', modernCode: 'ANAN/ANAF', description: 'Dry type — base + fans', ratingBoost: '~133% of base' },
]

interface ProtectionDevice {
  name: string
  function: string
  whatDetects: string
  application: string
}

const transformerProtections: ProtectionDevice[] = [
  { name: 'Buchholz Relay', function: 'Gas accumulation / oil surge', whatDetects: 'Internal arcing, overheating, winding faults. Gas accumulation = alarm, oil surge = trip.', application: 'Oil-filled transformers with conservator tanks. Required on most utility & large industrial units.' },
  { name: 'Sudden Pressure Relay', function: 'Rate of pressure rise', whatDetects: 'Internal faults causing rapid pressure increase. Faster than Buchholz for tank-type transformers.', application: 'Sealed tank-type oil transformers without conservator. Supplements differential protection.' },
  { name: 'Winding Temperature (RTD/OTI)', function: 'Hottest spot calculation', whatDetects: 'Winding overtemperature from overload or cooling failure. Two stages: alarm and trip.', application: 'All power transformers. OTI uses heater coil + CT to simulate hot spot temperature.' },
  { name: 'Oil Temperature Indicator', function: 'Top oil temperature', whatDetects: 'Overall oil temperature rise. Cooling system failure, sustained overload.', application: 'All oil-filled transformers. Controls fan and pump staging. Alarm and trip contacts.' },
  { name: 'Pressure Relief Device', function: 'Overpressure protection', whatDetects: 'Dangerous pressure buildup from internal fault or overload.', application: 'All sealed oil-filled transformers. Mechanical relief valve, typically with alarm contacts.' },
  { name: 'Oil Level Indicator', function: 'Oil volume monitoring', whatDetects: 'Oil leaks, thermal expansion/contraction beyond normal range.', application: 'All oil-filled transformers. Magnetic float type with low-level alarm contact.' },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Protection                                                */
/* ------------------------------------------------------------------ */

interface RelayFunction {
  ansiCode: string
  name: string
  function: string
  application: string
  settings: string
  color: string
}

const relayFunctions: RelayFunction[] = [
  { ansiCode: '50', name: 'Instantaneous Overcurrent', function: 'Trips with no intentional time delay when current exceeds pickup', application: 'High-current fault protection. Set above maximum inrush and below minimum fault current.', settings: 'Pickup: 6\u201310\u00D7 FLA typical. Time: 0 cycles (instantaneous)', color: '#ff6b6b' },
  { ansiCode: '51', name: 'Time Overcurrent', function: 'Inverse time-current characteristic — higher current = faster trip', application: 'Primary overcurrent protection for feeders, motors, transformers. Coordinates with downstream devices.', settings: 'Pickup: 1.25\u20131.5\u00D7 FLA. Curves: Very Inverse, Extremely Inverse, etc.', color: '#ff9f43' },
  { ansiCode: '50G / 51G', name: 'Ground Fault Overcurrent', function: 'Detects ground fault current via residual CT or zero-sequence CT', application: 'Ground fault protection. In mines, must detect 100mA ground fault per O.Reg.854.', settings: 'Pickup: 5\u201320% of CT rating (sensitive). Time: 0.1\u20130.5s', color: '#ffd700' },
  { ansiCode: '87', name: 'Differential', function: 'Compares current in and current out. Trips on difference (internal fault).', application: 'Transformer, bus, generator, large motor protection. Very fast, very selective.', settings: 'Pickup: 15\u201340% of rated current. Slope: 15\u201340%. Harmonic restraint for inrush.', color: '#4ade80' },
  { ansiCode: '21', name: 'Distance (Impedance)', function: 'Measures impedance (V/I) to fault. Multiple zones with increasing time delay.', application: 'Transmission line protection. Zone 1 instantaneous, Zone 2 time-delayed backup.', settings: 'Zone 1: 80\u201385% of line impedance. Zone 2: 120% of line. Zone 3: backup.', color: '#54a0ff' },
  { ansiCode: '67', name: 'Directional Overcurrent', function: 'Overcurrent that only operates for fault current in one direction', application: 'Parallel feeders, ring bus configurations, looped distribution systems.', settings: 'Forward or reverse power flow. Uses voltage as polarizing reference.', color: '#5f27cd' },
  { ansiCode: '27', name: 'Undervoltage', function: 'Trips when voltage drops below set threshold for set time', application: 'Motor protection (prevent re-energization), bus transfer schemes.', settings: 'Pickup: 80\u201390% of nominal. Time: 0.5\u20135 seconds.', color: '#ff6b6b' },
  { ansiCode: '59', name: 'Overvoltage', function: 'Trips when voltage exceeds set threshold', application: 'Generator protection, capacitor bank protection, ungrounded system detection.', settings: 'Pickup: 110\u2013120% of nominal. Time: 1\u20135 seconds.', color: '#ff9f43' },
  { ansiCode: '46', name: 'Negative Sequence (Current Unbalance)', function: 'Detects negative sequence current from unbalanced faults or open phase', application: 'Motor protection — prevents rotor overheating from unbalanced supply.', settings: 'Pickup: 10\u201320% I2. Definite or inverse time.', color: '#ffd700' },
  { ansiCode: '49', name: 'Thermal Overload', function: 'Calculates thermal state using I\u00B2t model and ambient temperature', application: 'Motor, transformer, cable thermal protection. Prevents insulation damage from sustained overload.', settings: 'Based on thermal time constant. Pickup: 105\u2013115% FLA.', color: '#4ade80' },
  { ansiCode: '81', name: 'Frequency', function: 'Trips on under or over frequency condition', application: 'Generator protection, load shedding schemes, island detection.', settings: 'Underfreq: 59.0\u201359.5 Hz. Overfreq: 60.5\u201361.0 Hz.', color: '#54a0ff' },
  { ansiCode: '86', name: 'Lockout Relay', function: 'Latching relay that requires manual reset after trip', application: 'Trips for serious faults (differential, Buchholz). Prevents automatic reclosing.', settings: 'Targets indicate which protection operated. Must be manually reset.', color: '#ff3c3c' },
]

interface CTRatio {
  application: string
  typicalRatio: string
  accuracy: string
  burden: string
  notes: string
}

const ctRatios: CTRatio[] = [
  { application: 'Metering (Revenue)', typicalRatio: '200:5, 400:5, 600:5', accuracy: '0.3 or 0.15 class', burden: 'B-0.1 to B-0.5', notes: 'High accuracy at rated current. Saturates on fault to protect meter.' },
  { application: 'Relay Protection', typicalRatio: '300:5, 600:5, 1200:5', accuracy: 'C100, C200, C400, C800', burden: 'B-1 to B-8', notes: 'Must not saturate at fault current. C rating = knee-point voltage.' },
  { application: 'MV Motor (500 HP @ 4.16kV)', typicalRatio: '100:5', accuracy: 'C200 minimum', burden: 'B-1.0', notes: 'Ratio selected for ~65A FLA. 50/51, 50G, 46, 49 functions.' },
  { application: 'MV Feeder (13.8 kV, 400A)', typicalRatio: '400:5 or 500:5', accuracy: 'C400 minimum', burden: 'B-2.0', notes: 'Must handle maximum fault current. 50/51, 51G, 67 functions.' },
  { application: 'Transformer Differential', typicalRatio: 'Selected to match MVA', accuracy: 'C200 minimum', burden: 'B-1.0', notes: 'Primary & secondary CT ratios matched to compensate transformer ratio.' },
  { application: 'Bus Differential', typicalRatio: '1200:5, 2000:5, 3000:5', accuracy: 'C800 preferred', burden: 'B-4.0', notes: 'All CTs on bus must have matching ratios and accuracy class.' },
  { application: 'Ground Fault (Residual)', typicalRatio: '50:5 window type', accuracy: 'C20 minimum', burden: 'B-0.5', notes: 'Zero-sequence CT around all three phases. Very sensitive pickup possible.' },
  { application: 'Mining Ground Fault', typicalRatio: '50:5 or 100:5', accuracy: 'C10 minimum', burden: 'B-0.2', notes: 'Must detect \u2264100mA. Core-balance type. Per O.Reg.854 and CSA M421.' },
]

/* ------------------------------------------------------------------ */
/*  Data: MV Safety                                                    */
/* ------------------------------------------------------------------ */

interface ApproachDistance {
  systemVoltage: string
  limitOfApproach: string
  restrictedApproach: string
  prohibitedApproach: string
  notes: string
  color: string
}

const approachDistances: ApproachDistance[] = [
  { systemVoltage: '750V to 5 kV', limitOfApproach: '1.0 m (3.3 ft)', restrictedApproach: '0.6 m (2.0 ft)', prohibitedApproach: '0.3 m (1.0 ft)', notes: '4.16 kV mine systems — common approach distance', color: '#4ade80' },
  { systemVoltage: '5 kV to 15 kV', limitOfApproach: '1.5 m (5.0 ft)', restrictedApproach: '0.7 m (2.3 ft)', prohibitedApproach: '0.4 m (1.3 ft)', notes: '13.8 kV distribution — most common MV level', color: '#ffd700' },
  { systemVoltage: '15 kV to 36 kV', limitOfApproach: '1.8 m (6.0 ft)', restrictedApproach: '0.8 m (2.6 ft)', prohibitedApproach: '0.5 m (1.6 ft)', notes: '27.6 kV and 34.5 kV utility systems', color: '#ff9f43' },
  { systemVoltage: '36 kV to 46 kV', limitOfApproach: '2.5 m (8.2 ft)', restrictedApproach: '0.8 m (2.6 ft)', prohibitedApproach: '0.5 m (1.6 ft)', notes: '44 kV subtransmission lines', color: '#ff6b6b' },
  { systemVoltage: '46 kV to 72.5 kV', limitOfApproach: '3.0 m (10.0 ft)', restrictedApproach: '1.0 m (3.3 ft)', prohibitedApproach: '0.7 m (2.3 ft)', notes: '69 kV transmission', color: '#ff3c3c' },
]

interface SwitchingStep {
  step: number
  action: string
  detail: string
  warning: string
}

const switchingProcedure: SwitchingStep[] = [
  { step: 1, action: 'Obtain Switching Order', detail: 'Written switching order from authorized person. Includes one-line diagram reference, steps, and verification points.', warning: 'Never switch without authorization. Verbal orders must be repeated back and confirmed.' },
  { step: 2, action: 'Don Appropriate PPE', detail: 'Minimum PPE per arc flash analysis. For MV: typically HRC 3 or 4 (40 cal/cm\u00B2). Face shield, flash suit, voltage-rated gloves.', warning: 'PPE must be rated for the incident energy. Check arc flash label on equipment.' },
  { step: 3, action: 'Identify Sources & Verify', detail: 'Confirm correct equipment from one-line diagram. Verify labels, equipment numbers, and physical location.', warning: 'Never assume — verify equipment identity independently. Look at bus connections.' },
  { step: 4, action: 'Open Load Break Device', detail: 'Open circuit breaker or load-break switch under load. This interrupts the load current safely.', warning: 'Do not open a disconnect switch under load — it has no interrupting rating and will arc.' },
  { step: 5, action: 'Open Disconnect Switch', detail: 'After load is interrupted, open visible-break disconnect for isolation. Verify visible gap.', warning: 'Confirm breaker is open BEFORE opening disconnect. Use operating handle or key interlock.' },
  { step: 6, action: 'Apply LOTO', detail: 'Apply personal lock and tag to each isolation point. Each worker applies own lock. Try to re-energize to verify.', warning: 'Lock must be personal — one lock per person, per energy source. Test after locking.' },
  { step: 7, action: 'Test for Absence of Voltage', detail: 'Use voltage-rated test instrument (phasing stick or voltage detector). Test all phases to ground and phase-to-phase.', warning: 'Test the tester on known live source before and after testing dead circuit. Live-dead-live protocol.' },
  { step: 8, action: 'Apply Personal Protective Grounds', detail: 'Install grounding cables using hot-stick rated for system voltage. Connect ground end first, then each phase.', warning: 'Grounds must be rated for available fault current. Size per IEEE 1246. Connect ground first always.' },
]

interface PPEItem {
  item: string
  standard: string
  voltageClass: string
  notes: string
}

const mvPPE: PPEItem[] = [
  { item: 'Rubber Insulating Gloves — Class 2', standard: 'CSA Z462, ASTM D120', voltageClass: 'Up to 17 kV AC', notes: 'Must be tested every 6 months. Leather protectors required over rubber.' },
  { item: 'Rubber Insulating Gloves — Class 3', standard: 'CSA Z462, ASTM D120', voltageClass: 'Up to 26.5 kV AC', notes: 'For 27.6 kV systems. Air test before each use. Replace if punctured.' },
  { item: 'Rubber Insulating Gloves — Class 4', standard: 'CSA Z462, ASTM D120', voltageClass: 'Up to 36 kV AC', notes: 'For 34.5 kV systems. Heaviest class commonly used in field.' },
  { item: 'Rubber Insulating Blanket', standard: 'ASTM D1048', voltageClass: 'Class matching system voltage', notes: 'Used to cover adjacent live parts during work. Secure with non-conductive clips.' },
  { item: 'Arc Flash Suit (HRC 3/4)', standard: 'CSA Z462, NFPA 70E', voltageClass: '25\u201340+ cal/cm\u00B2', notes: 'Required for MV switching. Includes hood, jacket, pants, gloves. Check arc flash label.' },
  { item: 'Hot Stick (Live-Line Tool)', standard: 'ASTM F711', voltageClass: 'Rated for system voltage', notes: 'Fiberglass with silicone coating. For operating disconnects, applying grounds, voltage testing.' },
  { item: 'Voltage Detector (Phasing Stick)', standard: 'IEC 61243', voltageClass: 'Rated for system voltage', notes: 'Capacitive type for MV. Test on known live source before use. Live-dead-live method.' },
  { item: 'Portable Protective Grounds', standard: 'IEEE 1246, ASTM F855', voltageClass: 'Rated for available fault current', notes: 'Copper cable with bronze clamps. Size for fault current and clearing time. Min #2 AWG Cu.' },
]

/* ------------------------------------------------------------------ */
/*  Data: Mining MV                                                    */
/* ------------------------------------------------------------------ */

interface TrailingCableSpec {
  voltage: string
  type: string
  conductors: string
  groundCheck: string
  protection: string
  notes: string
}

const trailingCables: TrailingCableSpec[] = [
  { voltage: '600V', type: 'Type W or Type G-GC', conductors: '3 conductor + ground + ground check', groundCheck: 'Pilot wire for ground continuity', protection: 'GFP at 100mA, trailing cable monitor', notes: 'Most common for portable equipment. CSA M421 compliant. Flexible SBR/EPDM jacket.' },
  { voltage: '2.4 kV', type: 'Type SHD-GC', conductors: '3 conductor + ground + ground check + shield', groundCheck: 'Ground check circuit, 40V AC or DC', protection: 'GFP at 100mA, differential GFP, ground check monitor', notes: 'Used for large scoops, drills, crushers. Each phase individually shielded.' },
  { voltage: '4.16 kV', type: 'Type SHD-GC', conductors: '3 conductor + ground + ground check + shield', groundCheck: 'Ground check circuit, continuous monitoring', protection: 'Sensitive GFP (5A pickup), ground check monitor, pilot relay', notes: 'Largest trailing cable voltage in Ontario mines. Round or flat configuration.' },
  { voltage: '5-15 kV', type: 'Type SHD-GC (MV)', conductors: '3 conductor + ground + GC + individually shielded', groundCheck: 'Ground check circuit with supervision', protection: 'Differential GFP, ground check, overcurrent', notes: 'Used in large open-pit draglines and shovels. Extra mechanical protection required.' },
]

interface MinePowerCenter {
  name: string
  primaryVoltage: string
  secondaryVoltage: string
  kvaRange: string
  features: string[]
  application: string
}

const minePowerCenters: MinePowerCenter[] = [
  {
    name: 'Portable Power Center (Unit Sub)',
    primaryVoltage: '4.16 kV or 13.8 kV',
    secondaryVoltage: '600V',
    kvaRange: '150\u20132500 kVA',
    features: ['Skid or wheel mounted', 'Integral MV fuses or breaker', 'LV breakers or contactors', 'GFP for each circuit (100mA)', 'Ground check monitor', 'Trailing cable receptacles'],
    application: 'Underground development headings — feeds drills, bolters, scoops, pumps, fans',
  },
  {
    name: 'Stationary Mine Substation',
    primaryVoltage: '13.8 kV or 44 kV',
    secondaryVoltage: '4.16 kV or 13.8 kV',
    kvaRange: '2500\u201325000 kVA',
    features: ['Fixed installation in engineered room', 'MV switchgear with relay protection', 'Fire suppression system', 'SCADA monitoring', 'Neutral grounding resistor'],
    application: 'Main underground distribution, shaft bottom, surface primary substation',
  },
  {
    name: 'Surface Main Substation',
    primaryVoltage: '44 kV or 115 kV',
    secondaryVoltage: '4.16 kV or 13.8 kV',
    kvaRange: '5000\u201360000 kVA',
    features: ['Outdoor oil-filled transformer', 'Metal-clad switchgear', 'Revenue metering', 'OLTC tap changers', 'Full relay protection suite', 'Battery-backed DC control'],
    application: 'Mine utility interconnection point, distributes to all mine loads',
  },
]

interface MineGFPRequirement {
  application: string
  maxFault: string
  maxTime: string
  reference: string
  notes: string
}

const mineGFPRequirements: MineGFPRequirement[] = [
  { application: 'Portable equipment (trailing cable)', maxFault: '100 mA', maxTime: '200 ms', reference: 'O.Reg.854 s.160(4)', notes: 'Ground fault protection must be sensitive and fast. Core-balance CT typically used.' },
  { application: 'Fixed 600V equipment underground', maxFault: '100 mA', maxTime: '200 ms', reference: 'O.Reg.854 s.160(2)', notes: 'All underground 600V circuits require sensitive GFP.' },
  { application: 'MV distribution underground', maxFault: '5 A recommended', maxTime: '500 ms', reference: 'CSA M421', notes: 'Resistance-grounded systems limit fault current. Relay detects neutral current.' },
  { application: 'Ground check monitor', maxFault: 'Continuity pilot', maxTime: 'Before energization', reference: 'O.Reg.854 s.160(5)', notes: 'Must verify ground conductor continuity before allowing power. Trips on ground wire break.' },
  { application: 'Surface MV distribution', maxFault: 'Per CEC Part I', maxTime: 'Per relay coordination', reference: 'CEC Rule 36-302', notes: 'Resistance or solidly grounded. NGR typically 200\u2013400A for 5\u201310 seconds.' },
]

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 56,
  padding: '0 14px',
  borderRadius: 28,
  fontSize: 12,
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

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: '14px',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 2,
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
}

const tableHeader: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  padding: '8px 6px',
  borderBottom: '2px solid var(--primary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
}

const tableCell: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text)',
  padding: '8px 6px',
  borderBottom: '1px solid var(--divider)',
  lineHeight: 1.4,
}

const tableCellDim: React.CSSProperties = {
  ...tableCell,
  color: 'var(--text-secondary)',
  fontSize: 12,
}

const tagStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 700,
  background: `${color}22`,
  color,
  border: `1px solid ${color}44`,
})

const warningBox: React.CSSProperties = {
  background: 'rgba(255, 59, 48, 0.08)',
  border: '1px solid rgba(255, 59, 48, 0.3)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: '#ff6b6b',
  lineHeight: 1.5,
}

const infoBox: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.06)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
}

const bulletItem: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  padding: '3px 0',
  paddingLeft: 16,
  position: 'relative',
  lineHeight: 1.5,
}

const bulletDot = (color: string): React.CSSProperties => ({
  position: 'absolute',
  left: 0,
  color,
})

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ExpandableCard({ title, color, children }: { title: string; color?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ ...card, overflow: 'hidden', borderLeft: color ? `4px solid ${color}` : undefined }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'transparent',
          border: 'none', cursor: 'pointer', padding: 0, minHeight: 56,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', textAlign: 'left' }}>
          {title}
        </span>
        <span style={{
          color: 'var(--text-secondary)', fontSize: 18,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          flexShrink: 0,
          marginLeft: 8,
        }}>
          {'\u25BC'}
        </span>
      </button>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  )
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, ...mono, color: valueColor || 'var(--text)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function MediumVoltagePage() {
  const [tab, setTab] = useState<TabKey>('basics')
  return (
    <PageWrapper title="Medium Voltage Systems">
      {/* ---- Tab Pills ---- */}
      <div style={pillRow}>
        {tabItems.map(t => (
          <button
            key={t.key}
            style={tab === t.key ? pillActive : pillBase}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================================================================ */}
      {/*  TAB: MV BASICS                                                  */}
      {/* ================================================================ */}
      {tab === 'basics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Medium Voltage Definition</div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              What is Medium Voltage?
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              Per the Canadian Electrical Code (CEC), <strong style={{ color: 'var(--primary)' }}>Medium Voltage (MV)</strong> is
              defined as any voltage exceeding <strong style={{ color: 'var(--text)' }}>750V</strong> up to
              and including <strong style={{ color: 'var(--text)' }}>46 kV</strong>. Voltages above 46 kV are
              classified as High Voltage (HV). The CEC addresses MV installations primarily in
              Section 36 (High Voltage Installations) which applies to all voltages over 750V.
            </div>
            <div style={infoBox}>
              <strong style={{ color: 'var(--primary)' }}>Key Point:</strong> In Ontario mining,
              MV systems are governed by both the CEC and <strong style={{ color: 'var(--text)' }}>O.Reg.854</strong> (Mines
              and Mining Plants) plus <strong style={{ color: 'var(--text)' }}>CSA M421</strong> (Use of Electricity in Mines).
              Mine regulations often exceed CEC requirements.
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Why Use Medium Voltage?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { reason: 'Power Transmission Efficiency', detail: 'P = I\u00B2R losses decrease as voltage increases. Doubling voltage cuts current in half, reducing losses by 75%.' },
                { reason: 'Smaller Conductors', detail: 'Higher voltage means lower current for same power, allowing smaller (cheaper) cable and equipment.' },
                { reason: 'Longer Distances', detail: 'Voltage drop is proportional to current. MV enables runs of several kilometres with acceptable drop.' },
                { reason: 'Large Motor Drives', detail: 'Motors above ~200 HP are more efficient and economical at MV. 4.16 kV motors common above 500 HP.' },
                { reason: 'System Capacity', detail: 'A single 13.8 kV feeder can deliver tens of MW — equivalent to many parallel 600V feeders.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--divider)' : 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{item.reason}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionLabel}>Common MV Voltages in Ontario</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Voltage</th>
                  <th style={tableHeader}>System</th>
                  <th style={tableHeader}>Application</th>
                </tr>
              </thead>
              <tbody>
                {commonVoltages.map((v, i) => (
                  <tr key={i}>
                    <td style={{ ...tableCell, whiteSpace: 'nowrap' }}>
                      <span style={{ ...mono, color: v.color, fontSize: 14 }}>{v.voltage}</span>
                    </td>
                    <td style={{ ...tableCellDim, fontSize: 11, ...mono }}>{v.system}</td>
                    <td style={tableCellDim}>{v.application}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={sectionLabel}>Single-Line Diagram Concepts</div>

          <div style={{ ...card, padding: '10px 14px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
              A <strong style={{ color: 'var(--text)' }}>single-line diagram</strong> (SLD) represents a
              three-phase power system using a single line. Every MV installation should have an
              up-to-date SLD showing all sources, switching devices, protection, and loads.
            </div>
            {singleLineConcepts.map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '8px 0',
                borderBottom: i < singleLineConcepts.length - 1 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{
                  ...mono, fontSize: 16, color: 'var(--primary)',
                  minWidth: 56, textAlign: 'center', flexShrink: 0,
                  background: 'var(--input-bg)', borderRadius: 6, padding: '4px 0',
                }}>
                  {c.symbol}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{c.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Voltage Formula Reference */}
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Key MV Formulas
            </div>
            {[
              { name: 'Power (3-Phase)', formula: 'P = \u221A3 \u00D7 V\u2097 \u00D7 I\u2097 \u00D7 PF', example: '13.8kV, 200A, PF=0.9: P = 1.732 \u00D7 13800 \u00D7 200 \u00D7 0.9 = 4,303 kW' },
              { name: 'Current from kVA', formula: 'I = kVA \u00D7 1000 / (\u221A3 \u00D7 V\u2097)', example: '5000 kVA at 13.8 kV: I = 5000000 / (1.732 \u00D7 13800) = 209A' },
              { name: 'Fault Current (Approx)', formula: 'I\u209B\u209C = kVA \u00D7 1000 / (\u221A3 \u00D7 V \u00D7 Z%)', example: '10 MVA, 13.8 kV, 6% Z: Isc = 10000000 / (1.732 \u00D7 13800 \u00D7 0.06) = 6,975A' },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{f.name}</div>
                <div style={{
                  ...mono, fontSize: 14, color: 'var(--primary)',
                  background: 'var(--input-bg)', borderRadius: 6, padding: '8px 12px', marginBottom: 4,
                }}>
                  {f.formula}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--primary)' }}>Ex:</strong> {f.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MV EQUIPMENT                                               */}
      {/* ================================================================ */}
      {tab === 'equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Switchgear Types</div>

          {switchgearTypes.map((sg, i) => (
            <ExpandableCard key={i} title={sg.name} color={sg.color}>
              <InfoRow label="Standard" value={sg.standard} />
              <InfoRow label="Voltage Rating" value={sg.voltage} valueColor="var(--primary)" />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Key Features
              </div>
              {sg.features.map((f, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot(sg.color)}>{'\u2022'}</span>
                  {f}
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Applications
              </div>
              {sg.applications.map((a, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('#4ade80')}>{'\u2022'}</span>
                  {a}
                </div>
              ))}
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>Circuit Breaker Types</div>

          {breakerTypes.map((b, i) => (
            <ExpandableCard key={i} title={b.name}>
              <InfoRow label="Arc Quenching Medium" value={b.medium} />
              <InfoRow label="Voltage Range" value={b.voltage} valueColor="var(--primary)" />
              <InfoRow label="Interrupting Capacity" value={b.interrupting} valueColor="#ff6b6b" />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase' }}>
                Advantages
              </div>
              {b.advantages.map((a, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('#4ade80')}>{'\u2022'}</span>
                  {a}
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#ff6b6b', textTransform: 'uppercase' }}>
                Disadvantages
              </div>
              {b.disadvantages.map((d, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('#ff6b6b')}>{'\u2022'}</span>
                  {d}
                </div>
              ))}
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>MV Fuse Types</div>

          {mvFuseTypes.map((f, i) => (
            <div key={i} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{f.name}</div>
                <span style={tagStyle('#54a0ff')}>{f.type}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Rating: <span style={{ ...mono, color: 'var(--primary)' }}>{f.rating}</span>
              </div>
              {f.characteristics.map((c, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('var(--primary)')}>{'\u2022'}</span>
                  {c}
                </div>
              ))}
            </div>
          ))}

          <div style={sectionLabel}>Other MV Switching Devices</div>

          {[
            {
              name: 'Load Break Switch',
              description: 'Can interrupt load current but NOT fault current. Used for switching feeders, transformer primaries, and loop schemes. Typically rated 600A continuous, 12 kA momentary.',
              types: ['Gang-operated air break', 'SF6 insulated', 'Vacuum interrupter type', 'Oil-immersed (outdoor)'],
            },
            {
              name: 'Recloser',
              description: 'Self-contained device that automatically opens on fault, waits, then recloses. If fault persists, locks out after programmed number of operations (typically 3 fast + 1 delayed).',
              types: ['Vacuum or oil interrupting', 'Electronic or hydraulic control', 'Single-phase or three-phase', 'SCADA communicable'],
            },
            {
              name: 'Sectionalizer',
              description: 'Counts upstream recloser operations. Opens during a dead interval after a set number of counts. Has NO fault interrupting capability — relies on upstream recloser.',
              types: ['Hydraulic count type', 'Electronic count type', 'Used with reclosers in series', 'Automatic isolation of faulted sections'],
            },
          ].map((device, i) => (
            <ExpandableCard key={i} title={device.name}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                {device.description}
              </div>
              {device.types.map((t, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('var(--primary)')}>{'\u2022'}</span>
                  {t}
                </div>
              ))}
            </ExpandableCard>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MV CABLE                                                   */}
      {/* ================================================================ */}
      {tab === 'cable' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>MV-TECK Cable</div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              MV-TECK90 Cable Construction
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              MV-TECK90 is the medium voltage version of TECK cable, widely used in Canadian
              industrial and mining installations. It is armoured, shielded, and rated for wet
              or dry locations, direct burial, and cable tray installation.
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6 }}>
              Construction Layers (Inside Out)
            </div>
            {[
              { layer: '1. Conductor', desc: 'Copper or aluminum, stranded (Class B or C)' },
              { layer: '2. Conductor Shield', desc: 'Semi-conducting tape or extruded layer — smooths electric field' },
              { layer: '3. Insulation', desc: 'XLPE or EPR, thickness per voltage rating (90\u00B0C rated)' },
              { layer: '4. Insulation Shield', desc: 'Semi-conducting layer + metallic shield (copper tape or wire)' },
              { layer: '5. Jacket (Inner)', desc: 'PVC or PE jacket over each shielded core' },
              { layer: '6. Assembly', desc: 'Three individually shielded cores cabled together with fillers' },
              { layer: '7. Binder Tape', desc: 'Non-hygroscopic tape binding the assembly' },
              { layer: '8. Armour', desc: 'Interlocked aluminum or galvanized steel armour' },
              { layer: '9. Overall Jacket', desc: 'PVC jacket (sunlight and oil resistant)' },
            ].map((l, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '5px 0',
                borderBottom: i < 8 ? '1px solid var(--divider)' : 'none',
              }}>
                <span style={{ ...mono, fontSize: 12, color: 'var(--primary)', minWidth: 120, flexShrink: 0 }}>
                  {l.layer}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {l.desc}
                </span>
              </div>
            ))}
          </div>

          <div style={sectionLabel}>Insulation Comparison: XLPE vs EPR</div>

          {cableInsulations.map((ins, i) => (
            <ExpandableCard key={i} title={`${ins.type} — ${ins.fullName}`} color={ins.color}>
              <InfoRow label="Continuous Rating" value={ins.tempRating} valueColor="var(--primary)" />
              <InfoRow label="Emergency / Short Circuit" value={ins.emergencyTemp} valueColor="#ff9f43" />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase' }}>
                Advantages
              </div>
              {ins.advantages.map((a, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('#4ade80')}>{'\u2022'}</span>
                  {a}
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#ff6b6b', textTransform: 'uppercase' }}>
                Disadvantages
              </div>
              {ins.disadvantages.map((d, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('#ff6b6b')}>{'\u2022'}</span>
                  {d}
                </div>
              ))}
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>Cable Shielding Types</div>

          {shieldTypes.map((s, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>{s.description}</div>
              <div style={{
                fontSize: 12, background: 'var(--input-bg)', borderRadius: 6,
                padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--primary)' }}>Application:</strong> {s.application}
              </div>
            </div>
          ))}

          <div style={sectionLabel}>Termination Types</div>

          {terminationTypes.map((t, i) => (
            <ExpandableCard key={i} title={t.name}>
              <span style={tagStyle('#54a0ff')}>{t.type}</span>
              <div style={{ marginTop: 8 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={bulletItem}>
                    <span style={bulletDot('var(--primary)')}>{'\u2022'}</span>
                    {f}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 8, fontSize: 12, background: 'var(--input-bg)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--text)' }}>Use:</strong> {t.application}
              </div>
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>Cable Testing Methods</div>

          {cableTests.map((ct, i) => (
            <div key={i} style={{ ...card, borderLeft: `4px solid ${ct.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{ct.name}</div>
                <span style={tagStyle(ct.color)}>{ct.fullName.split('(')[0].trim()}</span>
              </div>
              <InfoRow label="Test Voltage" value={ct.voltage} valueColor="var(--primary)" />
              <InfoRow label="Duration" value={ct.duration} />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 6, marginBottom: 6 }}>
                <strong style={{ color: 'var(--text)' }}>Purpose:</strong> {ct.purpose}
              </div>
              <div style={infoBox}>
                <strong style={{ color: 'var(--primary)' }}>Note:</strong> {ct.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MV TRANSFORMERS                                            */}
      {/* ================================================================ */}
      {tab === 'transformers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Transformer Types</div>

          {transformerTypes.map((t, i) => (
            <ExpandableCard key={i} title={t.name} color={t.color}>
              <InfoRow label="Cooling" value={t.cooling} />
              <InfoRow label="Insulation" value={t.insulation} />
              <InfoRow label="Primary Voltage" value={t.voltageRange} valueColor="var(--primary)" />
              <InfoRow label="Size Range" value={t.sizeRange} valueColor="#ff9f43" />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Features
              </div>
              {t.features.map((f, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot(t.color)}>{'\u2022'}</span>
                  {f}
                </div>
              ))}
              <div style={{
                marginTop: 8, fontSize: 12, background: 'var(--input-bg)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--text)' }}>Application:</strong> {t.application}
              </div>
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>BIL Ratings Reference</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>System Voltage</th>
                  <th style={tableHeader}>BIL (kV)</th>
                  <th style={tableHeader}>Chopped (kV)</th>
                  <th style={tableHeader}>Application</th>
                </tr>
              </thead>
              <tbody>
                {bilRatings.map((b, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                    <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>{b.systemVoltage}</td>
                    <td style={{ ...tableCell, ...mono }}>{b.bilKv}</td>
                    <td style={{ ...tableCell, ...mono }}>{b.chopped}</td>
                    <td style={tableCellDim}>{b.application}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={infoBox}>
            <strong style={{ color: 'var(--primary)' }}>BIL (Basic Impulse Level):</strong> The crest value of a
            standard lightning impulse (1.2/50 \u00B5s) that the insulation can withstand without failure.
            Higher BIL is selected for equipment in exposed locations or areas with high lightning activity.
          </div>

          <div style={sectionLabel}>Cooling Classes</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Legacy</th>
                  <th style={tableHeader}>Modern (IEC)</th>
                  <th style={tableHeader}>Description</th>
                  <th style={tableHeader}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {coolingClasses.map((c, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                    <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>{c.designation}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{c.modernCode}</td>
                    <td style={tableCellDim}>{c.description}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12, color: '#4ade80' }}>{c.ratingBoost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={sectionLabel}>Tap Changers</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                NLTC — No-Load Tap Changer
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                Changed only when the transformer is de-energized. Typically provides
                {'\u00B1'}2.5% or {'\u00B1'}5% adjustment in 2.5% steps (5 positions). Used where voltage
                variation is predictable and infrequent. Most common on distribution transformers.
              </div>
              <div style={warningBox}>
                <strong>WARNING:</strong> Never operate an NLTC under load. De-energize transformer completely,
                wait for discharge, then change tap position. Verify position indicator before re-energizing.
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                OLTC — On-Load Tap Changer
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                Can change taps while transformer is energized and carrying load. Uses a diverter
                switch with resistors or reactors to bridge between taps during transition. Typically
                {'\u00B1'}10% range in 32 steps. Requires separate oil compartment and regular maintenance.
                Common on large substation transformers and mine surface substations.
              </div>
              {[
                'Automatic voltage regulation (AVR) control',
                'Separate oil compartment from main tank',
                'Operation counter for maintenance scheduling',
                'Mechanical and electrical interlocks',
                'Must maintain during annual shutdown',
              ].map((item, i) => (
                <div key={i} style={bulletItem}>
                  <span style={bulletDot('var(--primary)')}>{'\u2022'}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={sectionLabel}>Transformer Protection Devices</div>

          {transformerProtections.map((p, i) => (
            <div key={i} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                <span style={tagStyle('#ff9f43')}>{p.function}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
                {p.whatDetects}
              </div>
              <div style={{
                fontSize: 12, background: 'var(--input-bg)', borderRadius: 6,
                padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--primary)' }}>Application:</strong> {p.application}
              </div>
            </div>
          ))}

          <div style={sectionLabel}>Transformer Impedance</div>

          <div style={card}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              Transformer impedance (Z%) is the percentage of rated voltage required to circulate
              rated current through the short-circuited winding. It determines the available fault
              current and voltage regulation.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>kVA Rating</th>
                    <th style={tableHeader}>Typical Z%</th>
                    <th style={tableHeader}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kva: '75\u2013500', z: '4.0\u20135.0%', notes: 'Small distribution transformers' },
                    { kva: '500\u20132500', z: '5.0\u20136.5%', notes: 'Medium distribution / mine unit subs' },
                    { kva: '2500\u201310000', z: '5.5\u20137.5%', notes: 'Substation transformers' },
                    { kva: '10000\u201360000', z: '7.0\u201312.0%', notes: 'Large power transformers' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>{row.kva} kVA</td>
                      <td style={{ ...tableCell, ...mono }}>{row.z}</td>
                      <td style={tableCellDim}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ ...infoBox, marginTop: 10 }}>
              <strong style={{ color: 'var(--primary)' }}>Fault Current:</strong> Available fault current at
              transformer secondary = Base current / Z% (per unit). Higher Z% = lower fault current
              but worse voltage regulation. Lower Z% = higher fault current but better regulation.
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MV PROTECTION                                              */}
      {/* ================================================================ */}
      {tab === 'protection' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Protective Relay Functions (ANSI/IEEE)</div>

          {relayFunctions.map((r, i) => (
            <ExpandableCard key={i} title={`${r.ansiCode} — ${r.name}`} color={r.color}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                <strong style={{ color: 'var(--text)' }}>Function:</strong> {r.function}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                <strong style={{ color: 'var(--text)' }}>Application:</strong> {r.application}
              </div>
              <div style={{
                ...mono, fontSize: 13, color: 'var(--primary)',
                background: 'var(--input-bg)', borderRadius: 6, padding: '8px 12px', lineHeight: 1.5,
              }}>
                <strong>Settings:</strong> {r.settings}
              </div>
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>Motor Protection Relay Functions</div>

          <div style={card}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              MV motors (typically 4.16 kV and above) require comprehensive relay protection.
              Modern multifunction motor relays combine all these functions in a single unit.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 440 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>ANSI #</th>
                    <th style={tableHeader}>Function</th>
                    <th style={tableHeader}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: '49', func: 'Thermal Overload', purpose: 'I\u00B2t thermal model prevents insulation damage' },
                    { code: '50', func: 'Instantaneous OC', purpose: 'High fault current, trips in <1 cycle' },
                    { code: '51', func: 'Time Overcurrent', purpose: 'Moderate overcurrent with time delay' },
                    { code: '46', func: 'Neg Sequence / Unbalance', purpose: 'Prevents rotor overheating from unbalance' },
                    { code: '50G', func: 'Ground Fault Inst.', purpose: 'Detects phase-to-ground faults' },
                    { code: '66', func: 'Starts Per Hour', purpose: 'Limits motor starting frequency' },
                    { code: '37', func: 'Undercurrent', purpose: 'Detects loss of load (pump cavitation)' },
                    { code: '48', func: 'Locked Rotor / Stall', purpose: 'Excessive starting time protection' },
                    { code: '27', func: 'Undervoltage', purpose: 'Prevents restart after voltage dip' },
                    { code: '86', func: 'Lockout', purpose: 'Latches trip for manual reset investigation' },
                    { code: '38', func: 'Bearing RTD', purpose: 'Monitors bearing temperature directly' },
                    { code: '49S', func: 'Stator RTD', purpose: 'Monitors winding temperature directly' },
                  ].map((m, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                      <td style={{ ...tableCell, ...mono, color: 'var(--primary)', fontWeight: 700 }}>{m.code}</td>
                      <td style={{ ...tableCell, fontWeight: 600 }}>{m.func}</td>
                      <td style={tableCellDim}>{m.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={sectionLabel}>Relay Coordination Principles</div>

          <div style={card}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              Relay coordination ensures that the protective device closest to a fault operates
              first, minimizing the area of disruption. This is achieved by selecting appropriate
              time-current curves and time intervals.
            </div>
            {[
              { principle: 'Selectivity (Discrimination)', detail: 'Only the device immediately upstream of the fault should trip. Achieved by grading time settings between upstream and downstream devices.' },
              { principle: 'Coordination Time Interval (CTI)', detail: 'Minimum time separation between upstream and downstream device curves. Typically 0.3\u20130.4 seconds for electromechanical relays, 0.2\u20130.3 seconds for digital relays.' },
              { principle: 'Time-Current Curves', detail: 'Plot trip time vs. fault current. Upstream device curve must be above (slower than) downstream curve at all fault levels. Standard curves: Moderately Inverse, Very Inverse, Extremely Inverse.' },
              { principle: 'Instantaneous Override', detail: 'Upstream device instantaneous element set above maximum through-fault current (to avoid tripping for downstream faults).' },
              { principle: 'Ground Fault Coordination', detail: 'Separate coordination study for ground faults. In resistance-grounded systems, ground current is limited, allowing sensitive pickup settings.' },
              { principle: 'Fuse-Relay Coordination', detail: 'When fuses protect downstream equipment, relay curves must coordinate with fuse total clearing and minimum melt curves.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--divider)' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>
                  {item.principle}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>

          <div style={sectionLabel}>CT Ratios for MV Applications</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Application</th>
                  <th style={tableHeader}>Typical Ratio</th>
                  <th style={tableHeader}>Accuracy</th>
                  <th style={tableHeader}>Burden</th>
                </tr>
              </thead>
              <tbody>
                {ctRatios.map((ct, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                    <td style={{ ...tableCell, fontWeight: 600, fontSize: 13 }}>{ct.application}</td>
                    <td style={{ ...tableCell, ...mono, color: 'var(--primary)', fontSize: 12 }}>{ct.typicalRatio}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{ct.accuracy}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{ct.burden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ctRatios.map((ct, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: 8 }}>
              <strong style={{ color: 'var(--text)' }}>{ct.application}:</strong> {ct.notes}
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MV SAFETY                                                  */}
      {/* ================================================================ */}
      {tab === 'safety' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Approach Distances (CEC Table 64)</div>

          <div style={warningBox}>
            <strong>CRITICAL:</strong> Approach distances define safety zones around exposed live MV
            conductors. These are MINIMUM distances. Always maintain the maximum practical distance.
            Only qualified, authorized workers may enter the Restricted or Prohibited approach boundaries.
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>System Voltage</th>
                  <th style={tableHeader}>Limit of Approach</th>
                  <th style={tableHeader}>Restricted</th>
                  <th style={tableHeader}>Prohibited</th>
                </tr>
              </thead>
              <tbody>
                {approachDistances.map((a, i) => (
                  <tr key={i}>
                    <td style={{ ...tableCell, ...mono, color: a.color, fontWeight: 700 }}>{a.systemVoltage}</td>
                    <td style={{ ...tableCell, ...mono }}>{a.limitOfApproach}</td>
                    <td style={{ ...tableCell, ...mono, color: '#ff9f43' }}>{a.restrictedApproach}</td>
                    <td style={{ ...tableCell, ...mono, color: '#ff3c3c' }}>{a.prohibitedApproach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ ...card, padding: '10px 14px' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: '#4ade80' }}>Limit of Approach:</strong> Boundary for unqualified
              persons. No one without training may enter.<br />
              <strong style={{ color: '#ff9f43' }}>Restricted Approach:</strong> Qualified workers only.
              Must use insulating PPE rated for voltage.<br />
              <strong style={{ color: '#ff3c3c' }}>Prohibited Approach:</strong> Same as direct contact.
              Requires same protection as touching live parts.
            </div>
          </div>

          <div style={sectionLabel}>MV Switching Procedure</div>

          {switchingProcedure.map((s, i) => (
            <div key={i} style={{
              ...card,
              borderLeft: `4px solid ${i < 3 ? '#54a0ff' : i < 6 ? '#ffd700' : '#ff6b6b'}`,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  ...mono, fontSize: 18, color: 'var(--primary)',
                  background: 'var(--input-bg)', borderRadius: 8,
                  minWidth: 36, height: 36, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {s.action}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                    {s.detail}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#ff6b6b',
                    background: 'rgba(255,59,48,0.06)', borderRadius: 6,
                    padding: '6px 10px', lineHeight: 1.4,
                    border: '1px solid rgba(255,59,48,0.15)',
                  }}>
                    <strong>WARNING:</strong> {s.warning}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={sectionLabel}>Testing for Absence of Voltage</div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Live-Dead-Live Protocol
            </div>
            {[
              { step: 'LIVE', desc: 'Test your voltage detector on a KNOWN live source at the same voltage class. Confirm it indicates correctly.', color: '#ff3c3c' },
              { step: 'DEAD', desc: 'Test the circuit that should be de-energized. Test phase-to-phase AND phase-to-ground on ALL phases.', color: '#4ade80' },
              { step: 'LIVE', desc: 'Return to the KNOWN live source and confirm the detector still indicates correctly. This proves it was working during the dead test.', color: '#ff3c3c' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{
                  ...mono, fontSize: 14, color: s.color,
                  background: `${s.color}15`, borderRadius: 6,
                  padding: '4px 10px', flexShrink: 0, fontWeight: 700,
                }}>
                  {s.step}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={sectionLabel}>PPE for MV Work</div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>PPE Item</th>
                  <th style={tableHeader}>Standard</th>
                  <th style={tableHeader}>Voltage Class</th>
                </tr>
              </thead>
              <tbody>
                {mvPPE.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                    <td style={{ ...tableCell, fontWeight: 600, fontSize: 13 }}>{p.item}</td>
                    <td style={{ ...tableCellDim, ...mono, fontSize: 11 }}>{p.standard}</td>
                    <td style={{ ...tableCell, ...mono, color: 'var(--primary)', fontSize: 12 }}>{p.voltageClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mvPPE.map((p, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: 8 }}>
              <strong style={{ color: 'var(--text)' }}>{p.item.split(' \u2014')[0]}:</strong> {p.notes}
            </div>
          ))}

          <div style={sectionLabel}>Rescue Procedures</div>

          <div style={warningBox}>
            <strong>EMERGENCY RESCUE — MV Contact:</strong> Do NOT touch the victim directly.
            Use a non-conductive rescue hook or hot stick rated for the voltage. De-energize the
            system if possible. Call 911 immediately. If the victim is clear of the circuit, begin
            CPR/AED if trained. All MV workers must complete rescue training per CSA Z462 and O.Reg.854.
          </div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Rescue Steps — Electrical Contact
            </div>
            {[
              { step: '1. Assess the Scene', detail: 'Do NOT become a second victim. Identify the energy source and voltage level. Determine if the circuit is still live.' },
              { step: '2. De-Energize if Possible', detail: 'Open the nearest upstream breaker or switch. If you cannot de-energize, use insulated rescue equipment rated for the voltage.' },
              { step: '3. Separate Victim from Source', detail: 'Use rescue hook, hot stick, or dry non-conductive material. Never use bare hands, wet rope, or metal objects.' },
              { step: '4. Call for Help', detail: 'Call 911, mine rescue, or site emergency number. State "electrical contact" and voltage level. Request AED.' },
              { step: '5. Begin First Aid', detail: 'Once victim is clear and scene is safe: check ABCs (airway, breathing, circulation). Begin CPR if no pulse. Apply AED as soon as available. Treat burns as secondary to cardiac arrest.' },
              { step: '6. Monitor & Document', detail: 'Even if victim appears fine, electrical injuries can cause delayed cardiac effects. Medical evaluation mandatory. Document incident for investigation.' },
            ].map((r, i) => (
              <div key={i} style={{
                padding: '8px 0',
                borderBottom: i < 5 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ff6b6b', marginBottom: 2 }}>{r.step}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/*  TAB: MINING MV                                                  */}
      {/* ================================================================ */}
      {tab === 'mining' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={sectionLabel}>Mining MV Trailing Cables</div>

          {trailingCables.map((tc, i) => (
            <div key={i} style={{ ...card, borderLeft: `4px solid ${i === 0 ? '#4ade80' : i === 1 ? '#ffd700' : i === 2 ? '#ff9f43' : '#ff6b6b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{tc.voltage} Trailing Cable</div>
                <span style={tagStyle('#54a0ff')}>{tc.type}</span>
              </div>
              <InfoRow label="Conductors" value={tc.conductors} />
              <InfoRow label="Ground Check" value={tc.groundCheck} />
              <InfoRow label="Protection" value={tc.protection} valueColor="#ff9f43" />
              <div style={{
                marginTop: 8, fontSize: 12, background: 'var(--input-bg)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--primary)' }}>Notes:</strong> {tc.notes}
              </div>
            </div>
          ))}

          <div style={sectionLabel}>Mine Power Centers</div>

          {minePowerCenters.map((pc, i) => (
            <ExpandableCard key={i} title={pc.name}>
              <InfoRow label="Primary Voltage" value={pc.primaryVoltage} valueColor="var(--primary)" />
              <InfoRow label="Secondary Voltage" value={pc.secondaryVoltage} valueColor="#ff9f43" />
              <InfoRow label="kVA Range" value={pc.kvaRange} />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Features
              </div>
              {pc.features.map((f, j) => (
                <div key={j} style={bulletItem}>
                  <span style={bulletDot('var(--primary)')}>{'\u2022'}</span>
                  {f}
                </div>
              ))}
              <div style={{
                marginTop: 8, fontSize: 12, background: 'var(--input-bg)',
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <strong style={{ color: 'var(--text)' }}>Application:</strong> {pc.application}
              </div>
            </ExpandableCard>
          ))}

          <div style={sectionLabel}>Ground Fault Protection Requirements</div>

          <div style={warningBox}>
            <strong>CRITICAL — Ontario Mine GFP:</strong> O.Reg.854 Section 160 requires ground fault
            protection on ALL underground electrical equipment. Maximum 100mA pickup and 200ms trip
            time for portable equipment with trailing cables. This is significantly more sensitive than
            surface industrial installations.
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Application</th>
                  <th style={tableHeader}>Max Fault</th>
                  <th style={tableHeader}>Max Time</th>
                  <th style={tableHeader}>Reference</th>
                </tr>
              </thead>
              <tbody>
                {mineGFPRequirements.map((g, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                    <td style={{ ...tableCell, fontWeight: 600, fontSize: 13 }}>{g.application}</td>
                    <td style={{ ...tableCell, ...mono, color: '#ff6b6b', fontWeight: 700 }}>{g.maxFault}</td>
                    <td style={{ ...tableCell, ...mono, color: '#ff9f43' }}>{g.maxTime}</td>
                    <td style={{ ...tableCellDim, ...mono, fontSize: 11 }}>{g.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mineGFPRequirements.map((g, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: 8 }}>
              <strong style={{ color: 'var(--text)' }}>{g.application}:</strong> {g.notes}
            </div>
          ))}

          <div style={sectionLabel}>Ground Check Monitors</div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Ground Check Circuit — How It Works
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              A ground check monitor continuously verifies the integrity of the grounding conductor
              in trailing cables. It uses a pilot wire (ground check conductor) that runs alongside
              the main ground wire. A small monitoring voltage (typically 40V AC or DC) is applied
              to the pilot circuit. If the ground conductor breaks, the pilot circuit also opens,
              tripping the contactor and de-energizing the cable before a fault can occur without a
              ground path.
            </div>
            {[
              { item: 'Pilot Wire', detail: 'Dedicated conductor in trailing cable, connected to ground check relay at power center.' },
              { item: 'Monitoring Voltage', detail: 'Typically 40V AC or DC applied between pilot and ground conductor. Low enough to be intrinsically safe.' },
              { item: 'Ground Check Relay', detail: 'Monitors pilot circuit continuity. De-energizes trailing cable contactor on loss of ground continuity.' },
              { item: 'Response Time', detail: 'Must de-energize equipment within 200ms of ground conductor failure. Prevents energized operation without ground.' },
              { item: 'Testing', detail: 'Ground check monitor function must be tested before each use of portable equipment per O.Reg.854.' },
            ].map((g, i) => (
              <div key={i} style={{
                padding: '6px 0',
                borderBottom: i < 4 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{g.item}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{g.detail}</div>
              </div>
            ))}
          </div>

          <div style={sectionLabel}>Portable Substations (Unit Subs)</div>

          <div style={card}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              Portable substations (unit subs) are the backbone of underground mine power
              distribution. They step down MV (typically 4.16 kV or 13.8 kV) to 600V for
              equipment. Key requirements for Ontario mines include the following.
            </div>
            {[
              'Integral MV disconnect with visible break and grounding capability',
              'MV fuses (current-limiting) sized for available fault current',
              'Transformer with impedance matched to GFP sensitivity requirements',
              'Ground fault protection on each secondary circuit (100mA / 200ms)',
              'Ground check monitor for each trailing cable circuit',
              'Low-voltage circuit breakers or magnetic contactors for each circuit',
              'Emergency stop button accessible from outside the enclosure',
              'Ventilation provisions for heat dissipation',
              'Flame-resistant construction per CSA M421',
              'Nameplate with ratings, serial number, impedance, and BIL',
              'Proper bonding of frame to mine grounding system',
              'Approved for underground use by MASHA or equivalent authority',
            ].map((req, i) => (
              <div key={i} style={bulletItem}>
                <span style={bulletDot(i < 4 ? '#ff6b6b' : 'var(--primary)')}>{'\u2022'}</span>
                {req}
              </div>
            ))}
          </div>

          <div style={sectionLabel}>Mine MV System Grounding</div>

          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Resistance Grounding in Mines
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
              Ontario mines use <strong style={{ color: 'var(--primary)' }}>high-resistance grounding</strong> on
              MV systems to limit ground fault current. This prevents dangerous step and touch
              potentials in the confined underground environment and reduces arc flash energy
              from ground faults.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Parameter</th>
                    <th style={tableHeader}>Value</th>
                    <th style={tableHeader}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { param: 'NGR Current (4.16 kV)', value: '5\u201325 A', notes: 'Limits fault current, enables detection' },
                    { param: 'NGR Current (13.8 kV)', value: '200\u2013400 A', notes: 'Higher to allow relay coordination' },
                    { param: 'NGR Rating (Time)', value: '10 sec continuous', notes: 'Must withstand fault until cleared' },
                    { param: 'Detection Level', value: '\u2264100 mA', notes: 'Per O.Reg.854 for trailing cable equipment' },
                    { param: 'GFP Method', value: 'Zero-sequence CT', notes: 'Core-balance CT around all 3 phases' },
                    { param: 'Alarm vs Trip', value: 'Trip required', notes: 'No alarm-only for mining GFP' },
                  ].map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--input-bg)' }}>
                      <td style={{ ...tableCell, fontWeight: 600, fontSize: 13 }}>{row.param}</td>
                      <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>{row.value}</td>
                      <td style={tableCellDim}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---- Footer Reference ---- */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--divider)',
        borderRadius: 'var(--radius-sm)', padding: '12px 14px',
        fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--text)' }}>References:</strong> CEC Part I Section 36 (High Voltage Installations),
        CEC Table 64 (Approach Distances), CSA M421 (Use of Electricity in Mines), O.Reg.854 (Mines &amp; Mining Plants),
        IEEE C37 (Switchgear Standards), IEEE 400 (Cable Testing), IEEE 1246 (Temporary Protective Grounding),
        CSA Z462 (Workplace Electrical Safety), NFPA 70E (Electrical Safety in the Workplace),
        IEEE C57.12 (Transformer Standards)
      </div>
    </PageWrapper>
  )
}
