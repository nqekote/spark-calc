import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Grounding & Bonding Reference — Ontario Mining Electricians        */
/* ------------------------------------------------------------------ */

type TabKey = 'types' | 'cec' | 'mining' | 'testing' | 'troubleshooting'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'types', label: 'System Types' },
  { key: 'cec', label: 'CEC Rules' },
  { key: 'mining', label: 'Mining Ground' },
  { key: 'testing', label: 'Testing' },
  { key: 'troubleshooting', label: 'Troubleshooting' },
]

/* ===================== TAB 1: SYSTEM TYPES ======================== */

interface SystemType {
  name: string
  description: string
  howItWorks: string
  firstFault: string
  secondFault: string
  voltages: string
  miningUse: string
  advantages: string[]
  disadvantages: string[]
  diagram: string
  color: string
}

const systemTypes: SystemType[] = [
  {
    name: 'Solidly Grounded',
    description: 'Neutral point connected directly to earth with no intentional impedance.',
    howItWorks: 'The transformer or generator neutral is connected directly to a grounding electrode through a grounding conductor. Fault current flows through the earth path back to the source. This creates a low-impedance path for ground fault current.',
    firstFault: 'High fault current flows immediately. Overcurrent protective devices (breakers/fuses) trip quickly. Ground fault is cleared fast, but fault current can be very high (thousands of amps).',
    secondFault: 'N/A — first fault is cleared by protective devices.',
    voltages: '120/208V, 120/240V, 277/480V, 347/600V',
    miningUse: 'Surface buildings, office buildings, camp facilities, warehouse lighting. NOT recommended for portable mining equipment circuits.',
    advantages: [
      'Simple design, lowest cost',
      'Fast fault clearing — overcurrent devices trip immediately',
      'Overvoltage on unfaulted phases is limited',
      'Well understood, most common system',
      'Ground fault relaying is straightforward',
    ],
    disadvantages: [
      'Very high fault currents — arc flash and fire hazard',
      'Unplanned shutdowns on first fault',
      'Equipment damage from high fault energy',
      'Not suitable for continuous-process operations',
      'Flash hazard at fault point can be severe',
    ],
    diagram: 'SOURCE [XFMR] ---+--- Phase A\n                 |--- Phase B\n                 |--- Phase C\n            Neutral\n                 |\n                 | (direct connection)\n                 |\n              ===== EARTH',
    color: 'var(--primary)',
  },
  {
    name: 'Ungrounded (Delta)',
    description: 'System has no intentional connection between any conductor and earth. The system "floats" relative to ground.',
    howItWorks: 'Delta-connected transformer secondary has no neutral point. System connects to ground only through distributed capacitance of cables and equipment. Capacitive coupling creates a high-impedance path to ground.',
    firstFault: 'NO TRIP! Very low current flows (milliamps through system capacitance). System continues to operate. However, voltage on unfaulted phases rises to LINE voltage (1.73x phase voltage). This overstresses insulation on the other two phases.',
    secondFault: 'DANGER! A second ground fault on a different phase creates a phase-to-phase fault through ground. High fault current, arc flash, equipment damage, potential fire. This is why ungrounded systems are dangerous if not properly monitored.',
    voltages: '240V delta, 480V delta, 600V delta, 4160V delta',
    miningUse: 'Historically used for mining mobile equipment. Being replaced by HRG systems. Still found in older mines. O. Reg. 854 allows ungrounded systems with proper ground fault detection.',
    advantages: [
      'No trip on first ground fault — continuity of service',
      'Low first-fault current reduces equipment damage',
      'Useful where shutdown is dangerous (hoists, ventilation)',
    ],
    disadvantages: [
      'Voltage on healthy phases rises to 1.73x on first fault',
      'Second fault causes full short circuit through ground',
      'Transient overvoltages (5-8x normal) from arcing faults',
      'Difficult to locate ground faults',
      'Insulation failure cascade from overvoltage stress',
      'Intermittent arcing faults cause ferroresonance',
    ],
    diagram: 'SOURCE [DELTA XFMR]\n    A o----+\n           |  (no neutral)\n    B o----+\n           |  (no earth connection)\n    C o----+\n           |\n       [distributed capacitance]\n           |\n        ===== EARTH (very high Z)',
    color: '#ff3c3c',
  },
  {
    name: 'High Resistance Ground (HRG)',
    description: 'Neutral grounded through a resistor that limits fault current to approximately 5-10A. The preferred system for mining operations.',
    howItWorks: 'A grounding transformer (zigzag or wye-broken-delta) creates an artificial neutral on a delta system. A Neutral Grounding Resistor (NGR) connects this neutral to earth. The NGR is sized so that resistive fault current slightly exceeds the system\'s total capacitive charging current (typically 5A continuous).',
    firstFault: 'ALARM only — system continues to operate. Ground fault current limited to ~5A by the NGR. Pulsing ground fault indicator (PGI) helps locate the faulted feeder. Voltage on unfaulted phases rises to line voltage but without dangerous transient overvoltages.',
    secondFault: 'TRIP — if a second fault occurs on a different phase before the first is found and cleared, relaying detects the dual fault and trips the affected feeders. Some systems trip on first fault to individual feeders while alarming at the main.',
    voltages: '480V, 600V, 2400V, 4160V',
    miningUse: 'STANDARD for mining in Ontario. Required by many mine operations for all underground and surface mobile equipment circuits. O. Reg. 854 drives adoption. Used on mine power centers, trailing cable systems, portable substations.',
    advantages: [
      'Low fault current (5A) — minimal equipment damage',
      'Continuity of service on first fault (alarm only)',
      'No transient overvoltages (resistor dampens them)',
      'No arc flash hazard from ground faults',
      'Easy fault location with pulsing ground fault indicator',
      'Second fault still protected by relaying',
      'Meets Ontario mining regulations',
    ],
    disadvantages: [
      'Higher cost — needs grounding transformer + NGR + relaying',
      'Must monitor and respond to first-fault alarms promptly',
      'NGR can fail open (system becomes ungrounded) — needs monitoring',
      'Requires trained personnel to troubleshoot',
      'Ground fault protection coordination more complex',
      'NGR must be rated for continuous duty (if fault not cleared)',
    ],
    diagram: 'SOURCE [DELTA XFMR]\n    A o----+\n    B o----+\n    C o----+\n           |\n    [Grounding Transformer]\n    (zigzag or wye-broken-delta)\n           |\n        Neutral\n           |\n        [NGR] ~5A max\n           |\n        ===== EARTH\n           |\n    [Ground Fault Relay 50G/51G]\n    [Pulsing GFI locator]',
    color: '#00cc66',
  },
  {
    name: 'Low Resistance Ground (LRG)',
    description: 'Neutral grounded through a resistor that limits fault current to 100-1000A. Common on medium voltage mine distribution.',
    howItWorks: 'Similar to HRG but with a lower-value resistor allowing higher fault current. NGR typically sized for 200-400A for 10 seconds. Provides enough current for selective ground fault relaying to trip only the faulted feeder while leaving the rest of the system energized.',
    firstFault: 'TRIP on faulted feeder — ground fault relay (51G) on each feeder detects and selectively trips only the faulted circuit. Main bus remains energized. Fault current is high enough for reliable relay operation but low enough to limit damage.',
    secondFault: 'N/A — first fault is cleared by selective tripping.',
    voltages: '2400V, 4160V, 13.8kV, 27.6kV, 44kV',
    miningUse: 'Mine main substations, primary distribution (4160V, 13.8kV). Feeds mine power centers which then use HRG on secondary. Common for surface mine main power distribution and underground mine main feeds.',
    advantages: [
      'Selective tripping — only faulted feeder trips',
      'Rest of system stays energized',
      'Fault current high enough for reliable relay operation',
      'Good balance between fault current and damage limitation',
      'Standard approach for medium voltage distribution',
    ],
    disadvantages: [
      'Faulted feeder does trip (no continuity on faulted circuit)',
      'Higher fault current than HRG — some equipment damage possible',
      'NGR must be rated for time-limited duty (10 seconds typical)',
      'More expensive relay coordination required',
      'Must ensure NGR doesn\'t fail open',
    ],
    diagram: 'SOURCE [WYE XFMR]\n    A o----+\n    B o----+\n    C o----+\n        Neutral\n           |\n        [NGR] 200-400A\n        (10 sec rating)\n           |\n        ===== EARTH\n           |\n    [51G on each feeder for\n     selective tripping]',
    color: '#ff8c00',
  },
  {
    name: 'Reactance Grounded',
    description: 'Neutral grounded through a reactor (inductor). Limits fault current while maintaining enough for relay operation.',
    howItWorks: 'An iron-core reactor connects the neutral to earth. The reactance is sized so that X0 <= X1 (zero-sequence reactance is less than or equal to positive-sequence reactance). This limits ground fault current while keeping the system "effectively grounded" for overvoltage purposes.',
    firstFault: 'TRIP — fault current is limited but sufficient for protective relay operation. Fault current depends on reactor sizing, typically 25-60% of the available three-phase fault current.',
    secondFault: 'N/A — first fault trips the circuit.',
    voltages: '13.8kV, 27.6kV, 44kV, 115kV',
    miningUse: 'Utility supply to mine substations. Mine main incoming supply from utility may be reactance grounded. Not common within the mine itself — LRG or HRG preferred for mine distribution.',
    advantages: [
      'Lower fault current than solidly grounded',
      'Limits ground fault current while allowing relay operation',
      'System remains effectively grounded (limits overvoltage)',
      'Common utility practice',
    ],
    disadvantages: [
      'Reactor can saturate during high-current faults',
      'More complex than resistance grounding',
      'Not commonly used within mine distribution',
      'Does not dampen transient overvoltages as well as resistance grounding',
    ],
    diagram: 'SOURCE [WYE XFMR]\n    A o----+\n    B o----+\n    C o----+\n        Neutral\n           |\n        [REACTOR] (XL)\n        X0 <= X1\n           |\n        ===== EARTH',
    color: '#888',
  },
  {
    name: 'Corner Grounded Delta',
    description: 'One phase conductor of a delta system is intentionally grounded. That phase sits at earth potential.',
    howItWorks: 'In a delta-connected transformer, one corner (one phase) is connected directly to earth. The grounded phase (usually B-phase) is at ground potential. The other two phases are at full line voltage to ground. A ground fault on an ungrounded phase behaves like a solidly grounded system fault.',
    firstFault: 'On ungrounded phase: high fault current, overcurrent devices trip. On grounded phase: no effect (it\'s already at ground). Between ungrounded phases through ground: phase-to-phase fault current.',
    secondFault: 'N/A — first faults on ungrounded phases trip immediately.',
    voltages: '240V delta, 480V delta',
    miningUse: 'Rare in mining. Found in some older industrial installations and some legacy mine surface buildings. Not recommended for new installations in mining.',
    advantages: [
      'Overcurrent devices clear ground faults (no special relaying needed)',
      'Simple system — one phase at known ground potential',
      'Lower cost than resistance grounded systems',
    ],
    disadvantages: [
      'Only 2 voltage levels available (no neutral for line-to-neutral loads)',
      'Grounded phase MUST be correctly identified — wrong phase = danger',
      'Cannot be paralleled with wye-connected systems',
      'High ground fault current on ungrounded phases',
      'Phase identification critical — mislabeling causes serious problems',
      'If ground reference is lost, system becomes ungrounded delta',
    ],
    diagram: 'SOURCE [DELTA XFMR]\n    A o---- (line voltage to ground)\n    B o---- GROUNDED (0V to earth)\n    C o---- (line voltage to ground)\n           |\n        ===== EARTH\n  Note: B-phase is directly earthed',
    color: '#888',
  },
]

const comparisonTable = [
  { type: 'Solidly Grounded', first: 'Trips immediately (high current)', second: 'N/A', use: 'Buildings, lighting, offices' },
  { type: 'Ungrounded Delta', first: 'No trip, alarm, voltage rises 1.73x', second: 'Phase-to-phase fault through ground', use: 'Legacy mining (being phased out)' },
  { type: 'High Resistance (HRG)', first: 'Alarm only, ~5A, system runs', second: 'Trips affected feeders', use: 'Mine portable equipment, power centers' },
  { type: 'Low Resistance (LRG)', first: 'Selective trip, 200-400A', second: 'N/A', use: 'Mine MV distribution (4.16-13.8kV)' },
  { type: 'Reactance Grounded', first: 'Trips, reduced fault current', second: 'N/A', use: 'Utility supply, MV incoming' },
  { type: 'Corner Grounded Delta', first: 'Trips on ungrounded phases', second: 'N/A', use: 'Older industrial (rare in mining)' },
]

/* ===================== TAB 2: CEC RULES ========================== */

interface CECRule {
  rule: string
  title: string
  summary: string
  fieldApplication: string
  critical?: boolean
}

const cecRules: CECRule[] = [
  {
    rule: 'Rule 10-002',
    title: 'Definitions',
    summary: 'Defines key grounding and bonding terms used throughout Section 10.',
    fieldApplication: 'Ground: a conducting connection to earth. Grounded: intentionally connected to earth. Bonding: connecting metallic parts to form an electrically continuous path. Grounding conductor: connects the system neutral to the grounding electrode. Bonding conductor: connects equipment frames to the grounding system. Bond: the connection between metallic parts. Bonding jumper: conductor connecting parts of the bonding system. Effective ground-fault current path: intentionally constructed low-impedance path for fault current back to the source. Know these definitions — inspectors will test you on them.',
    critical: false,
  },
  {
    rule: 'Rule 10-100',
    title: 'Systems Required to Be Grounded',
    summary: 'Specifies which electrical systems must be grounded.',
    fieldApplication: 'AC systems supplying premises wiring must be grounded if: they can be grounded so the maximum voltage to ground does not exceed 150V (like 120/208V or 120/240V systems), or if the system is 3-phase 4-wire wye with neutral used as a circuit conductor (like 347/600V). In practical terms: all 120V systems, all wye systems with a neutral, and single-phase 120/240V systems must be grounded. This applies to most building wiring in a mine surface facility.',
    critical: true,
  },
  {
    rule: 'Rule 10-106',
    title: 'Systems Permitted to Be Ungrounded',
    summary: 'Lists specific exceptions where systems are NOT required to be grounded — critical mining exception!',
    fieldApplication: 'This is the mining rule. Systems permitted to be ungrounded include: circuits in mines and similar locations where ground fault current could create a fire or explosion hazard. This is why mines can run ungrounded delta or HRG systems. Also permits ungrounded systems for: industrial processes where a shutdown on first fault would create a hazard, and crane/hoist circuits. In mining: this rule allows HRG and ungrounded systems for mobile equipment where high ground fault current would be dangerous (arc flash, cable fires in underground environments).',
    critical: true,
  },
  {
    rule: 'Rule 10-200',
    title: 'Grounding Electrode Requirements',
    summary: 'Requirements for the grounding electrode system that connects the electrical system to earth.',
    fieldApplication: 'Every grounded system must have a grounding electrode. The electrode must be in direct contact with earth. Each building or structure served must have its own grounding electrode. For mines: the ground bed is the grounding electrode system — it must be designed, installed, and tested to meet this rule. Multiple electrodes bonded together form a grounding electrode system. Supplementary electrodes may be needed to achieve required resistance.',
    critical: false,
  },
  {
    rule: 'Rule 10-204',
    title: 'Grounding Electrode Types',
    summary: 'Specifies acceptable types of grounding electrodes.',
    fieldApplication: 'Acceptable electrodes include: Ground rods (minimum 3m long, 16mm diameter copper-bonded or 19mm galvanized steel). Ground plates (minimum 0.6m² area, at least 600mm below grade). Ground ring (bare copper, #2 AWG minimum, encircling the building at least 600mm deep). Concrete-encased electrode (Ufer ground) — 6m of #4 AWG bare copper in concrete footer. Metal underground water pipe (first 3m entering building, must be supplemented). For mines: driven rods and ground plates are most common. Rock conditions may require drilled holes with conductive backfill (bentonite or ground enhancement material).',
    critical: false,
  },
  {
    rule: 'Rule 10-206',
    title: 'Electrode Resistance — 25 Ohms Maximum',
    summary: 'Single electrode must be supplemented if resistance exceeds 25 ohms.',
    fieldApplication: 'If a single grounding electrode has resistance exceeding 25 ohms, you must install additional electrodes. In mining: 25 ohms is the CEC maximum but most mines target much lower — 5 ohms for buildings, 2 ohms for mine ground beds, less than 1 ohm for main substations. Rocky terrain and frozen ground in Northern Ontario make achieving low resistance challenging. Use multiple rods, ground enhancement material (GEM), or deep-driven grounds. Test with fall-of-potential method.',
    critical: true,
  },
  {
    rule: 'Rule 10-402',
    title: 'Bonding of Non-Current-Carrying Parts',
    summary: 'All exposed non-current-carrying metal parts must be bonded to provide a fault current path.',
    fieldApplication: 'Every piece of electrical equipment with metal enclosures must be bonded: panels, junction boxes, conduit, cable tray, motor frames, switchgear, transformers. The bonding path must be continuous, permanent, and have sufficiently low impedance to facilitate protective device operation. In mining: this includes all portable equipment frames, power center enclosures, cable tray, and metallic raceways. Bonding jumpers across flexible connections (like flex conduit to a motor) are critical — vibration can loosen connections.',
    critical: true,
  },
  {
    rule: 'Rule 10-600',
    title: 'Grounding Conductor Sizing (Table 17)',
    summary: 'Sizes the grounding electrode conductor based on the largest service or feeder conductor.',
    fieldApplication: 'CEC Table 17 provides minimum sizes. For example: #6 AWG copper service = #8 AWG copper ground. #3/0 AWG service = #4 AWG copper ground. 500 kcmil service = #1/0 copper ground. The grounding conductor must be copper (or a copper-clad conductor). It runs from the system neutral to the grounding electrode. It must be continuous (no splices except irreversible compression or exothermic welds). Protect it from physical damage. In mines: this conductor is critical — an undersized grounding conductor can burn open during a fault, leaving the system ungrounded.',
    critical: true,
  },
  {
    rule: 'Rule 10-614',
    title: 'Bonding Conductor Sizing',
    summary: 'Sizes the equipment bonding conductor based on overcurrent protection rating.',
    fieldApplication: 'CEC Table 16 provides minimum sizes. For example: 15A circuit = #14 AWG bonding conductor. 60A circuit = #10 AWG. 200A circuit = #6 AWG. 400A circuit = #3 AWG. 1000A circuit = 250 kcmil. The bonding conductor must carry the ground fault current long enough for the overcurrent device to trip. In mining: trailing cables include a ground conductor sized per this rule. Always verify the ground conductor in a trailing cable is adequate for the circuit protection.',
    critical: false,
  },
  {
    rule: 'Rule 10-700',
    title: 'Ground Fault Protection',
    summary: 'Requirements for ground fault protection of equipment.',
    fieldApplication: 'Ground fault protection is required for solidly grounded wye systems rated 150V to ground and more than 1000A. This means most 347/600V services over 1000A in mine surface buildings need GFP. The GFP must detect ground faults of 1200A or less and disconnect within 1 second. For mine buildings with large 600V services, this is mandatory. GFP does not replace equipment bonding — it is an additional layer of protection. Test GFP when initially installed and every 12 months.',
    critical: true,
  },
  {
    rule: 'Rule 10-800',
    title: 'Portable Equipment Grounding',
    summary: 'Grounding requirements for portable and mobile equipment — absolutely critical for mining.',
    fieldApplication: 'Portable equipment must have an equipment grounding conductor in the supply cord or cable. The grounding conductor must extend from the equipment frame back to the source grounding point. For mining: this means the ground conductor in every trailing cable must be continuous and tested. Ground check monitors must verify conductor integrity before the equipment can be energized. If the ground wire breaks, the ground check circuit de-energizes the equipment. Cord-connected equipment must use a grounding-type plug. NEVER defeat a grounding pin.',
    critical: true,
  },
]

/* ===================== TAB 3: MINING GROUND ====================== */

interface MiningTopic {
  title: string
  content: string
  subtopics?: { heading: string; text: string }[]
  critical?: boolean
  color?: string
}

const miningTopics: MiningTopic[] = [
  {
    title: 'O. Reg. 854 Grounding Requirements',
    critical: true,
    color: '#ff3c3c',
    content: 'Ontario Regulation 854 (Mines and Mining Plants) contains mandatory grounding requirements that go beyond the CEC.',
    subtopics: [
      { heading: 'Section 153 — Ground Fault Protection', text: 'All underground mine electrical installations must have ground fault protection. Systems over 300V must trip at ground fault currents of 100mA or less. This is far more sensitive than CEC requirements for surface buildings. The goal is to prevent electrocution and cable fires underground where escape routes are limited.' },
      { heading: 'Section 153(2) — Monthly Testing', text: 'Ground fault relays must be tested at least monthly. Records of all tests must be kept and be available for MOL inspector review. Test by injecting a known current through the relay and verifying it trips within the required time and at the correct pickup setting.' },
      { heading: 'Section 153(3) — Trailing Cable Grounds', text: 'Every trailing cable must include a grounding conductor. Medium voltage trailing cables (over 750V) require ground check monitor conductors. The ground check system must de-energize the equipment if the grounding conductor is broken or has excessive resistance.' },
      { heading: 'Section 153(4) — Portable Equipment', text: 'All portable and mobile mining equipment must maintain a continuous equipment grounding conductor back to the source. This includes jumbos, scalers, LHD (load-haul-dump), trucks, drills, and all plug-connected equipment.' },
    ],
  },
  {
    title: 'Mine Ground Bed Design',
    content: 'The mine ground bed is the foundation of the entire grounding system. Proper design is critical for personnel safety and equipment protection.',
    subtopics: [
      { heading: 'Electrode Types for Mines', text: 'Driven ground rods (copper-bonded steel, 3m minimum, often 6m). Ground plates (buried copper plates, useful in shallow soil). Ground rings (bare copper encircling substations). Counterpoise (horizontal buried conductors radiating from substation). Deep ground wells (drilled into rock, filled with conductive backfill). Concrete-encased electrodes in building foundations.' },
      { heading: 'Rock Conditions Challenge', text: 'Canadian Shield rock has extremely high resistivity (10,000 to 100,000 ohm-metres). Soil over rock is often thin (less than 1 metre). This makes achieving low ground resistance very difficult. Solutions: multiple long rods, ground enhancement material (GEM/bentonite), deeper wells reaching water table, extensive counterpoise networks.' },
      { heading: 'Ground Enhancement Material (GEM)', text: 'Backfill material with very low resistivity (0.12 ohm-metres typical). Packed around ground rods in augered or drilled holes. Absorbs moisture from surrounding soil, maintaining low resistance. Common products: Erico GEM, Lyncole XIT. Required in rocky terrain where soil contact is poor. Does not corrode the electrode.' },
      { heading: 'Target Resistance Values', text: 'Main mine substation: less than 1 ohm. Underground substations: less than 5 ohms. Surface buildings: less than 5 ohms. Portable power centers: less than 5 ohms (verify with clamp-on tester). Individual ground rod: less than 25 ohms per CEC, but aim for less than 10 ohms each.' },
    ],
  },
  {
    title: 'Ground Check Monitors',
    critical: true,
    color: '#ff8c00',
    content: 'Ground check monitors continuously verify the integrity of the grounding conductor in trailing cables. They are required by O. Reg. 854 for medium voltage portable equipment.',
    subtopics: [
      { heading: 'How They Work', text: 'A low-voltage pilot signal (typically 40-80VDC) is sent through a dedicated pilot wire in the trailing cable (or through the ground conductor itself). The monitor at the power source continuously checks for this signal. If the ground conductor breaks, the pilot signal is lost, and the contactor opens — de-energizing the equipment within milliseconds.' },
      { heading: 'Common Types', text: 'Littelfuse (formerly Bender) SE-325: industry standard for mining ground check monitors. Monitors ground conductor continuity and resistance. Trips on open ground, high resistance ground, or pilot wire fault. Also monitors for ground faults on the system. Eaton ground check relay: similar function, used in Eaton mine power centers. Line Power GC-1: another common mining ground check monitor.' },
      { heading: 'Pilot Wire System', text: 'A separate small conductor in the trailing cable (#14 or #12 AWG) used as the ground check pilot. The pilot wire loops from the source through the trailing cable, connects to the equipment frame at the far end, and returns through the ground conductor. This creates a supervised loop — any break in either the pilot or ground conductor is detected. The resistance of this loop is continuously monitored.' },
      { heading: 'Testing Requirements', text: 'Test ground check monitors monthly per O. Reg. 854. Test by: (1) opening the pilot wire — monitor should trip within 100ms. (2) Opening the ground conductor — monitor should trip. (3) Inserting a resistance in the ground loop — verify trip point (typically 25-50 ohms). (4) Verify reset requires manual action (no auto-reset). Document all test results.' },
    ],
  },
  {
    title: 'Ground Fault Relaying',
    content: 'Mining power systems use specialized ground fault relays to detect and isolate faults. Understanding relay types is essential for troubleshooting.',
    subtopics: [
      { heading: '50G — Instantaneous Ground Overcurrent', text: 'Trips instantly when ground fault current exceeds the pickup setting. Used as backup protection. Typical setting: 10-50A pickup, instantaneous trip. In HRG systems, may be set at 5-8A to trip on a solid ground fault. Zero-sequence CT (window CT around all 3 phases) detects ground current.' },
      { heading: '51G — Time-Overcurrent Ground', text: 'Trips with an inverse time delay — higher current = faster trip. Allows coordination between upstream and downstream relays. Used on mine feeders for selective tripping. The feeder closest to the fault trips first, leaving the rest of the system energized. Time dial and pickup must be coordinated with other relays in the system.' },
      { heading: '27/59G — Neutral Displacement', text: 'Monitors the voltage across the NGR in HRG systems. Under normal conditions, voltage is near zero. A ground fault causes voltage to appear across the NGR. 59G (overvoltage) element alarms on first fault. Can be set with definite time delay. This is the primary alarm relay in HRG systems — it tells you a ground fault exists somewhere on the system. It does NOT tell you which feeder is faulted.' },
      { heading: 'Zero-Sequence CT (Core Balance CT)', text: 'A single CT that surrounds all three phase conductors (and neutral if present). Under normal conditions, currents sum to zero and CT output is zero. A ground fault causes unbalanced current — CT detects the difference. This is how individual feeder ground faults are detected. The CT is typically a large window type that the cable passes through. Proper installation is critical — all three phases must pass through the same CT, and no ground conductor through the CT.' },
    ],
  },
  {
    title: 'Underground Grounding Challenges',
    content: 'Underground mines present unique grounding difficulties that surface installations do not encounter.',
    subtopics: [
      { heading: 'Rock is a Poor Conductor', text: 'Precambrian Shield rock: 10,000 to 100,000+ ohm-metres resistivity. Compare to moist soil: 10-100 ohm-metres. This means a ground rod driven into rock provides essentially no grounding. Underground ground beds must use alternative methods: mesh grounds in development headings, connections to mine dewatering systems (water in sumps provides a ground path), counterpoise grids bolted to rock with conductive grout, and connections back to surface ground bed through dedicated ground conductors in the shaft.' },
      { heading: 'Ground Rods in Rock', text: 'Traditional driven rods are useless in solid rock. Instead: drill holes, install copper rods, backfill with conductive GEM. Or use rock bolts bonded to the grounding system. Mesh ground mats laid on the floor of electrical rooms and substations. Copper ground bus bonded to all equipment and run back to the shaft ground conductor. The shaft ground conductor is often the primary ground path for the entire underground system.' },
      { heading: 'Shaft Ground Conductor', text: 'A dedicated copper ground conductor runs the full length of the mine shaft. Typically bare copper, sized for the maximum fault current. Bonded to the surface ground bed at the top. Bonded to underground ground buses at each level. Must be continuous, inspected regularly, and resistance-tested. If this conductor fails, the entire underground system can lose its ground reference.' },
      { heading: 'Water as a Ground Path', text: 'Mine dewatering pumps and sumps can provide a supplementary ground path through the water. However: water quality varies (mineral content affects conductivity), water level changes seasonally, pump operation is intermittent. Never rely solely on water as a ground path. Use it as supplementary to the dedicated ground conductor system. Bond pump columns and discharge pipes to the grounding system.' },
    ],
  },
  {
    title: 'Surface Mine Grounding',
    content: 'Surface mining equipment (draglines, shovels, trucks) presents grounding challenges due to mobility and size.',
    subtopics: [
      { heading: 'Dragline & Shovel Systems', text: 'Large mining shovels and draglines are powered by trailing cables at 4160V or higher. Ground conductor in the trailing cable provides the ground path. Equipment frame must be bonded to the ground conductor at the cable termination. Ground check monitors are mandatory. Cable reeling systems must maintain ground continuity through slip rings. Regular testing of ground conductor integrity is critical.' },
      { heading: 'Haul Truck Systems', text: 'Electric haul trucks (trolley-assist or diesel-electric) have frame grounding requirements. Trolley-powered trucks use the rail or trolley ground bus. Diesel-electric trucks ground through the trailing cable (if plug-connected) or through tire contact (unreliable). All truck electrical systems must be bonded to the frame. Ground fault protection on truck electrical systems must be functional.' },
      { heading: 'Portable Substations & Power Centers', text: 'Surface power centers are moved as the mine pit advances. Each relocation requires: new ground electrode installation, ground resistance testing, bonding verification. Power centers typically use driven ground rods or ground plates. Multiple rods bonded together in a grid pattern. Ground resistance must be verified before energizing. The frame of the power center must be bonded to the ground electrode.' },
    ],
  },
  {
    title: 'Ground Fault Current Paths',
    critical: true,
    color: '#ff8c00',
    content: 'Understanding how fault current flows is essential for proper grounding system design and troubleshooting.',
    subtopics: [
      { heading: 'Solidly Grounded System Fault Path', text: 'Fault occurs at equipment -> current flows through equipment frame -> through bonding conductor -> through ground bus -> through grounding conductor -> through earth/electrode -> back to transformer neutral. The current magnitude depends on the impedance of this path. Low impedance = high current = fast trip. The goal is a low-impedance path so protective devices operate quickly.' },
      { heading: 'HRG System Fault Path', text: 'Fault occurs at equipment -> current flows through equipment frame -> through bonding conductor -> through ground bus -> through earth/electrode -> back to transformer neutral -> through NGR to transformer neutral. The NGR limits the current to ~5A regardless of the fault impedance. This is why HRG ground faults don\'t trip breakers — 5A is below the breaker\'s trip setting. Special ground fault relays (50G, 51G, 59G) are needed to detect this low current.' },
      { heading: 'Trailing Cable Fault Path', text: 'For portable mine equipment: fault at the machine -> current flows through machine frame -> through ground conductor in trailing cable -> back to the power center ground bus -> through the grounding system to the source. The trailing cable ground conductor IS the fault current path. If it is broken, there is NO ground fault path. This is why ground check monitors are critical — they verify this path exists before the equipment can run.' },
    ],
  },
]

/* ===================== TAB 4: TESTING ============================ */

interface TestProcedure {
  title: string
  content: string
  steps?: string[]
  values?: { condition: string; value: string }[]
  equipment?: string[]
  critical?: boolean
}

const testProcedures: TestProcedure[] = [
  {
    title: 'Fall of Potential Method (3-Point Test)',
    content: 'The standard and most accurate method for measuring ground electrode resistance. Uses three electrodes: the ground under test, a current electrode, and a potential electrode.',
    steps: [
      'Disconnect the ground electrode from the system (IMPORTANT: system must be de-energized or an alternative ground must be in place)',
      'Drive the current electrode (C2) into the ground as far as practical from the electrode under test — minimum 30m, ideally 10x the electrode length',
      'The current electrode should be in a straight line from the test electrode',
      'Place the potential probe (P2) at 62% of the distance between the test electrode and current electrode (the 62% rule)',
      'Connect the ground resistance tester: C1 and P1 to the electrode under test, C2 to the far current electrode, P2 to the 62% potential probe',
      'Take the first reading at the 62% position',
      'Move the potential probe to 52% and 72% of the distance and take additional readings',
      'If all three readings are within 5%, the 62% reading is the ground resistance',
      'If readings vary more than 5%, move the current electrode further away and repeat',
      'Record all readings with date, weather, soil conditions, and instrument used',
    ],
    equipment: ['Ground resistance tester (Megger DET4TC, Fluke 1625-2, AEMC 6474)', 'Auxiliary ground electrodes (steel rods with wire leads)', 'Measuring tape (minimum 60m)', 'Hammer for driving auxiliary rods', 'Test leads (minimum 30m each, ideally 60m)'],
  },
  {
    title: '4-Point Wenner Method (Soil Resistivity)',
    content: 'Measures soil resistivity at a specific depth. Essential for designing new ground beds before installation. Tells you how the soil will perform as a conductor at different depths.',
    steps: [
      'Drive 4 equally-spaced probes in a straight line at the test location',
      'Spacing "a" between probes determines the depth measured (depth = spacing)',
      'Connect instrument: C1 to outer probe 1, P1 to inner probe 2, P2 to inner probe 3, C2 to outer probe 4',
      'Take the resistance reading (R)',
      'Calculate resistivity: ρ = 2πaR (where a = spacing in metres, R = reading in ohms)',
      'Result is in ohm-metres',
      'Repeat at different spacings: 1m, 2m, 5m, 10m, 20m to get a resistivity profile at different depths',
      'The depth at which resistivity is lowest indicates the best depth for ground electrodes',
      'Test at multiple locations across the proposed ground bed site',
      'Test in different seasons if possible — frozen ground has very high resistivity',
    ],
    equipment: ['4-point ground resistance tester (same instruments as 3-point)', '4 auxiliary probes with long leads', 'Measuring tape', 'Record sheets for resistivity vs depth plot'],
  },
  {
    title: 'Clamp-On Ground Resistance Testing',
    content: 'Measures ground resistance without disconnecting the electrode. Works only on systems with multiple parallel ground paths (multiple ground rods bonded in a system).',
    steps: [
      'Verify the system has multiple parallel ground paths (this method will not work on a single isolated electrode)',
      'Clamp the tester around the ground conductor going to the individual electrode you want to test',
      'The instrument injects a signal and measures the loop impedance',
      'The reading includes the electrode resistance in parallel with all other electrodes',
      'For individual electrode resistance: calculate from the parallel combination',
      'Useful for routine checks without disconnecting the system',
      'Cannot be used on a single isolated ground electrode — it measures a loop, so there must be a return path through other electrodes',
      'Good for verifying that individual rods in a ground bed are still effective',
    ],
    equipment: ['Clamp-on ground tester (Fluke 1630-2, Megger DET14C, AEMC 6417)', 'No auxiliary electrodes needed (advantage of this method)'],
  },
  {
    title: 'Ground Resistance Acceptable Values',
    content: 'Different applications require different ground resistance targets. Mining operations typically require much lower resistance than the CEC minimum.',
    values: [
      { condition: 'CEC Rule 10-206 maximum for single electrode', value: '25 Ω' },
      { condition: 'Recommended for commercial buildings', value: '< 5 Ω' },
      { condition: 'Mine surface substation', value: '< 1 Ω' },
      { condition: 'Mine underground substation', value: '< 5 Ω' },
      { condition: 'Mine portable power center', value: '< 5 Ω' },
      { condition: 'Mine main ground bed', value: '< 2 Ω' },
      { condition: 'Telecommunications / data center', value: '< 5 Ω' },
      { condition: 'Lightning protection ground', value: '< 10 Ω' },
      { condition: 'Hospital / sensitive equipment', value: '< 1 Ω' },
      { condition: 'Individual ground rod (typical)', value: '15-50 Ω (varies by soil)' },
    ],
  },
  {
    title: 'Bonding Conductor Continuity Testing',
    content: 'Verifies that the bonding path from every piece of equipment back to the source is continuous and low resistance.',
    steps: [
      'De-energize and lock out the circuit',
      'Use a low-resistance ohmmeter (milliohm meter) or a dedicated bonding tester',
      'Test from the equipment frame to the panel ground bus',
      'Then from the panel ground bus to the main bonding jumper',
      'Then from the main bonding jumper to the grounding electrode',
      'Each connection should be less than 1 ohm, ideally less than 0.1 ohm',
      'Check all bonding jumpers at flexible connections',
      'Verify conduit bonding at each fitting (locknut, bonding bushing, etc.)',
      'For trailing cables: test ground conductor resistance end-to-end',
      'Record results and compare to previous tests to identify degradation',
    ],
    equipment: ['Low-resistance ohmmeter / milliohm meter (Megger DLRO series)', 'Long test leads for trailing cable testing', 'Bonding tester'],
  },
  {
    title: 'Ground Fault Loop Impedance Testing',
    content: 'Measures the total impedance of the ground fault loop to verify that overcurrent devices will operate within required time during a fault.',
    steps: [
      'Use a ground fault loop impedance tester at the furthest outlet on the circuit',
      'The tester briefly creates a low-impedance path and measures voltage drop',
      'From the impedance, calculate the prospective ground fault current: IGFC = V / Z',
      'Compare this current to the overcurrent device trip characteristics',
      'Verify the device will trip within the required time (typically 5 seconds or less)',
      'For a 15A breaker: loop impedance must be low enough for the breaker to see 5x its rating (75A) within its trip time',
      'High loop impedance means the breaker may not trip fast enough on a ground fault',
      'If impedance is too high: check for loose connections, undersized ground conductors, or long cable runs',
    ],
    equipment: ['Loop impedance tester (Megger MFT1741, Fluke 1664 FC)', 'Record the prospective fault current at each test point'],
  },
  {
    title: 'Insulation Resistance of Grounding System',
    content: 'While we want low resistance to earth, we need high insulation resistance of the conductors carrying normal current — the grounding conductor insulation must be intact.',
    steps: [
      'For trailing cables: megger test the ground conductor to each phase conductor',
      'Test voltage: 500V for cables rated below 1000V, 1000V for cables up to 5kV, 5000V for cables above 5kV',
      'Minimum insulation resistance: 1 megohm per kV of rated voltage + 1 megohm',
      'For a 600V trailing cable: minimum 1.6 megohms ground to phase',
      'For a 5kV trailing cable: minimum 6 megohms ground to phase',
      'Test at mine-required intervals and after any cable repair or splice',
      'Record results and trend over time — decreasing values indicate insulation degradation',
    ],
    equipment: ['Insulation resistance tester / megger (Megger MIT series, Fluke 1555)', 'Rated for the test voltage required'],
  },
  {
    title: 'When to Test',
    content: 'Ground testing is not a one-time event. Regular testing catches degradation before it causes problems.',
    values: [
      { condition: 'New installation', value: 'Before energizing — mandatory' },
      { condition: 'Annual testing', value: 'All ground electrodes and bonding' },
      { condition: 'Monthly', value: 'Ground fault relay functional test (mining)' },
      { condition: 'After modifications', value: 'Any changes to grounding system' },
      { condition: 'After ground fault event', value: 'Verify system integrity' },
      { condition: 'After lightning strike', value: 'Check electrode and conductor damage' },
      { condition: 'Seasonal (where applicable)', value: 'Spring thaw, late summer dry, fall freeze' },
      { condition: 'After cable repair/splice', value: 'Megger and continuity test' },
      { condition: 'Before portable equipment relocation', value: 'Verify ground at new location' },
      { condition: 'When GFI alarm is received', value: 'Troubleshoot and locate fault' },
    ],
  },
  {
    title: 'Documenting Results',
    content: 'O. Reg. 854 requires documentation of all electrical testing. Poor documentation is a common inspection finding.',
    steps: [
      'Record: date, time, weather conditions (temperature, moisture, frost depth)',
      'Record: instrument used (make, model, serial number, calibration date)',
      'Record: test method (fall-of-potential, clamp-on, etc.)',
      'Record: electrode identification (which rod, plate, or grid section)',
      'Record: readings obtained (all probe positions for fall-of-potential)',
      'Record: calculated ground resistance value',
      'Record: pass/fail assessment against the target value',
      'Record: tester name and qualification',
      'Compare to previous results and note trends',
      'Flag any deterioration for corrective action',
      'Keep records for minimum 2 years (O. Reg. 854 requirement)',
      'Make records available for MOL inspector review',
    ],
  },
]

/* ===================== TAB 5: TROUBLESHOOTING ==================== */

interface TroubleshootingTopic {
  title: string
  content: string
  steps?: string[]
  subtopics?: { heading: string; text: string }[]
  danger?: boolean
  warning?: boolean
}

const troubleshootingTopics: TroubleshootingTopic[] = [
  {
    title: 'HRG System Fault Tracing',
    content: 'When the 59G relay alarms indicating a ground fault on an HRG system, you need to find which feeder is faulted. The clamp-on ammeter method is the standard approach.',
    steps: [
      'Confirm the 59G alarm is genuine — check voltage across NGR (should be close to phase voltage for a solid fault)',
      'Get a clamp-on ammeter capable of reading low AC current (1-10A range)',
      'Go to the main distribution point where feeders leave the bus',
      'Clamp the ammeter around all three phase conductors of each feeder (NOT the ground wire)',
      'Under normal conditions, the three phases should sum to near zero',
      'The faulted feeder will show the ground fault current (approximately 5A for a solid fault)',
      'The unfaulted feeders will show near-zero or small capacitive current only',
      'Once the faulted feeder is identified, trace downstream to isolate the fault',
      'Open each branch on the faulted feeder one at a time and watch the ammeter — when the current drops to zero, you have found the faulted branch',
      'Megger test the suspected faulted cable or equipment to confirm',
    ],
  },
  {
    title: 'Pulsing Ground Fault Locator',
    content: 'A pulsing ground fault indicator (PGI) makes fault tracing much easier. The relay system pulses the fault current on and off at a recognizable frequency (typically 0.5-2 Hz).',
    steps: [
      'Activate the pulsing mode on the HRG ground fault relay or standalone PGI unit',
      'The PGI periodically shorts and opens the NGR, creating a pulsing fault current',
      'Use a clamp-on ammeter on each feeder — the faulted feeder shows a distinctive pulsing signal',
      'Follow the pulsing current downstream: at each junction, clamp each branch',
      'The branch carrying the pulsing current leads toward the fault',
      'Continue tracing until you reach the faulted equipment or cable section',
      'The pulsing signal is easy to distinguish from normal load current or capacitive currents',
      'After locating and isolating the fault, de-activate pulsing mode',
      'Common PGI units: Littelfuse SE-330 (pulser), Bender RCMA series',
    ],
  },
  {
    title: 'Systematic Insulation Resistance Testing',
    content: 'When the clamp-on method doesn\'t clearly identify the fault (high-resistance or intermittent fault), use systematic megger testing.',
    steps: [
      'De-energize the faulted feeder (lock out / tag out)',
      'Disconnect all loads on the feeder',
      'Megger test the main cable run — all phases to ground',
      'If cable tests good, reconnect loads one at a time and megger test each',
      'The faulted equipment or cable will show low insulation resistance to ground',
      'For motor circuits: disconnect the motor leads and test the cable separately from the motor',
      'For VFDs: disconnect the output cable from the drive and test the cable and motor separately',
      'For long cable runs: if the cable fails, test each half to narrow down the fault location',
      'Accept criteria: 1 megohm per kV + 1 megohm minimum',
      'Document all readings for trending',
    ],
  },
  {
    title: 'Common Ground Fault Causes in Mining',
    content: 'Mining environments are harsh on electrical insulation. These are the most frequent causes of ground faults that you will encounter.',
    subtopics: [
      { heading: 'Moisture Ingress', text: 'The number one cause. Water entering junction boxes, motor terminal boxes, cable splices, and connector interfaces. Underground mines have constant water. Condensation from temperature changes. Pressure washing of equipment forces water into enclosures. Prevention: proper sealing, drain holes in J-boxes, heat tracing in cold areas, silicone sealant on entries.' },
      { heading: 'Vibration Damage', text: 'Mining equipment vibrates constantly. Vibration loosens terminal connections, causing hot spots that degrade insulation. Wire insulation wears through against sharp edges in vibrating equipment. Vibration causes fatigue cracking of cable jackets at entry points. Prevention: proper strain relief, vibration-resistant connectors, regular retorquing of terminals, flexible conduit transitions.' },
      { heading: 'Mechanical Damage', text: 'Trailing cables run over by equipment. Cables pinched between rock and equipment. Impact damage from falling rock. Cable pulled too tight around corners, damaging the jacket. Rodent damage (mice and porcupines chew cable insulation). Prevention: cable troughs, proper cable management, rodent-resistant cable jackets where available, regular visual inspection.' },
      { heading: 'Age and Thermal Degradation', text: 'Insulation deteriorates over time, especially at elevated temperatures. Every 10°C above rated temperature halves insulation life. Overloaded cables run hot, accelerating degradation. UV exposure on surface cables breaks down insulation. Prevention: proper cable sizing, temperature monitoring, replacing aged cables proactively, keeping cables out of direct sunlight.' },
      { heading: 'Poor Terminations and Splices', text: 'Improperly made splices are a major failure point. Insufficient insulation buildup on splices. Cold solder joints or improperly crimped connectors. Splice kits not rated for the voltage or environment. Moisture entering through poorly sealed splice points. Prevention: trained personnel making all splices, using proper splice kits, testing after splicing, regular inspection of accessible splices.' },
    ],
  },
  {
    title: 'Ground Faults on VFD Output',
    warning: true,
    content: 'Variable frequency drives create unique ground fault challenges. The PWM output waveform has very fast voltage transitions (dV/dt) that cause capacitive current flow to ground through cable capacitance.',
    subtopics: [
      { heading: 'Capacitive Ground Current', text: 'VFD output cables have capacitance between conductors and between conductors and ground. The fast-switching PWM waveform (rise times of 50-400 nanoseconds) charges and discharges this capacitance every switching cycle. The resulting "capacitive ground current" flows through the ground conductor and can be significant — 1-5A or more on long cable runs. This current is NOT a ground fault but will cause HRG ground fault relays to alarm.' },
      { heading: 'Nuisance Alarms', text: 'The capacitive charging current from VFD output cables can trip or alarm sensitive ground fault relays. This is a leading cause of "nuisance" ground fault alarms in mines. Solutions: use output filters (dV/dt filters or sine wave filters), keep cable runs as short as possible, use shielded VFD cable (TECK90 with overall shield), adjust relay pickup above the capacitive current level (but be careful not to reduce sensitivity below safe levels).' },
      { heading: 'Testing Challenges', text: 'Standard insulation resistance (megger) testing may not detect intermittent VFD-related faults. The fault may only occur at operating voltage and frequency. Use an oscilloscope with high-voltage differential probe to look at waveform quality. Check common-mode voltage with respect to ground. Verify that VFD output cables are properly shielded and the shield is grounded at both ends. Check for bearing currents on the motor (can indicate grounding issues).' },
    ],
  },
  {
    title: 'Nuisance Ground Fault Alarms',
    warning: true,
    content: 'Not every ground fault alarm indicates a real insulation failure. Understanding nuisance alarms prevents unnecessary shutdowns and helps focus troubleshooting.',
    subtopics: [
      { heading: 'Long Cable Runs', text: 'Every cable has capacitance to ground. Longer cables = more capacitance = more capacitive leakage current. This is normal but it can exceed relay pickup settings, especially on HRG systems set for high sensitivity. Solution: calculate expected capacitive current for the cable type and length. Set relay pickup above this value. Use multiple feeders for long runs instead of one long feeder. Document the expected capacitive current for each feeder as a baseline.' },
      { heading: 'Filter Capacitors', text: 'EMI filters, power factor correction capacitors, and surge suppressors all have capacitors connected line-to-ground. These provide a path for current to flow to ground at normal operating frequency and at harmonic frequencies. On HRG systems, the total capacitive current from all connected filters can exceed the 5A NGR current, making the system effectively ungrounded. Solution: inventory all line-to-ground capacitance on the system. Remove unnecessary filters. Size the NGR current to exceed total capacitive current.' },
      { heading: 'Harmonic Currents', text: 'Non-linear loads (VFDs, rectifiers, UPS systems) generate harmonic currents. These harmonics can flow through cable capacitance and line-to-ground paths. High-frequency harmonics are especially problematic because cable capacitive impedance decreases with frequency. Solution: harmonic filters on the source, shielded cable, proper grounding of cable shields. Consider harmonic content when selecting ground fault relay type — some relays respond to harmonics, others filter them out.' },
    ],
  },
  {
    title: 'Intermittent Ground Faults',
    content: 'The hardest faults to find. The insulation breaks down under certain conditions (vibration, temperature, moisture, voltage stress) and then recovers.',
    subtopics: [
      { heading: 'Trending and Data Logging', text: 'Install a data logger on the HRG system to record ground fault events with timestamp. Look for patterns: time of day (thermal cycling), weather (moisture), equipment operation (vibration when running). Many modern ground fault relays have event logging built in — use it. Track the frequency and duration of alarms. If alarms are increasing in frequency, the insulation is degrading and a permanent fault is coming.' },
      { heading: 'Thermal Cycling Faults', text: 'Insulation cracks under repeated thermal expansion/contraction. Fault appears when equipment is hot (insulation resistance drops with temperature) and disappears when cool. Test by running the equipment to operating temperature and then megger testing while still warm. Compare warm readings to cold readings — a significant drop indicates thermal fault.' },
      { heading: 'Vibration-Related Faults', text: 'A conductor may touch ground only when the equipment is running and vibrating. The fault disappears when the equipment stops. Very common on mining equipment. To diagnose: run the equipment while monitoring ground fault current with a clamp-on. Tap or vibrate suspected cable areas and watch for current spikes. Check for worn cable entry points, loose conductors in J-boxes, and cable rubbing on metal edges.' },
      { heading: 'Moisture-Related Faults', text: 'Fault appears during or after rain/washing, disappears as it dries. Common with damaged cable jackets, degraded splice insulation, and improperly sealed boxes. To diagnose: test during wet conditions. Spray water on suspected areas while monitoring ground fault current. Inspect all cable entries, J-boxes, and connector interfaces for moisture evidence (corrosion, mineral deposits, water staining).' },
    ],
  },
  {
    title: 'Emergency Procedures',
    danger: true,
    content: 'Not all ground faults are equal. Some require immediate action, others can be investigated while the system runs.',
    subtopics: [
      { heading: 'CLEAR IMMEDIATELY — Do Not Investigate While Running', text: 'Solidly grounded systems: any ground fault is cleared automatically by breakers — but verify the breaker tripped. Ungrounded delta systems: a second ground fault on any phase creates a phase-to-phase fault — if one fault exists, another could happen at any time. Ground fault with visible arcing, smoke, or fire. Ground fault with smell of burning insulation. Ground fault on a system with personnel in direct contact with equipment. Ground fault current exceeding the NGR continuous rating on HRG systems. Any time the ground fault relay trips (not just alarms).' },
      { heading: 'ALARM — Can Investigate While Running (HRG Only)', text: 'HRG system with first-fault alarm and no visible damage. Fault current is at expected level (approximately 5A for solid fault, less for resistive fault). No personnel working on or near the faulted circuit. The fault does not affect critical safety systems (ventilation, pumps, hoisting). You have the ability to monitor the fault while tracing. Begin fault tracing using clamp-on or PGI method. Set a time limit for investigation (typically one shift maximum). If the fault is not found within the time limit, schedule a shutdown to troubleshoot.' },
      { heading: 'General Emergency Steps', text: 'If in doubt, de-energize. Protect people first, then equipment. Notify the supervisor and electrical supervisor. Do not re-energize until the fault is found and repaired. Document everything — the alarm time, actions taken, what was found. After repair, test the system before re-energizing: megger test, ground resistance test, verify ground fault relays are functional.' },
    ],
  },
]

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
  padding: 14,
}

const sectionLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 4,
  marginTop: 12,
}

const monoTag: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--input-bg)',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--primary)',
  fontFamily: 'var(--font-mono)',
  marginBottom: 8,
}

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
}

const dangerBanner: React.CSSProperties = {
  background: 'rgba(255, 60, 60, 0.1)',
  border: '1px solid rgba(255, 60, 60, 0.3)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GroundingSystemsPage() {
  const [tab, setTab] = useState<TabKey>('types')
  const [expandedSystem, setExpandedSystem] = useState<number | null>(0)
  const [expandedMining, setExpandedMining] = useState<number | null>(0)
  const [expandedTest, setExpandedTest] = useState<number | null>(0)
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(0)
  const [search, setSearch] = useState('')

  const toggleExpand = (
    current: number | null,
    setter: (v: number | null) => void,
    idx: number,
  ) => {
    setter(current === idx ? null : idx)
  }

  /* -- Search filter helper -- */
  const matchSearch = (text: string) =>
    !search.trim() || text.toLowerCase().includes(search.toLowerCase())

  return (
    <>
      <Header title="Grounding & Bonding" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Safety banner */}
        <div style={dangerBanner}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{'⚠\uFE0F'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            <strong>Grounding saves lives.</strong> An improper ground is invisible until someone gets hurt.
            Always verify ground integrity before energizing. Never bypass ground check systems.
          </div>
        </div>

        {/* Tab pills */}
        <div style={pillRow}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={tab === t.key ? pillActive : pillBase}
              onClick={() => { setTab(t.key); setSearch('') }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
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
            placeholder={`Search ${tabs.find(t => t.key === tab)?.label ?? ''}...`}
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: 56, padding: '0 16px 0 44px',
              background: 'var(--input-bg)',
              border: '2px solid var(--input-border)',
              borderRadius: 'var(--radius)',
              fontSize: 16, color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* ========== TAB 1: SYSTEM TYPES ========== */}
        {tab === 'types' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* System type cards */}
            {systemTypes
              .filter(s => matchSearch(s.name + s.description + s.howItWorks + s.miningUse + s.firstFault))
              .map((sys, idx) => {
                const isOpen = expandedSystem === idx
                return (
                  <div key={sys.name} style={{
                    ...card,
                    borderLeft: `4px solid ${sys.color}`,
                    cursor: 'pointer',
                  }}>
                    <button
                      onClick={() => toggleExpand(expandedSystem, setExpandedSystem, idx)}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        padding: 0, cursor: 'pointer', textAlign: 'left',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        minHeight: 44, gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                          {sys.name}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {sys.description}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 18, color: 'var(--text-secondary)', flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}>
                        {'▼'}
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>

                        <div>
                          <div style={sectionLabel}>How It Works</div>
                          <div style={bodyText}>{sys.howItWorks}</div>
                        </div>

                        {/* First / Second fault behavior */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: 8,
                        }}>
                          <div style={{
                            background: sys.name.includes('Ungrounded')
                              ? 'rgba(255, 60, 60, 0.08)'
                              : 'rgba(255, 215, 0, 0.08)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: sys.name.includes('Ungrounded')
                              ? '1px solid rgba(255, 60, 60, 0.2)'
                              : '1px solid rgba(255, 215, 0, 0.15)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>
                              First Fault Behavior
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                              {sys.firstFault}
                            </div>
                          </div>
                          <div style={{
                            background: sys.name.includes('Ungrounded')
                              ? 'rgba(255, 60, 60, 0.15)'
                              : 'rgba(255, 215, 0, 0.05)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: sys.name.includes('Ungrounded')
                              ? '1px solid rgba(255, 60, 60, 0.3)'
                              : '1px solid rgba(255, 215, 0, 0.1)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4 }}>
                              Second Fault Behavior
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                              {sys.secondFault}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div style={sectionLabel}>Typical Voltages</div>
                          <div style={monoTag}>{sys.voltages}</div>
                        </div>

                        <div>
                          <div style={sectionLabel}>Mining Application</div>
                          <div style={bodyText}>{sys.miningUse}</div>
                        </div>

                        {/* Advantages / Disadvantages */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                          <div style={{
                            background: 'rgba(0, 204, 102, 0.08)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: '1px solid rgba(0, 204, 102, 0.2)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#00cc66', textTransform: 'uppercase', marginBottom: 6 }}>
                              Advantages
                            </div>
                            {sys.advantages.map((a, i) => (
                              <div key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, paddingLeft: 12, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#00cc66' }}>{'✓'}</span>
                                {a}
                              </div>
                            ))}
                          </div>
                          <div style={{
                            background: 'rgba(255, 60, 60, 0.06)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: '1px solid rgba(255, 60, 60, 0.15)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#ff3c3c', textTransform: 'uppercase', marginBottom: 6 }}>
                              Disadvantages
                            </div>
                            {sys.disadvantages.map((d, i) => (
                              <div key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, paddingLeft: 12, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#ff3c3c' }}>{'✗'}</span>
                                {d}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Text diagram */}
                        <div>
                          <div style={sectionLabel}>System Diagram</div>
                          <pre style={{
                            background: 'var(--input-bg)',
                            border: '1px solid var(--divider)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px',
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--primary)',
                            overflowX: 'auto',
                            whiteSpace: 'pre',
                            lineHeight: 1.5,
                            margin: 0,
                          }}>
                            {sys.diagram}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Comparison table */}
            {matchSearch('comparison table first fault second fault') && (
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
                }}>
                  System Comparison Table
                </div>
                <div style={{
                  overflowX: 'auto',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--divider)',
                }}>
                  <table style={{
                    width: '100%', borderCollapse: 'collapse',
                    fontSize: 12, minWidth: 600,
                    fontFamily: 'var(--font-sans)',
                  }}>
                    <thead>
                      <tr style={{ background: 'var(--input-bg)' }}>
                        {['System Type', 'First Fault', 'Second Fault', 'Typical Use'].map(h => (
                          <th key={h} style={{
                            padding: '10px 12px', textAlign: 'left',
                            color: 'var(--primary)', fontWeight: 700,
                            borderBottom: '2px solid var(--divider)',
                            whiteSpace: 'nowrap',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonTable.map((row, i) => (
                        <tr key={row.type} style={{
                          background: i % 2 === 0 ? 'var(--surface)' : 'var(--input-bg)',
                        }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--divider)', whiteSpace: 'nowrap' }}>
                            {row.type}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--divider)', lineHeight: 1.4 }}>
                            {row.first}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--divider)', lineHeight: 1.4 }}>
                            {row.second}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--divider)', lineHeight: 1.4 }}>
                            {row.use}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== TAB 2: CEC RULES ========== */}
        {tab === 'cec' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              CEC Section 10 — Grounding & Bonding
            </div>

            {cecRules
              .filter(r => matchSearch(r.rule + r.title + r.summary + r.fieldApplication))
              .map(rule => (
                <div key={rule.rule} style={{
                  ...card,
                  borderLeft: rule.critical
                    ? '4px solid #ff3c3c'
                    : '4px solid var(--primary)',
                  border: rule.critical
                    ? '1px solid rgba(255, 60, 60, 0.3)'
                    : '1px solid var(--divider)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                        {rule.critical && <span style={{ color: '#ff3c3c', marginRight: 6 }}>{'●'}</span>}
                        {rule.title}
                      </div>
                    </div>
                  </div>
                  <div style={monoTag}>{rule.rule}</div>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--text)',
                    lineHeight: 1.5, marginBottom: 8,
                  }}>
                    {rule.summary}
                  </div>
                  <div style={{
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    border: '1px solid var(--divider)',
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                      textTransform: 'uppercase', marginBottom: 6,
                    }}>
                      Field Application
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {rule.fieldApplication}
                    </div>
                  </div>
                </div>
              ))}

            {cecRules.filter(r => matchSearch(r.rule + r.title + r.summary + r.fieldApplication)).length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 15 }}>
                No rules match &quot;{search}&quot;
              </div>
            )}

            {/* Legend */}
            <div style={{
              ...card, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#ff3c3c', fontSize: 14 }}>{'●'}</span>
                <span><strong>Critical rules</strong> — essential for mining safety and compliance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--primary)', fontSize: 14 }}>{'●'}</span>
                <span><strong>Standard rules</strong> — important reference for proper grounding practice</span>
              </div>
            </div>
          </div>
        )}

        {/* ========== TAB 3: MINING GROUND ========== */}
        {tab === 'mining' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {miningTopics
              .filter(t => {
                const allText = t.title + t.content + (t.subtopics?.map(s => s.heading + s.text).join(' ') ?? '')
                return matchSearch(allText)
              })
              .map((topic, idx) => {
                const isOpen = expandedMining === idx
                const borderColor = topic.color ?? 'var(--primary)'
                return (
                  <div key={topic.title} style={{
                    ...card,
                    borderLeft: `4px solid ${borderColor}`,
                    ...(topic.critical ? { border: `1px solid ${borderColor}40` } : {}),
                  }}>
                    <button
                      onClick={() => toggleExpand(expandedMining, setExpandedMining, idx)}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        padding: 0, cursor: 'pointer', textAlign: 'left',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        minHeight: 44, gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                          {topic.critical && <span style={{ color: borderColor, marginRight: 6 }}>{'●'}</span>}
                          {topic.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {topic.content}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 18, color: 'var(--text-secondary)', flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}>
                        {'▼'}
                      </span>
                    </button>

                    {isOpen && topic.subtopics && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {topic.subtopics.map(sub => (
                          <div key={sub.heading} style={{
                            background: 'var(--input-bg)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: '1px solid var(--divider)',
                          }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                              {sub.heading}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                              {sub.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

            {miningTopics.filter(t => {
              const allText = t.title + t.content + (t.subtopics?.map(s => s.heading + s.text).join(' ') ?? '')
              return matchSearch(allText)
            }).length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 15 }}>
                No topics match &quot;{search}&quot;
              </div>
            )}
          </div>
        )}

        {/* ========== TAB 4: TESTING ========== */}
        {tab === 'testing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {testProcedures
              .filter(t => {
                const allText = t.title + t.content +
                  (t.steps?.join(' ') ?? '') +
                  (t.values?.map(v => v.condition + v.value).join(' ') ?? '') +
                  (t.equipment?.join(' ') ?? '')
                return matchSearch(allText)
              })
              .map((proc, idx) => {
                const isOpen = expandedTest === idx
                return (
                  <div key={proc.title} style={{
                    ...card,
                    borderLeft: '4px solid var(--primary)',
                  }}>
                    <button
                      onClick={() => toggleExpand(expandedTest, setExpandedTest, idx)}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        padding: 0, cursor: 'pointer', textAlign: 'left',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        minHeight: 44, gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                          {proc.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {proc.content}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 18, color: 'var(--text-secondary)', flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}>
                        {'▼'}
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

                        {/* Steps */}
                        {proc.steps && (
                          <div style={{
                            background: 'var(--input-bg)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: '1px solid var(--divider)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
                              Procedure
                            </div>
                            {proc.steps.map((step, i) => (
                              <div key={i} style={{
                                display: 'flex', gap: 10, alignItems: 'flex-start',
                                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                                padding: '4px 0',
                              }}>
                                <span style={{
                                  flexShrink: 0, width: 22, height: 22,
                                  borderRadius: '50%', background: 'var(--primary)',
                                  color: '#000', fontSize: 11, fontWeight: 700,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  marginTop: 1,
                                }}>
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Values table */}
                        {proc.values && (
                          <div style={{
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--divider)',
                            overflow: 'hidden',
                          }}>
                            {proc.values.map((v, i) => (
                              <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', gap: 12,
                                padding: '10px 12px',
                                background: i % 2 === 0 ? 'var(--surface)' : 'var(--input-bg)',
                                borderBottom: i < proc.values!.length - 1 ? '1px solid var(--divider)' : undefined,
                                minHeight: 44,
                              }}>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>
                                  {v.condition}
                                </span>
                                <span style={{
                                  fontSize: 14, fontWeight: 700, color: 'var(--primary)',
                                  fontFamily: 'var(--font-mono)', flexShrink: 0,
                                  textAlign: 'right',
                                }}>
                                  {v.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Equipment */}
                        {proc.equipment && (
                          <div style={{
                            background: 'rgba(255, 215, 0, 0.06)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 12px',
                            border: '1px solid rgba(255, 215, 0, 0.15)',
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6 }}>
                              Equipment Needed
                            </div>
                            {proc.equipment.map((eq, i) => (
                              <div key={i} style={{
                                fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                                paddingLeft: 14, position: 'relative',
                              }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>{'•'}</span>
                                {eq}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

            {testProcedures.filter(t => {
              const allText = t.title + t.content + (t.steps?.join(' ') ?? '') + (t.values?.map(v => v.condition + v.value).join(' ') ?? '')
              return matchSearch(allText)
            }).length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 15 }}>
                No procedures match &quot;{search}&quot;
              </div>
            )}
          </div>
        )}

        {/* ========== TAB 5: TROUBLESHOOTING ========== */}
        {tab === 'troubleshooting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {troubleshootingTopics
              .filter(t => {
                const allText = t.title + t.content +
                  (t.steps?.join(' ') ?? '') +
                  (t.subtopics?.map(s => s.heading + s.text).join(' ') ?? '')
                return matchSearch(allText)
              })
              .map((topic, idx) => {
                const isOpen = expandedTrouble === idx
                const isDanger = topic.danger
                const isWarning = topic.warning
                const borderColor = isDanger ? '#ff3c3c' : isWarning ? '#ff8c00' : 'var(--primary)'

                return (
                  <div key={topic.title}>
                    {/* Danger / warning banners */}
                    {isDanger && idx === troubleshootingTopics.filter(t => {
                      const allText = t.title + t.content + (t.steps?.join(' ') ?? '') + (t.subtopics?.map(s => s.heading + s.text).join(' ') ?? '')
                      return matchSearch(allText)
                    }).findIndex(t => t.danger) && (
                      <div style={{ ...dangerBanner, marginBottom: 12 }}>
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{'⚠\uFE0F'}</span>
                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                          <strong>Emergency decisions matter.</strong> Know when to de-energize immediately versus when you can safely investigate.
                        </div>
                      </div>
                    )}

                    <div style={{
                      ...card,
                      borderLeft: `4px solid ${borderColor}`,
                      ...(isDanger ? { border: '1px solid rgba(255, 60, 60, 0.3)' } : {}),
                      ...(isWarning ? { border: '1px solid rgba(255, 165, 0, 0.3)' } : {}),
                    }}>
                      <button
                        onClick={() => toggleExpand(expandedTrouble, setExpandedTrouble, idx)}
                        style={{
                          width: '100%', background: 'none', border: 'none',
                          padding: 0, cursor: 'pointer', textAlign: 'left',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          minHeight: 44, gap: 8,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                            {isDanger && <span style={{ color: '#ff3c3c', marginRight: 6 }}>{'●'}</span>}
                            {isWarning && <span style={{ color: '#ff8c00', marginRight: 6 }}>{'●'}</span>}
                            {topic.title}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {topic.content}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 18, color: 'var(--text-secondary)', flexShrink: 0,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}>
                          {'▼'}
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

                          {/* Steps */}
                          {topic.steps && (
                            <div style={{
                              background: 'var(--input-bg)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px 12px',
                              border: '1px solid var(--divider)',
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
                                Procedure
                              </div>
                              {topic.steps.map((step, i) => (
                                <div key={i} style={{
                                  display: 'flex', gap: 10, alignItems: 'flex-start',
                                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                                  padding: '4px 0',
                                }}>
                                  <span style={{
                                    flexShrink: 0, width: 22, height: 22,
                                    borderRadius: '50%', background: 'var(--primary)',
                                    color: '#000', fontSize: 11, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: 1,
                                  }}>
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Subtopics */}
                          {topic.subtopics && topic.subtopics.map(sub => {
                            const isEmergencyClear = sub.heading.includes('CLEAR IMMEDIATELY')
                            const isAlarm = sub.heading.includes('ALARM')
                            return (
                              <div key={sub.heading} style={{
                                background: isEmergencyClear
                                  ? 'rgba(255, 60, 60, 0.1)'
                                  : isAlarm
                                    ? 'rgba(255, 165, 0, 0.08)'
                                    : 'var(--input-bg)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '10px 12px',
                                border: isEmergencyClear
                                  ? '1px solid rgba(255, 60, 60, 0.3)'
                                  : isAlarm
                                    ? '1px solid rgba(255, 165, 0, 0.25)'
                                    : '1px solid var(--divider)',
                              }}>
                                <div style={{
                                  fontSize: 13, fontWeight: 700, marginBottom: 6,
                                  color: isEmergencyClear
                                    ? '#ff3c3c'
                                    : isAlarm
                                      ? '#ff8c00'
                                      : 'var(--text)',
                                }}>
                                  {sub.heading}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                                  {sub.text}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            {troubleshootingTopics.filter(t => {
              const allText = t.title + t.content + (t.steps?.join(' ') ?? '') + (t.subtopics?.map(s => s.heading + s.text).join(' ') ?? '')
              return matchSearch(allText)
            }).length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 15 }}>
                No topics match &quot;{search}&quot;
              </div>
            )}
          </div>
        )}

        {/* References footer */}
        <div style={{
          ...card, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CEC Section 10 (Grounding & Bonding),
          CEC Table 16 & 17 (Conductor Sizing), O. Reg. 854 (Mines & Mining Plants),
          IEEE Std 142 (Grounding of Industrial Systems), IEEE Std 80 (Substation Grounding),
          CSA Z462 (Workplace Electrical Safety)
        </div>
      </div>
    </>
  )
}
