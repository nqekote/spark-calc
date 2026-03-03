import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ------------------------------------------------------------------ */
/*  Power Quality & Harmonics Reference                                */
/*  For Ontario Electrical / Mining Apprentices                        */
/* ------------------------------------------------------------------ */

type TabKey =
  | 'basics'
  | 'voltage'
  | 'harmonics'
  | 'calculator'
  | 'solutions'
  | 'powerfactor'
  | 'measuring'
  | 'mining'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'basics', label: 'PQ Basics' },
  { key: 'voltage', label: 'Voltage' },
  { key: 'harmonics', label: 'Harmonics' },
  { key: 'calculator', label: 'Calculator' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'powerfactor', label: 'Power Factor' },
  { key: 'measuring', label: 'Measuring' },
  { key: 'mining', label: 'Mining PQ' },
]

/* ================================================================== */
/*  TAB 1: POWER QUALITY BASICS DATA                                   */
/* ================================================================== */

interface PQStakeholder {
  who: string
  concern: string
  examples: string[]
  color: string
}

const stakeholders: PQStakeholder[] = [
  {
    who: 'Utilities (Hydro One, Local Distribution)',
    concern: 'Delivering clean, reliable power that meets CSA and IEEE standards. Harmonic current from customers distorts voltage for everyone on the feeder.',
    examples: [
      'Voltage regulation within +/- 5% of nominal',
      'Frequency stability at 60Hz +/- 0.5Hz',
      'Harmonic voltage distortion below IEEE 519 limits',
      'Reliable service with minimal interruptions',
    ],
    color: '#3b82f6',
  },
  {
    who: 'Facility Owners / Mine Operators',
    concern: 'Maximizing uptime, reducing equipment failures, controlling energy costs, and meeting utility power quality requirements at the point of common coupling.',
    examples: [
      'Transformer overheating from harmonic loading',
      'Nuisance breaker/relay trips from distorted waveforms',
      'Capacitor bank failures from harmonic resonance',
      'Penalty charges from poor power factor',
      'Production losses from voltage sags and interruptions',
    ],
    color: '#22c55e',
  },
  {
    who: 'Equipment Manufacturers',
    concern: 'Designing equipment that operates correctly within expected power quality levels and does not inject excessive harmonics back into the system.',
    examples: [
      'VFD input harmonic specifications (IEEE 519 compliance)',
      'Equipment voltage tolerance ranges (CBEMA/ITIC curve)',
      'EMC compliance for electromagnetic interference',
      'Motor insulation rated for VFD waveforms (inverter-duty)',
    ],
    color: '#8b5cf6',
  },
  {
    who: 'Electricians & Maintenance',
    concern: 'Understanding PQ issues to troubleshoot equipment failures, install mitigation equipment, and maintain power quality monitoring systems.',
    examples: [
      'Diagnosing unexplained equipment trips and failures',
      'Installing harmonic filters and line reactors',
      'Interpreting PQ analyzer data and reports',
      'Properly grounding and bonding for PQ',
    ],
    color: '#f59e0b',
  },
]

interface PQCostItem {
  category: string
  description: string
  typicalCost: string
}

const poorPQCosts: PQCostItem[] = [
  { category: 'Production Downtime', description: 'Equipment trips, process restarts, lost product', typicalCost: '$5,000 - $500,000+ per event' },
  { category: 'Equipment Damage', description: 'Premature transformer, motor, capacitor failures', typicalCost: '$2,000 - $100,000+ per failure' },
  { category: 'Energy Waste', description: 'Harmonic losses in conductors and transformers', typicalCost: '2-10% of energy bill ongoing' },
  { category: 'Utility Penalties', description: 'Power factor penalties, demand charges from distortion', typicalCost: '$500 - $10,000+ per month' },
  { category: 'Shortened Equipment Life', description: 'Capacitors, motors, electronics fail before expected lifespan', typicalCost: '20-50% reduction in service life' },
  { category: 'Data/Process Corruption', description: 'PLC errors, communication failures, false sensor readings', typicalCost: 'Variable, can cause safety incidents' },
]

/* ================================================================== */
/*  TAB 2: VOLTAGE ISSUES DATA                                         */
/* ================================================================== */

interface VoltageIssue {
  name: string
  ieee1159: string
  duration: string
  magnitude: string
  causes: string[]
  effects: string[]
  description: string
  color: string
}

const voltageIssues: VoltageIssue[] = [
  {
    name: 'Voltage Sag (Dip)',
    ieee1159: 'Sag / Dip',
    duration: '0.5 cycles to 1 minute',
    magnitude: '10% to 90% of nominal (0.1 to 0.9 pu)',
    description: 'A short-duration decrease in RMS voltage. The most common PQ disturbance and the #1 cause of equipment malfunction. Caused by faults on the utility system or large motor starts nearby.',
    causes: [
      'Utility-side faults (tree contact, lightning, animal contact)',
      'Large motor starting (inrush current causes voltage drop)',
      'Transformer energizing (inrush current)',
      'Arc furnace or welder operation',
      'Switching of large loads on same feeder',
    ],
    effects: [
      'VFD DC bus undervoltage trips',
      'PLC and control system dropouts',
      'Motor contactors dropping out (coil voltage too low)',
      'Lighting flicker visible to operators',
      'Process equipment errors and production loss',
    ],
    color: '#3b82f6',
  },
  {
    name: 'Voltage Swell',
    ieee1159: 'Swell',
    duration: '0.5 cycles to 1 minute',
    magnitude: '110% to 180% of nominal (1.1 to 1.8 pu)',
    description: 'A short-duration increase in RMS voltage. Less common than sags. Usually caused by single line-to-ground faults on ungrounded systems (unfaulted phases swell to line voltage) or sudden large load rejection.',
    causes: [
      'Single line-to-ground fault on ungrounded/HRG system',
      'Sudden large load rejection (motor trip, VFD trip)',
      'Capacitor bank energizing',
      'Utility voltage regulator malfunction',
      'Incorrect transformer tap setting',
    ],
    effects: [
      'Overvoltage damage to sensitive electronics',
      'VFD DC bus overvoltage trip',
      'LED driver and power supply failures',
      'Insulation stress on motors and cables',
      'Capacitor overvoltage and potential failure',
    ],
    color: '#22c55e',
  },
  {
    name: 'Transient (Impulse)',
    ieee1159: 'Impulsive Transient',
    duration: 'Nanoseconds to milliseconds',
    magnitude: 'Up to 6000V on 120V system',
    description: 'Very fast, short-duration voltage spike. Lightning is the classic cause, but switching transients from capacitor banks and transformer energizing are more common in practice. Can cause immediate equipment damage or cumulative insulation degradation.',
    causes: [
      'Lightning strikes (direct or induced)',
      'Capacitor bank switching',
      'Utility breaker operations',
      'VFD/SCR switching transients',
      'Arc welder and arc furnace ignition',
      'Contactor opening/closing on inductive loads',
    ],
    effects: [
      'Semiconductor and circuit board damage',
      'Insulation puncture in motors and transformers',
      'Data corruption in PLCs and computers',
      'Surge protector degradation',
      'Bearing pitting in motors (shaft voltage discharge)',
    ],
    color: '#ef4444',
  },
  {
    name: 'Oscillatory Transient',
    ieee1159: 'Oscillatory Transient',
    duration: 'Milliseconds to several cycles',
    magnitude: 'Up to 2x nominal, oscillating',
    description: 'A sudden, non-power-frequency change in voltage that includes both positive and negative values. Typically decaying oscillation caused by capacitor switching or transformer energizing. More common than impulse transients in industrial settings.',
    causes: [
      'Capacitor bank switching (most common industrial cause)',
      'Transformer energizing (magnetizing inrush)',
      'Cable switching and back-feed conditions',
      'Power electronic device switching',
      'Utility fault clearing',
    ],
    effects: [
      'Nuisance trips of VFDs and adjustable speed drives',
      'Capacitor fuse blowing or capacitor failure',
      'PLC analog input errors',
      'Power supply stress in control equipment',
      'Insulation degradation over time',
    ],
    color: '#f59e0b',
  },
  {
    name: 'Interruption',
    ieee1159: 'Momentary / Temporary / Sustained',
    duration: 'Momentary: 0.5 cycles to 3s | Temporary: 3s to 1min | Sustained: > 1min',
    magnitude: '< 10% of nominal (essentially zero voltage)',
    description: 'Complete loss of supply voltage. The most severe PQ event. Momentary interruptions are caused by protective device operation (auto-reclosing breakers). Sustained interruptions require manual or time-delayed restoration.',
    causes: [
      'Utility breaker operation (fault clearing + auto-reclose)',
      'Fuse blowing on distribution feeders',
      'Equipment failure (transformer, switch, cable)',
      'Severe weather (ice storms, wind, lightning)',
      'Planned maintenance outages',
    ],
    effects: [
      'Complete production shutdown',
      'Loss of all unprotected electronic systems',
      'Motor re-acceleration inrush on restoration',
      'PLC program loss if no battery backup',
      'Safety system activation (emergency lighting, UPS)',
    ],
    color: '#ff3c3c',
  },
  {
    name: 'Voltage Flicker',
    ieee1159: 'Voltage Fluctuation',
    duration: 'Intermittent, ongoing',
    magnitude: '0.1% to 7% of nominal, repetitive',
    description: 'Repetitive or random voltage variations that cause visible lighting flicker. The human eye is most sensitive to flicker at 8-10Hz. Arc furnaces, reciprocating compressors, and rock crushers are common industrial sources. Measured as Pst (short-term) and Plt (long-term) flicker severity.',
    causes: [
      'Arc furnaces (random, high-magnitude fluctuations)',
      'Reciprocating compressors and pumps',
      'Rock crushers and jaw crushers in mining',
      'Large motor starts (repetitive cycling)',
      'Welding equipment (spot welders, arc welders)',
    ],
    effects: [
      'Visible lighting flicker (annoyance, headaches)',
      'Optical sensor errors in automated processes',
      'Motor speed variations on sensitive loads',
      'Worker fatigue and discomfort',
      'Utility complaints from neighboring customers',
    ],
    color: '#8b5cf6',
  },
  {
    name: 'Voltage Unbalance',
    ieee1159: 'Voltage Imbalance',
    duration: 'Steady state (continuous)',
    magnitude: 'Typically 0.5% to 5%',
    description: 'Unequal voltage magnitudes or phase angle displacement between the three phases. Causes negative-sequence current in motors which produces torque opposing rotation and generates excessive heat. A 3.5% voltage unbalance can cause 25% current unbalance in motors. NEMA MG-1 limits: derate motors above 1% voltage unbalance.',
    causes: [
      'Unequal single-phase loading across three phases',
      'Blown fuse on a three-phase capacitor bank (single-phasing)',
      'Open delta transformer connections',
      'Unequal conductor impedances (different cable lengths)',
      'Utility supply inherent unbalance',
    ],
    effects: [
      'Motor overheating (derate 2% per 1% unbalance)',
      'Increased I2R losses (25% current unbalance from 3.5% voltage unbalance)',
      'VFD input rectifier imbalance and DC bus ripple',
      'Negative-sequence torque reduces motor output',
      'Shortened bearing life from vibration',
    ],
    color: '#ff8c00',
  },
]

/* ================================================================== */
/*  TAB 3: HARMONICS DATA                                              */
/* ================================================================== */

interface HarmonicOrder {
  order: number
  frequency: string
  sequence: string
  commonSource: string
  typicalMagnitude: string
  color: string
}

const harmonicSpectrum: HarmonicOrder[] = [
  { order: 1, frequency: '60 Hz', sequence: 'Positive (+)', commonSource: 'Fundamental (desired)', typicalMagnitude: '100%', color: '#22c55e' },
  { order: 3, frequency: '180 Hz', sequence: 'Zero (0)', commonSource: 'Switch-mode power supplies, LED drivers, single-phase rectifiers', typicalMagnitude: '15-80%', color: '#ef4444' },
  { order: 5, frequency: '300 Hz', sequence: 'Negative (-)', commonSource: '6-pulse VFDs, 3-phase rectifiers, UPS systems', typicalMagnitude: '20-40%', color: '#f59e0b' },
  { order: 7, frequency: '420 Hz', sequence: 'Positive (+)', commonSource: '6-pulse VFDs, 3-phase rectifiers', typicalMagnitude: '10-20%', color: '#3b82f6' },
  { order: 9, frequency: '540 Hz', sequence: 'Zero (0)', commonSource: 'Triplen harmonic (adds in neutral)', typicalMagnitude: '5-15%', color: '#ef4444' },
  { order: 11, frequency: '660 Hz', sequence: 'Negative (-)', commonSource: '12-pulse VFDs, large rectifiers', typicalMagnitude: '5-10%', color: '#8b5cf6' },
  { order: 13, frequency: '780 Hz', sequence: 'Positive (+)', commonSource: '12-pulse VFDs, large rectifiers', typicalMagnitude: '3-8%', color: '#8b5cf6' },
]

interface HarmonicSource {
  source: string
  harmonicsProduced: string
  typicalTHD: string
  notes: string
}

const harmonicSources: HarmonicSource[] = [
  { source: '6-Pulse VFD (no filter)', harmonicsProduced: '5th, 7th, 11th, 13th', typicalTHD: '30-80% current THD', notes: 'Most common industrial harmonic source. Characteristic harmonics follow h = 6n +/- 1 formula.' },
  { source: '12-Pulse VFD', harmonicsProduced: '11th, 13th, 23rd, 25th', typicalTHD: '8-15% current THD', notes: 'Phase-shifting transformer cancels 5th and 7th. More expensive but much lower THD.' },
  { source: '18-Pulse VFD', harmonicsProduced: '17th, 19th, 35th, 37th', typicalTHD: '3-6% current THD', notes: 'Uses three 6-pulse rectifiers with phase-shifting. Very low harmonics, common for large drives.' },
  { source: 'Active Front End (AFE) VFD', harmonicsProduced: 'Minimal', typicalTHD: '<5% current THD', notes: 'IGBT-based rectifier controls input current waveshape. Can provide unity or leading power factor.' },
  { source: 'Single-Phase Rectifier (PC, LED)', harmonicsProduced: '3rd, 5th, 7th, 9th', typicalTHD: '80-130% current THD', notes: 'High per-unit THD but low absolute current. Large quantity becomes significant.' },
  { source: 'Switch-Mode Power Supplies', harmonicsProduced: '3rd dominant, plus 5th-13th', typicalTHD: '60-100% current THD', notes: 'Found in every electronic device. 3rd harmonic dominant issue.' },
  { source: 'Arc Furnace', harmonicsProduced: 'All orders (including even)', typicalTHD: '25-50% current THD', notes: 'Random, non-characteristic harmonics including inter-harmonics. Most difficult to filter.' },
  { source: 'Magnetic Ballast Fluorescent', harmonicsProduced: '3rd, 5th', typicalTHD: '15-25% current THD', notes: 'Being replaced by LED but still in many facilities.' },
  { source: 'Battery Charger (SCR)', harmonicsProduced: '5th, 7th, 11th', typicalTHD: '25-40% current THD', notes: 'Common in mining for underground vehicle charging.' },
]

interface HarmonicEffect {
  component: string
  effect: string
  details: string
  severity: 'high' | 'medium' | 'low'
}

const harmonicEffects: HarmonicEffect[] = [
  {
    component: 'Transformers',
    effect: 'Overheating & Derating',
    details: 'Harmonic currents cause additional eddy current and hysteresis losses in the core and windings. A transformer loaded to 100% with 30% THD will overheat significantly. The K-factor quantifies additional heating: K-1 rated transformer handles only sinusoidal loads. K-4, K-13, K-20 transformers are designed for increasing harmonic content.',
    severity: 'high',
  },
  {
    component: 'Neutral Conductor',
    effect: 'Overloading (Triplen Harmonics)',
    details: 'In a balanced 3-phase, 4-wire system, fundamental currents cancel in the neutral. However, triplen harmonics (3rd, 9th, 15th...) are zero-sequence and ADD arithmetically in the neutral. With high 3rd harmonic loads (LED lighting, computers), neutral current can exceed phase current by 1.5 to 1.73 times. The neutral has no overcurrent protection! Size neutral at 200% of phase conductor for non-linear loads.',
    severity: 'high',
  },
  {
    component: 'Capacitor Banks',
    effect: 'Resonance & Failure',
    details: 'Capacitor impedance decreases with frequency (Xc = 1/2*pi*f*C). At certain harmonic frequencies, the capacitor and system inductance form a resonant circuit. Resonance amplifies harmonic currents through the capacitor by 5-20x, causing severe overheating, dielectric failure, or explosion. Always check resonant frequency before installing PF correction capacitors: fr = fsystem * sqrt(MVAsc / MVArcap).',
    severity: 'high',
  },
  {
    component: 'Motors',
    effect: 'Overheating & Torque Pulsation',
    details: 'Negative-sequence harmonics (5th, 11th) produce a magnetic field rotating opposite to the rotor, creating braking torque and heat. Positive-sequence harmonics (7th, 13th) create forward-rotating fields at non-fundamental speed, also causing heating. Net effect: 3-10% additional heating for typical harmonic levels. Motors on VFDs experience additional heating from PWM carrier frequency harmonics.',
    severity: 'medium',
  },
  {
    component: 'Circuit Breakers',
    effect: 'Nuisance Tripping / Failure to Trip',
    details: 'Thermal-magnetic breakers respond to RMS current (true RMS includes harmonics). Breaker may trip at lower-than-expected load because RMS current with harmonics is higher than fundamental-only measurement. Conversely, peak-sensing electronic trip units may mis-measure distorted waveforms. Use true-RMS sensing trip units in harmonic-rich environments.',
    severity: 'medium',
  },
  {
    component: 'Sensitive Electronics',
    effect: 'Malfunction & Data Errors',
    details: 'PLCs, DCS systems, computers, and communication equipment can experience data corruption, false readings, and lockups from distorted supply voltage. Zero-crossing detection circuits malfunction with flat-topped or notched voltage waveforms. Analog inputs produce incorrect readings.',
    severity: 'medium',
  },
  {
    component: 'Conductors',
    effect: 'Additional Heating (Skin Effect)',
    details: 'At higher frequencies, current flows more on the conductor surface (skin effect), increasing effective resistance. A #4/0 conductor has 1.0 AC/DC ratio at 60Hz but approximately 1.15 at 300Hz (5th harmonic). This increases I2R losses by 15% for the 5th harmonic component. Proximity effect between parallel conductors also worsens at harmonic frequencies.',
    severity: 'low',
  },
  {
    component: 'Metering',
    effect: 'Inaccurate Readings',
    details: 'Average-responding meters (older analog and some cheap digital meters) read 10-40% low on distorted waveforms. Only true-RMS meters give accurate current readings when harmonics are present. Revenue meters must be rated for harmonic environments to avoid billing errors.',
    severity: 'medium',
  },
]

/* ================================================================== */
/*  TAB 5: SOLUTIONS DATA                                              */
/* ================================================================== */

interface SolutionItem {
  name: string
  type: string
  howItWorks: string
  bestFor: string
  limitations: string
  typicalCost: string
  color: string
}

const solutions: SolutionItem[] = [
  {
    name: 'Line Reactor (3-5% Impedance)',
    type: 'Passive',
    howItWorks: 'A series inductor placed on the VFD input. Adds impedance that limits the rate of current change (di/dt), reducing harmonic current peaks. Typically reduces THD from 80% to 35-45% on a 6-pulse VFD. Also provides some protection against voltage transients.',
    bestFor: 'Basic harmonic reduction on individual VFDs. First line of defense. Should be standard on all VFD installations.',
    limitations: 'Cannot achieve IEEE 519 compliance alone on large VFDs. Adds 2-3% voltage drop at fundamental frequency. Takes up panel space.',
    typicalCost: '$200 - $2,000 depending on amperage',
    color: '#3b82f6',
  },
  {
    name: 'Passive Harmonic Filter (Tuned LC)',
    type: 'Passive',
    howItWorks: 'A series inductor and shunt capacitor tuned to a specific harmonic frequency (typically 4.7th for 5th harmonic absorption). Provides a low-impedance path for the target harmonic, diverting it from the system. Often combined with high-pass filters for higher harmonics.',
    bestFor: 'Reducing specific dominant harmonics on individual large drives or at the PCC (point of common coupling). Can reduce THD to 8-12%.',
    limitations: 'Tuned to specific frequency; less effective on other harmonics. Can create resonance at other frequencies. Must be designed with system impedance data. Detuning over time as capacitors age.',
    typicalCost: '$5,000 - $50,000 depending on system size',
    color: '#22c55e',
  },
  {
    name: 'Active Harmonic Filter (AHF)',
    type: 'Active',
    howItWorks: 'Power electronics device that measures harmonic current in real-time and injects equal-and-opposite harmonic current to cancel it. Uses IGBTs and DSP control to dynamically compensate for changing harmonic loads. Can correct multiple harmonic orders simultaneously.',
    bestFor: 'Dynamic, varying harmonic loads. Multiple harmonic sources. When passive filters cannot achieve required THD. Can also provide reactive power compensation.',
    limitations: 'Higher cost than passive filters. Requires proper commissioning. Has a maximum compensation capacity (kA rating). EMI considerations. Reliability of active electronics vs passive components.',
    typicalCost: '$15,000 - $150,000 depending on rating',
    color: '#8b5cf6',
  },
  {
    name: 'K-Rated Transformer',
    type: 'Equipment Rating',
    howItWorks: 'Transformer designed to handle additional heating from harmonic currents without exceeding temperature limits. Uses lower-loss core material, increased conductor size, improved cooling, and transposed windings. K-factor rating indicates harmonic handling: K-1 (sinusoidal only), K-4 (moderate harmonics), K-13 (heavy harmonics like VFDs), K-20 (severe harmonics like SCR drives).',
    bestFor: 'New installations with known non-linear loads. Dedicated transformers for VFD loads, data centers, or lighting panels with LED/electronic loads.',
    limitations: 'Does not reduce harmonics on the system. Only protects the transformer itself from harmonic heating. More expensive than standard transformers. Still need to address downstream harmonic effects.',
    typicalCost: '20-50% more than standard transformer of same kVA',
    color: '#f59e0b',
  },
  {
    name: 'Isolation Transformer',
    type: 'Passive',
    howItWorks: 'Provides electrical isolation between source and load. Delta-wye configuration traps triplen harmonics (3rd, 9th, 15th) in the delta winding, preventing them from propagating upstream. Also provides a new neutral-ground bond for downstream sensitive equipment.',
    bestFor: 'Isolating sensitive equipment from upstream harmonic distortion. Blocking triplen harmonics from propagating to the utility. Creating a clean neutral-ground reference for IT equipment.',
    limitations: 'Only blocks zero-sequence (triplen) harmonics. Does not reduce 5th, 7th, etc. Adds losses (2-4% efficiency penalty). Takes floor space and adds cost. Does not help with voltage sags.',
    typicalCost: '$3,000 - $30,000 depending on kVA',
    color: '#ff8c00',
  },
  {
    name: 'Multi-Pulse Drive (12/18/24-Pulse)',
    type: 'Drive Design',
    howItWorks: '12-pulse: Two 6-pulse rectifiers fed by a phase-shifting transformer (30 degree shift). The 5th and 7th harmonics from each rectifier are 180 degrees out of phase and cancel. 18-pulse: Three 6-pulse rectifiers with 20 degree phase shifts, cancelling 5th, 7th, 11th, 13th. Each additional pulse count eliminates more harmonic orders.',
    bestFor: 'Large VFDs (>100HP) where harmonic reduction must be built into the drive. New installations where you can specify the drive type.',
    limitations: 'Requires special multi-winding transformer (expensive, large). Harmonic cancellation is perfect only at rated load; less effective at partial load. Higher initial cost.',
    typicalCost: '30-60% more than standard 6-pulse VFD',
    color: '#00cc66',
  },
  {
    name: 'Proper Grounding & Bonding',
    type: 'Installation Practice',
    howItWorks: 'A good grounding system provides a low-impedance return path for harmonic currents, reducing voltage distortion. 360-degree shield termination on VFD cables contains high-frequency harmonic EMI. Proper bonding prevents circulating ground currents. Dedicated neutral and ground conductors prevent neutral-to-ground voltage issues.',
    bestFor: 'Every installation. The foundation of power quality. Poor grounding makes every PQ issue worse.',
    limitations: 'Does not eliminate harmonic currents, just manages their path. Cannot fix fundamental design problems (undersized systems, missing filters).',
    typicalCost: 'Included in proper installation practice',
    color: '#22c55e',
  },
]

interface IEEE519Limit {
  sccRatio: string
  thd: string
  h_lt_11: string
  h_11_17: string
  h_17_23: string
  h_23_35: string
  h_gt_35: string
}

const ieee519CurrentLimits: IEEE519Limit[] = [
  { sccRatio: '< 20', thd: '5.0%', h_lt_11: '4.0%', h_11_17: '2.0%', h_17_23: '1.5%', h_23_35: '0.6%', h_gt_35: '0.3%' },
  { sccRatio: '20 - 50', thd: '8.0%', h_lt_11: '7.0%', h_11_17: '3.5%', h_17_23: '2.5%', h_23_35: '1.0%', h_gt_35: '0.5%' },
  { sccRatio: '50 - 100', thd: '12.0%', h_lt_11: '10.0%', h_11_17: '4.5%', h_17_23: '4.0%', h_23_35: '1.5%', h_gt_35: '0.7%' },
  { sccRatio: '100 - 1000', thd: '15.0%', h_lt_11: '12.0%', h_11_17: '5.5%', h_17_23: '5.0%', h_23_35: '2.0%', h_gt_35: '1.0%' },
  { sccRatio: '> 1000', thd: '20.0%', h_lt_11: '15.0%', h_11_17: '7.0%', h_17_23: '6.0%', h_23_35: '2.5%', h_gt_35: '1.4%' },
]

/* ================================================================== */
/*  TAB 6: POWER FACTOR DATA                                           */
/* ================================================================== */

interface PFComparison {
  parameter: string
  displacement: string
  truePF: string
}

const pfComparisons: PFComparison[] = [
  { parameter: 'Definition', displacement: 'cos(angle) between fundamental voltage and fundamental current', truePF: 'Ratio of total real power (W) to total apparent power (VA), including all harmonics' },
  { parameter: 'Formula', displacement: 'DPF = cos(phi_1)', truePF: 'TPF = P_total / S_total = DPF x Distortion PF' },
  { parameter: 'What it Measures', displacement: 'Phase shift of the 60Hz fundamental component only', truePF: 'Total efficiency of power conversion including harmonic effects' },
  { parameter: 'Affected by Harmonics?', displacement: 'No - only looks at fundamental', truePF: 'Yes - harmonic currents increase VA without adding real power' },
  { parameter: 'Typical VFD (no filter)', displacement: '0.95 - 0.98 (looks good!)', truePF: '0.70 - 0.85 (much worse than expected)' },
  { parameter: 'Measured By', displacement: 'Standard PF meter, utility meter', truePF: 'True-RMS power quality analyzer' },
  { parameter: 'Utility Billing', displacement: 'Most Ontario utilities use DPF for billing', truePF: 'Some progressive utilities measure true PF' },
  { parameter: 'Correction Method', displacement: 'Capacitor banks (traditional PF correction)', truePF: 'Harmonic filters + capacitors, or active filters' },
]

/* ================================================================== */
/*  TAB 7: MEASURING PQ DATA                                           */
/* ================================================================== */

interface MeterComparison {
  feature: string
  basicMeter: string
  pqAnalyzer: string
}

const meterComparisons: MeterComparison[] = [
  { feature: 'Voltage Measurement', basicMeter: 'True RMS voltage (good)', pqAnalyzer: 'True RMS + waveform capture + harmonics' },
  { feature: 'Current Measurement', basicMeter: 'True RMS current (good)', pqAnalyzer: 'True RMS + waveform + harmonics to 50th order' },
  { feature: 'Power Measurement', basicMeter: 'Not available', pqAnalyzer: 'W, VA, VAR, PF (displacement and true)' },
  { feature: 'Harmonic Analysis', basicMeter: 'Not available', pqAnalyzer: 'Individual harmonic magnitudes and angles to 50th order' },
  { feature: 'THD Measurement', basicMeter: 'Not available', pqAnalyzer: 'Voltage THD and Current THD' },
  { feature: 'Voltage Events', basicMeter: 'Manual spot readings only', pqAnalyzer: 'Automatic sag/swell/transient capture with timestamp' },
  { feature: 'Data Logging', basicMeter: 'Min/Max hold (some models)', pqAnalyzer: 'Continuous logging for days/weeks with trends' },
  { feature: 'Waveform Capture', basicMeter: 'Not available', pqAnalyzer: 'Oscilloscope-like waveform display and recording' },
  { feature: 'Flicker', basicMeter: 'Not available', pqAnalyzer: 'Pst and Plt per IEC 61000-4-15' },
  { feature: 'Unbalance', basicMeter: 'Measure each phase individually', pqAnalyzer: 'Automatic 3-phase unbalance calculation' },
  { feature: 'Cost', basicMeter: '$100 - $500', pqAnalyzer: '$2,000 - $15,000+' },
  { feature: 'Examples', basicMeter: 'Fluke 87V, Fluke 117', pqAnalyzer: 'Fluke 1760, Fluke 435-II, Dranetz HDPQ, Hioki PQ3198' },
]

interface PQMetric {
  metric: string
  whatItTells: string
  goodValue: string
  actionLevel: string
}

const keyMetrics: PQMetric[] = [
  { metric: 'Voltage THD', whatItTells: 'Overall voltage waveform distortion', goodValue: '< 5%', actionLevel: '> 8% — investigate sources' },
  { metric: 'Current THD', whatItTells: 'Harmonic current injection from loads', goodValue: '< 15% at PCC', actionLevel: '> 30% — filters needed' },
  { metric: 'Voltage Unbalance', whatItTells: 'Phase voltage equality', goodValue: '< 1%', actionLevel: '> 2% — check loading, fuses' },
  { metric: 'Current Unbalance', whatItTells: 'Phase current equality', goodValue: '< 10%', actionLevel: '> 20% — check wiring, loads' },
  { metric: 'True Power Factor', whatItTells: 'Real efficiency of power use', goodValue: '> 0.90', actionLevel: '< 0.85 — PF correction needed' },
  { metric: 'Voltage Sag Count', whatItTells: 'Frequency of voltage dips', goodValue: '< 10 per month', actionLevel: '> 20/month — UPS or CVT needed' },
  { metric: 'Neutral Current', whatItTells: 'Triplen harmonic loading', goodValue: '< 50% of phase current', actionLevel: '> 100% — oversize neutral' },
  { metric: 'K-Factor', whatItTells: 'Transformer harmonic heating', goodValue: 'K < 4', actionLevel: 'K > 13 — use K-rated transformer' },
  { metric: 'Crest Factor', whatItTells: 'Peak-to-RMS ratio (1.414 for sine)', goodValue: '1.3 - 1.5', actionLevel: '< 1.2 or > 2.0 — investigate' },
]

/* ================================================================== */
/*  TAB 8: MINING PQ DATA                                              */
/* ================================================================== */

interface MiningPQTopic {
  title: string
  content: string
  keyPoints: string[]
  color: string
}

const miningPQTopics: MiningPQTopic[] = [
  {
    title: 'VFD Harmonics on Mine Power Systems',
    content: 'Mining operations use large numbers of VFDs for conveyors, crushers, pumps, fans, and hoists. A typical underground mine may have 20-50 VFDs ranging from 10HP to 5000HP. The aggregate harmonic current injection can be severe, especially because mine power systems are often "weak" (limited fault current available from long distribution runs or generator supply). Weak systems mean higher voltage THD for the same current THD.',
    keyPoints: [
      'Mine systems often have ISC/IL ratio < 20, the most restrictive IEEE 519 category',
      'VFDs on long trailing cables can see reflected wave voltage spikes 2x DC bus voltage',
      'Multiple VFDs on the same bus may have harmonic diversity factor of 0.8-0.9 (don\'t simply add THDs)',
      '12-pulse or 18-pulse VFDs preferred for drives > 100HP in mining',
      'Active front end VFDs increasingly common for mine hoist and crusher applications',
      'Generator-fed mine systems are more sensitive to harmonics than utility-fed systems',
    ],
    color: '#3b82f6',
  },
  {
    title: 'Cable Capacitance Effects',
    content: 'Long cable runs in mining (trailing cables 100m-1000m+, feeder cables several km) have significant capacitance. This capacitance combined with system inductance creates resonant circuits at specific harmonic frequencies. Shielded cables (TECK90, SHD-GC) have higher capacitance than unshielded cables. When the system resonant frequency coincides with a prominent harmonic, voltage amplification can cause insulation failures and equipment damage.',
    keyPoints: [
      'TECK90 cable capacitance: approximately 50-100 nF/km depending on conductor size',
      'Trailing cable (SHD-GC) capacitance: 80-150 nF/km (higher due to compact construction)',
      'System resonant frequency = 1 / (2*pi*sqrt(L*C)) -- must not coincide with 5th, 7th harmonics',
      'Long cable capacitance can cause VFD output ground fault relay nuisance trips',
      'Cable capacitance increases motor current at no-load (capacitive charging current)',
      'dV/dt filters or sinewave filters needed for cable runs > 100m to VFD-fed motors',
    ],
    color: '#22c55e',
  },
  {
    title: 'Ground Fault Current Harmonics',
    content: 'On HRG (high-resistance grounded) mine power systems, ground fault current is limited to approximately 5A by the NGR. However, VFD common-mode currents (high-frequency components from PWM switching) flow through the grounding system and can interfere with sensitive ground fault detection. These high-frequency ground currents can cause nuisance tripping of ground fault relays or mask legitimate ground faults.',
    keyPoints: [
      'VFD common-mode current at PWM carrier frequency (2-16kHz) flows through ground system',
      'Standard zero-sequence CTs may respond to high-frequency ground currents as if they were fault current',
      'Solution: use ground fault relays with adjustable frequency filtering (50/60Hz fundamental extraction)',
      'Ensure ground fault relay bandwidth matches the fault current frequency, not VFD noise frequency',
      'Proper 360-degree cable shield termination reduces high-frequency ground current by 90%+',
      'Ontario mine regulation: ground fault must trip within 200ms at <100mA for portable equipment',
    ],
    color: '#ef4444',
  },
  {
    title: 'Generator Harmonic Compatibility',
    content: 'Many mine operations use diesel or natural gas generators for primary or backup power. Generators are more sensitive to harmonic loading than utility supply because they have higher source impedance (lower fault current) and the generator excitation system can be destabilized by harmonic voltages. Harmonic currents cause additional rotor heating and torque pulsations that can damage bearings and couplings.',
    keyPoints: [
      'Generator sub-transient reactance (Xd") is typically 10-20%, much higher than utility transformers (5-6%)',
      'Same harmonic current causes 2-4x higher voltage THD on generator than on transformer',
      'Generator AVR (automatic voltage regulator) may oscillate or become unstable with high voltage THD',
      'Size generator at 1.5-2.0x the non-linear load kVA (derate for harmonic heating)',
      'Install line reactors or active filters between generators and VFD loads',
      'Generator neutral current (triplen harmonics) heats the neutral winding -- can require oversized neutral lead',
      'Peak current from VFD rectifiers can exceed generator surge capability -- add input reactors',
    ],
    color: '#f59e0b',
  },
  {
    title: 'Voltage Notching in Mine Substations',
    content: 'SCR-based drives and thyristor-controlled rectifiers create voltage notches (brief dips in the voltage waveform during commutation). In mine substations with multiple drives operating simultaneously, these notches can be severe enough to affect other equipment on the same bus. IEEE 519 defines notch depth and area limits. Voltage notching is different from harmonic distortion and requires different measurement techniques.',
    keyPoints: [
      'Notch depth should not exceed 20% on dedicated bus, 10% on shared bus per IEEE 519',
      'Total notch area (volt-microseconds) is limited based on system voltage',
      'Common with SCR-controlled DC drives for hoists and older conveyors',
      'Line reactors between the notch source and sensitive equipment reduce notch propagation',
      'Modern VFDs (diode rectifier + IGBT inverter) produce less notching than SCR drives',
      'Measure with oscilloscope or PQ analyzer -- standard meters cannot capture notches',
    ],
    color: '#8b5cf6',
  },
  {
    title: 'Power Quality Monitoring in Mines',
    content: 'Ontario mines should implement continuous PQ monitoring at key points in the power distribution system. This enables trending, event correlation, and proactive maintenance. A PQ monitoring system captures sags, swells, transients, harmonics, and power factor continuously and reports trends over time. It helps identify degrading equipment (capacitor aging, loose connections) before failures occur.',
    keyPoints: [
      'Install permanent PQ monitors at utility service entrance (PCC), main substations, and critical load buses',
      'Minimum monitoring: voltage and current on all three phases, neutral current, ground current',
      'Log voltage THD, current THD, power factor, and unbalance continuously with 10-minute averages',
      'Set alarms for: voltage sag < 90%, swell > 110%, THD > IEEE 519 limits, unbalance > 2%',
      'Correlate PQ events with production data and equipment trip logs',
      'Review PQ data monthly as part of preventive maintenance program',
      'Common industrial PQ monitors: Dranetz HDPQ Visa, Fluke 1760, Schneider ION series, GE EPM series',
    ],
    color: '#ff8c00',
  },
]

/* ================================================================== */
/*  SHARED STYLES                                                      */
/* ================================================================== */

const pillRow: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  padding: '12px 0 4px',
}

const pillBase: React.CSSProperties = {
  flexShrink: 0,
  minHeight: 56,
  padding: '0 14px',
  borderRadius: 28,
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

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  padding: 14,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--primary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 10,
}

const warningBox: React.CSSProperties = {
  background: 'rgba(255, 59, 48, 0.1)',
  border: '1px solid rgba(255, 59, 48, 0.3)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: '#ff6b6b',
  lineHeight: 1.5,
}

const tipBox: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.08)',
  border: '1px solid rgba(255, 215, 0, 0.25)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: 'var(--primary)',
  lineHeight: 1.5,
}

const infoBox: React.CSSProperties = {
  background: 'rgba(59, 130, 246, 0.08)',
  border: '1px solid rgba(59, 130, 246, 0.25)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: 13,
  color: '#7cb3ff',
  lineHeight: 1.5,
}

const tableCell: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  borderBottom: '1px solid var(--divider)',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
}

const tableHeader: React.CSSProperties = {
  ...tableCell,
  fontWeight: 700,
  color: 'var(--primary)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  position: 'sticky' as const,
  top: 0,
  background: 'var(--surface)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 56,
  padding: '0 14px',
  background: 'var(--input-bg)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontSize: 16,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 4,
  display: 'block',
}

const resultBox: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.06)',
  border: '2px solid var(--primary)',
  borderRadius: 'var(--radius)',
  padding: 16,
}

const monoTag: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--input-bg)',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  marginRight: 6,
  marginBottom: 4,
}

/* ================================================================== */
/*  COLLAPSIBLE SECTION COMPONENT                                      */
/* ================================================================== */

function CollapsibleSection({
  title,
  defaultOpen = false,
  borderColor,
  children,
}: {
  title: string
  defaultOpen?: boolean
  borderColor?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--divider)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          minHeight: 56,
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {title}
      </button>
      {open && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  )
}

/* ================================================================== */
/*  THD / K-FACTOR CALCULATOR COMPONENT                                */
/* ================================================================== */

function HarmonicCalculator() {
  const [fundamental, setFundamental] = useState('')
  const [h3, setH3] = useState('')
  const [h5, setH5] = useState('')
  const [h7, setH7] = useState('')
  const [h9, setH9] = useState('')
  const [h11, setH11] = useState('')
  const [h13, setH13] = useState('')

  const I1 = parseFloat(fundamental) || 0
  const pct3 = parseFloat(h3) || 0
  const pct5 = parseFloat(h5) || 0
  const pct7 = parseFloat(h7) || 0
  const pct9 = parseFloat(h9) || 0
  const pct11 = parseFloat(h11) || 0
  const pct13 = parseFloat(h13) || 0

  // Convert percentages to actual currents
  const I3 = I1 * pct3 / 100
  const I5 = I1 * pct5 / 100
  const I7 = I1 * pct7 / 100
  const I9 = I1 * pct9 / 100
  const I11 = I1 * pct11 / 100
  const I13 = I1 * pct13 / 100

  // THD calculation: sqrt(sum of squares of harmonic currents) / fundamental * 100
  const harmonicSumSquares = I3 * I3 + I5 * I5 + I7 * I7 + I9 * I9 + I11 * I11 + I13 * I13
  const thd = I1 > 0 ? (Math.sqrt(harmonicSumSquares) / I1) * 100 : 0

  // True RMS current: sqrt(I1^2 + I3^2 + I5^2 + ...)
  const trueRMS = Math.sqrt(I1 * I1 + harmonicSumSquares)

  // K-Factor: sum of (Ih/I1)^2 * h^2 for all harmonics, normalized
  // K = sum(Ih_pu^2 * h^2) where Ih_pu = Ih / Irms
  const totalISquared = I1 * I1 + harmonicSumSquares
  const kFactor = totalISquared > 0
    ? (
      (I1 * I1 * 1 * 1 +
        I3 * I3 * 3 * 3 +
        I5 * I5 * 5 * 5 +
        I7 * I7 * 7 * 7 +
        I9 * I9 * 9 * 9 +
        I11 * I11 * 11 * 11 +
        I13 * I13 * 13 * 13) / totalISquared
    )
    : 0

  // Crest factor estimate (peak / RMS)
  const peakEstimate = I1 + I3 + I5 + I7 + I9 + I11 + I13
  const crestFactor = trueRMS > 0 ? peakEstimate / trueRMS : 0

  // Determine K-rating needed
  const getKRating = (k: number): string => {
    if (k <= 1) return 'K-1 (Standard transformer OK)'
    if (k <= 4) return 'K-4 (Moderate non-linear load)'
    if (k <= 9) return 'K-9 (Significant non-linear load)'
    if (k <= 13) return 'K-13 (Heavy non-linear load — VFDs, UPS)'
    if (k <= 20) return 'K-20 (Severe — SCR drives, welders)'
    return 'K-30+ (Extreme — dedicated specialty transformer)'
  }

  // THD severity
  const getTHDSeverity = (t: number): { label: string; color: string } => {
    if (t <= 5) return { label: 'Low (within IEEE 519 voltage limits)', color: '#22c55e' }
    if (t <= 15) return { label: 'Moderate (common with VFDs)', color: '#f59e0b' }
    if (t <= 30) return { label: 'High (filters recommended)', color: '#ff8c00' }
    return { label: 'Very High (filters required)', color: '#ef4444' }
  }

  const hasInput = I1 > 0
  const thdSeverity = getTHDSeverity(thd)

  const harmonicInputs: { label: string; order: number; value: string; setter: (v: string) => void; hint: string }[] = [
    { label: '3rd Harmonic (%)', order: 3, value: h3, setter: setH3, hint: 'Triplen. 15-80% for SMPS/LED' },
    { label: '5th Harmonic (%)', order: 5, value: h5, setter: setH5, hint: 'Dominant on 6-pulse VFD: 20-40%' },
    { label: '7th Harmonic (%)', order: 7, value: h7, setter: setH7, hint: '6-pulse VFD: 10-20%' },
    { label: '9th Harmonic (%)', order: 9, value: h9, setter: setH9, hint: 'Triplen. 5-15% for SMPS' },
    { label: '11th Harmonic (%)', order: 11, value: h11, setter: setH11, hint: '12-pulse residual: 5-10%' },
    { label: '13th Harmonic (%)', order: 13, value: h13, setter: setH13, hint: '12-pulse residual: 3-8%' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={tipBox}>
        <strong>THD / K-Factor Calculator</strong> -- Enter the fundamental (60Hz) current in amps,
        then enter each harmonic as a percentage of the fundamental. The calculator will compute
        THD%, true RMS current, K-factor, and the recommended transformer K-rating.
      </div>

      {/* Fundamental input */}
      <div style={cardStyle}>
        <label style={labelStyle}>Fundamental Current (60Hz) in Amps</label>
        <input
          type="number"
          inputMode="decimal"
          value={fundamental}
          onChange={e => setFundamental(e.target.value)}
          placeholder="e.g. 100"
          style={inputStyle}
        />
      </div>

      {/* Harmonic percentage inputs */}
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={sectionTitle}>Harmonic Content (% of Fundamental)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {harmonicInputs.map(hi => (
            <div key={hi.order}>
              <label style={labelStyle}>{hi.label}</label>
              <input
                type="number"
                inputMode="decimal"
                value={hi.value}
                onChange={e => hi.setter(e.target.value)}
                placeholder={hi.hint}
                style={{ ...inputStyle, fontSize: 14, minHeight: 48 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preset buttons */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Quick Presets</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: '6-Pulse VFD', f: '100', h3: '0', h5: '35', h7: '18', h9: '0', h11: '8', h13: '5' },
            { label: 'LED Lighting Panel', f: '50', h3: '70', h5: '40', h7: '15', h9: '10', h11: '5', h13: '3' },
            { label: 'Computer/Office Load', f: '30', h3: '80', h5: '55', h7: '25', h9: '15', h11: '8', h13: '5' },
            { label: 'SCR Battery Charger', f: '80', h3: '0', h5: '30', h7: '12', h9: '0', h11: '7', h13: '4' },
            { label: '12-Pulse VFD', f: '100', h3: '0', h5: '2', h7: '1', h9: '0', h11: '8', h13: '5' },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setFundamental(preset.f)
                setH3(preset.h3)
                setH5(preset.h5)
                setH7(preset.h7)
                setH9(preset.h9)
                setH11(preset.h11)
                setH13(preset.h13)
              }}
              style={{
                minHeight: 56,
                padding: '0 16px',
                borderRadius: 28,
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid var(--divider)',
                background: 'var(--input-bg)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasInput && (
        <>
          <div style={resultBox}>
            <div style={sectionTitle}>Calculation Results</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total Harmonic Distortion</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: thdSeverity.color, fontFamily: 'var(--font-mono)' }}>
                  {thd.toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: thdSeverity.color }}>{thdSeverity.label}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>True RMS Current</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {trueRMS.toFixed(1)} A
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {((trueRMS / I1 - 1) * 100).toFixed(1)}% above fundamental
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>K-Factor</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
                  {kFactor.toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{getKRating(kFactor)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Crest Factor (est.)</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
                  {crestFactor.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Ideal sine wave = 1.414
                </div>
              </div>
            </div>
          </div>

          {/* Harmonic breakdown table */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Harmonic Current Breakdown</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Order</th>
                    <th style={tableHeader}>Freq (Hz)</th>
                    <th style={tableHeader}>% of Fund.</th>
                    <th style={tableHeader}>Current (A)</th>
                    <th style={tableHeader}>I^2*h^2 contrib.</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { order: 1, freq: 60, pct: 100, current: I1 },
                    { order: 3, freq: 180, pct: pct3, current: I3 },
                    { order: 5, freq: 300, pct: pct5, current: I5 },
                    { order: 7, freq: 420, pct: pct7, current: I7 },
                    { order: 9, freq: 540, pct: pct9, current: I9 },
                    { order: 11, freq: 660, pct: pct11, current: I11 },
                    { order: 13, freq: 780, pct: pct13, current: I13 },
                  ].map(row => {
                    const kContrib = row.current * row.current * row.order * row.order
                    return (
                      <tr key={row.order}>
                        <td style={{ ...tableCell, fontWeight: row.order === 1 ? 700 : 400, color: row.order === 1 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                          {row.order === 1 ? 'Fundamental' : `${row.order}${row.order === 3 || row.order === 9 ? ' (triplen)' : ''}`}
                        </td>
                        <td style={tableCell}>{row.freq}</td>
                        <td style={tableCell}>{row.pct.toFixed(1)}%</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.current.toFixed(2)}</td>
                        <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{kContrib.toFixed(0)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual bar chart of harmonic magnitudes */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Harmonic Spectrum (Visual)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { order: '1st (60Hz)', pct: 100, color: '#22c55e' },
                { order: '3rd (180Hz)', pct: pct3, color: '#ef4444' },
                { order: '5th (300Hz)', pct: pct5, color: '#f59e0b' },
                { order: '7th (420Hz)', pct: pct7, color: '#3b82f6' },
                { order: '9th (540Hz)', pct: pct9, color: '#ef4444' },
                { order: '11th (660Hz)', pct: pct11, color: '#8b5cf6' },
                { order: '13th (780Hz)', pct: pct13, color: '#8b5cf6' },
              ].map(bar => (
                <div key={bar.order} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 90, fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0, textAlign: 'right' }}>
                    {bar.order}
                  </div>
                  <div style={{ flex: 1, height: 20, background: 'var(--input-bg)', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(bar.pct, 100)}%`,
                        background: bar.color,
                        borderRadius: 4,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <div style={{ width: 45, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {bar.pct.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distortion power factor impact */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Distortion Power Factor Impact</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>Distortion Power Factor</strong> = 1 / sqrt(1 + THD^2) = 1 / sqrt(1 + {(thd / 100).toFixed(3)}^2) ={' '}
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {(1 / Math.sqrt(1 + (thd / 100) * (thd / 100))).toFixed(3)}
                </span>
              </p>
              <p style={{ margin: '0 0 8px' }}>
                Even with a displacement power factor of 0.95 (well corrected with capacitors), the <strong>True Power Factor</strong> would be:
              </p>
              <p style={{ margin: 0 }}>
                TPF = DPF x Distortion PF = 0.95 x {(1 / Math.sqrt(1 + (thd / 100) * (thd / 100))).toFixed(3)} ={' '}
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 18 }}>
                  {(0.95 / Math.sqrt(1 + (thd / 100) * (thd / 100))).toFixed(3)}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ================================================================== */
/*  TAB RENDERERS                                                      */
/* ================================================================== */

function TabBasics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={cardStyle}>
        <div style={sectionTitle}>What is Power Quality?</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Power quality</strong> refers to the characteristics of the electrical supply that
            enable equipment to function correctly without damage or loss of performance. A "perfect"
            power supply would deliver a pure 60Hz sinusoidal voltage at exactly nominal magnitude
            (e.g., 120V, 347V, 600V) with zero interruptions.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            In the real world, the voltage waveform is never perfect. It contains distortion from
            non-linear loads (VFDs, rectifiers, LED drivers), experiences sags and swells from faults
            and load switching, and can be interrupted by weather or equipment failures.
          </p>
          <p style={{ margin: 0 }}>
            The key PQ standards in Ontario include <strong>IEEE 519</strong> (harmonic limits),
            <strong> IEEE 1159</strong> (PQ monitoring and definitions),
            <strong> CSA C61000</strong> (EMC compatibility), and
            <strong> CEC Section 14</strong> (power factor requirements).
          </p>
        </div>
      </div>

      <div style={tipBox}>
        <strong>Apprentice Tip:</strong> Power quality problems often look like equipment problems.
        A motor overheating, a VFD tripping for no obvious reason, a PLC giving intermittent errors --
        these are all symptoms that may have a power quality root cause. Always check PQ before
        replacing equipment.
      </div>

      <div style={sectionTitle}>Who Cares About Power Quality?</div>
      {stakeholders.map(s => (
        <CollapsibleSection key={s.who} title={s.who} borderColor={s.color}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
            {s.concern}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Key Concerns:</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {s.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </CollapsibleSection>
      ))}

      <div style={sectionTitle}>Cost of Poor Power Quality</div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Category</th>
                <th style={tableHeader}>Description</th>
                <th style={tableHeader}>Typical Cost</th>
              </tr>
            </thead>
            <tbody>
              {poorPQCosts.map(c => (
                <tr key={c.category}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{c.category}</td>
                  <td style={tableCell}>{c.description}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>{c.typicalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={warningBox}>
        <strong>Real-World Impact:</strong> A single voltage sag event at an Ontario mine can cost
        $50,000+ in lost production, process restart, and damaged product. Annual PQ-related costs at
        a large mining operation can exceed $500,000. Investing in PQ monitoring and mitigation
        typically pays back within 6-18 months.
      </div>
    </div>
  )
}

function TabVoltage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={infoBox}>
        <strong>IEEE 1159</strong> defines standard categories for power quality disturbances.
        Understanding these categories helps you identify issues, communicate with utilities and
        engineers, and select appropriate mitigation equipment.
      </div>

      {voltageIssues.map(vi => (
        <CollapsibleSection key={vi.name} title={vi.name} borderColor={vi.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ ...monoTag, color: vi.color }}>IEEE 1159: {vi.ieee1159}</span>
              <span style={monoTag}>Duration: {vi.duration}</span>
              <span style={monoTag}>Magnitude: {vi.magnitude}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {vi.description}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Common Causes:</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {vi.causes.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>Effects on Equipment:</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {vi.effects.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      ))}

      <div style={tipBox}>
        <strong>Troubleshooting Tip:</strong> When equipment trips intermittently with no obvious cause,
        install a PQ analyzer for at least one week. Most "mystery trips" turn out to be voltage sags
        from utility switching or motor starts on the same bus. Even a 15% sag lasting 3 cycles can
        trip a VFD or drop out a contactor.
      </div>
    </div>
  )
}

function TabHarmonics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={cardStyle}>
        <div style={sectionTitle}>What Are Harmonics?</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 8px' }}>
            Harmonics are integer multiples of the fundamental frequency (60Hz in North America).
            The 2nd harmonic is 120Hz, the 3rd is 180Hz, the 5th is 300Hz, and so on. Non-linear
            loads (any load that draws current in pulses rather than a smooth sine wave) inject
            harmonic currents into the power system.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            These harmonic currents flow through the system impedance and create harmonic voltage
            distortion. The combined effect of all harmonics is measured as <strong>Total Harmonic
            Distortion (THD)</strong>.
          </p>
          <p style={{ margin: 0 }}>
            <strong>THD Formula:</strong>{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
              THD = sqrt(I3^2 + I5^2 + I7^2 + ... + In^2) / I1 x 100%
            </span>
          </p>
        </div>
      </div>

      <div style={warningBox}>
        <strong>Triplen Harmonics (3rd, 9th, 15th, 21st...):</strong> These are zero-sequence harmonics
        that ADD in the neutral conductor instead of cancelling. In a balanced 3-phase system with
        high 3rd harmonic content (LED lighting, computers), neutral current can reach 1.73x the phase
        current. The neutral has no overcurrent protection! This is a fire hazard in older buildings
        with undersized neutrals.
      </div>

      <div style={sectionTitle}>Harmonic Spectrum Reference</div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Order</th>
                <th style={tableHeader}>Frequency</th>
                <th style={tableHeader}>Sequence</th>
                <th style={tableHeader}>Common Source</th>
                <th style={tableHeader}>Typical %</th>
              </tr>
            </thead>
            <tbody>
              {harmonicSpectrum.map(h => (
                <tr key={h.order}>
                  <td style={{ ...tableCell, fontWeight: 700, color: h.color }}>{h.order === 1 ? '1st (Fund.)' : `${h.order}${h.order % 3 === 0 ? ' (triplen)' : ''}`}</td>
                  <td style={tableCell}>{h.frequency}</td>
                  <td style={{ ...tableCell, color: h.sequence.includes('Zero') ? '#ef4444' : h.sequence.includes('Negative') ? '#f59e0b' : '#22c55e' }}>{h.sequence}</td>
                  <td style={tableCell}>{h.commonSource}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{h.typicalMagnitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={tipBox}>
        <strong>Sequence Rotation:</strong> Positive-sequence harmonics (1st, 7th, 13th) rotate in the same
        direction as the fundamental and produce forward torque in motors. Negative-sequence harmonics (5th, 11th)
        rotate opposite and produce braking torque plus heat. Zero-sequence (3rd, 9th) do not produce rotating
        fields but add in the neutral.
      </div>

      <div style={sectionTitle}>Harmonic Sources</div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Source</th>
                <th style={tableHeader}>Harmonics Produced</th>
                <th style={tableHeader}>Typical Current THD</th>
                <th style={tableHeader}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {harmonicSources.map(s => (
                <tr key={s.source}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{s.source}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{s.harmonicsProduced}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{s.typicalTHD}</td>
                  <td style={tableCell}>{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={sectionTitle}>Effects of Harmonics</div>
      {harmonicEffects.map(he => (
        <CollapsibleSection
          key={he.component}
          title={`${he.component} -- ${he.effect}`}
          borderColor={he.severity === 'high' ? '#ef4444' : he.severity === 'medium' ? '#f59e0b' : '#3b82f6'}
        >
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {he.details}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{
              ...monoTag,
              color: he.severity === 'high' ? '#ef4444' : he.severity === 'medium' ? '#f59e0b' : '#3b82f6',
            }}>
              Severity: {he.severity.toUpperCase()}
            </span>
          </div>
        </CollapsibleSection>
      ))}

      <div style={cardStyle}>
        <div style={sectionTitle}>6-Pulse VFD Harmonic Formula</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 8px' }}>
            For a p-pulse rectifier, the characteristic harmonics follow:
          </p>
          <div style={{
            background: 'var(--input-bg)',
            borderRadius: 8,
            padding: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--primary)',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            h = n*p +/- 1
          </div>
          <p style={{ margin: '0 0 4px' }}>
            For 6-pulse: h = 5, 7, 11, 13, 17, 19, 23, 25...
          </p>
          <p style={{ margin: '0 0 4px' }}>
            For 12-pulse: h = 11, 13, 23, 25... (5th and 7th cancelled)
          </p>
          <p style={{ margin: 0 }}>
            For 18-pulse: h = 17, 19, 35, 37... (5th, 7th, 11th, 13th cancelled)
          </p>
        </div>
      </div>
    </div>
  )
}

function TabSolutions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={infoBox}>
        <strong>Mitigation Strategy:</strong> Start with the simplest, lowest-cost solutions first.
        Line reactors should be standard on every VFD. Only add passive or active filters if THD
        still exceeds IEEE 519 limits after basic measures.
      </div>

      {solutions.map(sol => (
        <CollapsibleSection key={sol.name} title={`${sol.name} (${sol.type})`} borderColor={sol.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>How It Works:</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sol.howItWorks}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 4 }}>Best For:</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sol.bestFor}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>Limitations:</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sol.limitations}</div>
            </div>
            <div style={{ ...monoTag, color: 'var(--primary)', fontSize: 13 }}>Cost: {sol.typicalCost}</div>
          </div>
        </CollapsibleSection>
      ))}

      <div style={sectionTitle}>IEEE 519 Current Distortion Limits</div>
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
          Maximum harmonic current distortion at the Point of Common Coupling (PCC) as a percentage
          of maximum demand load current (I_L). ISC/IL is the ratio of short-circuit current to
          maximum demand load current. Stiffer systems (higher ratio) allow more harmonic current.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>ISC/IL</th>
                <th style={tableHeader}>TDD%</th>
                <th style={tableHeader}>h&lt;11</th>
                <th style={tableHeader}>11-17</th>
                <th style={tableHeader}>17-23</th>
                <th style={tableHeader}>23-35</th>
                <th style={tableHeader}>&gt;35</th>
              </tr>
            </thead>
            <tbody>
              {ieee519CurrentLimits.map(row => (
                <tr key={row.sccRatio}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.sccRatio}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{row.thd}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.h_lt_11}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.h_11_17}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.h_17_23}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.h_23_35}</td>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.h_gt_35}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={tipBox}>
        <strong>IEEE 519 Voltage Limits:</strong> At the PCC, voltage THD should not exceed 5% for
        systems up to 69kV, with no individual harmonic exceeding 3%. For systems 69kV to 161kV,
        total THD limit is 2.5% and individual harmonic limit is 1.5%.
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>Mitigation Decision Guide</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { thd: 'THD < 15%', action: 'Line reactors on each VFD (3-5% impedance). Standard practice, should always be installed.', color: '#22c55e' },
            { thd: 'THD 15-30%', action: 'Add passive tuned filters (5th harmonic) at the main bus or on large individual VFDs. Consider 12-pulse VFDs for new large drives.', color: '#f59e0b' },
            { thd: 'THD 30-50%', action: 'Passive filters plus possibly active harmonic filters. Evaluate 18-pulse or AFE VFDs for large drives. System study required.', color: '#ff8c00' },
            { thd: 'THD > 50%', action: 'Comprehensive harmonic study required. Active filters, multi-pulse VFDs, system redesign. Engage a PQ specialist.', color: '#ef4444' },
          ].map(item => (
            <div key={item.thd} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ ...monoTag, color: item.color, flexShrink: 0, marginTop: 2 }}>{item.thd}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabPowerFactor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={cardStyle}>
        <div style={sectionTitle}>Three Types of Power Factor</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 8px' }}>
            Most electricians learn about power factor as the cosine of the angle between voltage and
            current. This is <strong>Displacement Power Factor (DPF)</strong> and only considers the
            fundamental 60Hz component. In a world with non-linear loads, there is a second component:
            <strong> Distortion Power Factor</strong>.
          </p>
          <div style={{
            background: 'var(--input-bg)',
            borderRadius: 8,
            padding: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--primary)',
            textAlign: 'center',
            margin: '8px 0',
            lineHeight: 1.8,
          }}>
            True PF = Displacement PF x Distortion PF<br />
            Distortion PF = 1 / sqrt(1 + THD_i^2)<br />
            True PF = cos(phi_1) / sqrt(1 + THD_i^2)
          </div>
          <p style={{ margin: 0 }}>
            A 6-pulse VFD with 40% current THD has a Distortion PF of{' '}
            <strong>{(1 / Math.sqrt(1 + 0.4 * 0.4)).toFixed(3)}</strong>. Even with perfect
            displacement PF of 1.0, the True PF would only be{' '}
            <strong>{(1 / Math.sqrt(1 + 0.4 * 0.4)).toFixed(3)}</strong>. Adding capacitors for
            PF correction would not help -- you need harmonic filters.
          </p>
        </div>
      </div>

      <div style={warningBox}>
        <strong>Capacitor + Harmonics = Danger:</strong> Do NOT install standard PF correction
        capacitor banks on systems with significant harmonic distortion without first performing a
        harmonic resonance study. The capacitor bank can resonate with the system inductance at a
        harmonic frequency, amplifying that harmonic by 5-20x, causing capacitor failure, fuse blowing,
        or even explosion. Use detuned reactors (typically 7% or 14%) in series with capacitors to
        shift the resonant frequency away from harmonic frequencies.
      </div>

      <div style={sectionTitle}>Displacement PF vs True PF Comparison</div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Parameter</th>
                <th style={tableHeader}>Displacement PF</th>
                <th style={tableHeader}>True PF</th>
              </tr>
            </thead>
            <tbody>
              {pfComparisons.map(row => (
                <tr key={row.parameter}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.parameter}</td>
                  <td style={tableCell}>{row.displacement}</td>
                  <td style={tableCell}>{row.truePF}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>Practical Examples</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              scenario: 'Motor with capacitor PF correction',
              dpf: '0.95',
              thd: '5%',
              truePF: (0.95 / Math.sqrt(1 + 0.05 * 0.05)).toFixed(3),
              comment: 'Minimal harmonics -- DPF and True PF nearly equal. Capacitor correction works well.',
              color: '#22c55e',
            },
            {
              scenario: '6-pulse VFD (no input filter)',
              dpf: '0.96',
              thd: '40%',
              truePF: (0.96 / Math.sqrt(1 + 0.40 * 0.40)).toFixed(3),
              comment: 'DPF looks good but True PF is significantly lower. Capacitors will NOT help.',
              color: '#f59e0b',
            },
            {
              scenario: 'LED lighting panel',
              dpf: '0.98',
              thd: '80%',
              truePF: (0.98 / Math.sqrt(1 + 0.80 * 0.80)).toFixed(3),
              comment: 'Very high THD destroys True PF despite excellent displacement PF. Need harmonic filter.',
              color: '#ef4444',
            },
            {
              scenario: '18-pulse VFD with line reactor',
              dpf: '0.95',
              thd: '5%',
              truePF: (0.95 / Math.sqrt(1 + 0.05 * 0.05)).toFixed(3),
              comment: 'Multi-pulse VFD virtually eliminates distortion PF penalty.',
              color: '#22c55e',
            },
            {
              scenario: 'VFD with Active Front End',
              dpf: '0.99',
              thd: '4%',
              truePF: (0.99 / Math.sqrt(1 + 0.04 * 0.04)).toFixed(3),
              comment: 'AFE provides near-unity True PF with very low harmonics.',
              color: '#22c55e',
            },
          ].map(ex => (
            <div key={ex.scenario} style={{ ...cardStyle, borderLeft: `4px solid ${ex.color}`, background: 'var(--input-bg)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{ex.scenario}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>DPF: <strong>{ex.dpf}</strong></span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>THD_i: <strong>{(parseFloat(ex.thd) * 100 ? ex.thd : ex.thd)}%</strong></span>
                <span style={{ fontSize: 12, color: 'var(--primary)' }}>True PF: <strong style={{ fontSize: 16 }}>{ex.truePF}</strong></span>
              </div>
              <div style={{ fontSize: 12, color: ex.color, lineHeight: 1.4 }}>{ex.comment}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={tipBox}>
        <strong>Ontario Utility Billing:</strong> Most Ontario LDCs (Local Distribution Companies) bill
        power factor based on displacement PF measured by the revenue meter. A facility with many VFDs
        might show a PF of 0.95 on their bill (DPF) while the true PF at their service entrance is
        only 0.78. As utilities adopt smarter metering, true PF billing is expected to become more common.
        Install true-RMS PQ monitoring now to understand your actual power factor.
      </div>
    </div>
  )
}

function TabMeasuring() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={cardStyle}>
        <div style={sectionTitle}>Basic Meter vs Power Quality Analyzer</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
          A standard multimeter (even a true-RMS Fluke 87V) can measure voltage and current accurately
          but cannot tell you WHY your equipment is tripping. A power quality analyzer captures the
          complete picture: waveforms, harmonics, events, trends, and power parameters over time.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Feature</th>
                <th style={tableHeader}>Basic DMM</th>
                <th style={tableHeader}>PQ Analyzer</th>
              </tr>
            </thead>
            <tbody>
              {meterComparisons.map(row => (
                <tr key={row.feature}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.feature}</td>
                  <td style={tableCell}>{row.basicMeter}</td>
                  <td style={tableCell}>{row.pqAnalyzer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={sectionTitle}>Key Metrics to Monitor</div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Metric</th>
                <th style={tableHeader}>What It Tells You</th>
                <th style={tableHeader}>Good Value</th>
                <th style={tableHeader}>Action Level</th>
              </tr>
            </thead>
            <tbody>
              {keyMetrics.map(m => (
                <tr key={m.metric}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{m.metric}</td>
                  <td style={tableCell}>{m.whatItTells}</td>
                  <td style={{ ...tableCell, color: '#22c55e', fontFamily: 'var(--font-mono)' }}>{m.goodValue}</td>
                  <td style={{ ...tableCell, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{m.actionLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={tipBox}>
        <strong>True RMS vs Average-Responding Meters:</strong> An average-responding meter multiplies
        the average rectified value by 1.11 to display RMS (correct only for pure sine waves). On a
        distorted waveform, this reads 10-40% LOW. Always use a true-RMS meter (Fluke 87V, 117, 179,
        etc.) when measuring in environments with VFDs, LED lighting, or electronic loads. The meter
        will say "TRMS" or "True RMS" on it.
      </div>

      <CollapsibleSection title="PQ Analyzer Setup Checklist" borderColor="var(--primary)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Verify analyzer voltage rating matches system voltage (600V CAT III or CAT IV)',
            'Connect voltage leads first (L1, L2, L3, N) with secure clips',
            'Install CTs on all three phases AND neutral -- orientation matters (arrow toward load)',
            'Verify correct CT ratio in analyzer settings (e.g., 100:1, 1000:1)',
            'Check phase rotation on analyzer display -- should show positive sequence (ABC)',
            'Verify power readings are positive (negative = CT installed backward)',
            'Set recording interval (1-minute for events, 10-minute for trends)',
            'Enable event capture: sags >10%, swells >10%, transients >200%',
            'Set recording duration (minimum 7 days for meaningful trend data)',
            'Document the measurement location, CT ratios, and system voltage for the report',
            'Secure all connections -- vibration can loosen clips and corrupt data',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ ...monoTag, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Interpreting PQ Reports" borderColor="#3b82f6">
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Trend Graphs:</strong> Look for patterns in THD, voltage, and power factor over
            the 24-hour cycle. High THD during daytime (VFDs running) that drops at night confirms
            VFDs as the primary harmonic source.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Event Table:</strong> Review voltage sag events -- note the magnitude, duration,
            and time. Correlate with equipment trip logs. If a VFD trips at 2:15 PM and the PQ
            analyzer shows an 18% sag at 2:14:58 PM, you have found your cause.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Harmonic Spectrum:</strong> The bar chart showing individual harmonic magnitudes
            tells you the type of load. Dominant 5th and 7th = 6-pulse VFDs. Dominant 3rd = single-phase
            non-linear loads (LED, computers). Even harmonics present = possible DC offset or half-wave
            rectification.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Voltage Unbalance Trend:</strong> If unbalance varies with load, the cause is
            likely internal (unequal single-phase loading). If unbalance is constant regardless of
            load, the cause is likely external (utility supply or transformer).
          </p>
        </div>
      </CollapsibleSection>

      <div style={warningBox}>
        <strong>Safety:</strong> Power quality analyzers connect to energized circuits. Follow all
        lockout/tagout procedures when installing CTs. Use properly rated test leads and CTs (CAT III
        or CAT IV for 600V systems). Never open a CT circuit while the conductor is energized -- the
        CT will develop dangerous voltage. Use only CTs designed for the analyzer model.
      </div>
    </div>
  )
}

function TabMining() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={infoBox}>
        <strong>Mining Power Systems</strong> present unique power quality challenges: long cable
        runs, weak systems (limited fault current), heavy non-linear loads (VFDs, rectifiers, battery
        chargers), and critical safety requirements under Ontario Regulation 854.
      </div>

      {miningPQTopics.map(topic => (
        <CollapsibleSection key={topic.title} title={topic.title} borderColor={topic.color} defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {topic.content}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Key Points:</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {topic.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
            </ul>
          </div>
        </CollapsibleSection>
      ))}

      <div style={cardStyle}>
        <div style={sectionTitle}>Mine Power System -- Typical Harmonic Issues</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Equipment</th>
                <th style={tableHeader}>Harmonic Impact</th>
                <th style={tableHeader}>Typical Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { equip: 'Crusher VFD (200-500HP)', impact: '5th, 7th dominant. 30-40% current THD at input. Can cause significant voltage distortion on weak mine bus.', mitigation: '12-pulse or 18-pulse drive, or 6-pulse with active filter. Minimum: 5% line reactor.' },
                { equip: 'Conveyor VFDs (50-250HP each)', impact: 'Multiple VFDs on same bus. Aggregate harmonic current can exceed transformer K-rating. Diversity factor 0.8-0.9.', mitigation: 'K-13 rated supply transformer. Line reactors on each VFD. Passive filter on main bus if THD > IEEE 519.' },
                { equip: 'Mine Hoist Drive (500-5000HP)', impact: 'Very large harmonic source. SCR drives produce voltage notching. VFD drives produce high current THD.', mitigation: 'Dedicated transformer. 18-pulse or AFE VFD. Active filter for large SCR drives. Isolated bus from sensitive loads.' },
                { equip: 'Battery Chargers (25-75kW)', impact: 'SCR-controlled chargers: 5th, 7th harmonics. Multiple chargers in battery bay compound the problem.', mitigation: 'Line reactors on each charger. Consider IGBT-based chargers for new installations. Dedicated transformer for charging bay.' },
                { equip: 'Ventilation Fan VFDs', impact: 'Variable torque load -- low current at reduced speed reduces harmonic injection. Full-speed operation has highest harmonics.', mitigation: 'Standard 6-pulse with 5% line reactor often sufficient. Consider 12-pulse for fans > 200HP.' },
                { equip: 'Underground Lighting (LED)', impact: 'High 3rd harmonic per fixture. Aggregate triplen harmonics overload shared neutrals. THD per driver: 60-130%.', mitigation: 'Oversize neutral conductors (200%). Separate lighting transformer (delta-wye traps triplens). Use low-THD LED drivers.' },
                { equip: 'Welding Equipment', impact: 'Random, impulsive harmonics. Voltage flicker on shared bus. Can affect PLC analog inputs.', mitigation: 'Dedicated feeder or transformer. Do not share bus with sensitive control equipment. Isolation transformer for nearby PLCs.' },
              ].map(row => (
                <tr key={row.equip}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--text)' }}>{row.equip}</td>
                  <td style={tableCell}>{row.impact}</td>
                  <td style={tableCell}>{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={warningBox}>
        <strong>Ontario Regulation 854 -- Ground Fault Protection:</strong> All portable electrical
        equipment underground must have ground fault protection that trips within 200ms at 100mA or
        less. VFD high-frequency common-mode currents can interfere with ground fault detection. Ensure
        ground fault relays are designed for VFD applications (fundamental frequency extraction) and
        test regularly with a calibrated ground fault test set.
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>PQ Monitoring Locations for Mines</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { location: 'Utility Service Entrance (PCC)', why: 'Verify incoming power quality meets utility standards. Baseline for all downstream issues. Required for IEEE 519 compliance assessment.', priority: 'CRITICAL' },
            { location: 'Main Mine Substation Secondary', why: 'Monitor voltage THD, sags, and unbalance fed to all mine loads. Detect transformer loading issues.', priority: 'HIGH' },
            { location: 'Large VFD Input Bus', why: 'Measure harmonic injection from major drives (crushers, hoists). Size filters correctly.', priority: 'HIGH' },
            { location: 'Sensitive Equipment Bus (PLC, Controls)', why: 'Verify clean power for control systems. Correlate PQ events with nuisance trips and data errors.', priority: 'MEDIUM' },
            { location: 'Generator Output Bus', why: 'Monitor voltage THD on generator-fed systems. Generator AVR stability monitoring.', priority: 'HIGH' },
            { location: 'Capacitor Bank Bus', why: 'Watch for resonance, overcurrent, and voltage amplification. Prevent capacitor failures.', priority: 'MEDIUM' },
          ].map(loc => (
            <div key={loc.location} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
              <span style={{
                ...monoTag,
                flexShrink: 0,
                color: loc.priority === 'CRITICAL' ? '#ef4444' : loc.priority === 'HIGH' ? '#f59e0b' : '#3b82f6',
              }}>
                {loc.priority}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{loc.location}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{loc.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={tipBox}>
        <strong>Pro Tip for Mine Electricians:</strong> When troubleshooting intermittent VFD trips
        underground, do not just reset the drive and walk away. Record the fault code, the time,
        and the operating conditions. Then correlate with the PQ monitoring data. A pattern of
        "DC bus undervoltage" trips at the same time each day often points to a recurring voltage
        sag from utility switching or a large motor start on the same feeder. Solving the root cause
        (adding ride-through, installing a UPS on the DC bus, or separating feeders) saves far more
        than repeatedly resetting the drive.
      </div>
    </div>
  )
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                */
/* ================================================================== */

export default function PowerQualityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('basics')

  const renderTab = () => {
    switch (activeTab) {
      case 'basics':
        return <TabBasics />
      case 'voltage':
        return <TabVoltage />
      case 'harmonics':
        return <TabHarmonics />
      case 'calculator':
        return <HarmonicCalculator />
      case 'solutions':
        return <TabSolutions />
      case 'powerfactor':
        return <TabPowerFactor />
      case 'measuring':
        return <TabMeasuring />
      case 'mining':
        return <TabMining />
      default:
        return null
    }
  }

  return (
    <PageWrapper title="Power Quality & Harmonics">
      {/* Tab Navigation */}
      <div style={pillRow}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={activeTab === t.key ? pillActive : pillBase}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </PageWrapper>
  )
}
