import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Fire Alarm Systems Reference - Ontario Mining Electricians         */
/* ------------------------------------------------------------------ */

type TabKey = 'systems' | 'devices' | 'wiring' | 'inspection' | 'troubleshoot'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'systems', label: 'System Types' },
  { key: 'devices', label: 'Devices' },
  { key: 'wiring', label: 'Wiring' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'troubleshoot', label: 'Troubleshooting' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: System Types Data                                           */
/* ------------------------------------------------------------------ */

interface SystemType {
  name: string
  description: string
  advantages: string[]
  limitations: string[]
  typicalUse: string
  tint: string
}

const systemTypes: SystemType[] = [
  {
    name: 'Single-Stage System',
    description: 'When any initiating device activates, the general alarm sounds immediately throughout the building. All notification appliances (horns, strobes) activate at once. Simplest system type with no pre-alert signal.',
    advantages: [
      'Simplest to design and install',
      'Immediate notification of all occupants',
      'Lowest cost system',
      'Minimal programming required',
    ],
    limitations: [
      'No pre-alert for investigation before general alarm',
      'Every activation causes full building evacuation',
      'Higher rate of disruptive false alarms',
      'Not suitable for large or complex buildings',
    ],
    typicalUse: 'Small buildings, single-storey commercial, small warehouses, residential occupancies. Not typical in mining operations.',
    tint: '#3b82f6',
  },
  {
    name: 'Two-Stage System',
    description: 'First stage: alert signal (intermittent tone or local alarm) notifies staff to investigate. Second stage: if not acknowledged within a set time (typically 5 minutes), or if manually activated, general alarm sounds for full evacuation. Common in commercial and industrial buildings.',
    advantages: [
      'Allows investigation before full evacuation',
      'Reduces disruption from false alarms',
      'Staff can verify alarm before committing to evacuation',
      'Required by building code in many commercial/industrial occupancies',
    ],
    limitations: [
      'Requires trained staff to respond to first stage',
      'More complex programming and system design',
      'Must have reliable alert signal acknowledgment process',
      'Timer must be properly set and tested',
    ],
    typicalUse: 'Large commercial buildings, industrial facilities, hospitals, hotels, high-rise buildings. Common in mining surface buildings (processing plants, offices, maintenance shops).',
    tint: '#f59e0b',
  },
  {
    name: 'Addressable System',
    description: 'Each device (detector, pull station, module) has a unique digital address on the signaling line circuit (SLC). The FACP can identify exactly which device has activated, showing its specific location and type. Most common system type in new construction. Uses a communication protocol (polling) to continuously monitor each device.',
    advantages: [
      'Exact device identification — pinpoint location of alarm',
      'Individual device sensitivity monitoring',
      'Reduced wiring (multiple devices on one SLC loop)',
      'Device status monitoring (dirty detector, pre-alarm)',
      'Easier troubleshooting with point identification',
      'Can support larger systems with fewer circuits',
    ],
    limitations: [
      'Higher device cost compared to conventional',
      'Requires compatible devices from same manufacturer',
      'More complex programming and commissioning',
      'Technician must understand digital addressing',
    ],
    typicalUse: 'Most new commercial and industrial construction. Mining processing plants, large mine surface facilities, mine offices and camps. Required for complex or large buildings.',
    tint: '#22c55e',
  },
  {
    name: 'Conventional (Zone) System',
    description: 'Devices are grouped into zones. When a device activates, the panel identifies the zone but not the specific device. Each zone has its own initiating device circuit (IDC) with an end-of-line resistor. Zones are typically defined by floor, wing, or area.',
    advantages: [
      'Lower device cost',
      'Simpler installation and wiring',
      'Easier to understand for basic troubleshooting',
      'Generic detectors can be used (not manufacturer-specific)',
    ],
    limitations: [
      'Cannot identify specific device — only zone',
      'More wiring required (separate circuit per zone)',
      'Limited information for emergency response',
      'Less capability for sensitivity monitoring',
      'Larger panels needed for more zones',
    ],
    typicalUse: 'Smaller buildings, renovations where cost is a concern, simple occupancies. Some older mining facilities. Being replaced by addressable in most new construction.',
    tint: '#8b5cf6',
  },
  {
    name: 'Voice Evacuation System',
    description: 'Integrates a public address (PA) system with the fire alarm. Instead of (or in addition to) standard tones, pre-recorded or live voice messages direct occupants to evacuate. Can provide different messages to different zones. Includes amplifiers, speakers, and microphone for live announcements.',
    advantages: [
      'Clear, specific evacuation instructions',
      'Can direct occupants to specific exits',
      'Different messages for different zones/floors',
      'Live announcements for changing situations',
      'Reduces panic — voice is more calming than horns',
    ],
    limitations: [
      'Most expensive alarm system type',
      'Complex design — speaker placement, wattage calculations',
      'Requires audio amplifiers and backup power for amplifiers',
      'More maintenance required (speaker testing, amplifier service)',
      'Voice intelligibility must meet minimum dBA and clarity standards',
    ],
    typicalUse: 'High-rise buildings, large assembly occupancies, airports, hospitals. Large mining complexes with varying evacuation routes. Required by code in specific occupancy types.',
    tint: '#06b6d4',
  },
  {
    name: 'Mining Fire Detection Systems',
    description: 'Specialized fire detection for underground and surface mining operations. Addresses unique hazards: conveyor belt fires, methane accumulation, spontaneous combustion of coal, and equipment fires in confined spaces. Often integrated with gas monitoring (CO, CH4) and ventilation control systems.',
    advantages: [
      'Purpose-built for harsh mining environments',
      'Integrates fire detection with gas monitoring',
      'Linear heat detection covers long conveyor runs',
      'Can trigger automatic suppression systems',
      'Interfaces with mine ventilation and communication systems',
    ],
    limitations: [
      'Specialized equipment with limited vendor options',
      'Harsh environment reduces device lifespan',
      'Requires mine-specific knowledge for design and maintenance',
      'Must comply with O. Reg. 854 (Mines and Mining Plants)',
      'Underground installations face explosion-proof requirements',
    ],
    typicalUse: 'Underground belt tunnels (linear heat detection), equipment galleries, fuel storage, crusher houses, conveyor transfer points. Surface: processing plants, maintenance shops, electrical rooms.',
    tint: '#ef4444',
  },
]

interface SystemComponent {
  name: string
  abbr: string
  description: string
}

const systemComponents: SystemComponent[] = [
  { name: 'Fire Alarm Control Panel (FACP)', abbr: 'FACP', description: 'Brain of the system. Receives signals from initiating devices, processes information, activates notification appliances, and communicates with monitoring station. Located in a secure, accessible location (typically main entrance).' },
  { name: 'Annunciator', abbr: 'ANN', description: 'Remote display panel showing system status, zone/device in alarm, and trouble conditions. Located at building entrance for fire department use. May include zone map with LED indicators.' },
  { name: 'Initiating Devices', abbr: 'ID', description: 'Devices that detect fire conditions: smoke detectors, heat detectors, pull stations, duct detectors, sprinkler flow switches, and tamper switches. Connected to initiating device circuits (IDC) or signaling line circuits (SLC).' },
  { name: 'Notification Appliances', abbr: 'NA', description: 'Devices that alert occupants: horns, strobes, horn/strobes, speakers, and bells. Connected to notification appliance circuits (NAC). Must meet minimum dBA and candela requirements per code.' },
  { name: 'Monitoring Station', abbr: 'CMS', description: 'Central station that receives alarm, trouble, and supervisory signals from the FACP. Dispatches fire department on alarm. Connected via telephone line, cellular, or IP. ULC-listed monitoring required for most commercial buildings.' },
]

interface UlcStandard {
  number: string
  title: string
  relevance: string
}

const ulcStandards: UlcStandard[] = [
  { number: 'CAN/ULC-S524', title: 'Installation of Fire Alarm Systems', relevance: 'Primary installation standard for fire alarm systems in Canada. Covers design, installation, verification, and acceptance testing. Referenced by Ontario Building Code.' },
  { number: 'CAN/ULC-S527', title: 'Control Units for Fire Alarm Systems', relevance: 'Requirements for fire alarm control panels (FACPs). Testing and listing standards for panel hardware and software.' },
  { number: 'CAN/ULC-S536', title: 'Inspection and Testing of Fire Alarm Systems', relevance: 'Defines inspection frequencies, testing procedures, and documentation requirements. Basis for all fire alarm inspection programs.' },
  { number: 'CAN/ULC-S537', title: 'Verification of Fire Alarm Systems', relevance: 'Procedures for initial verification after installation or modification. Must be performed before system is placed in service.' },
  { number: 'CAN/ULC-S561', title: 'Installation and Services for Fire Signal Receiving Centres', relevance: 'Requirements for central monitoring stations that receive fire alarm signals.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Devices Data                                                */
/* ------------------------------------------------------------------ */

interface DeviceInfo {
  name: string
  type: 'initiating' | 'notification' | 'mining'
  description: string
  placement: string
  keySpecs: string
  tint: string
}

const devices: DeviceInfo[] = [
  /* Initiating Devices */
  {
    name: 'Ionization Smoke Detector',
    type: 'initiating',
    description: 'Contains a small radioactive source (Americium-241) that ionizes air in a sensing chamber. Smoke particles disrupt ion flow, reducing current and triggering alarm. Best at detecting fast-flaming fires with small particles.',
    placement: 'General areas, electrical rooms, server rooms. NOT suitable for kitchens, garages, or areas with combustion byproducts. Being phased out in some jurisdictions due to radioactive source.',
    keySpecs: 'Spacing: 9.1m (30 ft) max between detectors. 4.6m (15 ft) from walls. Ceiling mount. Keep >0.9m from HVAC diffusers.',
    tint: '#ef4444',
  },
  {
    name: 'Photoelectric Smoke Detector',
    type: 'initiating',
    description: 'Uses a light source and photosensor in a chamber. Smoke particles scatter light onto the photosensor, triggering alarm. Best at detecting slow, smoldering fires that produce large smoke particles. Preferred over ionization in most applications.',
    placement: 'Hallways, sleeping areas, living spaces, offices. Better than ionization near kitchens and bathrooms (fewer nuisance alarms). Standard choice for most applications.',
    keySpecs: 'Spacing: 9.1m (30 ft) max. Ceiling mount or within 300mm of ceiling on wall. Must be compatible with FACP (addressable or conventional).',
    tint: '#ef4444',
  },
  {
    name: 'Beam Detector (Projected Beam)',
    type: 'initiating',
    description: 'Projects an infrared beam across a large space. Smoke between the transmitter and receiver (or reflector) reduces signal strength, triggering alarm. Single unit can cover up to 100m. Ideal for large open areas where spot detectors are impractical.',
    placement: 'Warehouses, atriums, aircraft hangars, large industrial spaces. Mount at ceiling level. Transmitter and receiver/reflector must have clear line of sight.',
    keySpecs: 'Range: up to 100m. Beam width coverage: up to 18m (60 ft). Sensitivity adjustable. Self-compensating models adjust for dust buildup.',
    tint: '#ef4444',
  },
  {
    name: 'Air Sampling (VESDA)',
    type: 'initiating',
    description: 'Continuously draws air through a network of sampling pipes using an aspirating fan. Air passes through a laser detection chamber that can detect very early traces of smoke. Most sensitive detection technology available. VESDA is the most common brand.',
    placement: 'Data centers, server rooms, clean rooms, heritage buildings, high-value storage. Sampling pipes run along ceiling with small holes at regular intervals.',
    keySpecs: 'Multiple sensitivity levels: Alert, Action, Fire 1, Fire 2. Can detect smoke at <0.005% obscuration. Pipe network up to 200m total. Requires regular filter maintenance.',
    tint: '#ef4444',
  },
  {
    name: 'Fixed Temperature Heat Detector',
    type: 'initiating',
    description: 'Activates when ambient temperature reaches a preset threshold. Common ratings: 57\°C (135\°F) for ordinary areas, 93\°C (200\°F) for high-temperature environments. Uses bimetallic element, fusible alloy, or electronic sensor.',
    placement: 'Kitchens, garages, boiler rooms, mechanical rooms, dusty environments where smoke detectors would false alarm. Must be rated at least 11\°C (20\°F) above maximum expected ambient temperature.',
    keySpecs: 'Spacing per ULC: ordinary rating 9.1m (30 ft), intermediate 9.1m, high temp 9.1m. Reduce spacing for high ceilings. Non-restorable (fusible) or restorable (bimetallic).',
    tint: '#f59e0b',
  },
  {
    name: 'Rate-of-Rise Heat Detector',
    type: 'initiating',
    description: 'Activates when temperature rises faster than a set rate, typically 8.3\°C (15\°F) per minute. Also includes a fixed temperature element as backup. More responsive than fixed-temp alone. Pneumatic type uses air chamber that expands with rapid heat increase.',
    placement: 'Same as fixed temperature, but provides faster response to rapidly developing fires. Good for areas with stable ambient temperatures. Not suitable for areas with normal rapid temperature changes.',
    keySpecs: 'Spacing: same as fixed temp per ULC. Combination rate-of-rise/fixed-temp is most common. Self-restoring after rate-of-rise activation. Fixed-temp element may be non-restorable.',
    tint: '#f59e0b',
  },
  {
    name: 'Manual Pull Station',
    type: 'initiating',
    description: 'Manual fire alarm initiating device. Occupant pulls handle or breaks glass to activate alarm. Single-action (pull only) is standard in Canada. Double-action (lift cover then pull) used in areas with frequent accidental activation.',
    placement: 'Required at every exit door on every floor. Maximum 45m (150 ft) travel distance from any point to nearest pull station. Mount at 1.2-1.4m (48-54 inches) above floor. Accessible and unobstructed.',
    keySpecs: 'Single action standard in Ontario. Red color, clearly marked "FIRE". Reset with key. Tamper-resistant. Address required for addressable systems.',
    tint: '#ef4444',
  },
  {
    name: 'Duct Smoke Detector',
    type: 'initiating',
    description: 'Installed in HVAC ductwork to detect smoke being distributed through the air handling system. Sampling tubes extend into the duct. When smoke is detected, it can shut down the HVAC unit, close fire/smoke dampers, and signal the FACP.',
    placement: 'Required in supply ducts serving areas over 2000 CFM (some jurisdictions). Install in supply duct downstream of fan and filters, and in return ducts over 15,000 CFM. Access panel required for maintenance.',
    keySpecs: 'Sampling tubes sized for duct width. Must not be sole means of detection for a space. Requires aux relay for HVAC shutdown. Annual sensitivity testing required.',
    tint: '#f59e0b',
  },
  {
    name: 'Sprinkler Flow & Tamper Switches',
    type: 'initiating',
    description: 'Flow switch: detects water movement in sprinkler piping when a head activates. Sends alarm signal to FACP. Tamper switch: monitors valve position (open/closed) on sprinkler system control valves. Sends supervisory signal if valve is closed.',
    placement: 'Flow switch: on main riser or branch line of each sprinkler zone. Tamper switch: on every control valve in sprinkler system (OS&Y valves, butterfly valves, PIV).',
    keySpecs: 'Flow switch: retard timer (adjustable 0-60 sec) to prevent false alarms from water hammer. Tamper switch: supervisory signal (not alarm). Both require supervision on FACP.',
    tint: '#3b82f6',
  },

  /* Notification Appliances */
  {
    name: 'Horn/Strobe Combination',
    type: 'notification',
    description: 'Combined audible (horn) and visual (strobe) notification appliance. Most common notification device. Horn provides audible alarm (typically 85+ dBA at 10 ft). Strobe provides visual notification for hearing-impaired occupants.',
    placement: 'Corridors, open areas, classrooms, offices. Mount on wall at 2.0-2.4m (80-96 inches) to top of strobe lens. Strobe candela rating based on room size and ceiling height.',
    keySpecs: 'Audible: minimum 15 dBA above ambient or 5 dBA above max noise level. Sleeping areas: 75 dBA at pillow. Strobe: 15 cd (corridors), 30-115 cd (rooms), 185 cd (large rooms). Synchronized strobes required.',
    tint: '#22c55e',
  },
  {
    name: 'Horn (Audible Only)',
    type: 'notification',
    description: 'Audible-only notification appliance. Various tones: continuous, temporal-3 (T3 code), or march time. Temporal-3 pattern (.5s on, .5s off, .5s on, .5s off, .5s on, 1.5s off) is the standard fire alarm signal.',
    placement: 'Areas where visual notification is not required or provided separately. Mechanical rooms, parking structures, stairwells.',
    keySpecs: 'Sound output: 85-99 dBA at 10 ft typical. Temporal-3 pattern for fire alarm per ULC. Must be audible above ambient noise in all areas served.',
    tint: '#22c55e',
  },
  {
    name: 'Speaker (Voice Evacuation)',
    type: 'notification',
    description: 'Speaker for voice evacuation systems. Delivers pre-recorded messages and live announcements. Wattage taps (0.25W, 0.5W, 1W, 2W) allow level adjustment. Requires 25V or 70V audio riser from amplifier.',
    placement: 'Similar to horn/strobe placement. Voice intelligibility (STI/CIS) must be verified in each space. Often combined with strobe for visual notification.',
    keySpecs: 'Wattage tap selected based on ambient noise and distance. 25V or 70V system. Must maintain intelligibility (CIS >0.70). Backup amplifier required.',
    tint: '#22c55e',
  },

  /* Mining-Specific */
  {
    name: 'Linear Heat Detection (Cable)',
    type: 'mining',
    description: 'Heat-sensitive cable that detects temperature along its entire length. Two conductors separated by heat-sensitive polymer. When temperature exceeds rating, polymer melts and conductors short, triggering alarm. Ideal for long, narrow spaces like conveyor belt tunnels.',
    placement: 'Run along conveyor belt structure, typically above the belt on the return side where friction fires originate. Also used in cable trays, tunnel ceilings, and along fuel lines. Fastened every 1.5-3m.',
    keySpecs: 'Alarm temperatures: 68\°C (155\°F), 88\°C (190\°F), 105\°C (220\°F). Digital type can locate alarm point within 1m. Analog type provides continuous temperature monitoring. Non-restorable (replace after activation) or restorable.',
    tint: '#ef4444',
  },
  {
    name: 'CO Detector (Carbon Monoxide)',
    type: 'mining',
    description: 'Electrochemical sensor that detects carbon monoxide gas. CO is an early indicator of fire in underground mines (combustion produces CO before visible smoke in many scenarios). Continuous monitoring with adjustable alarm thresholds.',
    placement: 'Underground: at regular intervals along main airways, at conveyor belt drives, near electrical installations, in refuges. Surface: enclosed spaces, equipment rooms, parking structures.',
    keySpecs: 'Typical alarm levels: 25 ppm (TWA warning), 50 ppm (action level), 100 ppm (immediate evacuation). Sensor life: 2-5 years. Calibration: every 3-6 months minimum. Cross-sensitive to H2S (select appropriate sensor).',
    tint: '#f59e0b',
  },
  {
    name: 'Methane Detector (CH4)',
    type: 'mining',
    description: 'Catalytic bead or infrared sensor for detecting methane gas accumulation. Critical in underground mines where methane can accumulate to explosive concentrations (5-15% LEL). Often integrated with ventilation control and equipment shutdown.',
    placement: 'Underground: highest point in headings, at face, behind seals, in return airways. Near potential ignition sources. Continuous monitoring required in gassy mines.',
    keySpecs: 'Alarm levels: 0.5% (warning/power disconnect in Ontario), 1.0% (evacuation), 1.25% (all equipment de-energized). LEL of methane: 5.0%. Calibration: weekly minimum. Bump test daily.',
    tint: '#ef4444',
  },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Wiring Data                                                 */
/* ------------------------------------------------------------------ */

interface WiringClass {
  name: string
  style: string
  description: string
  diagram: string
  faultTolerance: string
  tint: string
}

const wiringClasses: WiringClass[] = [
  {
    name: 'Class B (Style 4)',
    style: 'Style 4 (IDC/NAC)',
    description: 'Single run from panel to devices and back to panel with an end-of-line (EOL) resistor at the last device. Panel supervises the circuit by monitoring the EOL resistor value. An open circuit causes a trouble condition. A short circuit can cause a false alarm (IDC) or activation (NAC).',
    diagram:
`  CLASS B (STYLE 4) - SINGLE RUN WITH EOL
  ═════════════════════════════════════════

  FACP                                    LAST
  PANEL                                   DEVICE
  ┌─────┐                                ┌─────┐
  │ IDC │─── DET ── DET ── DET ── DET ──│ EOL │
  │  +  │    #1     #2     #3     #4     │  R  │
  │  -  │─── ─── ── ─── ── ─── ── ─── ──│     │
  └─────┘                                └─────┘

  ★ EOL resistor at last device (typically 4.7k or 3.9k)
  ★ Open wire = TROUBLE (loss of EOL)
  ★ Short circuit = ALARM (on IDC) / activation (on NAC)
  ★ Ground fault supervision varies by panel

  WIRING: "T-tapping" is common practice
  ┌─────┐
  │FACP │── DET ── DET ──┬── DET ── EOL
  │     │                 │
  │     │── ── ── ── ──┘ └── DET
  └─────┘  (T-tap spur to additional device)`,
    faultTolerance: 'A single open circuit disables all devices beyond the break. Panel sees trouble (loss of EOL). A single short circuit causes alarm condition on IDC or activates all devices on NAC.',
    tint: '#3b82f6',
  },
  {
    name: 'Class A (Style 6/7)',
    style: 'Style 6 (IDC/NAC) / Style 7 (SLC)',
    description: 'Loop configuration with outgoing and return paths to the panel. If a single open circuit occurs, the panel can communicate with all devices from both directions (some devices from the outgoing path, rest from the return path). Provides higher fault tolerance than Class B.',
    diagram:
`  CLASS A (STYLE 6/7) - LOOP WITH RETURN
  ════════════════════════════════════════

  FACP           OUTGOING PATH
  PANEL  ──────── DET ── DET ── DET ── DET
  ┌─────┐         #1     #2     #3     #4
  │ SLC │                                │
  │ OUT │                                │
  │     │                                │
  │ SLC │                                │
  │ RET │                                │
  └─────┘         DET ── DET ── DET ──── ┘
         ──────── #8     #7     #6     #5
                 RETURN PATH

  ★ No EOL resistor needed (loop returns to panel)
  ★ Single open: panel communicates from both ends
  ★ Single ground: panel can isolate and continue
  ★ Isolator modules placed every 50 devices (code)

  WITH ISOLATOR MODULES:
  FACP ── ISO ── DET ── DET ── ISO ── DET ── DET ── FACP
                                 │
                          (isolator module
                           isolates faulted
                           section)`,
    faultTolerance: 'Survives a single open circuit — panel communicates from both directions. Survives a single ground fault with isolator modules. Most reliable wiring class. Required in some critical applications and high-rise buildings.',
    tint: '#22c55e',
  },
  {
    name: 'Class X (Style 7)',
    style: 'Style 7 (SLC)',
    description: 'Similar to Class A but with additional short-circuit fault tolerance. Uses isolator modules to automatically disconnect a short-circuited section while maintaining communication with all other devices on the loop. Most robust wiring configuration.',
    diagram:
`  CLASS X (STYLE 7) - SHORT CIRCUIT TOLERANT
  ═══════════════════════════════════════════

  FACP ── ISO ── DET ── DET ── ISO ── DET ── DET
  ┌────┐                        │
  │SLC │                   ┌────┴────┐
  │OUT │                   │ SHORT   │
  │    │                   │ CIRCUIT │
  │SLC │                   │ HERE    │
  │RET │                   └────┬────┘
  └────┘                        │
         ── ISO ── DET ── DET ── ISO ── DET ── DET

  ★ Isolator modules (ISO) on each side of fault
  ★ Faulted section isolated automatically
  ★ Remaining devices continue to operate
  ★ Isolators required every 50 devices or per zone

  ISOLATOR PLACEMENT:
  - Between each floor or fire zone
  - Maximum 50 addressable devices between isolators
  - At both sides of riser connections`,
    faultTolerance: 'Survives single open AND single short circuit simultaneously. Isolator modules disconnect faulted section. All devices outside faulted section remain operational. Highest level of survivability.',
    tint: '#8b5cf6',
  },
]

interface WireType {
  type: string
  name: string
  rating: string
  use: string
}

const wireTypes: WireType[] = [
  { type: 'FPL', name: 'Fire Power Limited', rating: 'General purpose fire alarm cable. Not plenum or riser rated.', use: 'Enclosed raceways, non-plenum spaces. Basic fire alarm wiring.' },
  { type: 'FPLR', name: 'Fire Power Limited Riser', rating: 'Rated for vertical runs in risers and shafts.', use: 'Vertical runs between floors, riser shafts. Flame spread limited.' },
  { type: 'FPLP', name: 'Fire Power Limited Plenum', rating: 'Low smoke and flame spread for plenum spaces.', use: 'Above drop ceilings, in plenum air spaces, HVAC duct spaces.' },
  { type: 'CI', name: 'Circuit Integrity', rating: '2-hour fire rated cable. Maintains circuit integrity during fire.', use: 'Emergency voice/alarm circuits, firefighter communication, critical circuits that must operate during fire. Required for survivability circuits.' },
]

interface CircuitType {
  abbr: string
  name: string
  description: string
  supervision: string
}

const circuitTypes: CircuitType[] = [
  { abbr: 'SLC', name: 'Signaling Line Circuit', description: 'Digital communication loop between FACP and addressable devices. Carries polling data, device status, and alarm signals. Low current (typically <50mA). Uses twisted pair wiring.', supervision: 'Panel continuously polls each device. Open/short/ground faults detected and reported as specific trouble conditions.' },
  { abbr: 'IDC', name: 'Initiating Device Circuit', description: 'Circuit connecting initiating devices (detectors, pull stations) to the FACP in conventional systems. Normal state: EOL resistor value. Alarm state: short circuit (or lower resistance). Trouble: open circuit (loss of EOL).', supervision: 'Panel monitors EOL resistor. Alarm = resistance drops below threshold. Trouble = resistance goes to infinity (open). Ground fault = varies by panel.' },
  { abbr: 'NAC', name: 'Notification Appliance Circuit', description: 'Circuit powering notification appliances (horns, strobes, speakers). Normally de-energized (standby). When activated, panel applies power (24VDC typical) to energize all devices on the circuit. EOL resistor supervises wiring integrity while standby.', supervision: 'Panel monitors EOL in standby (same as IDC). On activation, monitors current draw vs expected load. Open circuit during activation = trouble.' },
]

interface WiringTip {
  tip: string
  category: 'best-practice' | 'code' | 'mining'
}

const wiringTips: WiringTip[] = [
  { tip: 'T-tapping: devices can be connected as spur taps off the main circuit (Class B). Keep spurs short. T-taps are common practice but some manufacturers recommend daisy-chain only.', category: 'best-practice' },
  { tip: 'EOL resistor placement: MUST be at the last device, NOT at the panel. Placing EOL at the panel supervises nothing — the entire field wiring could be open and the panel would show normal.', category: 'code' },
  { tip: 'EOL resistor value: use the value specified by the panel manufacturer (typically 3.9kΩ, 4.7kΩ, or 10kΩ). Using the wrong value causes trouble or false alarm.', category: 'code' },
  { tip: 'Maintain supervision: never "jump out" an EOL or bypass a device without restoring supervision. Even during service, use a supervisory jumper that maintains the expected circuit resistance.', category: 'best-practice' },
  { tip: 'CEC Section 32: fire alarm wiring must be run in dedicated raceways. Do not mix fire alarm wiring with other systems in the same conduit or cable tray.', category: 'code' },
  { tip: 'Proper terminations: use manufacturer-approved wire nuts or terminal blocks. Do not use push-in connectors for fire alarm circuits. Secure all connections with appropriate mechanical fasteners.', category: 'best-practice' },
  { tip: 'Wire color: red is standard for fire alarm wiring in Ontario. Some systems use red/black pair. Follow local AHJ requirements and maintain consistency throughout the installation.', category: 'code' },
  { tip: 'Mining environments: use armored cable (TECK or BX) or rigid conduit in all exposed areas. Mining vibration and mechanical damage require robust wiring methods. Seal all conduit entries against dust.', category: 'mining' },
  { tip: 'Cable derating: in mining, ambient temperatures may be high. Check cable ratings and derate if conduit fill or ambient temperature exceeds standard conditions.', category: 'mining' },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Inspection Data                                             */
/* ------------------------------------------------------------------ */

interface InspectionSchedule {
  frequency: string
  items: string[]
  reference: string
  tint: string
}

const inspectionSchedules: InspectionSchedule[] = [
  {
    frequency: 'Monthly',
    items: [
      'Visual inspection of FACP: check for trouble signals, alarm history, normal indicators',
      'Verify all panel LEDs/displays are functional (press lamp test if available)',
      'Check that FACP is receiving AC power and battery charger is operating',
      'Verify trouble signals are current and match known conditions',
      'Check printer/log (if equipped) for unusual entries',
      'Visual inspection of annunciator panels at entrances',
      'Verify central station monitoring connection is active (check with monitoring company)',
    ],
    reference: 'CAN/ULC-S536 Table 1',
    tint: '#22c55e',
  },
  {
    frequency: 'Semi-Annual (6 Months)',
    items: [
      'Test smoke detector sensitivity using calibrated test equipment or panel readout (addressable)',
      'Test sprinkler waterflow switches: open inspector test connection, verify alarm at panel within 90 seconds',
      'Test sprinkler tamper switches: partially close each valve, verify supervisory signal at panel',
      'Test duct detectors with canned smoke or aerosol (per manufacturer)',
      'Verify fire pump operation (if applicable): auto-start on pressure drop',
      'Battery load test: measure voltage under load per manufacturer spec',
      'Verify all software/firmware is current version and parameters are correct',
    ],
    reference: 'CAN/ULC-S536 Table 1',
    tint: '#f59e0b',
  },
  {
    frequency: 'Annual (12 Months)',
    items: [
      'Test EVERY initiating device: activate each detector, pull station, and supervisory device',
      'Test EVERY notification appliance: verify audibility and visibility (horns, strobes, speakers)',
      'Smoke detector testing: sensitivity test using calibrated smoke or panel diagnostic',
      'Heat detector testing: heat source test (heat gun to appropriate temp) or electronic test',
      'Pull station testing: operate each pull station and verify alarm at panel',
      'Battery capacity test: disconnect AC, measure battery duration under full alarm load',
      'Battery replacement: if batteries are over 5 years old or fail capacity test',
      'Emergency generator start test (if applicable): verify automatic transfer and fire alarm power',
      'Voice evacuation: test all pre-recorded messages and live microphone in each zone',
      'Verify all wiring and connections are secure (visual and tug test on random sample)',
      'Complete system documentation review: verify as-built drawings match installation',
    ],
    reference: 'CAN/ULC-S536 Table 1',
    tint: '#ef4444',
  },
  {
    frequency: '5-Year',
    items: [
      'Duct detector cleaning and recalibration (or replacement per manufacturer)',
      'Special hazard system testing (suppression systems, pre-action, deluge)',
      'Detector replacement evaluation: some manufacturers recommend replacement at 10-15 years',
      'Complete system re-verification if significant modifications have been made',
      'Firmware/software updates and full panel backup',
      'Ground fault testing on all circuits',
    ],
    reference: 'CAN/ULC-S536 Table 1 / Manufacturer recommendations',
    tint: '#8b5cf6',
  },
]

interface TestProcedure {
  test: string
  method: string
  passCriteria: string
}

const testProcedures: TestProcedure[] = [
  { test: 'Smoke Entry Test', method: 'Apply canned aerosol smoke (UL-listed) at detector. Hold within 0.6m of detector for up to 20 seconds. Use extension pole for ceiling-mounted detectors.', passCriteria: 'Detector activates and panel shows correct device/zone in alarm within manufacturer time spec (typically <30 seconds).' },
  { test: 'Heat Detector Test', method: 'Apply heat source (heat gun, hair dryer) to detector until rated temperature is reached. For rate-of-rise: apply heat rapidly. Electronic test tools available for some brands.', passCriteria: 'Fixed temp: activates at rated temperature (+/-5%). Rate-of-rise: activates when rate exceeds 8.3\°C/min. Panel shows correct device in alarm.' },
  { test: 'Pull Station Test', method: 'Operate pull station handle/lever. Note: some pull stations are single-action, some require protective cover to be lifted first. Reset with key after test.', passCriteria: 'Panel immediately shows alarm from correct device/zone. All programmed notification appliances activate. Signal received at monitoring station.' },
  { test: 'Waterflow Test', method: 'Open inspector test valve (ITV) on the most remote sprinkler riser. Water flows through test orifice, activating flow switch on the riser.', passCriteria: 'Alarm at panel within 90 seconds of opening ITV (retard timer delay). Correct zone identification. Monitoring station notified.' },
  { test: 'Battery Load Test', method: 'Disconnect AC power to FACP. Place system in alarm (activate one zone). Measure battery voltage under alarm load. Time battery duration.', passCriteria: 'Batteries must provide 24 hours standby + 5 minutes alarm load (or 60 hours standby + 5 min alarm if no generator). Voltage must stay above minimum operating threshold.' },
  { test: 'Voice Intelligibility Test', method: 'Play pre-recorded message in each speaker zone. Measure Common Intelligibility Scale (CIS) using test equipment at multiple locations in each zone.', passCriteria: 'CIS score must be \≥0.70 (or per AHJ requirements). All words clearly intelligible above ambient noise. Live microphone test from each fire command station.' },
]

interface DocumentReq {
  item: string
  detail: string
}

const documentReqs: DocumentReq[] = [
  { item: 'Inspector Identification', detail: 'Name, company, CFAA certification number, and qualifications of person performing inspection.' },
  { item: 'System Identification', detail: 'Building address, system type, panel make/model, number of zones/devices, date of installation.' },
  { item: 'Test Results', detail: 'Each device tested: pass/fail, device address/zone, type, location, date and time tested.' },
  { item: 'Deficiencies', detail: 'List of all deficiencies found. Severity (critical, non-critical). Recommended correction timeline.' },
  { item: 'Deficiency Correction', detail: 'Critical deficiencies: immediate correction or fire watch. Non-critical: correct within 30 days (or per AHJ).' },
  { item: 'Report Distribution', detail: 'Copy to building owner, fire department (AHJ), monitoring company, and maintenance file at FACP.' },
  { item: 'Mining (O. Reg. 854)', detail: 'Ontario mining operations must maintain fire alarm inspection records per O. Reg. 854 (Mines and Mining Plants). Underground mine fire detection systems have additional inspection requirements. Joint Health and Safety Committee (JHSC) must be informed of deficiencies.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Troubleshooting Data                                        */
/* ------------------------------------------------------------------ */

interface TroubleshootItem {
  problem: string
  symptoms: string
  causes: string[]
  solutions: string[]
  severity: 'high' | 'medium' | 'low'
}

const troubleshootItems: TroubleshootItem[] = [
  {
    problem: 'Ground Fault on Circuit',
    symptoms: 'Panel displays "GROUND FAULT" trouble on one or more circuits. May be intermittent. Can affect system operation.',
    causes: [
      'Damaged cable insulation (nails, screws, abrasion, rodent damage)',
      'Moisture in junction box, conduit, or detector base',
      'Wiring touching metal conduit or enclosure at bare splice',
      'Failed device with internal insulation breakdown',
      'Condensation in outdoor or mining underground installations',
    ],
    solutions: [
      'Systematic isolation: disconnect half the circuit at midpoint. If ground fault clears, fault is in the disconnected half. Repeat until isolated.',
      'Megger test each section of wiring (disconnect all devices first)',
      'Inspect all junction boxes for moisture, damaged wire, and improper splices',
      'Check each device base for moisture, corrosion, or conductive dust buildup',
      'In mining: pay special attention to areas with water intrusion and high humidity',
      'Repair damaged insulation or replace wire. Re-test to confirm clear.',
    ],
    severity: 'high',
  },
  {
    problem: 'Trouble Conditions',
    symptoms: 'Panel shows various trouble indicators. Yellow trouble LED illuminated. Buzzer sounding.',
    causes: [
      'Open circuit: broken wire, loose connection, device removed from base',
      'Short circuit: pinched wire, crossed conductors at splice point',
      'Ground fault: insulation failure (see above)',
      'Low battery: batteries aging (>5 years), charger failure, high AC ripple',
      'AC power loss: tripped breaker, blown fuse, power outage',
      'Communication failure: lost connection to monitoring station (phone line, IP, cellular)',
    ],
    solutions: [
      'Read panel display carefully — most panels identify the circuit and type of trouble',
      'Open circuit: walk the circuit, check each device in base, check all splices and terminal connections',
      'Short circuit: disconnect circuit at panel, check resistance (should read EOL value). Isolate as with ground fault.',
      'Low battery: test battery voltage (should be >12.6V per 12V battery). Load test. Replace if >5 years or failing capacity.',
      'AC loss: check dedicated fire alarm breaker. Should be on a locked breaker with red marking (CEC requirement).',
      'Comm failure: check phone line/IP/cellular connection. Contact monitoring station to verify signal path.',
    ],
    severity: 'medium',
  },
  {
    problem: 'False Alarms',
    symptoms: 'System goes into alarm without actual fire condition. Specific device or zone activates without cause.',
    causes: [
      'Dust and debris on smoke detector optics (most common in mining)',
      'Steam or high humidity (near kitchens, showers, steam pipes)',
      'Cooking smoke or aerosol spray near detector',
      'HVAC pushing air through detector too fast (>1.5 m/s)',
      'Insects inside detector sensing chamber',
      'Detector at end of life (sensitivity drift after 10+ years)',
      'Electrical noise/interference near detector circuit',
      'Construction dust and activity near detectors',
    ],
    solutions: [
      'Identify the specific device causing false alarm (check panel history log)',
      'Clean detector per manufacturer instructions (vacuum, compressed air, or replace sensing chamber)',
      'Relocate detector away from steam/cooking/HVAC sources if placement is the issue',
      'Install bug screens on detector bases in insect-prone areas',
      'Test detector sensitivity — replace if outside manufacturer spec range',
      'In mining: increase cleaning frequency (quarterly or monthly in dusty areas)',
      'Consider switching to heat detectors in areas where smoke detectors cannot be maintained',
      'During construction: bag or cap detectors and place on fire watch per code',
    ],
    severity: 'medium',
  },
  {
    problem: 'Device Replacement Procedure',
    symptoms: 'Device has failed testing, is damaged, or at end of life and needs replacement.',
    causes: [
      'Normal end of life (10-15 years for most detectors)',
      'Physical damage from maintenance or environmental factors',
      'Failed sensitivity test (too sensitive or not sensitive enough)',
      'Contamination that cannot be cleaned (grease, paint, chemical exposure)',
    ],
    solutions: [
      'Before removing device: notify monitoring station and place system in test mode',
      'Remove device from base — note the address label/dip switch settings',
      'Install replacement device with SAME address (addressable) or verify zone assignment (conventional)',
      'After installation: restore panel from test mode and verify new device is communicating',
      'Test new device with smoke/heat to verify proper operation',
      'Update as-built documentation with new device info (model, serial, date)',
      'Maintain supervision: if base is left empty temporarily, install a shorting base or EOL placeholder',
    ],
    severity: 'low',
  },
  {
    problem: 'Battery Issues',
    symptoms: 'Panel displays low battery trouble. System fails battery capacity test. Batteries visually swollen or leaking.',
    causes: [
      'Batteries past service life (typical: 5 years for sealed lead-acid)',
      'Charger failure (not providing proper float voltage)',
      'High ambient temperature reducing battery life',
      'Excessive AC power outages draining batteries frequently',
      'Loose or corroded battery connections',
    ],
    solutions: [
      'Impedance test: use battery impedance tester — compare to baseline. Rising impedance indicates aging.',
      'Load test: disconnect AC, measure voltage under alarm load. Should maintain voltage above panel minimum for rated duration.',
      'Float voltage: measure charger output — should be 27.4-27.6V for 24V system (2 x 12V batteries in series).',
      'Replace batteries: always replace BOTH batteries as a pair. Use same brand, capacity (Ah), and type.',
      'Schedule: replace every 5 years regardless of test results, or sooner if tests fail.',
      'Disposal: sealed lead-acid batteries are hazardous waste. Return to supplier or dispose per local regulations.',
    ],
    severity: 'medium',
  },
  {
    problem: 'Panel Reset and Silencing',
    symptoms: 'Need to reset panel after alarm or silence notification appliances during investigation.',
    causes: [
      'After an alarm event — panel must be manually reset after cause is identified and cleared',
      'During testing — silence horns between device tests',
      'After a fault condition is repaired — clear latched trouble conditions',
    ],
    solutions: [
      'SILENCE: press "Alarm Silence" or "Signal Silence" to stop notification appliances. Alarm is still active at panel. Re-activation of any device restarts notification.',
      'RESET: press "System Reset" to clear the alarm and return to normal. If initiating device is still in alarm state, system will immediately re-alarm.',
      'After reset: verify all zones return to normal. Check for any remaining trouble conditions.',
      'If panel will not reset: the initiating device is still in alarm. Identify and clear the activated device (replace detector, reset pull station, close flow switch).',
      'Document: record the alarm event, cause, action taken, and reset time in the fire alarm log.',
      'Notify monitoring station before and after testing to avoid false dispatches.',
    ],
    severity: 'low',
  },
  {
    problem: 'Mining-Specific Fire Alarm Issues',
    symptoms: 'Frequent troubles or false alarms in mining environments. Accelerated device degradation.',
    causes: [
      'Excessive dust accumulation on detector optics (rock dust, ore dust, road dust)',
      'Vibration from blasting, crushing, and heavy mobile equipment loosening connections',
      'Harsh environment: high humidity, water intrusion, temperature extremes',
      'Corrosive atmospheres: sulfide dust, process chemicals, salt spray',
      'Physical damage from equipment traffic and material handling',
      'Long cable runs in underground mines causing voltage drop and ground faults',
    ],
    solutions: [
      'Increase cleaning schedule: monthly in dusty areas (processing, crushing, screening)',
      'Use vibration-resistant mounting hardware and flexible conduit connections',
      'Seal all conduit entries and junction boxes against moisture and dust (IP65 minimum)',
      'Use stainless steel or coated enclosures in corrosive areas',
      'Install protective guards or cages over detectors and pull stations in traffic areas',
      'Use CI (circuit integrity) cable for critical circuits in underground installations',
      'Consider linear heat detection for conveyor belt monitoring instead of spot detectors',
      'Maintain spare parts inventory: detectors, bases, EOL resistors, cable connectors',
    ],
    severity: 'high',
  },
  {
    problem: 'When to Call CFAA-Certified Technician',
    symptoms: 'Issues beyond routine electrician scope. System requires specialized service.',
    causes: [
      'Panel programming changes or software updates (requires manufacturer training)',
      'Sensitivity testing with calibrated equipment (annual requirement per S536)',
      'System verification after installation or modification (CAN/ULC-S537)',
      'Persistent ground faults that cannot be isolated with standard troubleshooting',
      'Communication failures with monitoring station (may require telecom coordination)',
      'Any situation requiring panel replacement or major system modification',
    ],
    solutions: [
      'Electricians can: replace devices 1:1, clean detectors, reset panels, test individual devices, inspect wiring, replace batteries, and perform basic troubleshooting.',
      'CFAA technicians are required for: system programming, verification, sensitivity testing with calibrated equipment, system design changes, panel replacement, and annual inspection certification.',
      'CFAA-certified: Canadian Fire Alarm Association certification. Look for CFAA-A (technician) or CFAA-B (inspector) designations.',
      'Keep CFAA technician contact info posted at FACP for emergency service.',
      'Document all work performed — both electrician and CFAA technician scope. Maintain log at panel.',
      'In Ontario mining: fire alarm work must comply with both O. Reg. 854 and Ontario Building Code requirements.',
    ],
    severity: 'low',
  },
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

const subLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
}

/* ------------------------------------------------------------------ */
/*  Collapsible Card                                                   */
/* ------------------------------------------------------------------ */

function CollapsibleCard({ title, defaultOpen, children, accentColor, badge }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  accentColor?: string
  badge?: string
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
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 600,
          color: 'var(--text)', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
        <span style={{ flex: 1 }}>{title}</span>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
            background: 'var(--input-bg)', padding: '2px 8px', borderRadius: 10,
          }}>
            {badge}
          </span>
        )}
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

export default function FireAlarmPage() {
  const [tab, setTab] = useState<TabKey>('systems')
  const [expandedSystem, setExpandedSystem] = useState<number | null>(null)
  const [expandedDevice, setExpandedDevice] = useState<number | null>(null)

  /* Filter state for devices tab */
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'initiating' | 'notification' | 'mining'>('all')
  const filteredDevices = deviceFilter === 'all' ? devices : devices.filter(d => d.type === deviceFilter)

  return (
    <>
      <Header title="Fire Alarm" />
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
        {/*  TAB 1: System Types                                          */}
        {/* ============================================================ */}
        {tab === 'systems' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Fire Alarm System Types</div>

            {systemTypes.map((sys, idx) => (
              <div key={sys.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedSystem(expandedSystem === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--primary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedSystem === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{sys.name}</span>
                </button>

                {expandedSystem === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      {sys.description}
                    </div>

                    {/* Advantages */}
                    <div>
                      <div style={{ ...subLabel, color: '#22c55e' }}>Advantages</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sys.advantages.map((a, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #22c55e',
                          }}>
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Limitations */}
                    <div>
                      <div style={{ ...subLabel, color: '#ef4444' }}>Limitations</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sys.limitations.map((l, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #ef4444',
                          }}>
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typical Use */}
                    <div style={{
                      background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                    }}>
                      <div style={{ ...subLabel, color: 'var(--primary)' }}>Typical Applications</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                        {sys.typicalUse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* System Components */}
            <div style={sectionTitle}>System Components</div>
            {systemComponents.map(comp => (
              <div key={comp.abbr} style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#000', background: 'var(--primary)',
                    padding: '2px 10px', borderRadius: 10,
                  }}>
                    {comp.abbr}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{comp.name}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {comp.description}
                </div>
              </div>
            ))}

            {/* ULC Standards */}
            <div style={sectionTitle}>Canadian Standards (ULC)</div>
            {ulcStandards.map(std => (
              <div key={std.number} style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                  }}>
                    {std.number}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{std.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {std.relevance}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Devices                                               */}
        {/* ============================================================ */}
        {tab === 'devices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Device type filter */}
            <div style={pillRow}>
              {([
                { key: 'all' as const, label: 'All Devices' },
                { key: 'initiating' as const, label: 'Initiating' },
                { key: 'notification' as const, label: 'Notification' },
                { key: 'mining' as const, label: 'Mining' },
              ]).map(f => (
                <button key={f.key}
                  style={deviceFilter === f.key ? pillActive : pillBase}
                  onClick={() => setDeviceFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredDevices.map((dev, idx) => (
              <div key={dev.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedDevice(expandedDevice === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--primary)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedDevice === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{dev.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#000',
                    background: dev.tint, padding: '2px 8px', borderRadius: 10,
                    textTransform: 'uppercase',
                  }}>
                    {dev.type}
                  </span>
                </button>

                {expandedDevice === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                      {dev.description}
                    </div>

                    <div>
                      <div style={{ ...subLabel, color: 'var(--primary)' }}>Placement & Spacing</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {dev.placement}
                      </div>
                    </div>

                    <div style={{
                      background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                    }}>
                      <div style={{ ...subLabel, color: 'var(--text-secondary)' }}>Key Specifications</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
                        {dev.keySpecs}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Wiring                                                */}
        {/* ============================================================ */}
        {tab === 'wiring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Wiring Classes & Styles</div>

            {wiringClasses.map(wc => (
              <CollapsibleCard
                key={wc.name}
                title={wc.name}
                accentColor={wc.tint}
                badge={wc.style}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                    {wc.description}
                  </div>

                  {/* ASCII Diagram */}
                  <div style={{
                    background: '#0a0a0a', border: '1px solid var(--divider)',
                    borderRadius: 'var(--radius-sm)', padding: 14,
                    overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.4,
                      color: '#22d867', margin: 0, whiteSpace: 'pre',
                    }}>
                      {wc.diagram}
                    </pre>
                  </div>

                  <div style={{
                    background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                  }}>
                    <div style={{ ...subLabel, color: 'var(--primary)' }}>Fault Tolerance</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                      {wc.faultTolerance}
                    </div>
                  </div>
                </div>
              </CollapsibleCard>
            ))}

            {/* Wire Types */}
            <div style={sectionTitle}>Fire Alarm Cable Types</div>
            <div style={{ ...cardStyle, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--input-bg)' }}>
                    {['Type', 'Name', 'Rating', 'Use'].map(h => (
                      <th key={h} style={{
                        padding: '10px 8px', textAlign: 'left', color: 'var(--primary)',
                        fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
                        borderBottom: '1px solid var(--divider)', whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wireTypes.map((w, i) => (
                    <tr key={w.type} style={{ background: i % 2 ? 'var(--input-bg)' : 'transparent' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{w.type}</td>
                      <td style={{ padding: '8px', color: 'var(--text)', whiteSpace: 'nowrap' }}>{w.name}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{w.rating}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{w.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Circuit Types */}
            <div style={sectionTitle}>Circuit Types</div>
            {circuitTypes.map(ct => (
              <div key={ct.abbr} style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#000', background: 'var(--primary)',
                    padding: '2px 10px', borderRadius: 10, fontFamily: 'var(--font-mono)',
                  }}>
                    {ct.abbr}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ct.name}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  {ct.description}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
                  padding: '8px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)',
                }}>
                  <strong style={{ color: 'var(--primary)' }}>Supervision:</strong> {ct.supervision}
                </div>
              </div>
            ))}

            {/* Wiring Tips */}
            <div style={sectionTitle}>Practical Wiring Tips</div>
            {wiringTips.map((tip, idx) => {
              const catColor = tip.category === 'code' ? '#ef4444' : tip.category === 'mining' ? '#f59e0b' : '#3b82f6'
              return (
                <div key={idx} style={{
                  ...cardStyle, padding: '12px 16px',
                  borderLeft: `4px solid ${catColor}`,
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <span style={{
                    alignSelf: 'flex-start', fontSize: 10, fontWeight: 700,
                    color: '#000', background: catColor,
                    padding: '1px 8px', borderRadius: 8, textTransform: 'uppercase',
                  }}>
                    {tip.category === 'code' ? 'CODE' : tip.category === 'mining' ? 'MINING' : 'BEST PRACTICE'}
                  </span>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                    {tip.tip}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Inspection                                            */}
        {/* ============================================================ */}
        {tab === 'inspection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>CAN/ULC-S536 Inspection Schedule</div>

            {inspectionSchedules.map(sched => (
              <CollapsibleCard
                key={sched.frequency}
                title={sched.frequency}
                accentColor={sched.tint}
                badge={sched.reference}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sched.items.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
                      padding: '6px 0 6px 12px', borderLeft: '2px solid var(--divider)',
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            ))}

            {/* Testing Procedures */}
            <div style={sectionTitle}>Testing Procedures</div>
            {testProcedures.map(tp => (
              <CollapsibleCard key={tp.test} title={tp.test} accentColor="var(--primary)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={subLabel}>Method</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                      {tp.method}
                    </div>
                  </div>
                  <div style={{
                    background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: 12,
                  }}>
                    <div style={{ ...subLabel, color: '#22c55e' }}>Pass Criteria</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                      {tp.passCriteria}
                    </div>
                  </div>
                </div>
              </CollapsibleCard>
            ))}

            {/* Documentation Requirements */}
            <div style={sectionTitle}>Documentation Requirements</div>
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {documentReqs.map((doc, i) => (
                <div key={doc.item} style={{
                  padding: '12px 16px',
                  borderBottom: i < documentReqs.length - 1 ? '1px solid var(--divider)' : undefined,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {doc.item}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {doc.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Troubleshooting                                       */}
        {/* ============================================================ */}
        {tab === 'troubleshoot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={sectionTitle}>Fire Alarm Troubleshooting</div>

            {troubleshootItems.map(item => {
              const sevColor = item.severity === 'high' ? '#ef4444' : item.severity === 'medium' ? '#f59e0b' : '#3b82f6'
              return (
                <CollapsibleCard
                  key={item.problem}
                  title={item.problem}
                  accentColor={sevColor}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Severity Badge */}
                    <span style={{
                      alignSelf: 'flex-start', fontSize: 11, fontWeight: 700,
                      color: '#000', background: sevColor,
                      padding: '2px 10px', borderRadius: 10, textTransform: 'uppercase',
                    }}>
                      {item.severity} priority
                    </span>

                    {/* Symptoms */}
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      {item.symptoms}
                    </div>

                    {/* Causes */}
                    <div>
                      <div style={{ ...subLabel, color: '#ef4444' }}>Possible Causes</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.causes.map((c, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #ef4444',
                          }}>
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solutions */}
                    <div>
                      <div style={{ ...subLabel, color: '#22c55e' }}>Solutions</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {item.solutions.map((s, i) => (
                          <div key={i} style={{
                            fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                            padding: '4px 0 4px 12px', borderLeft: '2px solid #22c55e',
                          }}>
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleCard>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
