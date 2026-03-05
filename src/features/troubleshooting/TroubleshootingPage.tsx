import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Electrical Troubleshooting Guide - Ontario Mining Electricians     */
/* ------------------------------------------------------------------ */

type TabKey = 'motors' | 'controls' | 'power' | 'grounding' | 'tools'

interface TroubleshootingItem {
  title: string
  severity?: 'warning' | 'critical' | 'info'
  steps?: string[]
  notes?: string
  subItems?: { label: string; detail: string; color?: string }[]
  table?: { headers: string[]; rows: string[][] }
}

interface TroubleshootingSection {
  heading: string
  items: TroubleshootingItem[]
}

/* ------------------------------------------------------------------ */
/*  TAB 1: Motors                                                      */
/* ------------------------------------------------------------------ */

const motorSections: TroubleshootingSection[] = [
  {
    heading: 'Motor Won\'t Start',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Check power supply at disconnect — all 3 phases present? Measure L1-L2, L2-L3, L1-L3',
          'Check overloads (thermal or electronic) — tripped? Reset and check amps. If trips again, do NOT keep resetting',
          'Check contactor — coil pulling in? Listen for click. Check contacts for welding or pitting',
          'Check control circuit — start/stop buttons, selector switches, interlocks, safety relays',
          'Check motor windings — measure T1-T2, T2-T3, T1-T3 resistance (should be balanced within 5%)',
          'Check mechanical binding — disconnect motor from load, attempt to rotate shaft by hand',
        ],
        notes: 'Always verify your tester works on a known live source before and after testing a dead circuit.',
      },
      {
        title: 'Expected Winding Resistance Readings',
        subItems: [
          { label: 'Phase-to-Phase', detail: 'Should be balanced within 5%. Typical range: 0.3Ω to 20Ω depending on HP and voltage. Compare all three pairs — if one reads significantly different, suspect a winding fault.', color: 'var(--primary)' },
          { label: 'Phase-to-Ground (Megger)', detail: 'Minimum acceptable: 1 MΩ per kV of rated voltage + 1 MΩ (e.g., 480V motor = 1.48 MΩ min). New motor should read >100 MΩ. Below 5 MΩ = investigate.', color: 'var(--primary)' },
        ],
        table: {
          headers: ['Motor Voltage', 'Test Voltage', 'Min Insulation'],
          rows: [
            ['<1000V', '500V DC', '1 MΩ/kV + 1 MΩ'],
            ['1000–2500V', '1000V DC', '100 MΩ'],
            ['2500–5000V', '2500V DC', '100 MΩ'],
            ['5000‒13800V', '5000V DC', '1000 MΩ'],
          ],
        },
      },
    ],
  },
  {
    heading: 'Motor Runs Hot',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Check load — is the motor loaded beyond nameplate FLA? Measure amps on all 3 phases',
          'Check ventilation — fan turning? Air passages clear? Fan cover not blocked with debris/dust',
          'Check voltage unbalance — >2% unbalance causes significant heating (see Power tab calculator)',
          'Check current per phase — unbalanced current indicates winding or connection issue',
          'Check bearings — listen for noise, feel for excessive heat at bearing housings (>80°C = problem)',
          'Check alignment — misalignment causes bearing load, vibration, and excess heat',
        ],
        notes: 'A motor running at 10% above rated amps will experience a roughly 20% increase in winding temperature rise. Insulation life halves for every 10°C above rated temperature.',
      },
    ],
  },
  {
    heading: 'Motor Trips on Overload',
    items: [
      {
        title: 'Decision Tree',
        severity: 'warning',
        steps: [
          'Measure running amps vs nameplate FLA — if amps exceed nameplate, check mechanical load',
          'Check for single-phasing — one phase lost means remaining phases carry √3x current (~173%)',
          'Check supply voltage — low voltage = high current. Every 10% voltage drop ≈ 10% current increase',
          'Check mechanical load — binding, jammed, worn bearings, overloaded conveyor, frozen pump',
          'Check starter heater/OL sizing — heaters must match motor FLA and service factor. Ambient temp affects trip point',
        ],
        notes: 'For electronic overloads: verify the trip class setting (10, 20, or 30) matches the application. Class 10 for general purpose, Class 20 for harder starting loads, Class 30 for high-inertia loads.',
      },
    ],
  },
  {
    heading: 'Motor Vibrates',
    items: [
      {
        title: 'Decision Tree',
        steps: [
          'Check mounting bolts — loose mounting is the #1 cause. Torque all base bolts to spec',
          'Check coupling alignment — use dial indicators or laser alignment. Parallel and angular',
          'Check bearing condition — growling, grinding, or rumbling noise. Check bearing temperature',
          'Check voltage balance — unbalanced voltage causes unbalanced magnetic pull in the air gap',
          'Check for single-phasing — causes 2x line frequency vibration (120Hz on 60Hz system)',
          'Check rotor bars — broken rotor bars cause pulsating current and vibration at slip frequency',
        ],
        notes: 'Quick test: if vibration disappears instantly when power is removed, it is electrical. If vibration coasts down, it is mechanical.',
      },
    ],
  },
  {
    heading: 'VFD Faults',
    items: [
      {
        title: 'Common VFD Fault Codes',
        severity: 'info',
        subItems: [
          { label: 'Overcurrent (OC)', detail: 'Check motor windings for shorts. Check output cable length (<100m without reactor). Check for ground fault on output. Reduce accel ramp if faulting on start.', color: '#ff3c3c' },
          { label: 'Overvoltage (OV)', detail: 'Check input voltage. Check decel ramp (too fast = regenerative overvoltage). Add dynamic braking resistor for high-inertia loads. Check DC bus voltage.', color: '#ff8c00' },
          { label: 'Undervoltage (UV)', detail: 'Check input power supply stability. Check for voltage sags. Check DC bus capacitors (aged caps = low bus voltage). Check input fuses/breaker.', color: '#ff8c00' },
          { label: 'Ground Fault (GF)', detail: 'Megger motor and cable (disconnect VFD first!). Check cable terminations for moisture. Check motor leads for chafing. Common in mining due to harsh environment.', color: '#ff3c3c' },
          { label: 'Overtemperature (OT)', detail: 'Check ambient temperature. Check fan operation. Check heatsink fins for dust/debris buildup. Ensure minimum clearances around VFD enclosure are maintained.', color: '#ff8c00' },
        ],
        notes: 'CRITICAL: Never megger a VFD output! Always disconnect motor leads from VFD before insulation testing. VFD IGBTs will be destroyed by megger voltage.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  TAB 2: Controls                                                    */
/* ------------------------------------------------------------------ */

const controlSections: TroubleshootingSection[] = [
  {
    heading: 'Systematic Approach',
    items: [
      {
        title: 'Control Circuit Troubleshooting Method',
        severity: 'info',
        steps: [
          'Start at the power source — verify control transformer output voltage (120VAC, 24VDC, 24VAC)',
          'Check fuse or breaker on control circuit — blown fuse is a symptom, find the cause before replacing',
          'Follow the circuit from L1 (hot) through each device toward L2 (neutral/common)',
          'Test voltage at each device — voltage present on both sides = good device. Voltage on one side only = open device found',
          'For 24VDC circuits: check power supply output. LED indicator on supply should be green. Measure output with a meter, not just the LED',
          'Check for intermittent connections — wiggle wires at terminals while monitoring the circuit',
        ],
        notes: 'The device that has voltage on the supply side but NOT on the load side is your failed component. This is the fundamental rule of series circuit troubleshooting.',
      },
    ],
  },
  {
    heading: 'Common Control Issues',
    items: [
      {
        title: 'Connection & Contact Problems',
        subItems: [
          { label: 'Loose Connections', detail: 'Number one cause of control circuit failures. Vibration in mining environments loosens terminals over time. Re-torque annually. Look for discolored wires at terminals (heat = loose).', color: '#ff8c00' },
          { label: 'Failed Relay Coils', detail: 'Measure coil resistance — open reads infinite. A shorted coil reads very low. Check for correct coil voltage rating (120VAC coil on 24VDC = no pickup). Transient voltage can kill coils — add suppression.', color: 'var(--primary)' },
          { label: 'Stuck Contacts', detail: 'Contacts can weld shut under high current or arc. NO contact stuck closed or NC contact stuck open. Physically check contact operation. Replace the entire relay, not just contacts.', color: '#ff8c00' },
          { label: 'Burnt Contact Tips', detail: 'Look for blackened, pitted, or deformed contact surfaces. Caused by arcing during open/close. High-inductive loads (coils, solenoids) without suppression are the usual culprit.', color: 'var(--primary)' },
          { label: 'Control Transformer Issues', detail: 'Check primary and secondary fuses. Measure secondary voltage under load. Overloaded transformers run hot and voltage drops. Size: total VA of all coils + 25% margin.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Contactor Troubleshooting',
    items: [
      {
        title: 'Common Contactor Problems',
        severity: 'warning',
        subItems: [
          { label: 'Chattering/Buzzing', detail: 'Low control voltage (measure at coil). Broken shading coil on AC contactor (causes AC buzz). Dirty/misaligned armature face. Foreign material in air gap. Mechanical binding.', color: '#ff3c3c' },
          { label: 'Won\'t Pick Up', detail: 'No control power → check upstream fuse/breaker. Open coil → measure coil resistance. Wrong coil voltage → verify rating matches supply. Mechanical binding → check for debris or rust. Interlock preventing pickup.', color: '#ff8c00' },
          { label: 'Won\'t Drop Out', detail: 'Welded main contacts → replace contactor. Stuck armature → clean contact faces, check spring. Voltage still applied to coil → trace control circuit. Residual magnetism in worn contactor → replace.', color: '#ff3c3c' },
        ],
        notes: 'Chattering contactors will rapidly destroy contacts and can weld shut. Do not leave chattering — remove from service immediately.',
      },
    ],
  },
  {
    heading: 'Timer Troubleshooting',
    items: [
      {
        title: 'Timer Issues',
        subItems: [
          { label: 'Wrong Timing Mode', detail: 'ON-delay vs OFF-delay — most common wiring mistake. ON-delay: coil energizes, waits, then contacts change. OFF-delay: contacts change immediately, then revert after delay on de-energize.', color: 'var(--primary)' },
          { label: 'Failed Output', detail: 'Timer display shows but contacts don\'t change — internal relay failed. No display — no power or timer is dead. Check for correct input signal (voltage vs dry contact).', color: 'var(--primary)' },
          { label: 'Incorrect Wiring', detail: 'Check if using timed contacts or instantaneous contacts (most timers have both). Verify trigger input type: voltage trigger vs contact trigger. Check time base setting (sec, min, hr).', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Safety Relay Troubleshooting',
    items: [
      {
        title: 'Safety Relay Issues',
        severity: 'critical',
        subItems: [
          { label: 'Won\'t Reset', detail: 'Feedback circuit open — check that monitoring contacts from external contactors are wired back to safety relay. E-stop still pressed or latched. Input device (light curtain, guard switch) still tripped. Check LED status indicators on relay.', color: '#ff3c3c' },
          { label: 'Feedback Circuit Issues', detail: 'Safety relays monitor external contactor auxiliary contacts to verify contactors actually dropped out. If contactor welds, feedback opens, preventing reset. This is a SAFETY FEATURE — do not bypass.', color: '#ff3c3c' },
          { label: 'Muting Problems', detail: 'Muting sensors out of alignment (common on conveyors). Muting sequence incorrect — sensors must activate in the correct order. Muting lamp burnt out — indicates muting is active, required by code.', color: '#ff8c00' },
        ],
        notes: 'NEVER bypass a safety relay. If the machine won\'t run because the safety circuit is open, FIND AND FIX THE PROBLEM. Bypassing safety circuits has killed electricians.',
      },
    ],
  },
  {
    heading: 'Common Control Voltages',
    items: [
      {
        title: 'Control Voltage Reference',
        table: {
          headers: ['Voltage', 'Type', 'Common Use'],
          rows: [
            ['120VAC', 'AC', 'Motor starters, contactors, pilot lights, most industrial control circuits in North America'],
            ['24VDC', 'DC', 'PLCs, safety relays, sensors, solenoid valves, modern control systems. Safer for panel wiring.'],
            ['24VAC', 'AC', 'HVAC controls, thermostats, some legacy valve actuators. Less common in mining.'],
            ['240VAC', 'AC', 'Some older or large contactor coils. Common on mining equipment from overseas.'],
            ['48VDC', 'DC', 'Telecommunications, some mine communication systems, DC control on mobile equipment.'],
            ['12VDC', 'DC', 'Mobile mining equipment controls, vehicle electrical systems, some instrumentation.'],
          ],
        },
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  TAB 3: Power                                                       */
/* ------------------------------------------------------------------ */

const powerSections: TroubleshootingSection[] = [
  {
    heading: 'Phase Loss Detection',
    items: [
      {
        title: 'Symptoms & Testing',
        severity: 'critical',
        subItems: [
          { label: 'Symptoms', detail: 'Motors hum but won\'t start (single-phase condition). Motors run hot. Lights flicker. VFDs fault on input phase loss. Breakers trip without obvious overload.', color: '#ff3c3c' },
          { label: 'Testing', detail: 'Measure L1-L2, L2-L3, L1-L3 at the main disconnect. Voltage on one pair will be zero or very low if a phase is lost. Check upstream: utility feed, main breaker, fuse (one blown).', color: 'var(--primary)' },
          { label: 'Protection', detail: 'Install phase-loss relays (phase monitor relays) on critical circuits. Modern motor starters have electronic OLs with phase-loss detection built in. VFDs inherently detect input phase loss.', color: '#4caf50' },
        ],
        notes: 'Single-phasing is one of the most destructive faults for 3-phase motors. The remaining two phases carry 173% of normal current. Motors can burn out in minutes.',
      },
    ],
  },
  {
    heading: 'Voltage Unbalance',
    items: [
      {
        title: 'Calculation & Limits',
        severity: 'warning',
        steps: [
          'Measure all three phase-to-phase voltages: V_AB, V_BC, V_CA',
          'Calculate average: V_avg = (V_AB + V_BC + V_CA) / 3',
          'Find the voltage that deviates most from the average',
          'Calculate: % Unbalance = (Max Deviation / V_avg) x 100',
          'Acceptable limit: < 2% — above 2%, investigate and correct',
        ],
        subItems: [
          { label: 'Effects of Unbalance', detail: '1% voltage unbalance = 6-10% current unbalance. 3.5% voltage unbalance = motor must be derated by ~25%. Causes hot spots in windings, reduces bearing life, increases vibration.', color: '#ff8c00' },
          { label: 'Common Causes', detail: 'Unbalanced single-phase loads on the system. Blown power factor correction capacitor (one phase). Unequal transformer tap settings. Poor connections on one phase. Utility supply issue.', color: 'var(--primary)' },
        ],
      },
      {
        title: 'Voltage Unbalance Calculator',
        severity: 'info',
        notes: 'USE_CALCULATOR',
      },
    ],
  },
  {
    heading: 'Harmonics',
    items: [
      {
        title: 'Sources, Symptoms & Measurement',
        subItems: [
          { label: 'Sources', detail: 'VFDs (largest source in mining), LED/fluorescent lighting, computer/PLC power supplies, battery chargers, welding equipment, arc furnaces. Anything with a solid-state power converter.', color: 'var(--primary)' },
          { label: 'Symptoms', detail: 'Overheated neutral conductor (triplen harmonics add on neutral). Nuisance breaker trips. Transformer buzzing/overheating. Motor overheating with normal amps. Flickering or dimming lights. Communication interference.', color: '#ff8c00' },
          { label: 'Measurement', detail: 'Requires a power quality analyzer with harmonic measurement (e.g., Fluke 435). Total Harmonic Distortion (THD) should be < 5% at PCC per IEEE 519. Individual harmonics: 5th and 7th are most common from VFDs.', color: 'var(--primary)' },
          { label: 'Solutions', detail: 'Line reactors (3-5% impedance) on VFD inputs. Harmonic filters (passive or active). 12/18/24-pulse VFD front ends. K-rated transformers for harmonic-heavy loads. Oversized neutral conductors (200% for triplen harmonics).', color: '#4caf50' },
        ],
      },
    ],
  },
  {
    heading: 'Ground Faults',
    items: [
      {
        title: 'Systematic Isolation Procedure',
        severity: 'critical',
        steps: [
          'Identify affected circuit from ground fault relay indication or alarm panel',
          'De-energize and lock out the circuit',
          'Disconnect all loads (motors, heaters, etc.) from the circuit',
          'Megger the cable from the distribution panel — if good, cable is OK',
          'Reconnect loads one at a time, megger after each — fault returns when bad load is connected',
          'For the faulted load: megger phase-to-ground on each conductor. The low reading identifies the faulted phase',
          'For motor faults: check lead connections for moisture, check inside motor junction box, inspect cable entry',
        ],
        notes: 'In mining HRG systems, the ground fault relay will alarm but not trip on the first fault. This is intentional — it allows continued operation while you locate the fault. A SECOND ground fault creates a phase-to-phase fault through ground. Find and fix the first fault urgently.',
      },
      {
        title: 'Insulation Resistance Testing',
        table: {
          headers: ['Equipment Voltage', 'Test Voltage', 'Min. Acceptable'],
          rows: [
            ['<250V', '500V DC', '0.5 MΩ'],
            ['250–600V', '1000V DC', '1.0 MΩ'],
            ['600–1000V', '1000V DC', '2.0 MΩ'],
            ['1000–2500V', '2500V DC', '5.0 MΩ'],
            ['2500–5000V', '5000V DC', '20 MΩ'],
          ],
        },
        notes: 'For mining trailing cables: O. Reg. 854 requires minimum 1 MΩ per kV + 1 MΩ. Test after any repair or splice. Record all readings — trending is as important as absolute values.',
      },
    ],
  },
  {
    heading: 'Nuisance Tripping',
    items: [
      {
        title: 'Common Causes',
        subItems: [
          { label: 'Overloaded Circuits', detail: 'Circuit loaded to >80% of breaker rating on continuous loads. Calculate actual load vs breaker capacity. Add up ALL loads on the circuit, including receptacles and lighting.', color: '#ff8c00' },
          { label: 'Loose Connections', detail: 'High resistance at loose lugs creates heat and can cause thermal trip. Arc fault from loose connection can trip AFCI breakers. Tighten all connections and re-torque to manufacturer spec.', color: '#ff8c00' },
          { label: 'Shared Neutrals', detail: 'Multi-wire branch circuits sharing a neutral: if the neutral is broken or loose, voltage shifts cause overload on one branch. On GFCI/AFCI breakers, shared neutrals cause immediate trip.', color: '#ff3c3c' },
          { label: 'Harmonic Currents', detail: 'Triplen harmonics (3rd, 9th, 15th) add on the neutral. Neutral current can exceed phase current. Causes thermal trips on main breaker. See Harmonics section above.', color: 'var(--primary)' },
          { label: 'Inrush Current', detail: 'Motor starting, transformer energization, or capacitor switching can cause momentary overcurrent. Use motor-rated breakers, or adjust trip curve. Consider soft starters or VFDs.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'Transformer Troubleshooting',
    items: [
      {
        title: 'Transformer Tests & Checks',
        subItems: [
          { label: 'Turns Ratio Test', detail: 'Apply known voltage to primary (or use TTR test set), measure secondary. Ratio should match nameplate within 0.5%. Deviation indicates shorted turns. Test all phases.', color: 'var(--primary)' },
          { label: 'Insulation Resistance', detail: 'Megger primary to secondary, primary to ground, secondary to ground. Min 1 MΩ per kV + 1 MΩ at 40°C. Correct readings for temperature: halves for every 10°C above 40°C.', color: 'var(--primary)' },
          { label: 'Oil Analysis (liquid-filled)', detail: 'Dielectric breakdown voltage (should be >30 kV for mineral oil). Dissolved gas analysis (DGA) — detects internal faults before failure. Moisture content: <35 ppm for distribution transformers.', color: 'var(--primary)' },
          { label: 'Common Issues', detail: 'Overheating: check load, cooling fans/radiators, oil level. Humming/buzzing: loose laminations, DC offset, overexcitation. Oil leaks: check gaskets, bushings, drain valve.', color: '#ff8c00' },
        ],
        notes: 'For mine substation transformers: DGA testing is the single best predictive maintenance tool. Key gases: C2H2 (acetylene) = arcing, C2H4 (ethylene) = severe overheating, H2 (hydrogen) = partial discharge.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  TAB 4: Grounding                                                   */
/* ------------------------------------------------------------------ */

const groundingSections: TroubleshootingSection[] = [
  {
    heading: 'Ground Fault Tracing (HRG/NGR Systems)',
    items: [
      {
        title: 'High Resistance Grounding in Mining',
        severity: 'critical',
        subItems: [
          { label: 'How HRG Works', detail: 'A resistor (NGR) is connected between the transformer neutral and ground. Limits ground fault current to 5-10A (typical for mining). First ground fault causes alarm, not trip. Allows continued production while fault is located.', color: 'var(--primary)' },
          { label: 'Fault Indication', detail: 'Ground fault relay alarms. Ground indicator lights: normally all lit equally. On fault, one phase lamp goes dim (faulted phase) and the other two go bright. Modern systems use pulsing technology for easier tracing.', color: 'var(--primary)' },
          { label: 'Tracing Procedure', detail: 'Use a clamp-on ammeter on each feeder leaving the substation. The feeder carrying the fault will show ground fault current (typically pulsing). Follow that feeder to the next panel. Repeat: clamp each branch. Narrow down to the faulted circuit. Disconnect and megger.', color: '#4caf50' },
        ],
        notes: 'In an HRG system, the FIRST fault is safe (limited current). The SECOND ground fault on a different phase creates a phase-to-phase fault through ground, potentially with full fault current. Treat every first fault as urgent.',
      },
      {
        title: 'Pulsing Ground Fault Systems',
        steps: [
          'System pulses the ground fault current (on/off at ~1Hz)',
          'Use a clamp meter with pulse-detection — the pulsing current is easy to identify',
          'Start at the main bus, clamp each feeder. The feeder with pulsing current has the fault',
          'Follow the feeder downstream, clamping at each junction/panel',
          'Continue narrowing down until the faulted branch circuit is identified',
          'Lock out, disconnect load, megger to confirm — repair or replace the faulted component',
        ],
      },
    ],
  },
  {
    heading: 'Insulation Resistance Testing',
    items: [
      {
        title: 'Acceptable Values by Voltage Class',
        table: {
          headers: ['Nominal Voltage', 'Megger Test V', 'New Equipment', 'In-Service Min'],
          rows: [
            ['120–240V', '500V DC', '>200 MΩ', '1 MΩ'],
            ['240–600V', '1000V DC', '>200 MΩ', '2 MΩ'],
            ['600–1000V', '1000V DC', '>500 MΩ', '5 MΩ'],
            ['1–5kV', '2500V DC', '>1000 MΩ', '25 MΩ'],
            ['5–15kV', '5000V DC', '>5000 MΩ', '100 MΩ'],
          ],
        },
        notes: 'The absolute value matters less than the TREND. If a motor reads 50 MΩ this month and read 500 MΩ last month, investigate even though 50 MΩ is technically acceptable.',
      },
      {
        title: 'Weather & Environmental Effects',
        subItems: [
          { label: 'Humidity', detail: 'High humidity lowers insulation resistance readings. Moisture condenses on insulation surfaces, creating conductive paths. If possible, test in similar conditions each time for consistent trending.', color: 'var(--primary)' },
          { label: 'Temperature', detail: 'Insulation resistance approximately halves for every 10°C rise above reference (40°C). Correct readings to 40°C for comparison. Formula: R_40 = R_measured x 0.5^((40-T)/10).', color: 'var(--primary)' },
          { label: 'Mining Conditions', detail: 'Underground mines: consistently high humidity and temperature. Dust and mineral deposits reduce surface insulation. Water intrusion at cable glands and junction boxes is common. Check readings more frequently.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Step & Touch Potential',
    items: [
      {
        title: 'Mining Ground Potential Hazards',
        severity: 'critical',
        subItems: [
          { label: 'Step Potential', detail: 'Voltage difference between feet when standing near a grounding electrode during fault current flow. Worse on rocky ground (high resistivity). Can cause involuntary muscle contraction and falls. Keep feet together near substations during faults.', color: '#ff3c3c' },
          { label: 'Touch Potential', detail: 'Voltage between a person\'s hand (touching grounded equipment) and feet during a ground fault. This is why equipment grounding must be robust. A broken ground conductor means full voltage on equipment frame during a fault.', color: '#ff3c3c' },
          { label: 'Mitigation', detail: 'Ground grids around mine substations. Crushed rock layer (high resistivity surface) around equipment. Equipotential bonding of all metallic structures. Regular testing of grounding system integrity.', color: '#4caf50' },
        ],
        notes: 'In open-pit mines, ground resistance can be very high (rocky terrain). This means higher potential gradients during faults. Ground grid design is critical and should be done by a qualified engineer.',
      },
    ],
  },
  {
    heading: 'Equipment Grounding Conductor (EGC) Testing',
    items: [
      {
        title: 'EGC Verification',
        steps: [
          'Visual inspection: EGC is continuous, properly sized per CEC Table 16, connections tight',
          'Continuity test: measure resistance from equipment frame to the grounding bus at the panel. Should be <1Ω for short runs, <2Ω for longer circuits',
          'Ground loop impedance test: measures total impedance of the fault path. Ensures enough fault current flows to trip the breaker in the required time',
          'Bond test: measure resistance between bonded metallic parts. Should be <0.1Ω for direct bonds',
          'For trailing cables: test ground continuity before each shift. Ground check monitors do this automatically on medium voltage cables',
        ],
        notes: 'CEC Rule 10-906: Equipment grounding conductors must be tested after installation and after any repair or modification to verify continuity and adequacy.',
      },
    ],
  },
  {
    heading: 'Bond Testing',
    items: [
      {
        title: 'Bonding Requirements & Tests',
        subItems: [
          { label: 'What to Bond', detail: 'All metallic raceways, cable trays, equipment frames, structural steel, piping systems, and any metallic object that could become energized. In mining: rail tracks, ventilation ducts, water/air pipes.', color: 'var(--primary)' },
          { label: 'Test Method', detail: 'Use a low-resistance ohmmeter (DLRO) or a standard multimeter for basic checks. Measure from one bonded part to the next. Acceptable: <0.1Ω for direct bonds. Check both ends of bonding jumpers.', color: 'var(--primary)' },
          { label: 'Common Failures', detail: 'Corrosion at bond connections (especially in wet mine environments). Missing bonding jumpers across flexible connections. Paint or coating preventing metal-to-metal contact. Broken grounding conductor inside conduit.', color: '#ff8c00' },
        ],
      },
    ],
  },
  {
    heading: 'Lightning Protection',
    items: [
      {
        title: 'Lightning Protection System Inspection',
        subItems: [
          { label: 'Surface Facilities', detail: 'Inspect air terminals (lightning rods) for physical damage. Check down conductors for continuity and secure mounting. Measure ground resistance of lightning ground electrodes (<10Ω typical). Inspect surge protective devices (SPDs) at service entrance.', color: 'var(--primary)' },
          { label: 'Power Line Entry', detail: 'Check surge arresters on incoming power lines. Verify ground connections at poles and transformers. Look for signs of previous strikes: burnt arresters, fused connections, damaged insulators.', color: 'var(--primary)' },
          { label: 'Bonding to Lightning System', detail: 'All grounding systems must be bonded together: electrical ground, lightning ground, telecom ground, structural steel. Separate grounds can have dangerous voltage differences during a strike.', color: '#ff8c00' },
        ],
        notes: 'Ontario mining surface facilities are exposed to lightning. Annual inspection of lightning protection is recommended. CSA B72 (Installation of Lightning Protection Systems) is the reference standard.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  TAB 5: Tools & Tips                                                */
/* ------------------------------------------------------------------ */

const toolsSections: TroubleshootingSection[] = [
  {
    heading: 'Half-Split Troubleshooting Method',
    items: [
      {
        title: 'The Fastest Way to Find a Fault',
        severity: 'info',
        steps: [
          'Identify the full scope of the circuit (from source to load, counting all devices in series)',
          'Test at the MIDDLE of the circuit — this eliminates half the components in one measurement',
          'If the test shows good power at the midpoint → fault is in the second half (toward load)',
          'If the test shows no power at the midpoint → fault is in the first half (toward source)',
          'Test at the middle of the remaining suspect half — eliminates another half',
          'Repeat until the single faulted component is identified',
        ],
        notes: 'Example: A control circuit has 8 devices in series. Testing device-by-device could take 8 measurements. Half-split: test at device 4, then 2 or 6, then 1 or 3 or 5 or 7. Maximum 3 measurements to find the fault. This method is especially powerful on long circuits or cable runs.',
      },
    ],
  },
  {
    heading: 'Reading a Motor Nameplate',
    items: [
      {
        title: 'Motor Nameplate Fields Explained',
        subItems: [
          { label: 'HP / kW', detail: 'Rated output power at the shaft. 1 HP = 0.746 kW. This is OUTPUT power; the motor draws more than this from the electrical supply.', color: 'var(--primary)' },
          { label: 'FLA (Full Load Amps)', detail: 'The current drawn at rated HP, voltage, and speed. Use this for overload relay sizing (not NEC/CEC table values). OL should be set to nameplate FLA x SF.', color: 'var(--primary)' },
          { label: 'RPM', detail: 'Rated speed at full load. Will be slightly less than synchronous speed (e.g., 1750 RPM for a 4-pole/60Hz motor, sync speed = 1800). Difference is the slip.', color: 'var(--primary)' },
          { label: 'SF (Service Factor)', detail: 'Multiplier for allowable continuous overload. 1.15 SF means motor can safely run at 115% rated HP continuously. Common on NEMA motors. Set OL to FLA x SF.', color: 'var(--primary)' },
          { label: 'Frame', detail: 'Physical mounting dimensions (bolt pattern, shaft height). NEMA standardized: 56 frame to 5000+ frame. Same frame number = same physical mounting regardless of manufacturer.', color: 'var(--primary)' },
          { label: 'Enclosure', detail: 'ODP (Open Drip-Proof): indoor use, clean environments. TEFC (Totally Enclosed Fan Cooled): outdoor, dusty, wet. TENV: no fan, convection cooled. TEAO: for belt-driven fans. XP: explosion-proof for hazardous locations.', color: 'var(--primary)' },
          { label: 'NEMA Design', detail: 'Design A: normal torque, normal starting current. Design B: normal torque, low starting current (most common). Design C: high starting torque for hard-to-start loads. Design D: very high starting torque, high slip (crushers, hoists).', color: 'var(--primary)' },
          { label: 'Insulation Class', detail: 'Class A: 105°C max. Class B: 130°C (most common). Class F: 155°C (common modern motors). Class H: 180°C (high temp applications, mining hoists). Class determines maximum allowable winding temperature.', color: 'var(--primary)' },
          { label: 'Voltage / Connection', detail: 'Dual voltage: 230/460V. Low voltage = parallel (higher amps, lower voltage). High voltage = series (lower amps, higher voltage). Check connection diagram inside junction box. 9-lead or 12-lead configurations.', color: 'var(--primary)' },
          { label: 'Code Letter', detail: 'Indicates starting current (locked rotor kVA/HP). Code A = lowest starting current, Code V = highest. Affects branch circuit protection sizing. Most industrial motors are Code F to Code H.', color: 'var(--primary)' },
          { label: 'Efficiency / Premium', detail: 'IE1 (Standard), IE2 (High), IE3 (Premium), IE4 (Super Premium). Higher efficiency = lower operating cost. CEC requires minimum efficiency for most new installations.', color: 'var(--primary)' },
          { label: 'Duty Cycle', detail: 'S1: continuous. S2: short-time. S3: intermittent periodic. S4: intermittent with starting. S6: continuous with intermittent load. Must match application duty cycle.', color: 'var(--primary)' },
        ],
      },
    ],
  },
  {
    heading: 'CEC Wire Color Codes',
    items: [
      {
        title: 'Standard Canadian Wire Colors',
        table: {
          headers: ['Color', 'Function', 'Notes'],
          rows: [
            ['Black', 'Phase A (L1)', '120/208V and 347/600V systems'],
            ['Red', 'Phase B (L2)', '120/208V and 347/600V systems'],
            ['Blue', 'Phase C (L3)', '120/208V and 347/600V systems'],
            ['White', 'Neutral (N)', 'Grounded conductor. Must be identified throughout the run'],
            ['Green or Bare', 'Ground (EGC)', 'Equipment grounding conductor. Green with yellow stripe also acceptable'],
            ['Orange', 'HRG/Delta/Stinger Leg', 'High leg of delta system (208V to neutral). Also used in HRG fault indication circuits'],
            ['Grey', 'Neutral (alternate)', 'Sometimes used as alternate neutral identification'],
            ['Brown', 'Phase A (IEC/import equip)', 'International equipment may use IEC colors: brown, black, grey for phases'],
          ],
        },
        notes: 'CEC Rule 4-036: Identification of conductors. In mining, color coding is especially important for trailing cables and portable equipment. Always verify before connecting — previous workers may not have followed the code.',
      },
    ],
  },
  {
    heading: 'Common Electrical Smells',
    items: [
      {
        title: 'What Your Nose Tells You',
        severity: 'warning',
        subItems: [
          { label: 'Burning plastic / acrid smoke', detail: 'Wire insulation overheating or burning. IMMEDIATE fire hazard. De-energize immediately. Locate source: check panels, junction boxes, motors, and cable runs. Often caused by loose connections or overloaded circuits.', color: '#ff3c3c' },
          { label: 'Ozone (sharp, clean smell)', detail: 'Corona discharge or arcing. Common around high-voltage equipment. Can indicate insulation breakdown, loose connections, or tracking across dirty insulators. Inspect for carbon tracking on bus.', color: '#ff8c00' },
          { label: 'Rotten eggs (sulfur)', detail: 'Overheated sulfur-based insulation (older equipment). Can also indicate battery issues (hydrogen sulfide from lead-acid). In mining: may also be naturally occurring H2S gas — check atmosphere.', color: '#ff3c3c' },
          { label: 'Fish / seafood smell', detail: 'Overheated electrical components, particularly older capacitors, some wire insulation, and certain plastics. The off-gassing creates an amine compound that smells like fish. Check for hot components.', color: '#ff8c00' },
          { label: 'Hot oil / burnt transformer oil', detail: 'Transformer overheating. Could indicate overload, internal fault, blocked cooling, or low oil level. Check temperature gauges, oil level, and load. May need DGA test.', color: '#ff8c00' },
          { label: 'Metallic / electrical burning smell', detail: 'Arcing at contacts, motor brush wear, or welding contacts. Check contactors, motor brushes (if applicable), and any switching equipment. Usually accompanied by heat and possible discoloration.', color: '#ff8c00' },
        ],
        notes: 'Trust your nose. If something smells wrong, investigate IMMEDIATELY. Electrical fires can escalate rapidly, especially underground where ventilation can spread smoke and toxic gases throughout the mine.',
      },
    ],
  },
  {
    heading: 'Thermal Imaging Tips',
    items: [
      {
        title: 'Infrared Camera Best Practices',
        subItems: [
          { label: 'What to Look For', detail: 'Hot spots on connections, breakers, fuses, contactors, motors, transformers. Compare similar components under similar loads. A connection 10°C above its twin is suspect. 40°C above ambient = immediate action.', color: 'var(--primary)' },
          { label: 'Emissivity Settings', detail: 'Bare copper: ~0.07 (very low, hard to measure). Oxidized copper: ~0.65. Painted surfaces: ~0.95. Electrical tape (black): ~0.95. For accurate readings, apply a patch of electrical tape and measure it.', color: 'var(--primary)' },
          { label: 'Comparison Method', detail: 'Scan all three phases of the same circuit. They should be similar temperature at similar loads. A phase that is significantly hotter indicates a problem on that phase (loose connection, overload, imbalance).', color: 'var(--primary)' },
          { label: 'Common Findings in Mining', detail: 'Loose bus connections (vibration). Overloaded trailing cable connectors. Motor bearing housings (hot bearing vs cool bearing). VFD heatsinks with blocked airflow. Undersized or corroded ground connections.', color: '#ff8c00' },
          { label: 'Tips for Mining Environment', detail: 'Scan equipment under load (not at idle). Allow equipment to reach operating temperature (~30 min). Open panel doors for direct scanning when safe. Document and compare with previous scans. Dusty environments reduce emissivity accuracy.', color: 'var(--primary)' },
        ],
        notes: 'NFPA 70B recommends annual thermal scans for all electrical equipment. In mining, quarterly scans on critical equipment are good practice. A thermal imaging program has the best ROI of any predictive maintenance technique.',
      },
    ],
  },
  {
    heading: 'When to Call a Specialist',
    items: [
      {
        title: 'Know Your Limits',
        subItems: [
          { label: 'Power Quality Studies', detail: 'Complex harmonic issues, voltage flicker, power factor correction design, filter design. Requires specialized equipment (power quality analyzers) and expertise in IEEE 519 compliance.', color: 'var(--primary)' },
          { label: 'Relay Protection Coordination', detail: 'Setting protective relays, conducting coordination studies, time-current curve analysis, short circuit studies. Errors can result in uncoordinated protection and dangerous misoperation.', color: '#ff3c3c' },
          { label: 'Arc Flash Studies', detail: 'CSA Z462 requires arc flash hazard analysis. Requires short circuit study + coordination study + incident energy calculations. Results determine PPE categories and labeling. Update after any system changes.', color: '#ff3c3c' },
          { label: 'Transformer Oil Testing (DGA)', detail: 'Dissolved Gas Analysis requires lab testing and expert interpretation. Not a field test. Key for mine substation transformers. Detects arcing, overheating, and corona before failure.', color: 'var(--primary)' },
          { label: 'Medium/High Voltage Testing', detail: 'Cable testing (VLF, tan delta), switchgear testing, circuit breaker timing tests. Specialized equipment and training required. Work on >5kV requires specific qualifications.', color: '#ff3c3c' },
          { label: 'Grounding System Design', detail: 'Ground grid design for substations, step and touch potential calculations, soil resistivity testing, ground resistance surveys. Requires engineering analysis especially in high-resistivity mining terrain.', color: 'var(--primary)' },
        ],
        notes: 'There is no shame in calling for help. Knowing when a task exceeds your knowledge or equipment is a sign of competence, not weakness. A specialist prevents expensive mistakes and keeps everyone safe.',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tabs configuration                                                 */
/* ------------------------------------------------------------------ */

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'motors', label: 'Motors', icon: '⚙' },
  { key: 'controls', label: 'Controls', icon: '⊞' },
  { key: 'power', label: 'Power', icon: '⚡' },
  { key: 'grounding', label: 'Grounding', icon: '⏚' },
  { key: 'tools', label: 'Tools & Tips', icon: '\uD83D\uDD27' },
]

const sectionsByTab: Record<TabKey, TroubleshootingSection[]> = {
  motors: motorSections,
  controls: controlSections,
  power: powerSections,
  grounding: groundingSections,
  tools: toolsSections,
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
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
  gap: 6,
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
  overflow: 'hidden',
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CollapsibleCard({ item }: { item: TroubleshootingItem }) {
  const [open, setOpen] = useState(false)

  const borderColor =
    item.severity === 'critical' ? '#ff3c3c' :
    item.severity === 'warning' ? '#ff8c00' :
    item.severity === 'info' ? 'var(--primary)' :
    'var(--divider)'

  const headerBg =
    item.severity === 'critical' ? 'rgba(255, 60, 60, 0.08)' :
    item.severity === 'warning' ? 'rgba(255, 140, 0, 0.08)' :
    undefined

  return (
    <div style={{ ...cardStyle, borderLeft: `4px solid ${borderColor}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '14px 14px',
          minHeight: 56,
          background: headerBg || 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {item.severity === 'critical' && (
            <span style={{ color: '#ff3c3c', fontSize: 16, flexShrink: 0 }}>{'⚠'}</span>
          )}
          {item.severity === 'warning' && (
            <span style={{ color: '#ff8c00', fontSize: 16, flexShrink: 0 }}>{'▲'}</span>
          )}
          {item.severity === 'info' && (
            <span style={{ color: 'var(--primary)', fontSize: 16, flexShrink: 0 }}>{'ℹ'}</span>
          )}
          <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</span>
        </div>
        <svg
          width={20} height={20} viewBox="0 0 24 24"
          fill="none" stroke="var(--text-secondary)" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Flow steps */}
          {item.steps && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {item.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    {i < item.steps!.length - 1 && (
                      <div style={{
                        width: 2, height: 16,
                        background: 'var(--divider)',
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
                    paddingTop: 3, paddingBottom: i < item.steps!.length - 1 ? 8 : 0,
                  }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-items */}
          {item.subItems && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {item.subItems.map((si, i) => (
                <div key={i} style={{
                  background: 'var(--input-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  borderLeft: `3px solid ${si.color || 'var(--primary)'}`,
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: si.color || 'var(--primary)',
                    marginBottom: 4,
                  }}>
                    {si.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {si.detail}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {item.table && (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse', fontSize: 13,
                minWidth: item.table.headers.length > 3 ? 500 : undefined,
              }}>
                <thead>
                  <tr>
                    {item.table.headers.map((h, i) => (
                      <th key={i} style={{
                        textAlign: 'left', padding: '8px 10px',
                        background: 'var(--input-bg)',
                        color: 'var(--primary)',
                        fontWeight: 700, fontSize: 12,
                        borderBottom: '2px solid var(--divider)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '8px 10px',
                          borderBottom: '1px solid var(--divider)',
                          color: ci === 0 ? 'var(--text)' : 'var(--text-secondary)',
                          fontWeight: ci === 0 ? 600 : 400,
                          fontFamily: ci === 0 ? 'var(--font-mono)' : undefined,
                          lineHeight: 1.5,
                          whiteSpace: ci === 0 ? 'nowrap' : undefined,
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          {item.notes && item.notes !== 'USE_CALCULATOR' && (
            <div style={{
              background: item.severity === 'critical'
                ? 'rgba(255, 60, 60, 0.08)'
                : 'rgba(255, 215, 0, 0.08)',
              border: item.severity === 'critical'
                ? '1px solid rgba(255, 60, 60, 0.2)'
                : '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: 13,
              color: 'var(--text)',
              lineHeight: 1.6,
            }}>
              <strong style={{
                color: item.severity === 'critical' ? '#ff3c3c' : 'var(--primary)',
              }}>
                {item.severity === 'critical' ? '⚠ CRITICAL: ' : 'ℹ Note: '}
              </strong>
              {item.notes}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Voltage Unbalance Calculator                                       */
/* ------------------------------------------------------------------ */

function VoltageUnbalanceCalc() {
  const [vAB, setVAB] = useState('')
  const [vBC, setVBC] = useState('')
  const [vCA, setVCA] = useState('')

  const a = parseFloat(vAB)
  const b = parseFloat(vBC)
  const c = parseFloat(vCA)
  const allValid = !isNaN(a) && !isNaN(b) && !isNaN(c) && a > 0 && b > 0 && c > 0

  let avg = 0
  let maxDev = 0
  let pctUnbalance = 0
  let status: 'good' | 'caution' | 'bad' = 'good'
  let statusLabel = ''
  let statusColor = '#4caf50'

  if (allValid) {
    avg = (a + b + c) / 3
    maxDev = Math.max(Math.abs(a - avg), Math.abs(b - avg), Math.abs(c - avg))
    pctUnbalance = (maxDev / avg) * 100

    if (pctUnbalance <= 1) {
      status = 'good'
      statusLabel = 'Excellent'
      statusColor = '#4caf50'
    } else if (pctUnbalance <= 2) {
      status = 'caution'
      statusLabel = 'Acceptable (<2%)'
      statusColor = 'var(--primary)'
    } else if (pctUnbalance <= 5) {
      status = 'caution'
      statusLabel = 'Investigate & Correct'
      statusColor = '#ff8c00'
    } else {
      status = 'bad'
      statusLabel = 'CRITICAL — Do Not Run Motors'
      statusColor = '#ff3c3c'
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 56,
    padding: '0 16px',
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    fontSize: 16,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  }

  return (
    <div style={{
      ...cardStyle,
      borderLeft: '4px solid var(--primary)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
        {'⚡'} Voltage Unbalance Calculator
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        Enter your three phase-to-phase voltage readings:
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>AB</sub> (L1-L2)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vAB}
            onChange={e => setVAB(e.target.value)}
            placeholder="480"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>BC</sub> (L2-L3)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vBC}
            onChange={e => setVBC(e.target.value)}
            placeholder="475"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            V<sub>CA</sub> (L3-L1)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={vCA}
            onChange={e => setVCA(e.target.value)}
            placeholder="483"
            style={inputStyle}
          />
        </div>
      </div>

      {allValid && (
        <div style={{
          background: status === 'bad' ? 'rgba(255, 60, 60, 0.1)' :
            status === 'caution' ? 'rgba(255, 215, 0, 0.08)' :
            'rgba(76, 175, 80, 0.1)',
          border: `1px solid ${statusColor}40`,
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Average Voltage</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {avg.toFixed(1)} V
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Max Deviation</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              {maxDev.toFixed(1)} V
            </span>
          </div>
          <div style={{ height: 1, background: 'var(--divider)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>% Unbalance</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)' }}>
              {pctUnbalance.toFixed(2)}%
            </span>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: `${statusColor}20`,
            fontSize: 14,
            fontWeight: 700,
            color: statusColor,
          }}>
            {statusLabel}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function TroubleshootingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('motors')
  const [search, setSearch] = useState('')

  const currentSections = sectionsByTab[activeTab]

  // Filter sections based on search
  const filteredSections = search.trim()
    ? currentSections
        .map(section => ({
          ...section,
          items: section.items.filter(item => {
            const q = search.toLowerCase()
            const inTitle = item.title.toLowerCase().includes(q)
            const inSteps = item.steps?.some(s => s.toLowerCase().includes(q))
            const inNotes = item.notes?.toLowerCase().includes(q)
            const inSubs = item.subItems?.some(
              si => si.label.toLowerCase().includes(q) || si.detail.toLowerCase().includes(q)
            )
            const inHeading = section.heading.toLowerCase().includes(q)
            return inTitle || inSteps || inNotes || inSubs || inHeading
          }),
        }))
        .filter(section => section.items.length > 0)
    : currentSections

  return (
    <>
      <Header title="Troubleshooting" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Warning banner */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.08)',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{'\uD83D\uDD27'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            <strong>Field troubleshooting guide.</strong> Always follow lockout/tagout procedures,
            verify de-energization before testing, and wear appropriate PPE. When in doubt, stop and reassess.
          </div>
        </div>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={activeTab === t.key ? pillActive : pillBase}
              onClick={() => { setActiveTab(t.key); setSearch('') }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width={18} height={18} viewBox="0 0 24 24"
            fill="none" stroke="var(--text-secondary)" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()} troubleshooting...`}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 56, padding: '0 16px 0 44px',
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              fontSize: 16, color: 'var(--text)',
            }}
          />
        </div>

        {/* Content */}
        {filteredSections.map((section, si) => (
          <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
              paddingTop: si > 0 ? 4 : 0,
            }}>
              {section.heading}
            </div>
            {section.items.map((item, ii) => {
              // Special case: voltage unbalance calculator
              if (item.notes === 'USE_CALCULATOR') {
                return <VoltageUnbalanceCalc key={ii} />
              }
              return <CollapsibleCard key={ii} item={item} />
            })}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div style={{
            padding: '32px 16px', textAlign: 'center',
            color: 'var(--text-secondary)', fontSize: 15,
          }}>
            No results match &quot;{search}&quot;
          </div>
        )}

        {/* Legend */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#ff3c3c', fontSize: 14 }}>{'⚠'}</span>
            <span><strong>Critical</strong> &mdash; safety hazard or immediate damage risk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#ff8c00', fontSize: 14 }}>{'▲'}</span>
            <span><strong>Warning</strong> &mdash; common failure point, proceed carefully</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--primary)', fontSize: 14 }}>{'ℹ'}</span>
            <span><strong>Info</strong> &mdash; key reference or procedure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4caf50', fontSize: 14 }}>{'●'}</span>
            <span><strong>Solution</strong> &mdash; resolution or fix</span>
          </div>
        </div>

        {/* References */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC (Canadian Electrical Code),
          O. Reg. 854 (Mines and Mining Plants), CSA Z462 (Workplace Electrical Safety),
          IEEE 519 (Harmonic Control), NFPA 70B (Electrical Equipment Maintenance),
          CSA B72 (Lightning Protection Systems)
        </div>
      </div>
    </>
  )
}
