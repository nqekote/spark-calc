import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Protective Relay Reference — ANSI/IEEE, Mining Applications        */
/*  Comprehensive reference for open pit mine electricians              */
/* ------------------------------------------------------------------ */

type TabKey = 'ansi' | 'overcurrent' | 'ground' | 'voltage' | 'troubleshoot'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ansi', label: 'ANSI Device #' },
  { key: 'overcurrent', label: '50/51 OC' },
  { key: 'ground', label: '50G/51G GF' },
  { key: 'voltage', label: 'V & Freq' },
  { key: 'troubleshoot', label: 'Troubleshoot' },
]

/* ------------------------------------------------------------------ */
/*  ANSI Device Number Data                                            */
/* ------------------------------------------------------------------ */

interface ANSIDevice {
  number: string
  name: string
  description: string
  miningApplication: string
  category: 'overcurrent' | 'voltage' | 'frequency' | 'differential' | 'mechanical' | 'control' | 'motor' | 'ground'
  common: boolean
}

const ansiDevices: ANSIDevice[] = [
  {
    number: '2',
    name: 'Time-Delay Starting',
    description: 'Provides a time delay to permit sequential starting of equipment or completion of a switching operation.',
    miningApplication: 'Sequential start of conveyor drives, crusher feed systems, and pump stations to prevent demand surges on mine power grid.',
    category: 'control',
    common: false,
  },
  {
    number: '21',
    name: 'Distance (Impedance)',
    description: 'Functions when the admittance, impedance, or reactance of a circuit changes beyond a set value. Measures impedance to detect faults at a specific distance.',
    miningApplication: 'Used on long overhead transmission lines feeding open pit mine substations. Provides backup protection for remote line faults.',
    category: 'overcurrent',
    common: false,
  },
  {
    number: '25',
    name: 'Synchronism Check',
    description: 'Permits paralleling of two AC circuits only when they are within prescribed limits of frequency, voltage, and phase angle.',
    miningApplication: 'Essential when paralleling mine generators with utility feed or when reclosing a bus-tie breaker between mine substations. Prevents out-of-phase closing damage.',
    category: 'control',
    common: true,
  },
  {
    number: '27',
    name: 'Undervoltage',
    description: 'Trips or alarms when voltage falls below a set value. Protects equipment from damage due to low voltage conditions.',
    miningApplication: 'Motor protection on shovels, draglines, crushers. Prevents motor overheating from sustained undervoltage. Trip at 0.90-0.95 pu with 0.5-3s delay.',
    category: 'voltage',
    common: true,
  },
  {
    number: '32',
    name: 'Directional Power (Reverse Power)',
    description: 'Detects reverse power flow. Trips when power flows in the wrong direction through a circuit.',
    miningApplication: 'Protects mine generators from motoring. Used on tie lines between mine substations to detect backfeed conditions.',
    category: 'control',
    common: true,
  },
  {
    number: '37',
    name: 'Undercurrent / Underpower',
    description: 'Functions when current or power drops below a set value. Detects loss of load or broken belt conditions.',
    miningApplication: 'Conveyor belt protection (broken belt detection), pump dry-run protection for dewatering systems.',
    category: 'motor',
    common: false,
  },
  {
    number: '38',
    name: 'Bearing Temperature',
    description: 'Functions on excessive bearing temperature via RTD or thermocouple input.',
    miningApplication: 'Large motor bearing protection on crusher drives, mill motors, conveyor head drives. Critical for preventing catastrophic bearing failure.',
    category: 'mechanical',
    common: false,
  },
  {
    number: '46',
    name: 'Negative Sequence (Current Balance)',
    description: 'Detects negative-sequence current caused by unbalanced phase conditions. Protects motors from overheating due to unbalanced supply.',
    miningApplication: 'Essential motor protection on shovels, draglines, and large drives. Open pit mine trailing cables prone to single-phasing from connector damage. Pickup 0.1-0.2 pu.',
    category: 'motor',
    common: true,
  },
  {
    number: '47',
    name: 'Negative Sequence Voltage',
    description: 'Detects negative-sequence voltage from unbalanced supply or reversed phase rotation.',
    miningApplication: 'Phase rotation protection on portable substations and mobile equipment. Prevents reverse rotation of motors after maintenance reconnection.',
    category: 'voltage',
    common: false,
  },
  {
    number: '49',
    name: 'Thermal Overload',
    description: 'Functions when equipment temperature exceeds a set value. Uses thermal model based on current magnitude and duration.',
    miningApplication: 'Motor thermal model protection for dragline hoist/swing motors, crusher motors, conveyor drives. Uses I\²t curve to track cumulative heating. Prevents insulation breakdown.',
    category: 'motor',
    common: true,
  },
  {
    number: '50',
    name: 'Instantaneous Overcurrent',
    description: 'Operates instantaneously (no intentional delay) when current exceeds a set value. Provides fast clearing of high-magnitude faults.',
    miningApplication: 'Primary high-current fault protection on all mine feeders and motor circuits. Set 6-10x FLA or above maximum through-fault current. Fast clearing reduces arc flash energy.',
    category: 'overcurrent',
    common: true,
  },
  {
    number: '50G',
    name: 'Instantaneous Ground Overcurrent',
    description: 'Instantaneous overcurrent element specifically for ground fault current. Operates with no intentional time delay.',
    miningApplication: 'Fast ground fault clearing on mine feeders. Mandatory per O.Reg 854 for mine distribution. Set above normal residual unbalance, below minimum ground fault current.',
    category: 'ground',
    common: true,
  },
  {
    number: '51',
    name: 'Time Overcurrent',
    description: 'Functions with a definite or inverse time delay when current exceeds a set value. Time decreases as current increases.',
    miningApplication: 'Backup and coordination protection on all mine feeders. IEEE Very Inverse for feeders, Extremely Inverse for motors. Pickup 1.2-1.5x FLA. Coordinates with downstream devices.',
    category: 'overcurrent',
    common: true,
  },
  {
    number: '51G',
    name: 'Time Ground Overcurrent',
    description: 'Time-overcurrent element for ground fault current. Provides time-graded ground fault protection.',
    miningApplication: 'Ground fault protection with coordination. On HRG systems, pickup at 5-10% of NGR rating. Provides backup to 50G element with time delay for coordination.',
    category: 'ground',
    common: true,
  },
  {
    number: '51N',
    name: 'Neutral Time Overcurrent',
    description: 'Time-overcurrent element connected to the neutral of a transformer or generator. Detects ground faults via neutral current.',
    miningApplication: 'Transformer neutral overcurrent protection at mine substations. Detects ground faults on the transformer winding or downstream HRG system.',
    category: 'ground',
    common: false,
  },
  {
    number: '52',
    name: 'AC Circuit Breaker',
    description: 'Not a relay function but the device number for an AC circuit breaker used to switch circuits and interrupt fault current.',
    miningApplication: 'All mine switchgear breakers. Trip coil integrity monitoring is critical. Dead-bus close/live-bus close logic. Anti-pump circuits prevent breaker damage.',
    category: 'control',
    common: true,
  },
  {
    number: '59',
    name: 'Overvoltage',
    description: 'Trips or alarms when voltage exceeds a set value. Protects insulation and equipment from excessive voltage.',
    miningApplication: 'Protects mine bus from overvoltage during load rejection or capacitor switching. Typical pickup: 1.05-1.10 pu. Critical on mine generator buses.',
    category: 'voltage',
    common: true,
  },
  {
    number: '59G',
    name: 'Ground Overvoltage (Neutral Displacement)',
    description: 'Detects overvoltage across the neutral grounding resistor or neutral point. Indicates ground faults in HRG systems.',
    miningApplication: 'Primary ground fault detection on HRG mine distribution. Measures voltage across NGR. Alarm or trip on ground fault. Essential for open pit mine power systems.',
    category: 'ground',
    common: true,
  },
  {
    number: '60',
    name: 'Voltage Balance',
    description: 'Operates on a difference in voltage between two circuits, such as PT secondary circuits, to detect blown PT fuses.',
    miningApplication: 'Blown VT fuse detection at mine substations. Prevents misoperation of voltage-dependent relays (27, 59, 81) due to lost VT signal.',
    category: 'voltage',
    common: false,
  },
  {
    number: '63',
    name: 'Pressure (Buchholz)',
    description: 'Operates on gas pressure buildup inside oil-filled transformers. Detects internal arcing, overheating, or winding faults.',
    miningApplication: 'Main power transformer protection at mine substations. Sudden pressure relay trips immediately for internal faults. Buchholz relay on oil-filled transformers.',
    category: 'mechanical',
    common: false,
  },
  {
    number: '67',
    name: 'Directional Overcurrent',
    description: 'Overcurrent relay that operates only for fault current flowing in a specific direction. Used in looped or multi-source systems.',
    miningApplication: 'Used on dual-fed mine substations and ring bus configurations. Ensures selective tripping when fault current can flow from multiple sources. Common on tie lines.',
    category: 'overcurrent',
    common: true,
  },
  {
    number: '79',
    name: 'AC Reclosing',
    description: 'Automatically recloses a circuit breaker after a trip. Typically used on overhead lines where transient faults are common.',
    miningApplication: 'Overhead line reclosing for mine feed lines. CAUTION: Do NOT use reclosing on underground cable feeders or trailing cables. Common for overhead distribution to pit substations.',
    category: 'control',
    common: true,
  },
  {
    number: '81',
    name: 'Frequency',
    description: 'Operates when frequency deviates from normal. Includes underfrequency (81U) and overfrequency (81O) elements.',
    miningApplication: 'Load shedding on mine bus during utility disturbance. UF trip: 59.5 Hz typical. OF alarm: 60.5 Hz. Generator frequency protection. Critical for islanded mine power systems.',
    category: 'frequency',
    common: true,
  },
  {
    number: '86',
    name: 'Lockout Relay',
    description: 'Electrically-operated, hand-reset relay that locks out equipment after a trip. Requires manual reset before equipment can be re-energized.',
    miningApplication: 'Critical safety device on all mine switchgear. Locks out breaker after differential, ground fault, or transformer fault trip. Manual reset ensures investigation before re-energizing.',
    category: 'control',
    common: true,
  },
  {
    number: '87',
    name: 'Differential',
    description: 'Operates on the difference between incoming and outgoing current. Trips when current leaks out of the protected zone (internal fault).',
    miningApplication: 'Primary protection for mine power transformers (87T), bus sections (87B), and large generators (87G). Fastest clearing for internal faults. Reduces arc flash energy significantly.',
    category: 'differential',
    common: true,
  },
  {
    number: '87T',
    name: 'Transformer Differential',
    description: 'Differential protection specific to transformers. Accounts for CT ratio mismatch, transformer tap changes, and inrush current.',
    miningApplication: 'Main mine substation transformer protection. Must account for OLTC tap range. Second harmonic restraint blocks tripping during energization (inrush). Slope typically 25-40%.',
    category: 'differential',
    common: true,
  },
  {
    number: '87B',
    name: 'Bus Differential',
    description: 'Differential protection for a bus section. Operates on the sum of all currents entering and leaving the bus. Any difference indicates an internal bus fault.',
    miningApplication: 'Main mine substation bus protection. Fast clearing of bus faults (1-3 cycles). Critical for reducing arc flash energy on high-current mine buses.',
    category: 'differential',
    common: false,
  },
]

/* ------------------------------------------------------------------ */
/*  50/51 Overcurrent Curve Data                                       */
/* ------------------------------------------------------------------ */

interface CurveInfo {
  name: string
  ieeeDesignation: string
  equation: string
  typicalUse: string
  miningUse: string
  a: number
  b: number
  p: number
}

const curveTypes: CurveInfo[] = [
  {
    name: 'Moderately Inverse',
    ieeeDesignation: 'IEEE MI (C1)',
    equation: 't = TD * (0.0515 / (M^0.02 - 1) + 0.114)',
    typicalUse: 'General-purpose protection where fault current does not vary significantly with fault location.',
    miningUse: 'Utility incoming feeders, main bus tie breakers. Steady operating time across a range of fault currents.',
    a: 0.0515,
    b: 0.114,
    p: 0.02,
  },
  {
    name: 'Very Inverse',
    ieeeDesignation: 'IEEE VI (C2)',
    equation: 't = TD * (19.61 / (M^2 - 1) + 0.491)',
    typicalUse: 'Distribution feeders where fault current magnitude drops off significantly with distance from the source.',
    miningUse: 'PREFERRED for mine distribution feeders. Good discrimination between close-in and remote faults. Trails cable and overhead feeder protection.',
    a: 19.61,
    b: 0.491,
    p: 2.0,
  },
  {
    name: 'Extremely Inverse',
    ieeeDesignation: 'IEEE EI (C3)',
    equation: 't = TD * (28.2 / (M^2 - 1) + 0.1217)',
    typicalUse: 'Motor protection, transformer protection. Time characteristic closely matches thermal damage curve.',
    miningUse: 'PREFERRED for mine motor circuits (shovel drives, crusher motors). Closely matches motor damage curves. Fast at high multiples, slow at overloads.',
    a: 28.2,
    b: 0.1217,
    p: 2.0,
  },
  {
    name: 'Short-Time Inverse',
    ieeeDesignation: 'IEEE SI',
    equation: 't = TD * (0.00342 / (M^0.02 - 1) + 0.00262)',
    typicalUse: 'Short-time coordination with downstream fuses or other fast devices.',
    miningUse: 'Rarely used as primary curve in mining. Sometimes used as short-time element for bus protection coordination.',
    a: 0.00342,
    b: 0.00262,
    p: 0.02,
  },
  {
    name: 'Definite Time',
    ieeeDesignation: 'DT',
    equation: 't = Fixed time delay (0.1 - 60s)',
    typicalUse: 'Set time delay regardless of current magnitude. Simple to coordinate.',
    miningUse: 'Used as backup element on mine feeders. Common for ground fault protection timing in HRG systems. Easy to coordinate in series.',
    a: 0,
    b: 0,
    p: 0,
  },
]

/* ------------------------------------------------------------------ */
/*  Ground Fault Protection Data                                       */
/* ------------------------------------------------------------------ */

interface GFMethod {
  method: string
  description: string
  advantages: string[]
  disadvantages: string[]
  miningNotes: string
  diagram: string
}

const gfMethods: GFMethod[] = [
  {
    method: 'Residual CT Connection',
    description: 'Three phase CTs connected in a residual (wye) configuration. Ground fault current is detected as the vector sum of the three phase currents. Under balanced conditions, the residual current is zero.',
    advantages: [
      'Uses existing phase CTs (no additional hardware)',
      'Simple wiring and configuration',
      'Can be implemented with any standard relay',
    ],
    disadvantages: [
      'Sensitive to CT saturation mismatch between phases',
      'CT errors can cause false residual current',
      'Limited sensitivity (typically 5-10% of CT primary rating)',
      'Not suitable for sensitive ground fault detection below 1A',
    ],
    miningNotes: 'Acceptable for solidly grounded systems but NOT recommended as the primary GF method for mine HRG systems. CT mismatch errors can mask small ground fault currents typical of HRG systems.',
    diagram: 'A + B + C = 3I\₀ (residual)',
  },
  {
    method: 'Zero-Sequence CT (Core Balance CT)',
    description: 'A single CT that encircles all three phase conductors. Under normal conditions, the magnetic fields cancel. A ground fault creates an unbalanced flux that induces current in the CT secondary.',
    advantages: [
      'Very high sensitivity (can detect milliamp-level faults)',
      'Immune to CT saturation mismatch (single core)',
      'Accurate ground fault measurement regardless of load',
      'Preferred method for HRG systems',
    ],
    disadvantages: [
      'Requires all three phases through one CT window',
      'Cable shields / grounds must NOT pass through CT window',
      'Additional hardware cost',
      'Window size limits cable size / number of cables',
    ],
    miningNotes: 'PREFERRED method for mine HRG ground fault detection per O.Reg 854. Must ensure cable shields are grounded on the source side of the CT, NOT through the CT window. Critical installation detail often missed.',
    diagram: 'All 3 phases through single CT window',
  },
  {
    method: 'Neutral Grounding Resistor (NGR) CT',
    description: 'A CT installed on the neutral-to-ground connection of the NGR. Directly measures the current flowing through the grounding resistor during a ground fault.',
    advantages: [
      'Directly measures actual ground fault current',
      'Simple and reliable',
      'Independent of phase CT accuracy',
      'Easy to test and verify',
    ],
    disadvantages: [
      'Only detects faults downstream of the NGR location',
      'Does not provide feeder selectivity (cannot tell which feeder faulted)',
      'Requires separate CT on NGR connection',
    ],
    miningNotes: 'Used as bus-level ground fault detection in mine substations. Provides overall GF alarm/trip but requires feeder-level 50G/51G relays for selective tripping. NGR typically sized for 5-25A on mine HRG systems.',
    diagram: 'CT on neutral-to-ground resistor lead',
  },
  {
    method: 'Neutral Voltage Displacement (59G)',
    description: 'Measures the voltage across the NGR or neutral-to-ground point. During a ground fault, the neutral voltage rises proportionally to the fault severity. A full line-to-ground fault drives the neutral to full line-to-neutral voltage.',
    advantages: [
      'No CTs required on feeders for bus-level detection',
      'Can detect high-impedance ground faults',
      'Simple voltage measurement',
      'Works well as backup to current-based detection',
    ],
    disadvantages: [
      'No feeder selectivity',
      'Sensitive to third-harmonic voltages (may need filtering)',
      'Cannot determine fault magnitude precisely',
    ],
    miningNotes: 'Common backup ground fault indication on mine HRG systems. Voltage relay (59G) connected across NGR. Alarm at 5-10% of nominal neutral voltage, trip at higher level. Used with NGR CT method for redundancy.',
    diagram: 'VT across NGR or neutral-to-ground',
  },
]

interface HRGSetting {
  parameter: string
  typicalValue: string
  notes: string
}

const hrgSettings: HRGSetting[] = [
  { parameter: 'NGR Current Rating', typicalValue: '5A, 10A, or 25A', notes: 'Sized to limit ground fault current. 5A common for mine 4160V systems. 25A common for 600V systems.' },
  { parameter: 'NGR Resistance (4160V)', typicalValue: '480\Ω (for 5A)', notes: 'R = V_L-N / I_gf = 2400V / 5A = 480\Ω' },
  { parameter: 'NGR Resistance (600V)', typicalValue: '14\Ω (for 25A)', notes: 'R = V_L-N / I_gf = 347V / 25A = 13.9\Ω' },
  { parameter: '50G Pickup', typicalValue: '0.5 - 2.5A primary', notes: 'Set at 5-10% of NGR rating. Must be above normal unbalance. Instantaneous trip.' },
  { parameter: '51G Pickup', typicalValue: '0.25 - 1.0A primary', notes: 'More sensitive than 50G. Time-delayed for coordination with downstream devices.' },
  { parameter: '51G Time Dial', typicalValue: '0.5 - 2.0s', notes: 'Coordinate with downstream GF relays. Shortest time that provides selectivity.' },
  { parameter: '59G Alarm', typicalValue: '5-10% of V_L-N', notes: 'Early warning of developing ground fault or degraded insulation.' },
  { parameter: '59G Trip', typicalValue: '50-80% of V_L-N', notes: 'Trips for sustained ground faults. Backup to current-based protection.' },
  { parameter: 'Trailing Cable 50G', typicalValue: '0.5 - 1.5A', notes: 'Per O.Reg 854: ground fault protection mandatory on trailing cables. Very sensitive setting required.' },
  { parameter: 'Ground Continuity Monitor', typicalValue: 'Continuous', notes: 'Monitors ground conductor integrity on trailing cables. Trips equipment on open ground. Required per O.Reg 854.' },
]

/* ------------------------------------------------------------------ */
/*  Voltage & Frequency Relay Data                                     */
/* ------------------------------------------------------------------ */

interface VFRelaySetting {
  device: string
  function: string
  pickupRange: string
  typicalSetting: string
  timeDelay: string
  miningApplication: string
}

const vfRelaySettings: VFRelaySetting[] = [
  {
    device: '27 (UV)',
    function: 'Undervoltage Trip',
    pickupRange: '0.80 - 0.95 pu',
    typicalSetting: '0.90 pu',
    timeDelay: '0.5 - 3.0 s',
    miningApplication: 'Motor bus UV protection. Prevents motors from overheating on sustained low voltage. Longer delay to ride through momentary dips from shovel/dragline cycling.',
  },
  {
    device: '27 (UV)',
    function: 'Undervoltage Alarm',
    pickupRange: '0.90 - 0.97 pu',
    typicalSetting: '0.95 pu',
    timeDelay: '5.0 - 10.0 s',
    miningApplication: 'Early warning of voltage depression. Alerts operator before trip level. Common on mine MCC buses.',
  },
  {
    device: '59 (OV)',
    function: 'Overvoltage Trip',
    pickupRange: '1.05 - 1.15 pu',
    typicalSetting: '1.10 pu',
    timeDelay: '0.5 - 2.0 s',
    miningApplication: 'Protects insulation from sustained overvoltage. Common after load rejection events or capacitor switching at mine substations.',
  },
  {
    device: '59 (OV)',
    function: 'Overvoltage Alarm',
    pickupRange: '1.03 - 1.08 pu',
    typicalSetting: '1.05 pu',
    timeDelay: '5.0 - 10.0 s',
    miningApplication: 'Early warning of elevated voltage. May indicate regulator issues or light load conditions.',
  },
  {
    device: '81U (UF)',
    function: 'Underfrequency Trip',
    pickupRange: '57.0 - 59.5 Hz',
    typicalSetting: '59.5 Hz',
    timeDelay: '0.5 - 5.0 s',
    miningApplication: 'Load shedding during utility disturbance. Staged: 59.5 Hz shed non-critical (lighting, ventilation), 59.0 Hz shed production loads, 58.5 Hz trip all.',
  },
  {
    device: '81O (OF)',
    function: 'Overfrequency Alarm',
    pickupRange: '60.5 - 62.0 Hz',
    typicalSetting: '60.5 Hz',
    timeDelay: '5.0 - 10.0 s',
    miningApplication: 'Indicates generator overspeed or load rejection. Alarm first, trip at 61.0-62.0 Hz. Critical when mine generators run in parallel with utility.',
  },
  {
    device: '46 (I\₂)',
    function: 'Negative Sequence OC',
    pickupRange: '0.05 - 0.30 pu',
    typicalSetting: '0.10 - 0.20 pu',
    timeDelay: '5.0 - 10.0 s',
    miningApplication: 'Protects motors from unbalanced supply. Open pit trailing cables prone to connector damage causing single-phasing. Set sensitive enough to detect 3-5% voltage unbalance.',
  },
  {
    device: '49 (Thermal)',
    function: 'Motor Thermal Model',
    pickupRange: '1.0 - 1.2x FLA',
    typicalSetting: 'Service Factor based',
    timeDelay: 'I\²t curve',
    miningApplication: 'Tracks cumulative motor heating using thermal model. Accounts for ambient temperature, prior loading. Critical for cyclic loads like shovel hoist motors.',
  },
]

interface UnbalanceEffect {
  voltageUnbalance: string
  currentUnbalance: string
  temperatureRise: string
  deratingFactor: string
  effect: string
}

const unbalanceEffects: UnbalanceEffect[] = [
  { voltageUnbalance: '1%', currentUnbalance: '6-10%', temperatureRise: '2-4%', deratingFactor: '1.00', effect: 'Acceptable. Normal operating condition.' },
  { voltageUnbalance: '2%', currentUnbalance: '12-20%', temperatureRise: '8-16%', deratingFactor: '0.95', effect: 'Monitor closely. Increased losses and heating.' },
  { voltageUnbalance: '3%', currentUnbalance: '18-30%', temperatureRise: '18-36%', deratingFactor: '0.88', effect: 'Derate motor. Investigate supply issue promptly.' },
  { voltageUnbalance: '4%', currentUnbalance: '24-40%', temperatureRise: '32-64%', deratingFactor: '0.82', effect: 'Significant risk. Correct immediately or de-energize motor.' },
  { voltageUnbalance: '5%+', currentUnbalance: '30-50%+', temperatureRise: '50-100%+', deratingFactor: '<0.75', effect: 'DO NOT OPERATE. Motor damage imminent. Find and correct cause.' },
]

/* ------------------------------------------------------------------ */
/*  Troubleshooting Data                                               */
/* ------------------------------------------------------------------ */

interface TroubleshootIssue {
  issue: string
  symptoms: string[]
  possibleCauses: string[]
  diagnosticSteps: string[]
  category: 'nuisance' | 'failure' | 'settings' | 'communication' | 'testing'
}

const troubleshootIssues: TroubleshootIssue[] = [
  {
    issue: 'Nuisance Tripping \— 50 Element',
    symptoms: ['Relay trips on instantaneous overcurrent with no visible fault', 'Trip occurs during motor starting or load switching', 'Event record shows current spike but no sustained fault'],
    possibleCauses: ['50 pickup set too low (below motor inrush)', 'CT saturation during asymmetric inrush', 'Pickup set below maximum through-fault current for downstream faults', 'Load cold-start inrush exceeding pickup'],
    diagnosticSteps: ['Review event record: check peak current vs pickup setting', 'Verify 50 pickup is set above motor locked-rotor current (typically 6-10x FLA)', 'Check CT ratio \— may need higher ratio to avoid saturation', 'Review coordination study: 50 should be set above max through-fault at next downstream device', 'Consider adding short time delay (3-5 cycles) if transient inrush is the cause'],
    category: 'nuisance',
  },
  {
    issue: 'Nuisance Tripping \— 51 Element',
    symptoms: ['Time-overcurrent relay trips during normal operation', 'Trip after sustained high load but no fault', 'Multiple trips at same time of day or production cycle'],
    possibleCauses: ['51 pickup set below normal operating current', 'Time dial too fast (low TD setting)', 'Incorrect CT ratio entered in relay', 'Actual load has increased beyond original design', 'Harmonic currents inflating RMS measurement'],
    diagnosticSteps: ['Check relay metering: compare relay amps reading to actual load current with clamp meter', 'Verify CT ratio setting in relay matches physical CTs', 'Review 51 pickup: should be 1.2-1.5x actual FLA, not nameplate FLA', 'Check load profile: has production increased since settings were applied?', 'Measure THD \— if >10%, consider harmonic-rated relay or filtering'],
    category: 'nuisance',
  },
  {
    issue: 'Nuisance Tripping \— Ground Fault',
    symptoms: ['50G/51G trips with no confirmed ground fault', 'Ground fault trips during wet weather or after washdown', 'Intermittent ground fault alarms that self-clear'],
    possibleCauses: ['Degraded cable insulation (tracking fault)', 'Moisture in junction boxes, terminations, or connectors', 'Zero-sequence CT installed incorrectly (shield passing through window)', 'CT secondary wiring picking up noise', 'Capacitive coupling on long cable runs causing residual current'],
    diagnosticSteps: ['Check 50G event record for fault current magnitude and duration', 'Inspect cable terminations and connectors for moisture/contamination', 'Verify zero-sequence CT installation: shields must NOT pass through CT window', 'Megger all feeder cables \— look for low insulation resistance', 'Check for noise: disconnect CT secondary and check for stray voltage', 'On trailing cables: inspect plug faces, pilot pins, and ground conductor connections'],
    category: 'nuisance',
  },
  {
    issue: 'Failure to Trip',
    symptoms: ['Upstream device trips instead of the expected relay', 'Fault damage indicates prolonged arcing', 'Backup protection operates but primary does not'],
    possibleCauses: ['Relay settings incorrect or not applied to relay', 'CT wiring open or shorted', 'Trip coil failure (open circuit, no DC supply)', 'Relay watchdog fault or internal failure', 'Settings file not matching running settings (firmware update cleared settings)'],
    diagnosticSteps: ['Verify relay front panel shows ARMED status', 'Check trip circuit: measure DC voltage at trip coil terminals', 'Verify CT secondary is connected and not open-circuited (DANGER: open CT secondary)', 'Compare relay settings file to actual running settings in relay', 'Check relay self-diagnostics for internal failures', 'Perform relay test with test set to verify operation', 'Verify trip output contact is mapped to correct relay output'],
    category: 'failure',
  },
  {
    issue: 'Incorrect Relay Settings',
    symptoms: ['Coordination study shows overlap between upstream and downstream devices', 'Relay trips for faults that should be cleared by downstream device', 'Relay does not trip for faults it should detect'],
    possibleCauses: ['Settings not updated after system changes (new transformer, changed cable, added load)', 'Wrong CT ratio entered in relay', 'Settings applied to wrong relay (copy/paste error)', 'Curves not appropriate for application (e.g., MI curve where EI needed)'],
    diagnosticSteps: ['Request current coordination study from engineering', 'Verify relay settings against approved settings document', 'Confirm CT ratio, PT ratio, and all scaling factors', 'Check relay firmware version \— some settings change format between versions', 'Compare running settings to settings database/master file'],
    category: 'settings',
  },
  {
    issue: 'Communication Failure (Modbus/DNP3)',
    symptoms: ['SCADA shows relay data as stale or zero', 'Communication loss alarm on relay or RTU', 'Intermittent data dropouts', 'All relays on same comm loop affected'],
    possibleCauses: ['RS-485 termination resistor missing or incorrect', 'Baud rate or parity mismatch between relay and master', 'Relay address conflict (two devices with same address)', 'Cable damage: broken conductor, water ingress, shield grounding issue', 'Protocol mismatch (Modbus RTU vs ASCII, DNP3 serial vs TCP)'],
    diagnosticSteps: ['Check relay front panel for comm activity LED (RX/TX blinking)', 'Verify baud rate, parity, stop bits, and device address match the SCADA polling list', 'Check RS-485 wiring: A to A, B to B, common ground connected', 'Verify 120\Ω termination resistor at both ends of RS-485 bus (and only at both ends)', 'Use a serial protocol analyzer to check for responses from the relay', 'For DNP3 TCP: verify IP address, subnet, gateway, and port settings'],
    category: 'communication',
  },
  {
    issue: 'Relay Test Set Troubleshooting',
    symptoms: ['Test results do not match expected relay operation', 'Relay does not trip during testing', 'Test set shows error or cannot supply required current'],
    possibleCauses: ['Test leads connected to wrong relay terminals', 'Relay in test mode or outputs disabled', 'Test set current capacity insufficient for relay burden', 'Relay wired for 1A CTs but test set outputting 5A range values', 'Relay firmware requires specific test procedure'],
    diagnosticSteps: ['Verify test lead connections to correct relay current and voltage inputs', 'Check relay front panel: ensure relay is in normal mode (not programming/disabled)', 'Verify test set output range matches relay input rating (1A vs 5A)', 'For pickup test: ramp slowly (1-2% per second) for accurate pickup value', 'For timing test: use correct pre-fault and fault current values', 'Document test results: pickup value, timing at 3x, 5x, and 10x pickup'],
    category: 'testing',
  },
]

interface RelayBrand {
  brand: string
  series: string
  commonModels: string
  protocol: string
  software: string
  miningNotes: string
}

const relayBrands: RelayBrand[] = [
  {
    brand: 'SEL (Schweitzer)',
    series: 'SEL-300/400/700',
    commonModels: 'SEL-351, SEL-351S, SEL-451, SEL-751, SEL-710',
    protocol: 'Modbus RTU/TCP, DNP3, IEC 61850',
    software: 'AcSELerator QuickSet',
    miningNotes: 'Most common relay in North American mining. Rugged, reliable, excellent technical support. SEL-751 very popular for feeder protection. SEL-710 for motor protection.',
  },
  {
    brand: 'GE Multilin',
    series: 'UR Series / 8 Series',
    commonModels: 'F650, F60, T60, M60, 750/760, 489',
    protocol: 'Modbus RTU/TCP, DNP3, IEC 61850',
    software: 'EnerVista (free)',
    miningNotes: 'Widely used in mining, especially older installations. 750/760 for feeder protection. 489 for motor protection. UR series replacing older models.',
  },
  {
    brand: 'ABB',
    series: 'REF/REX/RET/REM',
    commonModels: 'REF615, REF620, RET670, REX640',
    protocol: 'Modbus RTU/TCP, DNP3, IEC 61850',
    software: 'PCM600 (Protection and Control IED Manager)',
    miningNotes: 'Common in mining substations, especially with ABB switchgear. REF615 for feeder protection. RET670 for transformer protection. Robust in harsh environments.',
  },
  {
    brand: 'Beckwith Electric',
    series: 'M-series',
    commonModels: 'M-3420, M-3425, M-7679',
    protocol: 'Modbus RTU, DNP3',
    software: 'Beckwith IPScom',
    miningNotes: 'Specialized in generator and transformer protection. M-3420 for generator protection common in mine power plants. Excellent for paralleling applications.',
  },
  {
    brand: 'Basler Electric',
    series: 'BE1-series',
    commonModels: 'BE1-50/51, BE1-67, BE1-87T',
    protocol: 'Modbus RTU, DNP3',
    software: 'BEST (Basler Electric Setting Tool)',
    miningNotes: 'Found in older mine installations. Straightforward settings and commissioning. BE1-67 common for directional protection on mine loop feeds.',
  },
]

interface LEDMeaning {
  led: string
  color: string
  meaning: string
  action: string
}

const ledMeanings: LEDMeaning[] = [
  { led: 'TRIP', color: '#ff3c3c', meaning: 'Relay has issued a trip command. A protection element has operated.', action: 'Check event record for cause. Do NOT reset until cause is identified and cleared.' },
  { led: 'ALARM', color: '#ffd700', meaning: 'A warning condition exists but no trip has occurred. May be thermal, voltage, or frequency alarm.', action: 'Check relay metering and alarm targets. Investigate promptly to prevent escalation to trip.' },
  { led: 'ENABLED / IN SERVICE', color: '#4ade80', meaning: 'Protection elements are active and relay is monitoring the circuit.', action: 'Normal indication. Relay is armed and ready to operate.' },
  { led: 'COMM (TX/RX)', color: '#4ade80', meaning: 'Communication port is active. Blinks with each message sent/received.', action: 'Normal when SCADA is polling. If not blinking, check communication settings and wiring.' },
  { led: 'SELF-TEST / FAIL', color: '#ff3c3c', meaning: 'Relay internal diagnostics have detected a failure. Protection may be compromised.', action: 'CRITICAL: Relay may not operate on faults. Check self-diagnostic logs. Contact manufacturer. Consider temporary alternative protection.' },
  { led: 'RECLOSING', color: '#60a5fa', meaning: 'Auto-reclose sequence is in progress or armed for reclosing.', action: 'Verify reclosing is appropriate for this circuit (NEVER on underground cables or trailing cables).' },
  { led: '86 LOCKOUT', color: '#ff3c3c', meaning: 'Lockout relay has operated. Breaker is locked out and cannot be closed.', action: 'Investigation required before reset. Check all protection targets. Manual reset only after cause is identified.' },
  { led: 'GROUND FAULT', color: '#ffd700', meaning: 'Ground fault has been detected. May be alarm or trip depending on settings.', action: 'Megger feeders to find faulted cable. On HRG systems, check one feeder at a time by opening each feeder breaker.' },
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

const warningCard: React.CSSProperties = {
  ...card,
  border: '1px solid rgba(255, 165, 0, 0.3)',
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

const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 4,
}

const resultBox: React.CSSProperties = {
  background: 'var(--surface-elevated)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
}

const monoValue: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--primary)',
}

const smallNote: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-tertiary)',
  lineHeight: 1.5,
}

/* ------------------------------------------------------------------ */
/*  Helper: calculate 50/51 relay settings                             */
/* ------------------------------------------------------------------ */

function calcOvercurrent(
  ctRatioPrimary: number,
  ctRatioSecondary: number,
  fla: number,
  pickup51Multiple: number,
  pickup50Multiple: number,
): {
  ctRatio: number
  flaSecondary: number
  pickup51Primary: number
  pickup51Secondary: number
  pickup50Primary: number
  pickup50Secondary: number
} | null {
  if (ctRatioPrimary <= 0 || ctRatioSecondary <= 0 || fla <= 0) return null
  const ctRatio = ctRatioPrimary / ctRatioSecondary
  const flaSecondary = fla / ctRatio
  const pickup51Primary = fla * pickup51Multiple
  const pickup51Secondary = pickup51Primary / ctRatio
  const pickup50Primary = fla * pickup50Multiple
  const pickup50Secondary = pickup50Primary / ctRatio
  return {
    ctRatio,
    flaSecondary: Math.round(flaSecondary * 100) / 100,
    pickup51Primary: Math.round(pickup51Primary * 10) / 10,
    pickup51Secondary: Math.round(pickup51Secondary * 100) / 100,
    pickup50Primary: Math.round(pickup50Primary * 10) / 10,
    pickup50Secondary: Math.round(pickup50Secondary * 100) / 100,
  }
}

/* ------------------------------------------------------------------ */
/*  Helper: calculate ground fault relay settings                      */
/* ------------------------------------------------------------------ */

function calcGroundFault(
  ngrRating: number,
  pickupPercent: number,
  systemVoltage: number,
): {
  ngrCurrent: number
  pickupPrimary: number
  ngrResistance: number
  vln: number
} | null {
  if (ngrRating <= 0 || pickupPercent <= 0 || systemVoltage <= 0) return null
  const vln = systemVoltage / Math.sqrt(3)
  const ngrResistance = vln / ngrRating
  const pickupPrimary = ngrRating * (pickupPercent / 100)
  return {
    ngrCurrent: Math.round(ngrRating * 100) / 100,
    pickupPrimary: Math.round(pickupPrimary * 100) / 100,
    ngrResistance: Math.round(ngrResistance * 10) / 10,
    vln: Math.round(vln * 10) / 10,
  }
}

/* ------------------------------------------------------------------ */
/*  Category color map for ANSI devices                                */
/* ------------------------------------------------------------------ */

const categoryColors: Record<ANSIDevice['category'], string> = {
  overcurrent: '#ff8c00',
  voltage: '#60a5fa',
  frequency: '#a78bfa',
  differential: '#f472b6',
  mechanical: '#94a3b8',
  control: '#4ade80',
  motor: '#fbbf24',
  ground: '#34d399',
}

const categoryLabels: Record<ANSIDevice['category'], string> = {
  overcurrent: 'Overcurrent',
  voltage: 'Voltage',
  frequency: 'Frequency',
  differential: 'Differential',
  mechanical: 'Mechanical',
  control: 'Control / Switching',
  motor: 'Motor Protection',
  ground: 'Ground Fault',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProtectiveRelaysPage() {
  const [tab, setTab] = useState<TabKey>('ansi')

  /* ANSI tab state */
  const [ansiSearch, setAnsiSearch] = useState('')
  const [ansiCategoryFilter, setAnsiCategoryFilter] = useState<ANSIDevice['category'] | 'all'>('all')

  /* 50/51 calculator state */
  const [ctPrimary, setCtPrimary] = useState('400')
  const [ctSecondary, setCtSecondary] = useState('5')
  const [ocFla, setOcFla] = useState('250')
  const [pickup51Mult, setPickup51Mult] = useState('1.3')
  const [pickup50Mult, setPickup50Mult] = useState('8')

  /* Ground fault calculator state */
  const [gfNgrRating, setGfNgrRating] = useState('5')
  const [gfPickupPct, setGfPickupPct] = useState('10')
  const [gfSystemV, setGfSystemV] = useState('4160')

  /* Troubleshooting filter */
  const [tsFilter, setTsFilter] = useState<TroubleshootIssue['category'] | 'all'>('all')

  /* Computed results */
  const ocResult = calcOvercurrent(
    parseFloat(ctPrimary),
    parseFloat(ctSecondary),
    parseFloat(ocFla),
    parseFloat(pickup51Mult),
    parseFloat(pickup50Mult),
  )

  const gfResult = calcGroundFault(
    parseFloat(gfNgrRating),
    parseFloat(gfPickupPct),
    parseFloat(gfSystemV),
  )

  /* Filter ANSI devices */
  const filteredDevices = ansiDevices.filter(d => {
    const searchLower = ansiSearch.toLowerCase()
    const matchesSearch = !ansiSearch ||
      d.number.toLowerCase().includes(searchLower) ||
      d.name.toLowerCase().includes(searchLower) ||
      d.description.toLowerCase().includes(searchLower) ||
      d.miningApplication.toLowerCase().includes(searchLower)
    const matchesCategory = ansiCategoryFilter === 'all' || d.category === ansiCategoryFilter
    return matchesSearch && matchesCategory
  })

  /* Filter troubleshooting */
  const filteredTsIssues = troubleshootIssues.filter(i => tsFilter === 'all' || i.category === tsFilter)

  return (
    <>
      <Header title="Protective Relay Ref." />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Mining safety banner */}
        <div style={{
          background: 'rgba(255, 165, 0, 0.10)',
          border: '1px solid rgba(255, 165, 0, 0.35)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{'\⚠\uFE0F'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            <strong style={{ color: '#ff8c00' }}>RELAY SETTINGS ARE CRITICAL.</strong>{' '}
            Incorrect settings can cause nuisance trips (production loss) or failure to trip (equipment damage, arc flash, injury).
            Always use approved coordination study settings. Per O.Reg 854, ground fault protection is mandatory on all mine distribution.
            Arc flash energy is directly related to relay clearing time.
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
        {/*  TAB 1: ANSI Device Numbers                                  */}
        {/* ============================================================ */}
        {tab === 'ansi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>ANSI/IEEE Device Numbers for Mining</div>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search by number, name, or description..."
              value={ansiSearch}
              onChange={e => setAnsiSearch(e.target.value)}
              style={inputStyle}
            />

            {/* Category filter pills */}
            <div style={{ ...pillRow, gap: 6 }}>
              <button
                style={ansiCategoryFilter === 'all' ? { ...pillActive, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18 } : { ...pillBase, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18 }}
                onClick={() => setAnsiCategoryFilter('all')}
              >
                All ({ansiDevices.length})
              </button>
              {(Object.keys(categoryLabels) as ANSIDevice['category'][]).map(cat => {
                const count = ansiDevices.filter(d => d.category === cat).length
                if (count === 0) return null
                return (
                  <button
                    key={cat}
                    style={ansiCategoryFilter === cat
                      ? { ...pillActive, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18, background: categoryColors[cat], border: `2px solid ${categoryColors[cat]}` }
                      : { ...pillBase, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18 }
                    }
                    onClick={() => setAnsiCategoryFilter(cat)}
                  >
                    {categoryLabels[cat]} ({count})
                  </button>
                )
              })}
            </div>

            {/* Results count */}
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Showing {filteredDevices.length} of {ansiDevices.length} devices
              {ansiSearch && <> matching &quot;{ansiSearch}&quot;</>}
            </div>

            {/* Device cards */}
            {filteredDevices.map(device => (
              <div key={device.number} style={{
                ...card,
                borderLeft: `4px solid ${categoryColors[device.category]}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    minWidth: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: `${categoryColors[device.category]}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 18,
                    fontWeight: 800,
                    color: categoryColors[device.category],
                  }}>
                    {device.number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                      {device.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        ...badge,
                        color: categoryColors[device.category],
                        background: `${categoryColors[device.category]}15`,
                      }}>
                        {categoryLabels[device.category]}
                      </span>
                      {device.common && (
                        <span style={{
                          ...badge,
                          color: 'var(--primary)',
                          background: 'var(--surface-elevated)',
                        }}>
                          Common in Mining
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {device.description}
                </div>

                <div style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                    Open Pit Mine Application
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                    {device.miningApplication}
                  </div>
                </div>
              </div>
            ))}

            {filteredDevices.length === 0 && (
              <div style={{ ...card, textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>No devices found</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Try a different search term or category filter</div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: 50/51 Overcurrent                                    */}
        {/* ============================================================ */}
        {tab === 'overcurrent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>50/51 Phase Overcurrent Protection</div>

            {/* 50 Element overview */}
            <div style={{ ...card, borderLeft: '4px solid #ff3c3c' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                50 Element &mdash; Instantaneous Overcurrent
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The 50 element provides fast, no-delay tripping for high-magnitude faults.
                It operates when current exceeds the pickup setting, typically clearing in 1-3 cycles (16-50 ms at 60 Hz).
                This is the primary defense against high-current faults that produce maximum arc flash energy.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                <div style={resultBox}>
                  <span style={label}>Typical Pickup Setting</span>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>6&ndash;10x FLA (motor circuits) or above maximum downstream through-fault current (feeder circuits)</div>
                </div>
                <div style={resultBox}>
                  <span style={label}>Operating Time</span>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>Instantaneous (no intentional delay) &mdash; typically 1&ndash;3 cycles</div>
                </div>
                <div style={resultBox}>
                  <span style={label}>Mining Note</span>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    For motor circuits on shovels and draglines, set above locked-rotor current.
                    For feeder circuits, set above maximum through-fault current at the downstream bus.
                    Fast clearing is critical for arc flash energy reduction.
                  </div>
                </div>
              </div>
            </div>

            {/* 51 Element overview */}
            <div style={{ ...card, borderLeft: '4px solid #ff8c00' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                51 Element &mdash; Time Overcurrent
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The 51 element provides time-graded overcurrent protection. Operating time decreases as fault current increases,
                following a selected inverse-time curve. This allows coordination between upstream and downstream devices &mdash;
                the device closest to the fault trips first.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                <div style={resultBox}>
                  <span style={label}>Typical Pickup Setting</span>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>1.2&ndash;1.5x FLA (must carry full load without tripping)</div>
                </div>
                <div style={resultBox}>
                  <span style={label}>Time Dial Setting</span>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>Adjusted to achieve 0.3&ndash;0.4s coordination margin with downstream devices</div>
                </div>
                <div style={resultBox}>
                  <span style={label}>Mining Note</span>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Use Very Inverse (IEEE C2) for distribution feeders to portable substations.
                    Use Extremely Inverse (IEEE C3) for motor circuits to match thermal damage curves.
                    Always verify coordination with downstream fuses, breakers, and relay settings.
                  </div>
                </div>
              </div>
            </div>

            {/* Time-Current Curve Info */}
            <div style={sectionHeading}>IEEE Time-Overcurrent Curves</div>
            {curveTypes.map(curve => (
              <div key={curve.name} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{curve.name}</div>
                  <span style={badge}>{curve.ieeeDesignation}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', marginBottom: 8, background: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                  {curve.equation}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  <strong>General use:</strong> {curve.typicalUse}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--primary)' }}>Mining use:</strong> {curve.miningUse}
                </div>
              </div>
            ))}

            {/* 50/51 Settings Calculator */}
            <div style={sectionHeading}>50/51 Settings Calculator</div>
            <div style={{ ...card, borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Phase Overcurrent Relay Settings
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={label}>CT Primary (A)</div>
                  <input type="number" value={ctPrimary} onChange={e => setCtPrimary(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div>
                  <div style={label}>CT Secondary (A)</div>
                  <input type="number" value={ctSecondary} onChange={e => setCtSecondary(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div>
                  <div style={label}>Motor/Load FLA</div>
                  <input type="number" value={ocFla} onChange={e => setOcFla(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div>
                  <div style={label}>51 Pickup Multiple</div>
                  <input type="number" step="0.1" value={pickup51Mult} onChange={e => setPickup51Mult(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={label}>50 Pickup Multiple (x FLA)</div>
                  <input type="number" step="0.5" value={pickup50Mult} onChange={e => setPickup50Mult(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
              </div>

              {ocResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    Calculated Settings
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>CT Ratio</div>
                      <div style={monoValue}>{ocResult.ctRatio}:1</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>FLA at CT Secondary</div>
                      <div style={monoValue}>{ocResult.flaSecondary} A</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>51 Pickup (Primary)</div>
                      <div style={monoValue}>{ocResult.pickup51Primary} A</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>51 Pickup (Secondary)</div>
                      <div style={monoValue}>{ocResult.pickup51Secondary} A</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>50 Pickup (Primary)</div>
                      <div style={monoValue}>{ocResult.pickup50Primary} A</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>50 Pickup (Secondary)</div>
                      <div style={monoValue}>{ocResult.pickup50Secondary} A</div>
                    </div>
                  </div>
                  <div style={smallNote}>
                    Relay setting = secondary value. Verify 50 pickup is above motor locked-rotor current.
                    Verify 51 pickup carries full load with margin. Always confirm against approved coordination study.
                  </div>
                </div>
              )}
            </div>

            {/* Coordination basics */}
            <div style={sectionHeading}>Coordination Basics</div>
            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text)' }}>What is coordination?</strong> Ensuring that the protective device closest to the fault operates
                first, while upstream devices remain energized. This minimizes the impact of a fault to the smallest possible section of the power system.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Coordination Time Interval (CTI)</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Minimum time margin between upstream and downstream device operating times at the same fault current.
                    Typical CTI: 0.3&ndash;0.4 seconds for relay-to-relay coordination. Accounts for relay overtravel, CT errors, and safety margin.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Sequence: Fuse &rarr; Relay &rarr; Main Breaker</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    In a mine distribution system: motor fuse (fastest) &rarr; feeder relay 51 &rarr; main bus relay 51 &rarr; incoming relay 51.
                    Each upstream device must be slower than its downstream device by at least the CTI.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Mining Consideration</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Open pit mines often add portable substations, new loads, or trailing cable extensions.
                    Each change can affect coordination. Update the coordination study when the power system changes.
                    Keep settings records on-site and accessible per O.Reg 854.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: 50G/51G Ground Fault                                 */}
        {/* ============================================================ */}
        {tab === 'ground' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>50G/51G Ground Fault Protection</div>

            {/* Mandatory notice */}
            <div style={{
              background: 'rgba(255, 60, 60, 0.10)',
              border: '1px solid rgba(255, 60, 60, 0.35)',
              borderRadius: 'var(--radius)',
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{'\⚠\uFE0F'}</span>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                <strong style={{ color: '#ff3c3c' }}>O.Reg 854 REQUIREMENT:</strong>{' '}
                Ground fault protection is mandatory on all mine distribution systems in Ontario.
                Trailing cables must have ground fault detection AND ground continuity monitoring.
                Do NOT bypass or disable ground fault protection under any circumstances.
              </div>
            </div>

            {/* GF Detection Methods */}
            <div style={sectionHeading}>Ground Fault Detection Methods</div>
            {gfMethods.map(method => (
              <div key={method.method} style={{ ...card, borderLeft: '4px solid #34d399' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  {method.method}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
                  {method.description}
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', marginBottom: 10 }}>
                  {method.diagram}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>Advantages</div>
                    {method.advantages.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: 8, borderLeft: '2px solid #4ade8040', marginBottom: 2 }}>
                        {a}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ff8c00', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>Disadvantages</div>
                    {method.disadvantages.map((d, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: 8, borderLeft: '2px solid #ff8c0040', marginBottom: 2 }}>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(52, 211, 153, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                    Mining Notes
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                    {method.miningNotes}
                  </div>
                </div>
              </div>
            ))}

            {/* HRG Settings Table */}
            <div style={sectionHeading}>HRG System Typical Settings (Mine)</div>
            <div style={{ ...card, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Parameter</th>
                    <th style={tableHeader}>Typical Value</th>
                    <th style={tableHeader}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {hrgSettings.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.parameter}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>{row.typicalValue}</td>
                      <td style={{ ...tableCell, color: 'var(--text-secondary)' }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GF Settings Calculator */}
            <div style={sectionHeading}>Ground Fault Settings Calculator</div>
            <div style={{ ...card, borderLeft: '4px solid #34d399' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                HRG Ground Fault Relay Settings
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={label}>System Voltage (V)</div>
                  <input type="number" value={gfSystemV} onChange={e => setGfSystemV(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div>
                  <div style={label}>NGR Rating (A)</div>
                  <input type="number" value={gfNgrRating} onChange={e => setGfNgrRating(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
                <div>
                  <div style={label}>Pickup (% of NGR)</div>
                  <input type="number" value={gfPickupPct} onChange={e => setGfPickupPct(e.target.value)} style={{ ...inputStyle, minHeight: 44, fontSize: 14 }} />
                </div>
              </div>

              {gfResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    Calculated Values
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Line-to-Neutral Voltage</div>
                      <div style={monoValue}>{gfResult.vln} V</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>NGR Resistance</div>
                      <div style={monoValue}>{gfResult.ngrResistance} {'\Ω'}</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Max GF Current (NGR)</div>
                      <div style={monoValue}>{gfResult.ngrCurrent} A</div>
                    </div>
                    <div style={resultBox}>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>50G Pickup Setting</div>
                      <div style={monoValue}>{gfResult.pickupPrimary} A primary</div>
                    </div>
                  </div>
                  <div style={smallNote}>
                    50G pickup must be above normal system unbalance and below minimum expected ground fault current.
                    For trailing cables, use more sensitive settings (lower pickup). Always verify against coordination study.
                  </div>
                </div>
              )}
            </div>

            {/* Trailing cable section */}
            <div style={sectionHeading}>Trailing Cable Ground Fault Protection</div>
            <div style={warningCard}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                Open Pit Trailing Cable Requirements
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Ground Fault Detection</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    All trailing cables must have ground fault protection. Pickup settings must be sensitive enough to detect
                    ground faults through the trailing cable impedance. Typical: 0.5-1.5A primary for 50G on trailing cable feeders.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Ground Continuity Monitor (GCM)</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Continuously monitors the ground conductor integrity. If the ground conductor opens (broken, disconnected),
                    the GCM trips the equipment immediately. Required per O.Reg 854. Uses a pilot wire in the trailing cable.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ff3c3c' }}>Ground Check Circuit</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Before energizing a trailing cable, the ground check circuit verifies ground continuity.
                    The plug cannot be energized until ground integrity is confirmed. If the ground check pilot wire is damaged,
                    the cable cannot be energized. NEVER bypass the ground check circuit.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Detection Sensitivity per O.Reg 854</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Ground fault relays on trailing cable circuits must detect ground faults at levels low enough to
                    prevent dangerous touch voltages. On HRG systems, the NGR limits fault current, so relay pickup
                    must be a small fraction of the NGR rating to provide adequate sensitivity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Voltage & Frequency                                  */}
        {/* ============================================================ */}
        {tab === 'voltage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Voltage, Frequency & Motor Protection Relays</div>

            {/* V/F Settings Table */}
            <div style={{ ...card, overflow: 'auto' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                Typical Relay Settings for Mine Substations
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Device</th>
                    <th style={tableHeader}>Function</th>
                    <th style={tableHeader}>Pickup Range</th>
                    <th style={tableHeader}>Typical</th>
                    <th style={tableHeader}>Time Delay</th>
                  </tr>
                </thead>
                <tbody>
                  {vfRelaySettings.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{row.device}</td>
                      <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.function}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.pickupRange}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{row.typicalSetting}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.timeDelay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mining application details per device */}
            <div style={sectionHeading}>Mining Applications</div>
            {vfRelaySettings.map((row, i) => (
              <div key={i} style={{ ...card, borderLeft: '4px solid #60a5fa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ ...badge, fontSize: 13, fontWeight: 800 }}>{row.device}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{row.function}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {row.miningApplication}
                </div>
              </div>
            ))}

            {/* Voltage Unbalance Effects on Motors */}
            <div style={sectionHeading}>Voltage Unbalance Effects on Motors</div>
            <div style={{ ...warningCard, borderLeft: '4px solid #fbbf24' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                Why Voltage Unbalance Matters in Open Pit Mining
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                Voltage unbalance creates negative-sequence current that rotates opposite to the rotor, producing
                excessive heating in the rotor and stator. A small voltage unbalance causes a much larger current
                unbalance. Open pit mines are especially vulnerable due to long trailing cables, single-phase loads
                on the distribution system, and connector damage on mobile equipment.
              </div>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>V Unbalance</th>
                      <th style={tableHeader}>I Unbalance</th>
                      <th style={tableHeader}>Temp Rise</th>
                      <th style={tableHeader}>Derate</th>
                      <th style={tableHeader}>Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unbalanceEffects.map((row, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 700, color: parseFloat(row.voltageUnbalance) >= 4 ? '#ff3c3c' : parseFloat(row.voltageUnbalance) >= 3 ? '#ff8c00' : 'var(--text)' }}>{row.voltageUnbalance}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.currentUnbalance}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{row.temperatureRise}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{row.deratingFactor}</td>
                        <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{row.effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ ...smallNote, marginTop: 10 }}>
                % Voltage Unbalance = (Max deviation from average / Average voltage) x 100.
                The 46 (negative sequence) relay detects this condition. Set pickup at 0.10-0.20 pu with 5-10s time delay.
                NEMA MG-1 recommends derating motors when voltage unbalance exceeds 1%.
              </div>
            </div>

            {/* Motor Thermal Protection */}
            <div style={sectionHeading}>49 &mdash; Motor Thermal Model Protection</div>
            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                Modern microprocessor relays use a thermal model to simulate motor temperature. The model tracks
                cumulative I{'\²'}t heating and cooling over time, providing a more accurate representation of motor
                thermal state than simple overload relays. This is critical for cyclic loads common in mining.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Thermal Capacity Used (TCU)</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Relay displays TCU as a percentage (0-100%). Trip occurs at 100%.
                    Alarm typically set at 80-90%. Allows operator to reduce load before trip.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Hot/Cold Stall Time</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Locked-rotor thermal limit from motor manufacturer data. Hot stall time is shorter
                    (motor already at operating temperature). Cold stall time is longer.
                    Relay must be set to trip before the hot stall time is exceeded.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Mining Application</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Shovel hoist and swing motors experience severe cyclic loading.
                    The thermal model tracks heating across multiple dig cycles.
                    Set the thermal model to the motor service factor.
                    For motors with RTDs, use direct temperature measurement as backup to the model.
                  </div>
                </div>
              </div>
            </div>

            {/* UV/OF ride-through */}
            <div style={sectionHeading}>Voltage Ride-Through for Mining</div>
            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
                Open pit mine loads cause significant voltage dips when large shovels or draglines cycle.
                UV relay settings must be coordinated to avoid nuisance tripping during these normal transient dips
                while still protecting against sustained undervoltage conditions.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={resultBox}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Momentary Dip (0.5-2 cycles):</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> UV relay time delay rides through. No trip.</span>
                </div>
                <div style={resultBox}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Short Duration (2-30 cycles):</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> UV alarm at 0.95 pu / 5s delay alerts operator.</span>
                </div>
                <div style={resultBox}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ff8c00' }}>Sustained (&gt;30 cycles):</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> UV trip at 0.90 pu / 0.5-3.0s protects motors from overheating.</span>
                </div>
                <div style={resultBox}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ff3c3c' }}>Severe (&lt;0.80 pu):</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> Instantaneous UV trip. Motors may stall. Rapid clearing prevents damage.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Troubleshooting                                      */}
        {/* ============================================================ */}
        {tab === 'troubleshoot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Relay Troubleshooting & Testing</div>

            {/* Category filter */}
            <div style={{ ...pillRow, gap: 6 }}>
              {([
                { key: 'all' as const, label: 'All Issues' },
                { key: 'nuisance' as const, label: 'Nuisance Trip' },
                { key: 'failure' as const, label: 'Failure to Trip' },
                { key: 'settings' as const, label: 'Settings' },
                { key: 'communication' as const, label: 'Comms' },
                { key: 'testing' as const, label: 'Testing' },
              ]).map(f => (
                <button
                  key={f.key}
                  style={tsFilter === f.key
                    ? { ...pillActive, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18 }
                    : { ...pillBase, minHeight: 36, fontSize: 12, padding: '0 12px', borderRadius: 18 }
                  }
                  onClick={() => setTsFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Troubleshooting issues */}
            {filteredTsIssues.map((issue, idx) => (
              <div key={idx} style={{
                ...card,
                borderLeft: `4px solid ${
                  issue.category === 'nuisance' ? '#ffd700' :
                  issue.category === 'failure' ? '#ff3c3c' :
                  issue.category === 'settings' ? '#ff8c00' :
                  issue.category === 'communication' ? '#60a5fa' :
                  '#a78bfa'
                }`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    ...badge,
                    color: issue.category === 'nuisance' ? '#ffd700' :
                           issue.category === 'failure' ? '#ff3c3c' :
                           issue.category === 'settings' ? '#ff8c00' :
                           issue.category === 'communication' ? '#60a5fa' : '#a78bfa',
                    background: `${
                      issue.category === 'nuisance' ? '#ffd700' :
                      issue.category === 'failure' ? '#ff3c3c' :
                      issue.category === 'settings' ? '#ff8c00' :
                      issue.category === 'communication' ? '#60a5fa' : '#a78bfa'
                    }15`,
                    textTransform: 'uppercase',
                  }}>
                    {issue.category}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{issue.issue}</div>
                </div>

                {/* Symptoms */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                    Symptoms
                  </div>
                  {issue.symptoms.map((s, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: 10, borderLeft: '2px solid var(--divider)', marginBottom: 2 }}>
                      {s}
                    </div>
                  ))}
                </div>

                {/* Possible Causes */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ff8c00', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>
                    Possible Causes
                  </div>
                  {issue.possibleCauses.map((c, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: 10, borderLeft: '2px solid #ff8c0040', marginBottom: 2 }}>
                      {c}
                    </div>
                  ))}
                </div>

                {/* Diagnostic Steps */}
                <div style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 }}>
                    Diagnostic Steps
                  </div>
                  {issue.diagnosticSteps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--primary)', minWidth: 18, textAlign: 'right' }}>
                        {i + 1}.
                      </span>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Event Record Reading */}
            <div style={sectionHeading}>Reading Relay Event Records (SOE)</div>
            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                Sequence of Events (SOE) records are the most valuable troubleshooting tool in a relay.
                They capture time-stamped data before, during, and after a fault or trip event.
                Always download the event record before resetting a relay after a trip.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Pre-Fault Data</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Load current, voltage, frequency before the event. Helps identify if conditions were abnormal before the fault.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Fault Data</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Peak fault current (which phases), fault voltage (depressed or zero), fault duration, and which elements operated.
                    Phase angle data can indicate fault type (line-to-ground, line-to-line, three-phase).
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Post-Fault Data</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Breaker opening confirmation, reclosing attempts (if enabled), and system recovery.
                    Trip time from fault inception to breaker open. Compare to expected relay operating time.
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Trip Counter</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Track the number of trip operations. High trip count may indicate a persistent problem.
                    Compare trip counter to maintenance records. Reset trip counter only after maintenance review.
                  </div>
                </div>
              </div>
            </div>

            {/* Relay Test Sets */}
            <div style={sectionHeading}>Relay Test Sets</div>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                Common Test Equipment in Mining
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Doble F6150', use: 'Full-featured relay test set. 3-phase current and voltage, advanced timing. Industry standard for commissioning.', tip: 'Use Doble ProTest or Protection Suite software for automated test plans.' },
                  { name: 'Omicron CMC 356', use: 'Universal relay test set with 6 current + 4 voltage outputs. Excellent for differential and distance relay testing.', tip: 'Omicron Test Universe software has pre-built test modules for common relay models.' },
                  { name: 'Megger SMRT / FREJA', use: 'Portable relay test set. Good for field testing of overcurrent and voltage relays. Lighter weight for mine site work.', tip: 'AVTS software available for automated testing. Good for routine maintenance tests.' },
                  { name: 'Manta MTS-5100', use: 'Cost-effective 3-phase test set. Suitable for basic overcurrent and voltage relay testing.', tip: 'Built-in test routines for common relay types. Easy to use for routine testing.' },
                ].map((ts, i) => (
                  <div key={i} style={resultBox}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>{ts.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{ts.use}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Tip: {ts.tip}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relay Brands */}
            <div style={sectionHeading}>Common Relay Brands in Mining</div>
            {relayBrands.map((brand, i) => (
              <div key={i} style={card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                  {brand.brand}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>
                  {brand.series}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <div style={resultBox}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Common Models</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{brand.commonModels}</div>
                  </div>
                  <div style={resultBox}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Protocols</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{brand.protocol}</div>
                  </div>
                </div>
                <div style={resultBox}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Software</div>
                  <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 4 }}>{brand.software}</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--primary)' }}>Mining:</strong> {brand.miningNotes}
                </div>
              </div>
            ))}

            {/* LED Meanings */}
            <div style={sectionHeading}>Relay LED Indicator Meanings</div>
            <div style={card}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                Relay front-panel LEDs provide at-a-glance status. While exact labeling varies by manufacturer,
                these are the most common indicators found on protective relays in mine installations.
              </div>
              {ledMeanings.map((led, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: i < ledMeanings.length - 1 ? '1px solid var(--divider)' : 'none',
                }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: led.color,
                    boxShadow: `0 0 8px ${led.color}60`,
                    flexShrink: 0,
                    marginTop: 2,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{led.led}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{led.meaning}</div>
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Action: {led.action}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Communication troubleshooting */}
            <div style={sectionHeading}>Communication Protocols Quick Reference</div>
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  {
                    protocol: 'Modbus RTU',
                    layer: 'RS-485 Serial',
                    speed: '9600-19200 baud typical',
                    notes: 'Most common legacy protocol. Simple master/slave. Check termination, baud, parity, address. Max 32 devices per bus segment.',
                  },
                  {
                    protocol: 'Modbus TCP',
                    layer: 'Ethernet TCP/IP',
                    speed: '10/100 Mbps',
                    notes: 'Modbus over Ethernet. Each relay gets IP address. Simpler wiring than serial. Check IP, subnet mask, gateway.',
                  },
                  {
                    protocol: 'DNP3 Serial',
                    layer: 'RS-232/RS-485',
                    speed: '9600-19200 baud',
                    notes: 'More robust than Modbus. Supports time-stamped events, unsolicited reporting. Used by utilities and larger mine SCADA systems.',
                  },
                  {
                    protocol: 'DNP3 TCP/IP',
                    layer: 'Ethernet TCP/IP',
                    speed: '10/100 Mbps',
                    notes: 'DNP3 over Ethernet. Check IP address, port (typically 20000), source/destination addresses.',
                  },
                  {
                    protocol: 'IEC 61850',
                    layer: 'Ethernet',
                    speed: '100 Mbps+',
                    notes: 'Modern substation standard. GOOSE messaging for fast relay-to-relay communication. Requires IEC 61850 configuration tool. Less common in older mine installations.',
                  },
                ].map((p, i) => (
                  <div key={i} style={resultBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{p.protocol}</span>
                      <span style={{ ...badge, fontSize: 10 }}>{p.layer}</span>
                      <span style={{ ...badge, fontSize: 10 }}>{p.speed}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mining maintenance reminders */}
            <div style={sectionHeading}>Relay Maintenance Reminders</div>
            <div style={{ ...warningCard, borderLeft: '4px solid #ff8c00' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Test relays per the approved maintenance schedule. Ground fault relays must be tested regularly \— do not skip.',
                  'Download and archive relay event records after every trip event. These are essential for root cause analysis.',
                  'Keep relay settings records on-site, current, and accessible. O.Reg 854 requires this documentation.',
                  'When mine power system changes (new transformer, additional load, new feeder), update the coordination study and relay settings.',
                  'Verify trip circuit integrity periodically. A relay with a failed trip coil will not protect anything.',
                  'After firmware updates, verify all settings are correct. Some updates may reset or change setting formats.',
                  'Arc flash incident energy is directly related to relay clearing time. Faster relays = lower arc flash energy = safer work.',
                  'Train all electrical personnel on relay front-panel indication, event record retrieval, and basic troubleshooting.',
                ].map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#ff8c00', minWidth: 18, textAlign: 'right' }}>
                      {i + 1}.
                    </span>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
