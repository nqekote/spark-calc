import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Control Circuits Reference - Ontario Mining Electricians            */
/* ------------------------------------------------------------------ */

type TabKey = 'circuits' | 'symbols' | 'disconnect' | 'timers' | 'markings'

/* ------------------------------------------------------------------ */
/*  Tab 1: Basic Circuits Data                                         */
/* ------------------------------------------------------------------ */

interface CircuitInfo {
  name: string
  schematic: string
  howItWorks: string
  keyComponents: string[]
  safetyInterlocks: string[]
  miningApps: string[]
}

const circuits: CircuitInfo[] = [
  {
    name: '2-Wire Control',
    schematic:
`  L1                          L2
  │                           │
  ├───[ DISC ]───┬─────────┤
  │               │         │
  │          [ OL HTR ]     │
  │               │         │
  │        ┌─────┴─────┐  │
  │        │   MOTOR   │  │
  │        └─────┬─────┘  │
  │              │         │
  │  Control:    │         │
  │              │         │
  ├─[ Float SW ]─┤         │
  │    (S1)      │         │
  ├─[ OL NC  ]──┤         │
  │   (OL)       │         │
  ├──( M coil )──┼─────────┘
  │              │
  └──────────────┘`,
    howItWorks: 'A maintained-contact device (float switch, pressure switch, thermostat) directly controls the contactor coil. When the switch closes, the coil energizes and the motor runs. When the switch opens, the motor stops. No seal-in contact needed because the pilot device stays closed.',
    keyComponents: ['Maintained-contact pilot device (float, pressure, thermostat)', 'Contactor (M)', 'Overload relay (OL)', 'Disconnect switch'],
    safetyInterlocks: ['Overload relay NC contact in series with coil', 'Disconnect switch upstream of all components', 'Motor will restart automatically when power returns — consider if this is safe for the application'],
    miningApps: ['Sump pumps (float switch control)', 'Ventilation fans (pressure switch)', 'Heating systems (thermostat)', 'Compressor pump-down control'],
  },
  {
    name: '3-Wire Control',
    schematic:
`  L1 (Hot)               L2 (Neutral)
  │                          │
  ├────[ STOP NC ]───┬─────┤
  │     (PB1)        │     │
  │                  │     │
  ├──[ START NO ]──┤     │
  │     (PB2)        │     │
  │                  │     │
  │  ┌─[ M aux NO ]─┘     │
  │  │  (seal-in)        │
  │  │                   │
  ├──┴─[ OL NC ]───────┤
  │      (OL)              │
  ├────( M coil )───────┘
  │
  └─────────────────────`,
    howItWorks: 'The most common motor starter circuit. Press START (NO pushbutton) to energize M coil. M auxiliary NO contact seals in parallel with START button, maintaining the circuit after START is released. Press STOP (NC pushbutton) to break the circuit and de-energize the coil. The seal-in drops out and motor stays off until START is pressed again. Motor does NOT restart after power loss (low-voltage protection).',
    keyComponents: ['STOP pushbutton (NC)', 'START pushbutton (NO)', 'Contactor (M) with auxiliary NO contact', 'Overload relay (OL)', 'Control transformer (if different control voltage)'],
    safetyInterlocks: ['OL NC contact in series — trips on motor overload', 'Low-voltage protection — motor won\'t auto-restart', 'STOP button is NC (fail-safe — broken wire stops motor)', 'E-stop can be wired in series with STOP'],
    miningApps: ['Conveyor belt starters', 'Pump stations', 'Crusher drives', 'Fan motors', 'Nearly all mining motor control applications'],
  },
  {
    name: 'Forward / Reverse',
    schematic:
`  L1                           L2
  │                             │
  ├───[ STOP NC ]───┬───────┤
  │    (PB1)         │       │
  │                  │       │
  │  Forward:        │       │
  ├─[ FWD NO ]──┬───┤       │
  │  (PB2)     │   │       │
  │  ┌[F aux]─┘   │       │
  │  │ (seal)     │       │
  ├──┴─[R NC]────┤       │
  │  (interlock)    │       │
  ├───[ OL NC ]───┤       │
  ├──( F coil )───┴───────┘
  │                             │
  │  Reverse:                   │
  ├─[ REV NO ]──┬───┬──────┤
  │  (PB3)     │   │       │
  │  ┌[R aux]─┘   │       │
  │  │ (seal)     │       │
  ├──┴─[F NC]────┤       │
  │  (interlock)    │       │
  ├───[ OL NC ]───┤       │
  ├──( R coil )───┴───────┘
  │
  └────────────────────────`,
    howItWorks: 'Two separate 3-wire circuits — one for Forward, one for Reverse. Each has its own seal-in contact. Electrical interlocks: a NC auxiliary contact from each contactor is wired in series with the opposite coil. This prevents both contactors from energizing simultaneously (which would cause a phase-to-phase short). Mechanical interlocking is also used as a backup. You must press STOP before changing direction.',
    keyComponents: ['STOP pushbutton (NC, shared)', 'FWD pushbutton (NO)', 'REV pushbutton (NO)', 'Forward contactor (F) with aux contacts', 'Reverse contactor (R) with aux contacts', 'Mechanical interlock between F and R', 'Overload relay (OL)'],
    safetyInterlocks: ['Electrical interlock: R NC in F circuit, F NC in R circuit', 'Mechanical interlock: physical linkage prevents both closing', 'Must press STOP before reversing (prevents arc flash)', 'OL protection on both directions', 'Consider adding time delay between directions for deceleration'],
    miningApps: ['Hoist motors (up/down)', 'Conveyor reversing', 'Gate/door operators', 'Crusher adjustment motors', 'Material handling trolleys'],
  },
  {
    name: 'Jog Circuit',
    schematic:
`  L1                           L2
  │                             │
  ├────[ STOP NC ]──┬──────┤
  │     (PB1)       │       │
  │                 │       │
  │  Run path:      │       │
  ├─[ START NO ]──┤       │
  │    (PB2)        │       │
  │  ┌[ M aux NO ]─┘       │
  │  │  (seal-in)          │
  │  │                     │
  ├──┴─[ OL NC ]───────┤
  │     (OL)                │
  ├───( M coil )────────┘
  │                         │
  │  Jog path (bypasses      │
  │  seal-in):               │
  ├──[ JOG NO ]─[ OL NC ]─┤
  │    (PB3)                 │
  └─────────────────────────`,
    howItWorks: 'Combines standard 3-wire control with a JOG button. The JOG pushbutton energizes the M coil directly, bypassing the seal-in circuit. Motor runs only while JOG is held down. When released, the coil de-energizes because there is no seal-in path through the jog button. The normal START button still provides latched run operation through the seal-in contact.',
    keyComponents: ['STOP pushbutton (NC)', 'START pushbutton (NO)', 'JOG pushbutton (NO)', 'Contactor (M) with aux NO contact', 'Overload relay (OL)'],
    safetyInterlocks: ['JOG button bypasses seal-in only — OL protection still active', 'Motor only runs while JOG is held', 'STOP button still de-energizes everything', 'Some jog circuits use a JOG/RUN selector switch instead'],
    miningApps: ['Conveyor belt positioning for splicing', 'Crusher positioning for maintenance', 'Pump impeller alignment', 'Any motor that needs precise positioning'],
  },
  {
    name: 'Two-Speed (Dahlander)',
    schematic:
`  L1                           L2
  │                             │
  ├────[ STOP NC ]──┬─────┤
  │     (PB1)       │      │
  │                 │      │
  │  Low Speed:     │      │
  ├─[ LOW NO ]───┤      │
  │   (PB2)        │      │
  │ ┌[L aux NO]──┘      │
  │ │ (seal)          │
  ├─┴─[H NC]────────┤
  │  (interlock)        │
  ├──[ OL NC ]───────┤
  ├─( L coil )───────┘
  │                      │
  │  High Speed:         │
  ├─[ HIGH NO ]─┬─────┤
  │   (PB3)     │      │
  │ ┌[H aux NO]─┘      │
  │ │ (seal)          │
  ├─┴─[L NC]────────┤
  │  (interlock)        │
  ├──[ OL NC ]───────┤
  ├─( H coil )───────┘
  │
  └───────────────────`,
    howItWorks: 'Dahlander motor has one winding that can be reconnected for two speeds (ratio of 2:1, e.g. 1800/900 RPM). Low-speed contactor (L) connects windings in series-delta. High-speed contactor (H) connects windings in parallel-star. Electrical interlocks prevent both speeds simultaneously. Separate starters with separate OL settings for each speed. Press STOP before switching speeds.',
    keyComponents: ['STOP pushbutton (NC, shared)', 'LOW speed pushbutton (NO)', 'HIGH speed pushbutton (NO)', 'Low-speed contactor (L)', 'High-speed contactor (H)', 'Star-point contactor (S) for high speed', 'Separate overload relays for each speed'],
    safetyInterlocks: ['Electrical interlock between L and H contactors', 'Mechanical interlock as backup', 'Separate OL relays sized for each speed\'s FLC', 'Time delay between speed changes recommended', 'Must stop before switching (or use compelling circuit)'],
    miningApps: ['Ventilation fans (low/high airflow)', 'Conveyor belts (load/unload speed)', 'Pump stations (low/high flow)', 'Cooling tower fans'],
  },
  {
    name: 'Star-Delta Starter',
    schematic:
`  L1                           L2
  │                             │
  ├───[ STOP NC ]──┬─────┤
  │    (PB1)        │      │
  ├─[ START NO ]──┤      │
  │    (PB2)        │      │
  │  ┌[ M aux NO ]─┘      │
  │  │  (seal)            │
  ├──┴─[ OL NC ]──────┤
  │                        │
  │  Main contactor:       │
  ├──( M coil )────────┘
  │                        │
  │  Star contactor:       │
  ├─[D NC]─( S coil )───┤
  │ (intlk)               │
  │                        │
  │  Timer (on M energize):│
  ├─[ M NO ]─( TR coil )─┤
  │                        │
  │  Delta (after timer):  │
  ├─[S NC]─[TR NO]─────┤
  │ (intlk)(timed)        │
  ├──( D coil )────────┘
  │
  └────────────────────`,
    howItWorks: 'Reduced-voltage starter. On START: Main contactor (M) and Star contactor (S) energize simultaneously. Motor windings are connected in Star (Y) configuration, receiving only 58% voltage (1/√3). Timer (TR) starts counting. After preset time (typically 5-15 seconds), timer contact closes, S drops out and Delta contactor (D) energizes. Motor now runs at full voltage in Delta. Starting current is reduced to 33% of DOL (direct-on-line) starting current.',
    keyComponents: ['Main contactor (M) - stays closed during run', 'Star contactor (S) - closed during start only', 'Delta contactor (D) - closed during run', 'Star-Delta timer (TR)', 'Overload relay (OL)', 'STOP/START pushbuttons'],
    safetyInterlocks: ['Electrical interlock between S and D (never both on)', 'Mechanical interlock between S and D', 'OL relay sized for motor FLC in delta', 'Timer prevents premature transition', 'Open-transition: brief power interruption during changeover (causes current transient)'],
    miningApps: ['Large pump motors (50+ HP)', 'Compressor motors', 'Crusher drives (where reduced starting torque is acceptable)', 'Fan motors', 'Any application where utility requires reduced inrush'],
  },
  {
    name: 'Auto-Transformer Starter',
    schematic:
`  L1                           L2
  │                             │
  ├───[ STOP NC ]──┬─────┤
  │    (PB1)        │      │
  ├─[ START NO ]──┤      │
  │    (PB2)        │      │
  │  ┌[ M aux NO ]─┘      │
  │  │  (seal)            │
  ├──┴─[ OL NC ]──────┤
  │                        │
  │  Start sequence:       │
  ├─( S coil )─────────┤
  │  (start contactor)    │
  │                        │
  │  S energizes auto-xfmr │
  │  Motor gets 65% or 80% │
  │  voltage via taps      │
  │                        │
  │  Timer:                │
  ├─[ S NO ]─( TR coil )─┤
  │                        │
  │  Run (after timer):    │
  ├─[ TR NO ]──────────┤
  │ (timed close)         │
  ├─( R coil )─────────┤
  │  (run contactor)      │
  │  R drops S out, motor  │
  │  now on full voltage   │
  └────────────────────`,
    howItWorks: 'An auto-transformer provides reduced voltage to the motor during starting. Common taps: 65%, 80% of line voltage. On START: Start contactor (S) energizes, connecting motor to auto-transformer taps. Timer starts. After preset time, Run contactor (R) energizes, bypassing the transformer and applying full voltage. S drops out. Provides more starting torque than Star-Delta at the same reduced current because voltage reduction is adjustable via taps.',
    keyComponents: ['Auto-transformer (3-phase, with 65%/80% taps)', 'Start contactor (S)', 'Run contactor (R)', 'Transition timer (TR)', 'Overload relay (OL)', 'STOP/START pushbuttons'],
    safetyInterlocks: ['Interlock between S and R contactors', 'OL sized for full-voltage FLC', 'Timer prevents premature transition', 'Closed-transition type preferred (Korndorfer) to avoid current spike', 'Thermal protection on auto-transformer windings'],
    miningApps: ['Large mine ventilation fans', 'Main pump drives', 'Mill and crusher motors (where Star-Delta torque is insufficient)', 'Mine hoist auxiliary drives', 'Applications needing adjustable starting voltage'],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Symbols Data                                                */
/* ------------------------------------------------------------------ */

interface SymbolEntry {
  symbol: string
  abbr: string
  name: string
  description: string
}

interface SymbolGroup {
  title: string
  entries: SymbolEntry[]
}

const symbolGroups: SymbolGroup[] = [
  {
    title: 'Contacts',
    entries: [
      { symbol: '─│ │─', abbr: 'NO', name: 'Normally Open', description: 'Open when de-energized, closes when coil energizes. IEC terminals: 13-14 (first NO), 23-24 (second NO).' },
      { symbol: '─╲╱─', abbr: 'NC', name: 'Normally Closed', description: 'Closed when de-energized, opens when coil energizes. IEC terminals: 11-12 (first NC), 21-22 (second NC).' },
      { symbol: '─│◗│─', abbr: 'NOTC', name: 'Timed-Close (NO)', description: 'NO contact with time delay on closing (on-delay). Opens instantly when de-energized.' },
      { symbol: '─╲◗╱─', abbr: 'NCTO', name: 'Timed-Open (NC)', description: 'NC contact with time delay on opening (on-delay). Closes instantly when de-energized.' },
    ],
  },
  {
    title: 'Coils',
    entries: [
      { symbol: '─( )─', abbr: 'CR', name: 'Control Relay', description: 'General-purpose relay coil. Energizes relay contacts throughout the circuit.' },
      { symbol: '─(M)─', abbr: 'M', name: 'Contactor Coil', description: 'Motor contactor coil. Controls main power contacts for motor starting.' },
      { symbol: '─(S)─', abbr: 'SOL', name: 'Solenoid', description: 'Solenoid valve or solenoid-operated device. Linear actuator.' },
      { symbol: '─(TR)─', abbr: 'TR', name: 'Timer Coil', description: 'Timing relay coil. Starts timing sequence when energized.' },
    ],
  },
  {
    title: 'Pilot Devices',
    entries: [
      { symbol: '─│○│─', abbr: 'PB-NO', name: 'Pushbutton (NO)', description: 'Momentary normally-open pushbutton. Spring-return. Green = START.' },
      { symbol: '─╲○╱─', abbr: 'PB-NC', name: 'Pushbutton (NC)', description: 'Momentary normally-closed pushbutton. Spring-return. Red = STOP.' },
      { symbol: '─○/─', abbr: 'SS2', name: 'Selector Switch (2-pos)', description: 'Two-position maintained selector switch. HAND/OFF or ON/OFF.' },
      { symbol: '─○/\\/─', abbr: 'SS3', name: 'Selector Switch (3-pos)', description: 'Three-position selector: HAND/OFF/AUTO. Most common in mining.' },
      { symbol: '─◉─', abbr: 'PL', name: 'Pilot Light', description: 'Indicator lamp. Red=running/danger, Green=stopped/safe, Amber=warning.' },
      { symbol: '─[○]─', abbr: 'E-STOP', name: 'E-Stop (Mushroom)', description: 'Emergency stop. Red mushroom head, NC contact, latching (pull-to-release or twist-to-release). Yellow background.' },
    ],
  },
  {
    title: 'Protection',
    entries: [
      { symbol: '─[OL]─', abbr: 'OL', name: 'Overload Relay', description: 'Thermal or electronic overload relay. Protects motor from sustained overcurrent. Trips OL NC contact.' },
      { symbol: '─[OL-E]─', abbr: 'OL-E', name: 'Electronic Overload', description: 'Electronic (solid-state) overload. Adjustable trip class, phase-loss protection, ground fault.' },
      { symbol: '─┼─', abbr: 'FU', name: 'Fuse', description: 'Overcurrent protection. One-time or renewable. Sized per CEC tables.' },
      { symbol: '─[CB]─', abbr: 'CB', name: 'Circuit Breaker', description: 'Resettable overcurrent protection. Thermal-magnetic or electronic trip.' },
      { symbol: '─[DISC]─', abbr: 'DISC', name: 'Disconnect', description: 'Disconnect switch. Provides visible break for lockout/tagout. May be fused or non-fused.' },
    ],
  },
  {
    title: 'Transformers',
    entries: [
      { symbol: ')|||(', abbr: 'CPT', name: 'Control Transformer', description: 'Steps down power voltage (600V/480V) to control voltage (120V). CEC Rule 26-252.' },
      { symbol: 'O)|||(', abbr: 'CT', name: 'Current Transformer', description: 'Steps down current for metering/relaying. Secondary is 5A. NEVER open-circuit a CT secondary.' },
      { symbol: ')|||(O', abbr: 'PT', name: 'Potential Transformer', description: 'Steps down voltage for metering. Secondary is 120V. Fused on primary side.' },
    ],
  },
  {
    title: 'Sensors',
    entries: [
      { symbol: '─[|]]─', abbr: 'PROX-I', name: 'Proximity (Inductive)', description: 'Detects metal objects without contact. Common for position sensing on conveyors, hoists.' },
      { symbol: '─[||]]─', abbr: 'PROX-C', name: 'Proximity (Capacitive)', description: 'Detects metal and non-metal objects. Used for level sensing through vessel walls.' },
      { symbol: '─[>]─', abbr: 'PE', name: 'Photoelectric', description: 'Light beam detection. Through-beam, retro-reflective, or diffuse. Conveyor presence detection.' },
      { symbol: '─/│─', abbr: 'LS', name: 'Limit Switch', description: 'Mechanical contact actuated by equipment movement. Roller lever, plunger, or wobble stick.' },
      { symbol: '─[P]─', abbr: 'PS', name: 'Pressure Switch', description: 'Opens/closes contacts based on pressure setpoint. Used for compressors, hydraulic systems.' },
      { symbol: '─[F]─', abbr: 'FS', name: 'Flow Switch', description: 'Detects fluid flow above/below setpoint. Paddle or thermal type. Cooling water verification.' },
      { symbol: '─[L]─', abbr: 'LVS', name: 'Level Switch', description: 'Detects liquid or solid material level. Float, capacitive, or ultrasonic. Sump level control.' },
      { symbol: '─[T]─', abbr: 'TS', name: 'Temperature Switch', description: 'Opens/closes at temperature setpoint. Bimetallic, RTD, or thermocouple input. Motor bearing monitoring.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Disconnect Wiring Data                                      */
/* ------------------------------------------------------------------ */

interface DisconnectSection {
  title: string
  content: string[]
}

const disconnectSections: DisconnectSection[] = [
  {
    title: 'Fused Disconnect',
    content: [
      'LINE SIDE (top): incoming power from the source. Always de-energized when disconnect is OFF.',
      'LOAD SIDE (bottom): outgoing power to the motor/load. De-energized when OFF.',
      'Fuse sizing for motors: use CEC Table 29 — typically 150-300% of motor FLC depending on starter type.',
      'Fuse class: Class R (RK1/RK5) for motor circuits, Class J for tight spaces, Class CC for control circuits.',
      'Dual-element (time-delay) fuses: preferred for motor circuits — handle inrush current without nuisance blowing.',
      'ALWAYS match fuse amp rating to the disconnect amp rating or lower. Never exceed disconnect rating.',
    ],
  },
  {
    title: 'Non-Fused Disconnect',
    content: [
      'Used when overcurrent protection is provided elsewhere (e.g., upstream breaker panel).',
      'Common in: branch circuit disconnect near motor with breaker at MCC, or for isolation only.',
      'Must still be HP-rated for motor circuits (CEC Rule 28-602).',
      'Advantage: no fuse replacement needed, simpler, lower cost.',
      'Disadvantage: no local overcurrent protection — relies on upstream device.',
    ],
  },
  {
    title: 'Combination Starter',
    content: [
      'All-in-one unit: disconnect + fuses + contactor + overload relay in one enclosure.',
      'Door interlock: disconnect must be OFF to open door. Defeat mechanism for qualified personnel only.',
      'Wiring order (top to bottom): Line power in → Fuses → Contactor → Overload → Motor out.',
      'Control transformer usually mounted inside, fed from line side.',
      'Auxiliary contacts available on contactor for control circuit and indication.',
      'NEMA ratings: NEMA 1 (indoor), NEMA 3R (outdoor rain-tight), NEMA 4X (washdown), NEMA 7/9 (hazardous).',
    ],
  },
  {
    title: 'Single Motor 3-Phase 600V',
    content: [
      'Typical connections: L1, L2, L3 on line side (top lugs). T1, T2, T3 on load side (bottom lugs).',
      'Ground conductor: bond to enclosure ground lug (green screw).',
      'Control power: tap from L1 and L2 (or L1-N if available) through control transformer to get 120V.',
      'Conduit entry: use proper connectors. Seal all unused knockouts.',
      'Wire routing: keep power and control wiring separated inside the enclosure.',
      'Phase rotation: verify with phase rotation meter before starting motor. L1-L2-L3 = A-B-C.',
    ],
  },
  {
    title: 'Multiple Loads / Tap Rules (CEC)',
    content: [
      'CEC Rule 14-100: Each motor must have its own overcurrent protection (OCP).',
      'Tap conductors (Rule 14-100(d)): max 7.5m (25 ft) for taps in industrial, must terminate in single OCP device.',
      'Each disconnect must be within sight of the motor it controls, or be capable of being locked open.',
      'Feeder conductor sizing: 125% of largest motor FLC + sum of all other motor FLCs.',
      'Feeder OCP: largest motor OCP + sum of all other motor FLCs.',
      'Keep individual motor branch circuits separate from disconnect to motor — no tapping off branch circuits.',
    ],
  },
  {
    title: 'Interlock Wiring',
    content: [
      'Door interlock: built-in mechanism prevents opening door while disconnect is ON.',
      'Defeat mechanism: slide bolt or tool-operated — only for qualified electricians working on energized equipment.',
      'Auxiliary contact for control: wired in series with control circuit to cut control power when disconnect is OFF.',
      'Remote indication: aux contact can feed back to PLC/DCS for disconnect position (ON/OFF).',
      'Safety interlock with guard: if machinery has removable guards, interlock switch on guard wired through E-stop circuit.',
    ],
  },
  {
    title: 'Disconnect Sizing (CEC Rule 28-602)',
    content: [
      'Must be rated in HP at the circuit voltage, or in amperes at 115% or more of motor FLC.',
      'Common sizes: 30A, 60A, 100A, 200A, 400A, 600A.',
      'For 600V 3-phase motors, HP rating must match or exceed motor HP.',
      'If no HP rating on disconnect, use ampere rating ≥ 115% of motor FLC.',
      'For multiple motors: disconnect rated for sum of all motor FLCs, or largest motor HP (whichever is larger).',
      'ALWAYS check both HP rating AND ampere rating — both must be adequate.',
    ],
  },
]

const wiringMistakes: string[] = [
  'Wrong torque on lug connections — always use a torque wrench and follow manufacturer specs.',
  'Mixing aluminum and copper conductors without proper bimetallic lugs (causes galvanic corrosion).',
  'Not leaving enough wire in the enclosure — need sufficient length for proper routing and future rework.',
  'Landing two wires under one lug (double-tapping) — unless the lug is specifically rated for two conductors.',
  'Wrong fuse type — using fast-acting fuses on motor circuits (will blow on inrush). Use time-delay.',
  'Incorrect phase rotation — motor runs backward. Always verify before energizing.',
  'Not bonding the enclosure ground lug to the grounding conductor.',
  'Forgetting to install anti-rotation bushings on conduit connectors.',
  'Using undersized conduit — calculate fill before pulling wire.',
  'Not labeling circuits — every disconnect should be clearly labeled with the load it serves.',
]

const disconnectChecklist: string[] = [
  'All connections torqued to manufacturer specification with calibrated torque wrench.',
  'Correct fuse type and size installed (verify against nameplate and drawings).',
  'Phase conductors: L1 (red/brown), L2 (black), L3 (blue) correctly landed.',
  'Ground conductor bonded to enclosure ground lug.',
  'Control wiring separated from power wiring inside enclosure.',
  'All unused knockouts sealed.',
  'Conduit connectors tight with anti-rotation bushings where required.',
  'Wire labels/ferrules installed on all conductors.',
  'No copper/aluminum mixing without proper bimetallic lugs.',
  'Door interlock mechanism tested — won\'t open when ON.',
  'Correct NEMA rating for the installation environment.',
  'Nameplate/circuit label installed on outside of enclosure.',
  'Phase rotation verified with meter before starting motor.',
  'Meggered motor and cable insulation resistance before energizing.',
  'Disconnect operates smoothly through full ON/OFF travel.',
  'Overload relay set to correct FLC and trip class.',
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Timers & Relays Data                                        */
/* ------------------------------------------------------------------ */

interface TimerType {
  name: string
  abbr: string
  description: string
  behavior: string
}

const timerTypes: TimerType[] = [
  { name: 'On-Delay Timer', abbr: 'TON', description: 'Output turns ON after a preset time delay. Resets instantly when de-energized.', behavior: 'Energize coil → wait → contacts change. De-energize → instant reset.' },
  { name: 'Off-Delay Timer', abbr: 'TOF', description: 'Output turns OFF after a preset time delay. Activates instantly when energized.', behavior: 'Energize coil → contacts change instantly. De-energize → wait → contacts reset.' },
  { name: 'One-Shot Timer', abbr: 'TPULSE', description: 'Produces a single timed pulse when triggered. Output ON for preset duration then OFF.', behavior: 'Trigger → output ON for set time → auto OFF. Will not re-trigger until complete.' },
  { name: 'Repeat Cycle', abbr: 'TCYCLE', description: 'Alternates ON/OFF continuously. Adjustable ON time and OFF time.', behavior: 'ON for T1 → OFF for T2 → repeat. Used for flashers, periodic pumping.' },
  { name: 'Star-Delta Timer', abbr: 'TSD', description: 'Specialized timer for Star-Delta motor starting. Pre-programmed sequence.', behavior: 'Start → Star mode for T1 → open transition gap → Delta mode.' },
]

interface RelayType {
  name: string
  abbr: string
  description: string
  contacts: string
}

const relayTypes: RelayType[] = [
  { name: 'Control Relay', abbr: 'CR', description: 'General-purpose relay for logic functions. Multiplies contacts, provides isolation.', contacts: 'Varies: 2-4 poles, NO/NC configurable' },
  { name: 'Ice Cube Relay', abbr: 'ICR', description: 'Plug-in relay with clear housing. 8-pin (DPDT) or 11-pin (3PDT). Easy to replace.', contacts: '8-pin: 2 Form C (DPDT), 11-pin: 3 Form C (3PDT)' },
  { name: 'Safety Relay', abbr: 'SR', description: 'Dual-channel input monitoring for E-stop, light curtains, safety gates. Force-guided contacts.', contacts: '3 NO safety + 1 NC auxiliary (typical)' },
  { name: 'Latching Relay', abbr: 'LR', description: 'Maintains state after coil is de-energized. Requires SET and RESET pulse. Mechanical or magnetic.', contacts: 'Same as standard relay — state is retained' },
  { name: 'Alternating Relay', abbr: 'ALT', description: 'Alternates between two outputs on successive triggers. Lead-lag pump control.', contacts: '1 Form C output — alternates A/B each cycle' },
]

const pinLayouts = {
  pin8: {
    title: '8-Pin Relay Socket (DPDT)',
    description: '2 Form C contacts (2 NO + 2 NC, shared commons). Octal base.',
    pins: [
      { pin: '1', function: 'Common 1 (C1)' },
      { pin: '2', function: 'Coil (-)' },
      { pin: '3', function: 'NC 1 (contact 1 break)' },
      { pin: '4', function: 'NO 1 (contact 1 make)' },
      { pin: '5', function: 'Common 2 (C2)' },
      { pin: '6', function: 'NC 2 (contact 2 break)' },
      { pin: '7', function: 'Coil (+)' },
      { pin: '8', function: 'NO 2 (contact 2 make)' },
    ],
  },
  pin11: {
    title: '11-Pin Relay Socket (3PDT)',
    description: '3 Form C contacts (3 NO + 3 NC, shared commons). Round base.',
    pins: [
      { pin: '1', function: 'NC 1 (contact 1 break)' },
      { pin: '2', function: 'Coil (+)' },
      { pin: '3', function: 'NC 3 (contact 3 break)' },
      { pin: '4', function: 'NO 1 (contact 1 make)' },
      { pin: '5', function: 'Common 2 (C2)' },
      { pin: '6', function: 'NO 3 (contact 3 make)' },
      { pin: '7', function: 'Coil (-)' },
      { pin: '8', function: 'NO 2 (contact 2 make)' },
      { pin: '9', function: 'Common 1 (C1)' },
      { pin: '10', function: 'Common 3 (C3)' },
      { pin: '11', function: 'NC 2 (contact 2 break)' },
    ],
  },
}

interface SafetyRelayConfig {
  name: string
  brand: string
  description: string
  wiring: string[]
}

const safetyRelayConfigs: SafetyRelayConfig[] = [
  {
    name: 'E-Stop (Dual Channel)',
    brand: 'Pilz PNOZ / AB Guardmaster',
    description: 'Two NC contacts from E-stop button wired to separate input channels (S11-S12, S21-S22). Relay monitors both channels for simultaneous opening.',
    wiring: [
      'Channel 1: E-stop NC1 → S11 input',
      'Channel 2: E-stop NC2 → S21 input',
      'Feedback: Y1/Y2 from monitored contactors → feedback input',
      'Reset: manual reset button to S33-S34 (after E-stop released)',
      'Outputs: safety contacts (13-14, 23-24) → contactor coils',
    ],
  },
  {
    name: 'Light Curtain',
    brand: 'Pilz PNOZ / AB Guardmaster',
    description: 'OSSD (Output Signal Switching Device) outputs from light curtain to safety relay inputs. Dual-channel pulsed signal.',
    wiring: [
      'OSSD1 → Safety relay input channel 1',
      'OSSD2 → Safety relay input channel 2',
      'Feedback loop from external contactors',
      'Auto-reset or manual reset depending on application risk assessment',
      'Muting sensors if needed for material pass-through',
    ],
  },
  {
    name: 'Safety Gate / Interlock Switch',
    brand: 'Pilz PNOZ / AB Guardmaster',
    description: 'Coded magnetic or tongue interlock switch provides dual NC contacts. Machine stops when gate opens.',
    wiring: [
      'Switch NC1 → Safety relay channel 1',
      'Switch NC2 → Safety relay channel 2',
      'Guard locking solenoid from safety relay output (if applicable)',
      'Feedback from power contactors to relay',
      'Manual reset recommended for safety gates',
    ],
  },
]

interface OLClass {
  classNum: string
  tripTime: string
  application: string
}

const olClasses: OLClass[] = [
  { classNum: 'Class 10', tripTime: 'Trips within 10 seconds at 6x FLA', application: 'Standard motors, pumps, fans. Most common class in mining applications.' },
  { classNum: 'Class 20', tripTime: 'Trips within 20 seconds at 6x FLA', application: 'Motors with higher inertia loads. Longer acceleration time (conveyors, loaded crushers).' },
  { classNum: 'Class 30', tripTime: 'Trips within 30 seconds at 6x FLA', application: 'High-inertia loads. Large flywheels, heavily loaded conveyors. Extended starting time.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Wire Markings Data                                          */
/* ------------------------------------------------------------------ */

interface ColorCode {
  conductor: string
  color: string
  css: string
  notes: string
}

const cecColorCodes: ColorCode[] = [
  { conductor: 'Phase A', color: 'Red', css: '#e53e3e', notes: 'First ungrounded conductor (600V 3-phase systems)' },
  { conductor: 'Phase B', color: 'Black', css: '#333', notes: 'Second ungrounded conductor' },
  { conductor: 'Phase C', color: 'Blue', css: '#3182ce', notes: 'Third ungrounded conductor' },
  { conductor: 'Neutral', color: 'White', css: '#f0f0f0', notes: 'Grounded conductor. Must not be used for any other purpose.' },
  { conductor: 'Ground', color: 'Green or Green/Yellow', css: '#38a169', notes: 'Equipment bonding conductor. Green/yellow stripe for IEC.' },
  { conductor: 'Control (120V)', color: 'Yellow/Red', css: '#e8a030', notes: 'Common in industrial control circuits from CPT secondary' },
  { conductor: 'Control (IT/Delta)', color: 'Orange', css: '#dd6b20', notes: 'Ungrounded control power from delta secondary or IT system' },
  { conductor: 'DC Positive', color: 'Red', css: '#e53e3e', notes: 'Positive DC conductor' },
  { conductor: 'DC Negative', color: 'Black or Blue', css: '#333', notes: 'Negative DC conductor' },
]

interface WireNumber {
  range: string
  meaning: string
}

const wireNumbers: WireNumber[] = [
  { range: '1, 2, 3', meaning: 'Power conductors (L1, L2, L3) — line side of disconnect' },
  { range: '4, 5, 6', meaning: 'Load side power (T1, T2, T3) — disconnect to starter' },
  { range: '7, 8, 9', meaning: 'Motor leads (T1, T2, T3) — starter to motor' },
  { range: '100-199', meaning: 'Control circuit — first control function (e.g., start/stop)' },
  { range: '200-299', meaning: 'Control circuit — second function (e.g., forward/reverse)' },
  { range: '300-399', meaning: 'Control circuit — third function (e.g., speed control)' },
  { range: '400-499', meaning: 'Interlock circuits (safety interlocks, door switches)' },
  { range: '500-599', meaning: 'Indication / pilot light circuits' },
  { range: '600-699', meaning: 'Analog circuits (4-20mA signals, RTD inputs)' },
  { range: '700-799', meaning: 'Communication / data (if applicable)' },
]

interface TerminalDesignation {
  terminal: string
  meaning: string
}

const terminalDesignations: TerminalDesignation[] = [
  { terminal: 'L1, L2, L3', meaning: 'Line (incoming power) terminals' },
  { terminal: 'T1, T2, T3', meaning: 'Load (outgoing to motor) terminals' },
  { terminal: 'A1, A2', meaning: 'Coil terminals (A1 = positive, A2 = negative/return)' },
  { terminal: '13-14', meaning: 'First NO auxiliary contact (IEC standard)' },
  { terminal: '21-22', meaning: 'First NC auxiliary contact (IEC standard)' },
  { terminal: '23-24', meaning: 'Second NO auxiliary contact' },
  { terminal: '31-32', meaning: 'Second NC auxiliary contact' },
  { terminal: '43-44', meaning: 'Third NO auxiliary contact' },
  { terminal: '53-54', meaning: 'Fourth NO auxiliary contact (on larger contactors)' },
  { terminal: '95-96', meaning: 'Overload relay NC contact (trips on overload)' },
  { terminal: '97-98', meaning: 'Overload relay NO contact (for alarm/indication)' },
  { terminal: 'X1, X2', meaning: 'Control transformer primary terminals' },
  { terminal: 'H1, H2, H3, H4', meaning: 'Control transformer primary (high voltage) connections' },
  { terminal: 'X1, X2, X3, X4', meaning: 'Control transformer secondary (low voltage) connections' },
]

const panelLabelingTips: string[] = [
  'Label every wire at both ends with ferrules or wire markers.',
  'Use heat-shrink wire markers for permanent, legible identification — Brady or equivalent.',
  'Match wire numbers to the electrical drawing/schematic.',
  'Label all terminal blocks with clear, sequential numbering.',
  'Control panel door should have pocket with as-built drawings.',
  'Each device should have a nameplate matching the drawing designation (M1, CR1, TR1, etc.).',
  'Use DIN rail-mounted terminal blocks with marking strips for clean organization.',
  'Color-code power vs. control vs. signal wiring for easy identification.',
  'Ferrule types: pin ferrules for stranded wire into spring-clamp terminals, bootlace ferrules for screw terminals.',
  'Brady BMP21+ or equivalent label printer is standard for most mine electrical shops.',
]

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */

const pillRow: React.CSSProperties = {
  display: 'flex', gap: 6, overflowX: 'auto',
  WebkitOverflowScrolling: 'touch', paddingBottom: 4, scrollbarWidth: 'none',
}
const pillBase: React.CSSProperties = {
  flexShrink: 0, minHeight: 48, padding: '0 14px', borderRadius: 24,
  fontSize: 13, fontWeight: 600, border: '2px solid var(--divider)',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
}
const pillActive: React.CSSProperties = {
  ...pillBase, background: 'var(--primary)', color: '#000',
  border: '2px solid var(--primary)',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--divider)',
  borderRadius: 'var(--radius)',
  overflow: 'hidden',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'circuits', label: 'Basic Circuits' },
  { key: 'symbols', label: 'Symbols' },
  { key: 'disconnect', label: 'Disconnect Wiring' },
  { key: 'timers', label: 'Timers & Relays' },
  { key: 'markings', label: 'Wire Markings' },
]

/* ------------------------------------------------------------------ */
/*  Collapsible Card Sub-Component                                     */
/* ------------------------------------------------------------------ */

function CollapsibleCard({ title, defaultOpen, children, accentColor }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  accentColor?: string
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div style={{
      ...cardStyle,
      borderLeft: accentColor ? `4px solid ${accentColor}` : undefined,
    }}>
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
      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ControlCircuitsPage() {
  const [tab, setTab] = useState<TabKey>('circuits')
  const [expandedCircuit, setExpandedCircuit] = useState<number | null>(null)

  return (
    <>
      <Header title="Control Circuits" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button key={t.key} style={tab === t.key ? pillActive : pillBase}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB 1: Basic Circuits                                        */}
        {/* ============================================================ */}
        {tab === 'circuits' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Common Control Circuit Diagrams</div>
            {circuits.map((c, idx) => (
              <div key={c.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedCircuit(expandedCircuit === idx ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 16px',
                    minHeight: 56,
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--primary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <svg
                    width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{
                      flexShrink: 0,
                      transform: expandedCircuit === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                    background: 'var(--input-bg)', padding: '2px 8px', borderRadius: 10,
                  }}>
                    LADDER
                  </span>
                </button>

                {expandedCircuit === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Schematic */}
                    <div style={{
                      background: '#0a0a0a',
                      border: '1px solid var(--divider)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                    }}>
                      <pre style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        lineHeight: 1.4,
                        color: '#22d867',
                        margin: 0,
                        whiteSpace: 'pre',
                      }}>
                        {c.schematic}
                      </pre>
                    </div>

                    {/* How it Works */}
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                        textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
                      }}>
                        How It Works
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                        {c.howItWorks}
                      </div>
                    </div>

                    {/* Key Components */}
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                        textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
                      }}>
                        Key Components
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {c.keyComponents.map((comp, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0', paddingLeft: 12,
                            borderLeft: '2px solid var(--primary)',
                          }}>
                            {comp}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety Interlocks */}
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: '#ff6b6b',
                        textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
                      }}>
                        Safety Interlocks
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {c.safetyInterlocks.map((item, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px',
                            borderLeft: '2px solid #ff6b6b',
                          }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mining Applications */}
                    <div style={{
                      background: 'var(--input-bg)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                    }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                        textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
                      }}>
                        Mining Applications
                      </div>
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 6,
                      }}>
                        {c.miningApps.map((app, i) => (
                          <span key={i} style={{
                            fontSize: 12, padding: '4px 10px',
                            background: 'var(--surface)',
                            border: '1px solid var(--divider)',
                            borderRadius: 12, color: 'var(--text)',
                          }}>
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Symbols                                               */}
        {/* ============================================================ */}
        {tab === 'symbols' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {symbolGroups.map(group => (
              <div key={group.title}>
                <div style={sectionTitle}>{group.title}</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 8,
                }}>
                  {group.entries.map(entry => (
                    <div key={entry.abbr} style={{
                      ...cardStyle,
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                          color: '#22d867',
                          background: '#0a0a0a',
                          padding: '2px 8px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                        }}>
                          {entry.symbol}
                        </span>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--primary)',
                        }}>
                          {entry.abbr}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {entry.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {entry.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Disconnect Wiring                                     */}
        {/* ============================================================ */}
        {tab === 'disconnect' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Disconnect Wiring Reference</div>

            {disconnectSections.map(section => (
              <CollapsibleCard key={section.title} title={section.title}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {section.content.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                      padding: '6px 0 6px 12px',
                      borderLeft: '2px solid var(--divider)',
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            ))}

            {/* Common Wiring Mistakes */}
            <CollapsibleCard title="Common Wiring Mistakes" accentColor="#ff6b6b">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {wiringMistakes.map((mistake, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                    padding: '6px 0',
                    borderBottom: i < wiringMistakes.length - 1 ? '1px solid var(--divider)' : undefined,
                  }}>
                    <span style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(255,107,107,0.15)', color: '#ff6b6b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, marginTop: 2,
                    }}>
                      {i + 1}
                    </span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Disconnect Wiring Checklist */}
            <CollapsibleCard title="Disconnect Wiring Checklist" accentColor="#38a169">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {disconnectChecklist.map((item, i) => (
                  <ChecklistItem key={i} text={item} />
                ))}
              </div>
            </CollapsibleCard>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Timers & Relays                                       */}
        {/* ============================================================ */}
        {tab === 'timers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Timer Types */}
            <div>
              <div style={sectionTitle}>Timer Types</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {timerTypes.map(t => (
                  <div key={t.abbr} style={{
                    ...cardStyle,
                    padding: '14px',
                    borderLeft: '4px solid var(--primary)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 700,
                        color: 'var(--primary)', fontSize: 14,
                      }}>
                        {t.abbr}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                        {t.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                      {t.description}
                    </div>
                    <div style={{
                      fontSize: 13, fontFamily: 'var(--font-mono)',
                      color: '#22d867', background: '#0a0a0a',
                      padding: '8px 10px', borderRadius: 4,
                    }}>
                      {t.behavior}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Wiring (8-pin, 11-pin) */}
            <div>
              <div style={sectionTitle}>Timer/Relay Socket Wiring</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* 8-Pin Socket */}
                <div style={{ ...cardStyle, padding: '14px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {pinLayouts.pin8.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                    {pinLayouts.pin8.description}
                  </div>
                  {/* Pin diagram */}
                  <div style={{
                    background: '#0a0a0a', borderRadius: 'var(--radius-sm)',
                    padding: '14px', marginBottom: 10,
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5,
                      color: '#22d867', margin: 0, textAlign: 'center', whiteSpace: 'pre',
                    }}>
{`     ___________
    /  8     1  \\
   |  7       2  |
   |  6       3  |
    \\  5     4  /
     \_________/
    (bottom view)`}
                    </pre>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pinLayouts.pin8.pins.map(p => (
                      <div key={p.pin} style={{
                        display: 'flex', gap: 10, padding: '6px 0',
                        borderBottom: '1px solid var(--divider)', alignItems: 'center',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontWeight: 700,
                          color: 'var(--primary)', fontSize: 14, minWidth: 36,
                        }}>
                          Pin {p.pin}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text)' }}>
                          {p.function}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 11-Pin Socket */}
                <div style={{ ...cardStyle, padding: '14px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {pinLayouts.pin11.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                    {pinLayouts.pin11.description}
                  </div>
                  {/* Pin diagram */}
                  <div style={{
                    background: '#0a0a0a', borderRadius: 'var(--radius-sm)',
                    padding: '14px', marginBottom: 10,
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.5,
                      color: '#22d867', margin: 0, textAlign: 'center', whiteSpace: 'pre',
                    }}>
{`       ___________
      / 11    1  \\
     | 10      2  |
     |  9      3  |
     |  8      4  |
     |  7      5  |
      \\    6    /
       \_______/
      (bottom view)`}
                    </pre>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pinLayouts.pin11.pins.map(p => (
                      <div key={p.pin} style={{
                        display: 'flex', gap: 10, padding: '6px 0',
                        borderBottom: '1px solid var(--divider)', alignItems: 'center',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontWeight: 700,
                          color: 'var(--primary)', fontSize: 14, minWidth: 44,
                        }}>
                          Pin {p.pin}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text)' }}>
                          {p.function}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Relay Types */}
            <div>
              <div style={sectionTitle}>Relay Types</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relayTypes.map(r => (
                  <div key={r.abbr} style={{
                    ...cardStyle,
                    padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 700,
                        color: 'var(--primary)', fontSize: 14,
                      }}>
                        {r.abbr}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                        {r.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                      {r.description}
                    </div>
                    <div style={{
                      fontSize: 13, color: 'var(--text)',
                      background: 'var(--input-bg)',
                      padding: '6px 10px', borderRadius: 4,
                    }}>
                      <strong>Contacts:</strong> {r.contacts}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Relays */}
            <div>
              <div style={sectionTitle}>Safety Relay Configurations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {safetyRelayConfigs.map(config => (
                  <CollapsibleCard key={config.name} title={`${config.name} (${config.brand})`} accentColor="#ff6b6b">
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 10 }}>
                      {config.description}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
                      textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
                    }}>
                      Typical Wiring
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {config.wiring.map((w, i) => (
                        <div key={i} style={{
                          fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                          padding: '4px 0 4px 12px',
                          borderLeft: '2px solid #ff6b6b',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {w}
                        </div>
                      ))}
                    </div>
                  </CollapsibleCard>
                ))}
              </div>
            </div>

            {/* Overload Relay Classes */}
            <div>
              <div style={sectionTitle}>Overload Relay Classes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {olClasses.map(ol => (
                  <div key={ol.classNum} style={{
                    ...cardStyle,
                    padding: '14px',
                    borderLeft: '4px solid var(--primary)',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                      {ol.classNum}
                    </div>
                    <div style={{
                      fontSize: 14, fontFamily: 'var(--font-mono)',
                      color: 'var(--text)', marginBottom: 6,
                    }}>
                      {ol.tripTime}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ol.application}
                    </div>
                  </div>
                ))}
              </div>

              {/* OL setting procedure */}
              <div style={{
                ...cardStyle,
                marginTop: 10,
                padding: '14px',
                background: 'var(--input-bg)',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--text)',
                  marginBottom: 8,
                }}>
                  Overload Setting Procedure
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Read motor nameplate FLA (Full Load Amps).',
                    'Set overload trip current to 100% of nameplate FLA (electronic OL) or 105-115% for thermal OL.',
                    'Select correct trip class: Class 10 for standard, Class 20 for high-inertia.',
                    'Enable phase-loss protection (electronic OL only).',
                    'Test trip function: use test button or simulate overload.',
                    'Record settings on the starter nameplate or maintenance log.',
                  ].map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, fontSize: 13, color: 'var(--text)',
                      lineHeight: 1.5,
                    }}>
                      <span style={{
                        flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--primary)', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, marginTop: 1,
                      }}>
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Wire Markings                                         */}
        {/* ============================================================ */}
        {tab === 'markings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* CEC Color Codes */}
            <div>
              <div style={sectionTitle}>CEC Conductor Color Codes</div>
              <div style={{
                ...cardStyle,
                overflow: 'hidden',
              }}>
                {cecColorCodes.map((cc, i) => (
                  <div key={cc.conductor} style={{
                    display: 'flex', gap: 12, padding: '10px 14px',
                    borderBottom: i < cecColorCodes.length - 1 ? '1px solid var(--divider)' : undefined,
                    alignItems: 'center', minHeight: 48,
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: cc.css, flexShrink: 0,
                      border: cc.color.includes('White') ? '2px solid var(--divider)' : '2px solid transparent',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                        {cc.conductor}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {cc.color}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4,
                      textAlign: 'right', maxWidth: '50%',
                    }}>
                      {cc.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wire Numbering */}
            <div>
              <div style={sectionTitle}>Wire Numbering Conventions</div>
              <div style={{
                ...cardStyle,
                overflow: 'hidden',
              }}>
                {wireNumbers.map((wn, i) => (
                  <div key={wn.range} style={{
                    display: 'flex', gap: 12, padding: '10px 14px',
                    borderBottom: i < wireNumbers.length - 1 ? '1px solid var(--divider)' : undefined,
                    alignItems: 'center', minHeight: 48,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--primary)', fontSize: 14,
                      minWidth: 70, flexShrink: 0,
                    }}>
                      {wn.range}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>
                      {wn.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Designations */}
            <div>
              <div style={sectionTitle}>Common Terminal Designations (IEC)</div>
              <div style={{
                ...cardStyle,
                overflow: 'hidden',
              }}>
                {terminalDesignations.map((td, i) => (
                  <div key={td.terminal} style={{
                    display: 'flex', gap: 12, padding: '10px 14px',
                    borderBottom: i < terminalDesignations.length - 1 ? '1px solid var(--divider)' : undefined,
                    alignItems: 'center', minHeight: 44,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--primary)', fontSize: 13,
                      minWidth: 70, flexShrink: 0,
                      background: '#0a0a0a', padding: '2px 8px',
                      borderRadius: 4, textAlign: 'center',
                    }}>
                      {td.terminal}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>
                      {td.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Labeling Best Practices */}
            <CollapsibleCard title="Panel Labeling Best Practices">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {panelLabelingTips.map((tip, i) => (
                  <div key={i} style={{
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                    padding: '6px 0 6px 12px',
                    borderLeft: '2px solid var(--primary)',
                  }}>
                    {tip}
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Ferrule & Wire Marker Types */}
            <CollapsibleCard title="Ferrule & Wire Marker Types">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { type: 'Pin Ferrules', desc: 'Crimped onto stranded wire ends. Required for spring-clamp terminals (Wago, Phoenix Contact). Prevents strand fraying.' },
                  { type: 'Bootlace Ferrules', desc: 'Insulated ferrules for screw terminals. Color-coded by wire size (orange=#20, white=#18, red=#16, black=#14, grey=#12, yellow=#10).' },
                  { type: 'Twin Ferrules', desc: 'Accepts two wires in one ferrule for double-landing on a single terminal. Use only where approved.' },
                  { type: 'Heat-Shrink Markers', desc: 'Permanent, durable identification. Print with Brady BMP21+ or equivalent. Standard in mining control panels.' },
                  { type: 'Wrap-Around Labels', desc: 'Self-laminating labels that wrap around the conductor. Good for larger wire sizes.' },
                  { type: 'Clip-On Markers', desc: 'Snap-on individual characters. Quick to apply but can fall off. Good for temporary identification.' },
                  { type: 'Sleeve Markers', desc: 'Pre-printed or blank sleeves that slide over wire before termination. Must be installed before connecting.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', marginBottom: 2 }}>
                      {item.type}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>
          </div>
        )}

        {/* Reference note */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px',
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC Section 28 (Motors),
          CEC Rule 26-252 (Transformers), CEC Rule 14-100 (Overcurrent),
          CEC Rule 28-602 (Disconnect Sizing), CSA C22.2, IEC 60947,
          O. Reg. 854 (Mines & Mining Plants)
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Checklist Item Sub-Component                                       */
/* ------------------------------------------------------------------ */

function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <button
      onClick={() => setChecked(!checked)}
      style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        padding: '8px 0', minHeight: 44,
        background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left', width: '100%',
      }}
    >
      <span style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: 4,
        border: checked ? '2px solid #38a169' : '2px solid var(--divider)',
        background: checked ? '#38a169' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1, transition: 'all 0.15s',
      }}>
        {checked && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </span>
      <span style={{
        fontSize: 14, lineHeight: 1.5,
        color: checked ? 'var(--text-secondary)' : 'var(--text)',
        textDecoration: checked ? 'line-through' : 'none',
        transition: 'all 0.15s',
      }}>
        {text}
      </span>
    </button>
  )
}
