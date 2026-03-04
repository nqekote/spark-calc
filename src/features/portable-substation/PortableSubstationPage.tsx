import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ------------------------------------------------------------------ */
/*  Portable Substation Reference                                      */
/*  For Ontario open pit mine electricians                             */
/*  CEC Part I, O.Reg. 854, IEEE C57, CSA C88                         */
/* ------------------------------------------------------------------ */

type TabKey = 'types' | 'installation' | 'relocation' | 'maintenance' | 'troubleshooting'

const tabItems: { key: TabKey; label: string }[] = [
  { key: 'types', label: 'Types & Config' },
  { key: 'installation', label: 'Installation' },
  { key: 'relocation', label: 'Relocation' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'troubleshooting', label: 'Troubleshoot' },
]

/* ------------------------------------------------------------------ */
/*  Data: Types & Configurations                                       */
/* ------------------------------------------------------------------ */

interface SubstationType {
  name: string
  description: string
  cooling: string
  typicalRatings: string
  mounting: string
  relocationFreq: string
  pros: string[]
  cons: string[]
  miningUse: string
  color: string
}

const substationTypes: SubstationType[] = [
  {
    name: 'Pad-Mount Substation',
    description: 'Oil-filled transformer mounted on a concrete or gravel pad. Self-cooled (ONAN) design with sealed tank. Most common for semi-permanent mine installations.',
    cooling: 'ONAN (Oil Natural Air Natural) — self-cooled',
    typicalRatings: '500 kVA to 3333 kVA',
    mounting: 'Concrete or compacted gravel pad, level within 1%',
    relocationFreq: 'Low — moved every 6-24 months',
    pros: [
      'Lowest cost per kVA for large ratings',
      'Excellent thermal performance in all seasons',
      'Tamper-resistant enclosure',
      'No external cooling fans to maintain',
      'Long service life (25-30+ years)',
    ],
    cons: [
      'Heaviest type — requires crane for relocation',
      'Site preparation required (pad, drainage)',
      'Oil containment/spill prevention needed',
      'Longest setup time of all types',
      'Not suitable for frequent moves',
    ],
    miningUse: 'Primary distribution to fixed conveyors, crusher stations, and process plant areas. Ideal for bench areas that will be active for extended periods.',
    color: '#ff6b6b',
  },
  {
    name: 'Skid-Mount Substation',
    description: 'Oil-filled or dry-type transformer built on structural steel skids with integrated lifting points. Designed for periodic relocation as mine faces advance.',
    cooling: 'ONAN or ONAF (Oil Natural Air Forced — with fans)',
    typicalRatings: '500 kVA to 2500 kVA',
    mounting: 'Steel skid base, prepared gravel pad, levelling shims',
    relocationFreq: 'Medium — moved every 3-12 months',
    pros: [
      'Faster relocation than pad-mount (fork pockets, lifting lugs)',
      'Self-contained unit — switchgear often integrated',
      'Can be dragged short distances on skids',
      'Structural steel base protects tank during moves',
      'Good balance of portability and capacity',
    ],
    cons: [
      'Still requires crane or heavy forklift to relocate',
      'Skid base adds weight and cost',
      'Ground must be reasonably level',
      'Oil containment still required',
      'More expensive than equivalent pad-mount',
    ],
    miningUse: 'Powering shovels, drills, and mobile equipment at active pit faces. The standard choice for most open pit mine portable power. Moved as benches advance.',
    color: '#ff9f43',
  },
  {
    name: 'Mobile (Trailer-Mount) Substation',
    description: 'Complete substation on a highway-legal or mine-haul trailer with quick-connect/disconnect terminations. Can be towed to new locations by haul truck or tractor.',
    cooling: 'ONAN or ONAF, sometimes OFAF (Oil Forced Air Forced)',
    typicalRatings: '500 kVA to 5000 kVA',
    mounting: 'Trailer with outriggers and levelling jacks',
    relocationFreq: 'High — can be moved daily if needed',
    pros: [
      'Fastest relocation — no crane needed',
      'Quick-connect terminations minimize downtime',
      'Highway-towable for inter-site moves',
      'Outriggers provide stability without pad',
      'Ideal for emergency/temporary power',
    ],
    cons: [
      'Highest cost per kVA',
      'Trailer maintenance adds complexity',
      'Vibration during transport can loosen connections',
      'Height restrictions in some pit areas',
      'Weight limits on mine haul roads',
    ],
    miningUse: 'Rapid deployment for drill programs, temporary bench power, emergency replacement for failed units. Essential for operations that relocate equipment frequently as the pit expands.',
    color: '#ffd700',
  },
]

interface VoltageConfig {
  primaryVoltage: string
  secondaryVoltage: string
  winding: string
  application: string
  notes: string
  color: string
}

const voltageConfigs: VoltageConfig[] = [
  { primaryVoltage: '4.16 kV', secondaryVoltage: '600V 3\u03D5', winding: '\u0394-Y', application: 'Small mine distribution, older systems', notes: 'Common in smaller operations. Short distribution distances.', color: '#4ade80' },
  { primaryVoltage: '13.8 kV', secondaryVoltage: '600V 3\u03D5', winding: '\u0394-Y', application: 'Most common open pit mining configuration', notes: 'Standard for most Ontario mines. Good balance of distribution distance and equipment cost.', color: '#ff9f43' },
  { primaryVoltage: '13.8 kV', secondaryVoltage: '347/600V 3\u03D5 4W', winding: '\u0394-Y', application: 'When 347V lighting loads are present', notes: '4-wire secondary provides 347V line-to-neutral for HID lighting.', color: '#ffd700' },
  { primaryVoltage: '25 kV', secondaryVoltage: '600V 3\u03D5', winding: '\u0394-Y', application: 'Large pits with long distribution runs', notes: 'Higher primary voltage allows longer cable runs with less loss. Requires 25kV-rated cable and terminations.', color: '#ff6b6b' },
  { primaryVoltage: '44 kV', secondaryVoltage: '4.16 kV / 13.8 kV', winding: '\u0394-Y or Y-Y', application: 'Main substation feeding portable subs', notes: 'Step-down from utility/mine main to distribution voltage.', color: '#a78bfa' },
]

interface ProtectionDevice {
  device: string
  location: string
  function: string
  typicalSetting: string
  standard: string
}

const protectionDevices: ProtectionDevice[] = [
  { device: 'Primary Fuses (Bay-O-Net)', location: 'HV bushings', function: 'Overcurrent and fault protection for primary winding', typicalSetting: 'Sized per CEC Table 26 — typically 125-150% of primary FLA', standard: 'CEC Rule 26-252' },
  { device: 'Primary Load-Break Switch', location: 'Internal or external', function: 'Visible-break isolation for maintenance', typicalSetting: 'Rated for full load current and BIL of system', standard: 'IEEE C37.74' },
  { device: 'HV Circuit Breaker', location: 'Upstream switchgear', function: 'Fault interruption with relay coordination', typicalSetting: 'Relay-coordinated trip settings', standard: 'IEEE C37.06' },
  { device: 'Secondary Main Breaker', location: 'Substation secondary compartment', function: 'Secondary overcurrent protection and load switching', typicalSetting: 'Rated at transformer secondary FLA or next standard size up', standard: 'CEC Rule 26-256' },
  { device: 'Ground Fault Protection (GFP)', location: 'Secondary circuit', function: 'Detect ground faults on secondary feeders — critical for mine safety', typicalSetting: '100 mA pickup, 200 ms trip (O.Reg.854)', standard: 'O.Reg.854 s.160' },
  { device: 'Surge Arresters', location: 'Primary and secondary bushings', function: 'Protect windings from lightning and switching surges', typicalSetting: 'MCOV rated for system voltage class', standard: 'IEEE C62.11' },
  { device: 'Neutral Grounding Resistor (NGR)', location: 'Secondary neutral', function: 'Limit ground fault current on resistance-grounded systems', typicalSetting: '200-400A for 10 seconds, or 25A continuous', standard: 'IEEE 142' },
  { device: 'Temperature Alarm/Trip', location: 'Winding hot-spot', function: 'Protect transformer from overheating damage', typicalSetting: 'Alarm at 95\u00B0C, trip at 105\u00B0C (top oil)', standard: 'IEEE C57.91' },
]

interface SubstationRating {
  kva: number
  primaryAmps13_8: string
  primaryAmps4_16: string
  secondaryAmps600: string
  approxWeight: string
  approxDimensions: string
  impedance: string
}

const substationRatings: SubstationRating[] = [
  { kva: 500, primaryAmps13_8: '20.9A', primaryAmps4_16: '69.4A', secondaryAmps600: '481A', approxWeight: '2,500 kg', approxDimensions: '1.8 \u00D7 1.2 \u00D7 1.8 m', impedance: '4.5-5.75%' },
  { kva: 750, primaryAmps13_8: '31.4A', primaryAmps4_16: '104A', secondaryAmps600: '722A', approxWeight: '3,200 kg', approxDimensions: '2.0 \u00D7 1.4 \u00D7 2.0 m', impedance: '5.0-5.75%' },
  { kva: 1000, primaryAmps13_8: '41.8A', primaryAmps4_16: '139A', secondaryAmps600: '962A', approxWeight: '4,000 kg', approxDimensions: '2.2 \u00D7 1.5 \u00D7 2.1 m', impedance: '5.5-5.75%' },
  { kva: 1500, primaryAmps13_8: '62.8A', primaryAmps4_16: '208A', secondaryAmps600: '1443A', approxWeight: '5,500 kg', approxDimensions: '2.5 \u00D7 1.6 \u00D7 2.3 m', impedance: '5.75-6.0%' },
  { kva: 2000, primaryAmps13_8: '83.7A', primaryAmps4_16: '277A', secondaryAmps600: '1925A', approxWeight: '7,000 kg', approxDimensions: '2.8 \u00D7 1.8 \u00D7 2.4 m', impedance: '5.75-6.5%' },
  { kva: 2500, primaryAmps13_8: '104.6A', primaryAmps4_16: '347A', secondaryAmps600: '2406A', approxWeight: '8,500 kg', approxDimensions: '3.0 \u00D7 1.9 \u00D7 2.5 m', impedance: '6.0-6.5%' },
  { kva: 3333, primaryAmps13_8: '139.5A', primaryAmps4_16: '462A', secondaryAmps600: '3208A', approxWeight: '11,000 kg', approxDimensions: '3.3 \u00D7 2.1 \u00D7 2.7 m', impedance: '6.0-7.0%' },
]

/* ------------------------------------------------------------------ */
/*  Data: Installation & Setup                                         */
/* ------------------------------------------------------------------ */

interface InstallStep {
  step: number
  title: string
  description: string
  details: string[]
  caution?: string
}

const installSteps: InstallStep[] = [
  {
    step: 1,
    title: 'Site Preparation',
    description: 'Prepare a level, stable pad with proper drainage and containment.',
    details: [
      'Clear and grade area to minimum 3m \u00D7 4m (larger for trailer-mount)',
      'Compact gravel base to 95% Proctor density, minimum 200mm thick',
      'Grade for drainage — 2% slope away from transformer on all sides',
      'Install secondary containment (oil spill berms or containment pad)',
      'Containment volume must hold 110% of total oil volume per TSSA requirements',
      'Ensure minimum clearances: 3m from blasting zones, 1.5m from roadways',
      'Verify no overhead obstructions for crane access during placement',
      'Mark utility crossings (water, air, fibre, other electrical) before digging',
    ],
    caution: 'O.Reg.854 s.36: No person shall enter a mine unless ground conditions are safe. Verify pit wall stability before placing substation near bench edges.',
  },
  {
    step: 2,
    title: 'Grounding System Installation',
    description: 'Install the grounding electrode system before energization.',
    details: [
      'Drive minimum 2 ground rods (3m \u00D7 16mm copper-clad steel) spaced 3m apart',
      'Connect rods with #2/0 AWG bare copper in trench minimum 450mm deep',
      'Bond transformer tank/skid to ground grid with #2/0 AWG or larger',
      'Bond all metallic structures within 2.5m of substation',
      'Test ground resistance: maximum 5 ohms for mine substations (O.Reg.854 s.159)',
      'Preferred target: less than 1 ohm for portable substation ground grid',
      'Use fall-of-potential method (3-point test) for ground resistance measurement',
      'Connect to mine ground grid if available within 30m',
      'Document all ground resistance readings in commissioning log',
    ],
    caution: 'Ground resistance may increase in rocky terrain common in open pit mines. Additional rods, ground enhancement material (GEM), or connection to mine ground grid may be required to achieve acceptable values.',
  },
  {
    step: 3,
    title: 'Primary (HV) Cable Connection',
    description: 'Connect the high-voltage primary cable to the transformer.',
    details: [
      'Verify primary cable is de-energized, locked out, and grounded (LOTO)',
      'Inspect HV cable for damage — check jacket, shield, and termination area',
      'Prepare cable ends per manufacturer termination kit instructions',
      'Install stress cones or pre-molded terminations on primary cable',
      'For separable connectors (elbows): clean contact surfaces, apply silicone compound',
      'Torque primary connections to manufacturer specifications',
      'Verify proper phase identification (A-B-C) matches upstream source',
      'Apply mastic sealant to all outdoor primary connections',
      'Perform phasing verification before connecting paralleled transformers',
      'Install surge arresters on primary bushings if not factory-installed',
    ],
    caution: 'HV terminations are safety-critical. Only qualified personnel with MV cable termination training shall perform this work. Follow IEEE 48 (HV cable termination) standards.',
  },
  {
    step: 4,
    title: 'Secondary Connections & Cable Routing',
    description: 'Connect secondary (load side) cables and verify routing.',
    details: [
      'Verify secondary breaker is OPEN and locked out before connecting',
      'Route secondary cables through proper strain relief or cable glands',
      'Maintain minimum bending radius: 12\u00D7 cable OD for shielded, 8\u00D7 for unshielded',
      'Torque all secondary lug connections per manufacturer spec (typically 45-75 ft-lb)',
      'Verify phase rotation matches mine distribution standard (ABC clockwise)',
      'Install cable supports every 600mm on vertical runs',
      'Protect cables crossing roadways with heavy-wall steel conduit or concrete duct',
      'Label all cables at both ends with circuit ID, voltage, and date',
      'Install ground conductor (#2/0 min) from secondary neutral to ground grid',
      'Verify neutral-to-ground bond at transformer secondary (for solidly grounded systems)',
    ],
  },
  {
    step: 5,
    title: 'Protection Relay Verification & Testing',
    description: 'Verify all protection devices are properly set and operational.',
    details: [
      'Verify primary fuse size matches transformer rating and coordination study',
      'Set secondary main breaker trip at transformer secondary FLA or per coordination',
      'Test GFP relay pickup and timing: verify 100 mA / 200 ms per O.Reg.854',
      'Test ground check monitor: verify trip on pilot wire open or short',
      'Verify temperature alarm and trip setpoints: alarm 95\u00B0C, trip 105\u00B0C typical',
      'Verify pressure relief device is operational and vent path is clear',
      'Test all alarm circuits: low oil, high temp, pressure, Buchholz (if equipped)',
      'Verify relay targets and trip counters are reset',
      'Record all relay settings in commissioning documentation',
    ],
    caution: 'GFP protection is mandatory for mine portable equipment per O.Reg.854 s.160. Failure to verify can result in undetected ground faults causing electrocution or fire.',
  },
  {
    step: 6,
    title: 'Commissioning Tests',
    description: 'Perform electrical tests to verify transformer integrity before energization.',
    details: [
      'Insulation resistance (megger) test: 1000V DC for 600V winding, 5000V DC for HV winding',
      'Minimum acceptable IR: 100 M\u03A9 at 20\u00B0C for new oil-filled transformers',
      'Turns ratio test (TTR): verify ratio within 0.5% of nameplate on all taps',
      'Winding resistance test: verify within 2% between phases (balance check)',
      'Power factor / dissipation factor test: should be < 0.5% for new oil-filled units',
      'Oil dielectric breakdown test: minimum 30 kV (ASTM D1816, 1mm gap)',
      'Oil moisture content: maximum 20 ppm for new oil (ASTM D1533)',
      'Dissolved gas analysis (DGA) — baseline sample if unit is new or relocated',
      'Phase rotation verification using phase rotation meter',
      'Check all tap changer positions and verify correct ratio at each tap',
    ],
  },
  {
    step: 7,
    title: 'Energization Procedure',
    description: 'Pre-energization checklist and step-by-step energization.',
    details: [
      'Complete pre-energization checklist (all items must pass — see reference table)',
      'Verify all commissioning test results are acceptable',
      'Verify all personnel are clear of the substation and barricades are in place',
      'Confirm with control room / dispatcher that energization is authorized',
      'Close primary disconnect (no load) — listen for unusual sounds',
      'Check for oil leaks, unusual vibration, or abnormal hum',
      'Measure secondary open-circuit voltage — verify correct ratio and phasing',
      'Close secondary main breaker — verify voltage at load terminals',
      'Gradually apply load — monitor temperature rise over first 4 hours',
      'Record initial oil temperature, ambient temperature, and load readings',
      'Perform thermal scan of all connections after 1 hour under load',
    ],
    caution: 'Do not energize if any commissioning test fails. Do not energize during active blasting operations. Notify mine dispatch before energization per mine communication protocol.',
  },
]

interface SafetyRequirement {
  requirement: string
  details: string
  reference: string
  color: string
}

const safetyRequirements: SafetyRequirement[] = [
  { requirement: 'Barricading', details: 'Portable substations must be barricaded to prevent unauthorized access. Minimum 1.2m high fence or barrier with lockable gate. Clearance of 1.0m minimum from all energized parts to barrier.', reference: 'O.Reg.854 s.159(2)', color: '#ff6b6b' },
  { requirement: 'Signage', details: 'DANGER HIGH VOLTAGE signs on all sides. Voltage rating posted. Emergency contact numbers posted. No Unauthorized Entry signs.', reference: 'CEC Rule 36-006', color: '#ff9f43' },
  { requirement: 'Fire Protection', details: 'Class BC or ABC fire extinguisher (minimum 20 lb) within 3m of substation. For oil-filled units >1000 kVA: consider fixed suppression or foam system.', reference: 'O.Reg.854 s.45', color: '#ffd700' },
  { requirement: 'Oil Containment', details: 'Secondary containment capable of holding 110% of total oil volume. Lined with oil-resistant membrane. Drain valve for rainwater removal. Regular inspection for integrity.', reference: 'TSSA O.Reg.217', color: '#4ade80' },
  { requirement: 'Lightning Protection', details: 'Surge arresters on primary and secondary bushings. Overhead shield wire if substation is the highest point in area. Ground flash density in Northern Ontario: 1-2 flashes/km\u00B2/year.', reference: 'IEEE C62.11', color: '#60a5fa' },
  { requirement: 'Approach Distances', details: 'Minimum approach distances for unqualified persons: 3.0m for 13.8kV, 3.0m for 25kV, 3.5m for 44kV. Qualified electrical workers: per CSA Z462 Table 4.', reference: 'CSA Z462 / O.Reg.854', color: '#a78bfa' },
]

interface OregRequirement {
  section: string
  title: string
  requirement: string
}

const oregRequirements: OregRequirement[] = [
  { section: 's.153', title: 'Electrical Installations', requirement: 'All electrical installations in a mine shall comply with the Ontario Electrical Safety Code and CEC. Portable substations must meet CSA standards.' },
  { section: 's.154', title: 'Electrical Supervision', requirement: 'An electrician holding a valid Certificate of Qualification shall supervise all electrical work. Substation installation requires a licensed electrician.' },
  { section: 's.155', title: 'Plans and Diagrams', requirement: 'Single-line diagrams must be maintained for all mine electrical distribution. Must be updated within 30 days when portable substations are relocated.' },
  { section: 's.158', title: 'Switchgear and Equipment', requirement: 'Switchgear shall be accessible for operation and maintenance. Circuit breakers shall be capable of interrupting the maximum available fault current.' },
  { section: 's.159', title: 'Grounding', requirement: 'All metallic enclosures, frames, and non-current-carrying parts shall be grounded. Grounding system resistance shall not exceed 5 ohms.' },
  { section: 's.160', title: 'Ground Fault Protection', requirement: 'Ground fault protection is required for all portable electrical equipment. Pickup: 100 mA maximum. Trip time: 200 ms maximum. Must be tested monthly.' },
  { section: 's.161', title: 'Ground Check Monitor', requirement: 'A ground check monitor (pilot wire system) is required for trailing cable installations to verify ground conductor continuity before and during energization.' },
  { section: 's.164', title: 'Cables', requirement: 'High voltage cables shall be properly terminated, supported, and protected from mechanical damage. Cable crossings must be protected.' },
  { section: 's.167', title: 'Transformer Installations', requirement: 'Oil-filled transformers shall have containment. Indoor oil-filled transformers require fire separation or suppression. Oil quantity and dielectric strength must be maintained.' },
]

/* ------------------------------------------------------------------ */
/*  Data: Relocation Procedures                                        */
/* ------------------------------------------------------------------ */

interface RelocationStep {
  phase: string
  step: number
  action: string
  details: string[]
  safetyNote?: string
  color: string
}

const relocationSteps: RelocationStep[] = [
  {
    phase: 'De-energization & Isolation',
    step: 1,
    action: 'Notify and coordinate shutdown',
    details: [
      'Submit relocation work order per mine planning schedule',
      'Notify mine dispatch and all affected crews minimum 24 hours in advance',
      'Coordinate with production to schedule outage during non-production window',
      'Verify backup power arrangements for critical loads if applicable',
      'Prepare LOTO tags and locks for all isolation points',
    ],
    color: '#ff6b6b',
  },
  {
    phase: 'De-energization & Isolation',
    step: 2,
    action: 'De-energize the substation',
    details: [
      'Open secondary main breaker — disconnect all loads first',
      'Verify zero voltage on secondary side with voltmeter',
      'Open primary disconnect switch or breaker',
      'Apply LOTO at primary isolation point (upstream breaker or switch)',
      'Apply personal locks and tags per mine LOTO procedure',
      'Install safety grounds on primary cable (if required by mine procedure)',
      'Verify de-energized state with HV proximity detector',
    ],
    safetyNote: 'Always disconnect secondary (load side) BEFORE primary (source side) to prevent back-feed and uncontrolled switching.',
    color: '#ff6b6b',
  },
  {
    phase: 'Disconnection',
    step: 3,
    action: 'Disconnect secondary cables',
    details: [
      'Verify all circuits are de-energized and LOTO is in place',
      'Disconnect secondary cables — label each phase and neutral',
      'Cap or insulate all exposed cable ends with approved termination caps',
      'Disconnect grounding conductors — document locations',
      'Coil secondary cables and secure for transport or re-routing',
      'Remove cable supports, strain reliefs, and cable tray sections',
    ],
    color: '#ff9f43',
  },
  {
    phase: 'Disconnection',
    step: 4,
    action: 'Disconnect primary cables',
    details: [
      'Remove surge arresters if they will not travel with the unit',
      'Disconnect primary cables (separable connectors or bolted terminations)',
      'For elbow connectors: use approved hot-stick to remove — install on parking bushings',
      'Cap primary bushings with rated bushing caps',
      'Disconnect transformer ground cable from ground grid',
      'Seal all openings to prevent moisture and contaminant entry',
    ],
    safetyNote: 'Treat all HV cables as energized until positively verified de-energized and grounded. Use HV gloves and rated tools for all primary disconnections.',
    color: '#ff9f43',
  },
  {
    phase: 'Transport Preparation',
    step: 5,
    action: 'Prepare transformer for transport',
    details: [
      'Check oil level — top up if necessary (transport with full oil level)',
      'Verify all drain valves are closed and secured',
      'Inspect tank for leaks — repair any weeping gaskets before moving',
      'Secure all access doors, panel covers, and hinged components',
      'Lock or remove tap changer handle',
      'Disconnect any auxiliary power feeds (fans, heaters, lighting)',
      'Remove or secure loose items (tools, test leads, documentation box)',
      'Verify lifting lugs/eyes are in good condition for crane operation',
    ],
    color: '#ffd700',
  },
  {
    phase: 'Transport',
    step: 6,
    action: 'Lift and transport',
    details: [
      'Verify crane/forklift capacity exceeds transformer weight by minimum 25%',
      'Use certified rigging rated for the load (synthetic slings or wire rope)',
      'Attach rigging to designated lifting points ONLY — never lift by bushings or radiators',
      'Lift slowly — check for tilt, oil leaks, and rigging balance',
      'Transport at low speed — maximum 15 km/h on mine roads',
      'Avoid sudden stops, sharp turns, and rough terrain',
      'Escort with pilot vehicle if load is over-width',
      'For trailer-mount: verify hitch, safety chains, brake connections, and trailer lights',
    ],
    safetyNote: 'Crane operations in open pits must comply with O.Reg.854 Part V (Hoisting). Ensure crane is on stable ground away from pit edges. Consider wind speed — do not lift in winds over 35 km/h.',
    color: '#ffd700',
  },
  {
    phase: 'Re-installation',
    step: 7,
    action: 'Place at new location',
    details: [
      'Verify new site preparation is complete (pad, drainage, containment)',
      'Place transformer level — check with spirit level on tank (within 1%)',
      'Install shims or packing as needed under skid/pad',
      'Allow oil to settle minimum 4 hours before energization (longer for large units)',
      'Install new grounding system or connect to existing mine ground grid',
      'Reconnect primary and secondary cables per installation procedure',
      'Perform all re-commissioning tests (see Tab 4)',
    ],
    color: '#4ade80',
  },
]

interface RecommissionTest {
  test: string
  purpose: string
  acceptCriteria: string
  required: string
}

const recommissionTests: RecommissionTest[] = [
  { test: 'Visual Inspection', purpose: 'Check for transport damage, oil leaks, loose connections', acceptCriteria: 'No visible damage, leaks, or loose components', required: 'Always' },
  { test: 'Oil Level Check', purpose: 'Verify oil is at proper level after transport', acceptCriteria: 'Oil level in normal range on sight glass at current temp', required: 'Always' },
  { test: 'Insulation Resistance (Megger)', purpose: 'Verify winding insulation integrity after move', acceptCriteria: '\u2265 100 M\u03A9 at 20\u00B0C (oil-filled), PI > 2.0', required: 'Always' },
  { test: 'Turns Ratio Test (TTR)', purpose: 'Verify core and winding integrity', acceptCriteria: 'Within 0.5% of nameplate ratio on all taps', required: 'After significant impact or damage suspected' },
  { test: 'Oil Dielectric Strength', purpose: 'Verify oil has not been contaminated during move', acceptCriteria: '\u2265 30 kV breakdown (ASTM D1816)', required: 'Always' },
  { test: 'Ground Resistance', purpose: 'Verify new grounding system is adequate', acceptCriteria: '\u2264 5\u03A9 (O.Reg.854), target < 1\u03A9', required: 'Always' },
  { test: 'Phase Rotation', purpose: 'Verify correct phase sequence at new location', acceptCriteria: 'ABC clockwise rotation matches mine standard', required: 'Always' },
  { test: 'GFP Relay Test', purpose: 'Verify ground fault protection is operational', acceptCriteria: 'Trips at \u2264 100 mA within 200 ms', required: 'Always' },
  { test: 'Phasing Verification', purpose: 'Verify phase alignment with existing mine distribution', acceptCriteria: 'Zero volts between same phases of parallel sources', required: 'When paralleling with other sources' },
  { test: 'Protection Function Test', purpose: 'Verify all protection relay functions', acceptCriteria: 'All relays trip at set values within tolerance', required: 'Always' },
]

interface RelocationDocument {
  document: string
  purpose: string
  retainedBy: string
}

const relocationDocuments: RelocationDocument[] = [
  { document: 'Relocation Work Order', purpose: 'Authorization and planning record for the move', retainedBy: 'Mine Engineering / Electrical Dept' },
  { document: 'Pre-Move Inspection Report', purpose: 'Document condition before transport', retainedBy: 'Electrical Supervisor' },
  { document: 'LOTO Clearance Records', purpose: 'Proof of proper isolation during work', retainedBy: 'Electrical Dept / Safety' },
  { document: 'Transport Record', purpose: 'Route, method, date/time, and any incidents', retainedBy: 'Mine Engineering' },
  { document: 'Commissioning Test Results', purpose: 'All test results at new location', retainedBy: 'Electrical Dept — keep with unit' },
  { document: 'Single-Line Diagram Update', purpose: 'Updated mine power distribution drawing', retainedBy: 'Electrical Engineering' },
  { document: 'Ground Resistance Test Report', purpose: 'New location ground resistance readings', retainedBy: 'Electrical Dept — keep with unit' },
  { document: 'Energization Authorization', purpose: 'Sign-off to re-energize at new location', retainedBy: 'Mine Electrical Supervisor' },
]

/* ------------------------------------------------------------------ */
/*  Data: Maintenance & Testing                                        */
/* ------------------------------------------------------------------ */

interface InspectionItem {
  item: string
  frequency: string
  procedure: string
  acceptCriteria: string
  color: string
}

const inspectionChecklist: InspectionItem[] = [
  { item: 'Visual inspection — leaks, damage', frequency: 'Daily', procedure: 'Walk around unit, check under tank for oil drips, inspect bushings and connections', acceptCriteria: 'No visible leaks, damage, or animal nesting', color: '#4ade80' },
  { item: 'Oil level — sight glass', frequency: 'Daily', procedure: 'Check oil level gauge/sight glass against temperature-corrected normal range', acceptCriteria: 'Oil level within normal band for ambient temperature', color: '#4ade80' },
  { item: 'Temperature reading', frequency: 'Daily', procedure: 'Record top-oil temperature from gauge or RTD. Compare to load and ambient.', acceptCriteria: 'Top oil temperature within rated rise above ambient', color: '#4ade80' },
  { item: 'Unusual noise or vibration', frequency: 'Daily', procedure: 'Listen for changes in hum level, buzzing, cracking, or mechanical rattling', acceptCriteria: 'Steady, low-frequency hum only — no arcing or rattling sounds', color: '#4ade80' },
  { item: 'Load current and voltage', frequency: 'Weekly', procedure: 'Record all phase currents and voltages. Check for imbalance.', acceptCriteria: 'Current \u2264 rated FLA, voltage imbalance < 2%, current imbalance < 5%', color: '#60a5fa' },
  { item: 'GFP relay indicator check', frequency: 'Weekly', procedure: 'Verify GFP relay power light is on, no fault indication, no tripped targets', acceptCriteria: 'Relay powered, no trip flags, no alarms', color: '#60a5fa' },
  { item: 'Containment inspection', frequency: 'Weekly', procedure: 'Inspect oil containment berm/liner for damage, accumulated water, or oil', acceptCriteria: 'No oil in containment, no liner damage, drain water if accumulated', color: '#60a5fa' },
  { item: 'Grounding connections', frequency: 'Monthly', procedure: 'Inspect all visible ground connections for tightness, corrosion, mechanical damage', acceptCriteria: 'All connections tight, no corrosion, conductors intact', color: '#ff9f43' },
  { item: 'GFP relay function test', frequency: 'Monthly', procedure: 'Inject test current using relay test set. Verify pickup and timing.', acceptCriteria: 'Trips at \u2264 100 mA within 200 ms per O.Reg.854', color: '#ff9f43' },
  { item: 'Surge arrester inspection', frequency: 'Monthly', procedure: 'Visual inspection for cracking, tracking marks, or flashover damage', acceptCriteria: 'No cracks, no tracking, no discoloration, counter reading normal', color: '#ff9f43' },
  { item: 'Bushing cleaning', frequency: 'Quarterly', procedure: 'De-energize and clean bushings with lint-free cloth. Check for cracks or chips.', acceptCriteria: 'Clean, no tracking marks, no cracks, no chips, creepage distance maintained', color: '#ffd700' },
  { item: 'Connection thermal scan', frequency: 'Quarterly', procedure: 'Infrared scan of all primary and secondary connections under load', acceptCriteria: 'No hotspots > 10\u00B0C above adjacent phase or > 40\u00B0C above ambient', color: '#ffd700' },
  { item: 'Oil dielectric breakdown test', frequency: 'Annual', procedure: 'Sample oil per ASTM D923. Test breakdown voltage per ASTM D1816.', acceptCriteria: '\u2265 30 kV (1mm gap) for in-service oil', color: '#ff6b6b' },
  { item: 'Dissolved Gas Analysis (DGA)', frequency: 'Annual', procedure: 'Sample oil per IEEE C57.104. Lab analysis for combustible gases.', acceptCriteria: 'All gases within Condition 1 limits (see DGA table)', color: '#ff6b6b' },
  { item: 'Oil moisture content', frequency: 'Annual', procedure: 'Sample oil. Karl Fischer titration per ASTM D1533.', acceptCriteria: '\u2264 35 ppm for in-service oil (per IEEE C57.106)', color: '#ff6b6b' },
  { item: 'Insulation resistance (megger)', frequency: 'Annual', procedure: 'De-energize. Megger H-L, H-Gnd, L-Gnd at rated test voltage for 1 minute.', acceptCriteria: 'Minimum per voltage class table. PI > 2.0.', color: '#ff6b6b' },
  { item: 'Ground resistance test', frequency: 'Annual', procedure: 'Fall-of-potential method. Test entire ground grid resistance.', acceptCriteria: '\u2264 5\u03A9 per O.Reg.854 s.159, target < 1\u03A9', color: '#ff6b6b' },
  { item: 'Cooling system check', frequency: 'Annual', procedure: 'Clean radiator fins, test fan motors (if ONAF), check oil pump (if OFAF).', acceptCriteria: 'Fins clear of debris, fans start and run properly, pumps flow verified', color: '#ff6b6b' },
  { item: 'Protection relay calibration', frequency: 'Annual', procedure: 'Full relay calibration using secondary injection test set.', acceptCriteria: 'All pickup and timing values within \u00B1 5% of settings', color: '#ff6b6b' },
]

interface DGAGas {
  gas: string
  symbol: string
  source: string
  condition1: string
  condition2: string
  condition3: string
  indicates: string
  color: string
}

const dgaGases: DGAGas[] = [
  { gas: 'Hydrogen', symbol: 'H\u2082', source: 'Partial discharge, low-energy arcing', condition1: '\u2264 100 ppm', condition2: '101-700 ppm', condition3: '> 700 ppm', indicates: 'Corona, partial discharge in oil or paper. Low levels may indicate normal aging.', color: '#60a5fa' },
  { gas: 'Methane', symbol: 'CH\u2084', source: 'Low-temperature thermal fault (150-300\u00B0C)', condition1: '\u2264 120 ppm', condition2: '121-400 ppm', condition3: '> 400 ppm', indicates: 'Overheated oil near hot metal surfaces. Localized hot spots.', color: '#4ade80' },
  { gas: 'Ethane', symbol: 'C\u2082H\u2086', source: 'Low-temperature thermal fault (300-700\u00B0C)', condition1: '\u2264 65 ppm', condition2: '66-100 ppm', condition3: '> 100 ppm', indicates: 'Thermal decomposition of oil. More severe than methane alone.', color: '#ffd700' },
  { gas: 'Ethylene', symbol: 'C\u2082H\u2084', source: 'High-temperature thermal fault (>700\u00B0C)', condition1: '\u2264 50 ppm', condition2: '51-200 ppm', condition3: '> 200 ppm', indicates: 'Severe overheating — hot metal in oil, bad connections, circulating currents. Key indicator of serious thermal fault.', color: '#ff9f43' },
  { gas: 'Acetylene', symbol: 'C\u2082H\u2082', source: 'Arcing (>1000\u00B0C)', condition1: '\u2264 1 ppm', condition2: '2-9 ppm', condition3: '> 9 ppm', indicates: 'Active arcing in oil. VERY SIGNIFICANT even at low levels. May indicate tap changer problems, flashover, or winding fault.', color: '#ff6b6b' },
  { gas: 'Carbon Monoxide', symbol: 'CO', source: 'Paper (cellulose) degradation', condition1: '\u2264 350 ppm', condition2: '351-570 ppm', condition3: '> 570 ppm', indicates: 'Overheated paper insulation. Combined with CO\u2082, indicates paper thermal damage.', color: '#a78bfa' },
  { gas: 'Carbon Dioxide', symbol: 'CO\u2082', source: 'Paper degradation, normal aging', condition1: '\u2264 2500 ppm', condition2: '2501-4000 ppm', condition3: '> 4000 ppm', indicates: 'Normal paper aging or thermal degradation. CO\u2082/CO ratio helps determine severity.', color: '#e879f9' },
  { gas: 'Oxygen', symbol: 'O\u2082', source: 'Air ingress, seal leaks', condition1: 'N/A', condition2: 'N/A', condition3: 'N/A', indicates: 'Seal integrity. High O\u2082 accelerates oil degradation. Should decrease over time in sealed units.', color: '#94a3b8' },
]

interface InsulationResistance {
  voltageClass: string
  testVoltage: string
  minNew: string
  minService: string
  notes: string
}

const insulationResistanceTable: InsulationResistance[] = [
  { voltageClass: '600V secondary', testVoltage: '1000V DC', minNew: '100 M\u03A9', minService: '25 M\u03A9', notes: 'Correct all readings to 20\u00B0C. Halves for every 10\u00B0C above 20\u00B0C.' },
  { voltageClass: '4.16 kV', testVoltage: '5000V DC', minNew: '500 M\u03A9', minService: '100 M\u03A9', notes: 'PI (Polarization Index) > 2.0 indicates dry insulation.' },
  { voltageClass: '13.8 kV', testVoltage: '5000V DC', minNew: '1000 M\u03A9', minService: '200 M\u03A9', notes: 'Trending over time is more important than absolute value.' },
  { voltageClass: '25 kV', testVoltage: '5000V DC', minNew: '1500 M\u03A9', minService: '300 M\u03A9', notes: 'If below minimum, investigate before re-energizing.' },
  { voltageClass: '44 kV', testVoltage: '5000V DC', minNew: '2000 M\u03A9', minService: '500 M\u03A9', notes: 'Low readings may indicate moisture in oil or contaminated bushings.' },
]

interface CoolingComponent {
  component: string
  maintenance: string
  frequency: string
  failureMode: string
}

const coolingMaintenance: CoolingComponent[] = [
  { component: 'Radiator Fins', maintenance: 'Blow out dust and debris with compressed air. Wash with low-pressure water if heavily soiled. Straighten bent fins.', frequency: 'Quarterly or as needed', failureMode: 'Reduced heat dissipation, overheating' },
  { component: 'Cooling Fans (ONAF)', maintenance: 'Verify operation. Check bearings for noise. Lubricate per manufacturer. Check wiring and controls.', frequency: 'Monthly run check, annual service', failureMode: 'Fan failure reduces capacity by 15-33%' },
  { component: 'Oil Pump (OFAF)', maintenance: 'Verify flow. Check motor current against nameplate. Check for leaks at seals.', frequency: 'Monthly check, annual service', failureMode: 'Loss of forced oil flow severely reduces capacity' },
  { component: 'Oil Level Gauge', maintenance: 'Compare gauge reading to actual oil level. Clean glass. Verify gasket seal.', frequency: 'Monthly verification', failureMode: 'Inaccurate readings mask low oil condition' },
  { component: 'Pressure Relief Valve', maintenance: 'Verify flag is not tripped. Inspect seal. Test operation if equipped with test lever.', frequency: 'Annual', failureMode: 'Tank rupture during internal fault if valve is blocked' },
  { component: 'Thermometer / RTD', maintenance: 'Compare reading to a calibrated thermometer. Verify alarm and trip contacts.', frequency: 'Annual calibration', failureMode: 'No warning of overheating condition' },
]

/* ------------------------------------------------------------------ */
/*  Data: Troubleshooting                                              */
/* ------------------------------------------------------------------ */

interface TroubleshootItem {
  symptom: string
  icon: string
  causes: { cause: string; likelihood: string }[]
  diagnostics: string[]
  immediateAction: string
  color: string
}

const troubleshootItems: TroubleshootItem[] = [
  {
    symptom: 'Transformer Overheating',
    icon: '\u{1F321}',
    causes: [
      { cause: 'Overloaded beyond rated kVA', likelihood: 'Common' },
      { cause: 'Blocked or dirty cooling fins/radiators', likelihood: 'Common' },
      { cause: 'Failed cooling fans (ONAF units)', likelihood: 'Common' },
      { cause: 'High ambient temperature (summer, sheltered location)', likelihood: 'Moderate' },
      { cause: 'Circulating currents from improper grounding', likelihood: 'Moderate' },
      { cause: 'Internal winding fault developing', likelihood: 'Rare' },
      { cause: 'Low oil level exposing windings', likelihood: 'Moderate' },
      { cause: 'Harmonic loading from VFDs', likelihood: 'Common' },
    ],
    diagnostics: [
      'Check load current on all phases — compare to rated FLA',
      'Inspect radiator fins for blockage — dust, debris, ice in winter',
      'Verify fan operation — check motor, contactor, thermal switch',
      'Compare top oil temp to ambient — rise should be \u2264 rated value',
      'Check for current imbalance between phases (>5% is suspect)',
      'Review load profile — k-factor and harmonic content if VFDs present',
    ],
    immediateAction: 'Reduce load to 80% of rated kVA. Restore cooling. If temperature continues to rise above trip setpoint, de-energize immediately.',
    color: '#ff6b6b',
  },
  {
    symptom: 'Oil Leaks',
    icon: '\u{1F4A7}',
    causes: [
      { cause: 'Gasket failure at covers or flanges', likelihood: 'Common' },
      { cause: 'Bushing seal deterioration', likelihood: 'Common' },
      { cause: 'Weld cracks from transport vibration', likelihood: 'Moderate' },
      { cause: 'Drain valve not fully closed or damaged', likelihood: 'Moderate' },
      { cause: 'Radiator tube pinhole leaks', likelihood: 'Moderate' },
      { cause: 'Pressure relief valve weeping', likelihood: 'Rare' },
      { cause: 'Thermal expansion overflow (overfilled)', likelihood: 'Moderate' },
    ],
    diagnostics: [
      'Locate the source — clean area and observe for fresh oil',
      'Check oil level gauge — dropping level confirms active leak',
      'Inspect gaskets at all cover plates and flanges',
      'Check bushing bases for oil tracking or staining',
      'Inspect drain valve — verify closed and cap is secure',
      'Check radiator tubes, especially at headers',
    ],
    immediateAction: 'For minor weeping: monitor level, schedule repair at next outage. For active leaking: if oil level drops to minimum mark, de-energize and repair. Report all spills per mine environmental procedure.',
    color: '#ff9f43',
  },
  {
    symptom: 'Relay Tripping — Ground Fault',
    icon: '\u26A1',
    causes: [
      { cause: 'Actual ground fault on secondary feeder cable', likelihood: 'Common' },
      { cause: 'Equipment insulation failure (motor, cable, junction box)', likelihood: 'Common' },
      { cause: 'Moisture ingress in cable termination or junction box', likelihood: 'Common' },
      { cause: 'GFP relay nuisance trip — CT saturation at motor start', likelihood: 'Moderate' },
      { cause: 'Incorrect relay settings or wiring error', likelihood: 'Rare' },
      { cause: 'Cable damage from mechanical impact or vehicle traffic', likelihood: 'Common' },
    ],
    diagnostics: [
      'Do NOT reset without investigating — ground faults can cause electrocution',
      'Isolate circuits one at a time to identify faulted feeder',
      'Megger each feeder cable phase-to-ground at 1000V DC',
      'Inspect cable route for physical damage, especially at road crossings',
      'Check moisture in terminations and junction boxes',
      'If nuisance trips suspected: verify relay settings, CT ratio, and wiring',
    ],
    immediateAction: 'Investigate cause before resetting. Isolate faulted circuit. Repair fault before re-energizing. Per O.Reg.854 s.160 — never bypass GFP protection.',
    color: '#ffd700',
  },
  {
    symptom: 'Relay Tripping — Overcurrent',
    icon: '\u26A0',
    causes: [
      { cause: 'Motor locked rotor on starting', likelihood: 'Common' },
      { cause: 'Overloaded secondary circuit', likelihood: 'Common' },
      { cause: 'Short circuit on secondary feeder', likelihood: 'Moderate' },
      { cause: 'Breaker trip unit calibration drift', likelihood: 'Rare' },
      { cause: 'Transformer internal fault', likelihood: 'Rare' },
    ],
    diagnostics: [
      'Check relay targets for type of trip (instantaneous vs. time-delay)',
      'Review load current at time of trip if recording meter available',
      'Check for signs of fault — burnt smell, discoloration, arc marks',
      'Megger secondary cables and equipment before resetting',
      'Verify breaker trip unit settings match coordination study',
    ],
    immediateAction: 'Determine trip cause before resetting. If instantaneous trip: suspect short circuit, inspect before reset. If time-delay: suspect overload, reduce load before reset.',
    color: '#ff9f43',
  },
  {
    symptom: 'Unusual Noise or Vibration',
    icon: '\u{1F50A}',
    causes: [
      { cause: 'Loose core laminations — normal aging', likelihood: 'Moderate' },
      { cause: 'Loose hardware — bolts, covers, brackets', likelihood: 'Common' },
      { cause: 'DC component in load current (half-wave rectifiers)', likelihood: 'Moderate' },
      { cause: 'Magnetostriction at elevated voltage (high-side tap too high)', likelihood: 'Moderate' },
      { cause: 'Partial discharge (crackling/snapping sound)', likelihood: 'Rare' },
      { cause: 'Over-excitation — voltage above 110% of rated', likelihood: 'Moderate' },
    ],
    diagnostics: [
      'Compare to baseline noise level — is this new or has it changed?',
      'Check supply voltage — over-voltage causes core saturation and noise',
      'Listen with stethoscope or ultrasonic detector for localization',
      'Check for DC offset loads (battery chargers, single-phase rectifiers)',
      'If crackling: may indicate partial discharge — schedule DGA and PF test',
    ],
    immediateAction: 'Increased hum is usually non-urgent but should be investigated. Crackling or snapping sounds: de-energize immediately and inspect before re-energizing.',
    color: '#a78bfa',
  },
  {
    symptom: 'Low Oil Level',
    icon: '\u{1F4C9}',
    causes: [
      { cause: 'External oil leak (gaskets, valves, bushings)', likelihood: 'Common' },
      { cause: 'Thermal contraction in cold weather (false low reading)', likelihood: 'Common' },
      { cause: 'Oil not topped up after previous maintenance', likelihood: 'Moderate' },
      { cause: 'Internal seal failure in conservator or OLTC', likelihood: 'Rare' },
    ],
    diagnostics: [
      'Verify reading is temperature-corrected — oil contracts significantly in cold weather',
      'Check under transformer and around all seals for active leaks',
      'Review maintenance records — was oil removed for testing and not replaced?',
      'If level drops without visible leak: suspect internal seal or conservator bladder',
    ],
    immediateAction: 'If oil level is below minimum mark: de-energize and top up with compatible oil. Never add oil to an energized transformer. Match oil type (mineral, silicone, or ester) exactly.',
    color: '#60a5fa',
  },
]

interface EmergencyProcedure {
  scenario: string
  immediateActions: string[]
  doNotActions: string[]
  notification: string
  color: string
}

const emergencyProcedures: EmergencyProcedure[] = [
  {
    scenario: 'Transformer Fire',
    immediateActions: [
      'Activate mine emergency alarm — report fire location to dispatch',
      'If safe to do so: de-energize transformer from upstream breaker (remote trip)',
      'Evacuate area — maintain 15m minimum exclusion zone',
      'If fire is small and unit is de-energized: use dry chemical or CO\u2082 extinguisher',
      'Do NOT use water on an energized or oil-burning transformer',
      'Notify mine rescue team and environmental coordinator',
      'Contain oil runoff to prevent environmental contamination',
    ],
    doNotActions: [
      'Do NOT approach an energized, burning transformer',
      'Do NOT use water if oil is burning — it will spread the fire',
      'Do NOT attempt to save personal property near the fire',
      'Do NOT re-energize until fully investigated and cleared',
    ],
    notification: 'Mine dispatch, emergency services, TSSA (if applicable), MOL if worker injury',
    color: '#ff6b6b',
  },
  {
    scenario: 'Oil Spill / Environmental Release',
    immediateActions: [
      'Contain the spill — deploy absorbent booms or berms',
      'Stop the source if safe (close valves, de-energize if leak is near energized parts)',
      'Prevent oil from reaching waterways, drains, or soil',
      'Apply absorbent materials (pads, granules) to contained oil',
      'Report to mine environmental coordinator immediately',
      'Document spill volume, area affected, and containment actions',
    ],
    doNotActions: [
      'Do NOT wash oil into drains or waterways',
      'Do NOT use dispersants without environmental approval',
      'Do NOT leave spill unattended until fully contained',
    ],
    notification: 'Mine environmental coordinator, MOE Spills Action Centre (1-800-268-6060) if spill reaches environment, mine manager',
    color: '#ff9f43',
  },
  {
    scenario: 'Internal Fault / Explosion',
    immediateActions: [
      'Evacuate area immediately — maintain 30m minimum exclusion zone',
      'Call mine emergency number — report location and type of incident',
      'Verify upstream protection operated — if not, trip upstream breaker remotely',
      'Do NOT approach transformer — pressurized oil and toxic gases may be present',
      'Account for all personnel in the area',
      'Wait for emergency response team and qualified electrical personnel',
    ],
    doNotActions: [
      'Do NOT approach the transformer',
      'Do NOT attempt to inspect damage until cooled and confirmed de-energized',
      'Do NOT re-energize — unit must be replaced or fully rebuilt',
      'Do NOT allow unqualified personnel near the unit',
    ],
    notification: 'Mine dispatch, emergency services, TSSA (mandatory for transformer explosion), MOL, mine electrical engineer',
    color: '#ff6b6b',
  },
]

interface OutOfServiceCriteria {
  condition: string
  action: string
  urgency: string
  color: string
}

const outOfServiceCriteria: OutOfServiceCriteria[] = [
  { condition: 'Acetylene (C\u2082H\u2082) > 9 ppm in DGA', action: 'De-energize immediately. Active arcing inside transformer.', urgency: 'Immediate', color: '#ff6b6b' },
  { condition: 'Oil dielectric strength < 25 kV', action: 'De-energize. Oil is contaminated or degraded. Filter or replace oil.', urgency: 'Immediate', color: '#ff6b6b' },
  { condition: 'Insulation resistance below minimum for voltage class', action: 'De-energize. Investigate cause — moisture, contamination, or winding damage.', urgency: 'Immediate', color: '#ff6b6b' },
  { condition: 'Oil level below minimum with active leak', action: 'De-energize. Repair leak, top up oil, retest before re-energizing.', urgency: 'Immediate', color: '#ff6b6b' },
  { condition: 'Pressure relief device has operated', action: 'De-energize and investigate. Internal fault or overpressure event.', urgency: 'Immediate', color: '#ff6b6b' },
  { condition: 'Audible partial discharge (crackling/snapping)', action: 'De-energize. Partial discharge will progress to failure.', urgency: 'Urgent', color: '#ff9f43' },
  { condition: 'Top oil temp exceeds 110\u00B0C at rated load', action: 'Reduce load immediately. If temp continues to rise, de-energize.', urgency: 'Urgent', color: '#ff9f43' },
  { condition: 'DGA shows rapid gas generation rate', action: 'Increase monitoring frequency. Plan outage for investigation.', urgency: 'Scheduled', color: '#ffd700' },
  { condition: 'Oil moisture > 50 ppm', action: 'Plan oil processing (vacuum dehydration). Monitor closely.', urgency: 'Scheduled', color: '#ffd700' },
  { condition: 'Visible bushing cracks or tracking marks', action: 'Schedule replacement at next outage. Monitor closely.', urgency: 'Scheduled', color: '#ffd700' },
]

/* ------------------------------------------------------------------ */
/*  Data: Commissioning Checklist                                      */
/* ------------------------------------------------------------------ */

interface CommissioningItem {
  category: string
  item: string
  pass: string
}

const commissioningChecklist: CommissioningItem[] = [
  { category: 'Site', item: 'Pad/base is level and properly compacted', pass: 'Level within 1% grade' },
  { category: 'Site', item: 'Drainage is adequate — no water pooling', pass: 'Water drains away from unit' },
  { category: 'Site', item: 'Secondary containment installed and intact', pass: 'Holds 110% oil volume' },
  { category: 'Site', item: 'Minimum clearances maintained from roads and edges', pass: 'Per mine safety plan' },
  { category: 'Site', item: 'Barricading installed with lockable access', pass: 'Min 1.2m height, locked' },
  { category: 'Site', item: 'Danger High Voltage signs posted on all sides', pass: 'Visible from 5m' },
  { category: 'Site', item: 'Fire extinguisher in place (20 lb min BC/ABC)', pass: 'Within 3m, inspected' },
  { category: 'Grounding', item: 'Ground rods installed per design', pass: 'Min 2 rods, 3m apart' },
  { category: 'Grounding', item: 'Ground resistance tested', pass: '\u2264 5\u03A9 (target < 1\u03A9)' },
  { category: 'Grounding', item: 'Tank/skid bonded to ground grid', pass: '#2/0 AWG minimum' },
  { category: 'Grounding', item: 'Neutral-ground bond in place (if req\u2019d)', pass: 'Per system design' },
  { category: 'Electrical', item: 'Insulation resistance — HV to ground', pass: '\u2265 min per voltage class' },
  { category: 'Electrical', item: 'Insulation resistance — LV to ground', pass: '\u2265 100 M\u03A9 at 20\u00B0C' },
  { category: 'Electrical', item: 'Insulation resistance — HV to LV', pass: '\u2265 min per voltage class' },
  { category: 'Electrical', item: 'Turns ratio test (all taps)', pass: 'Within 0.5% of nameplate' },
  { category: 'Electrical', item: 'Winding resistance (all phases)', pass: 'Within 2% between phases' },
  { category: 'Electrical', item: 'Phase rotation verified', pass: 'ABC clockwise' },
  { category: 'Electrical', item: 'Phasing verified against mine system', pass: '0V between same phases' },
  { category: 'Oil', item: 'Oil level within normal range', pass: 'At correct temp band' },
  { category: 'Oil', item: 'Oil dielectric breakdown', pass: '\u2265 30 kV (ASTM D1816)' },
  { category: 'Oil', item: 'Oil moisture content', pass: '\u2264 20 ppm new, \u2264 35 ppm service' },
  { category: 'Oil', item: 'DGA baseline sample taken', pass: 'Results on file' },
  { category: 'Protection', item: 'Primary fuses correct size and condition', pass: 'Per coordination study' },
  { category: 'Protection', item: 'Secondary breaker settings verified', pass: 'Per coordination study' },
  { category: 'Protection', item: 'GFP relay tested', pass: '\u2264 100 mA / 200 ms' },
  { category: 'Protection', item: 'Ground check monitor tested', pass: 'Trips on pilot open' },
  { category: 'Protection', item: 'Temperature alarms/trips verified', pass: 'Alarm 95\u00B0C, trip 105\u00B0C' },
  { category: 'Protection', item: 'Surge arresters installed and inspected', pass: 'No damage, proper rating' },
  { category: 'Connections', item: 'All primary connections torqued', pass: 'Per manufacturer spec' },
  { category: 'Connections', item: 'All secondary connections torqued', pass: 'Per manufacturer spec' },
  { category: 'Connections', item: 'All cables labeled and secured', pass: 'Both ends labeled' },
  { category: 'Connections', item: 'Cable bending radius maintained', pass: '12\u00D7 OD shielded, 8\u00D7 unshielded' },
  { category: 'Final', item: 'Single-line diagram updated', pass: 'Current revision on file' },
  { category: 'Final', item: 'Energization authorized by supervisor', pass: 'Signed authorization' },
  { category: 'Final', item: 'All personnel clear of substation', pass: 'Head count verified' },
  { category: 'Final', item: 'Dispatch notified of energization', pass: 'Acknowledged' },
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

const cardElevated: React.CSSProperties = {
  background: 'var(--surface-elevated)',
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

const cautionBox: React.CSSProperties = {
  background: 'rgba(255, 215, 0, 0.06)',
  border: '1px solid rgba(255, 215, 0, 0.2)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--warning)',
  lineHeight: 1.5,
}

const infoBox: React.CSSProperties = {
  background: 'rgba(96, 165, 250, 0.06)',
  border: '1px solid rgba(96, 165, 250, 0.2)',
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

const stepNumber: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 14,
  background: 'var(--primary)',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 13,
  flexShrink: 0,
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ExpandableCard({ title, color, defaultOpen, children }: { title: string; color?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0', gap: 8 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, ...mono, color: valueColor || 'var(--text)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, i) => (
        <div key={i} style={bulletItem}>
          <span style={bulletDot(color)}>{'\u2022'}</span>
          {item}
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={sectionLabel}>{children}</div>
}

/* ------------------------------------------------------------------ */
/*  Tab: Types & Configurations                                        */
/* ------------------------------------------------------------------ */

function TypesTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Substation types */}
      <SectionTitle>Substation Types for Open Pit Mining</SectionTitle>
      {substationTypes.map((s) => (
        <ExpandableCard key={s.name} title={s.name} color={s.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{s.description}</p>
            <InfoRow label="Cooling" value={s.cooling} />
            <InfoRow label="Typical Ratings" value={s.typicalRatings} valueColor="var(--primary)" />
            <InfoRow label="Mounting" value={s.mounting} />
            <InfoRow label="Relocation Freq." value={s.relocationFreq} />
            <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>ADVANTAGES</span>
              <BulletList items={s.pros} color="#4ade80" />
            </div>
            <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ff6b6b' }}>DISADVANTAGES</span>
              <BulletList items={s.cons} color="#ff6b6b" />
            </div>
            <div style={{ ...infoBox }}>
              <strong>Mining Use:</strong> {s.miningUse}
            </div>
          </div>
        </ExpandableCard>
      ))}

      {/* Comparison Table */}
      <SectionTitle>Quick Comparison</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Feature</th>
              <th style={tableHeader}>Pad-Mount</th>
              <th style={tableHeader}>Skid-Mount</th>
              <th style={tableHeader}>Mobile (Trailer)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Relocation Time</td>
              <td style={tableCellDim}>1-2 days</td>
              <td style={tableCellDim}>4-8 hours</td>
              <td style={{ ...tableCell, color: '#4ade80', ...mono }}>1-3 hours</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Crane Required</td>
              <td style={tableCellDim}>Yes — heavy crane</td>
              <td style={tableCellDim}>Yes — crane or heavy forklift</td>
              <td style={{ ...tableCell, color: '#4ade80', ...mono }}>No — tow vehicle</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Cost per kVA</td>
              <td style={{ ...tableCell, color: '#4ade80', ...mono }}>Lowest</td>
              <td style={tableCellDim}>Medium</td>
              <td style={tableCellDim}>Highest</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Typical Rating</td>
              <td style={tableCellDim}>500-3333 kVA</td>
              <td style={tableCellDim}>500-2500 kVA</td>
              <td style={tableCellDim}>500-5000 kVA</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Site Prep</td>
              <td style={tableCellDim}>Concrete or gravel pad</td>
              <td style={tableCellDim}>Gravel pad + shims</td>
              <td style={{ ...tableCell, color: '#4ade80', ...mono }}>Level ground only</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Best For</td>
              <td style={tableCellDim}>Semi-permanent locations</td>
              <td style={tableCellDim}>Active bench power</td>
              <td style={tableCellDim}>Rapid deploy / emergency</td>
            </tr>
            <tr>
              <td style={{ ...tableCell, fontWeight: 600 }}>Terminations</td>
              <td style={tableCellDim}>Standard bolted or elbow</td>
              <td style={tableCellDim}>Standard or quick-connect</td>
              <td style={{ ...tableCell, color: '#4ade80', ...mono }}>Quick-connect standard</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Winding Configurations */}
      <SectionTitle>Common Voltage & Winding Configurations</SectionTitle>
      <div style={infoBox}>
        <strong>Delta-Wye (\u0394-Y)</strong> is the most common winding configuration for mining substations. Delta primary provides harmonic isolation. Wye secondary provides a neutral point for grounding and 347V line-to-neutral.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Primary (HV)</th>
              <th style={tableHeader}>Secondary (LV)</th>
              <th style={tableHeader}>Winding</th>
              <th style={tableHeader}>Application</th>
              <th style={tableHeader}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {voltageConfigs.map((v, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, ...mono, color: v.color, fontWeight: 700 }}>{v.primaryVoltage}</td>
                <td style={{ ...tableCell, ...mono }}>{v.secondaryVoltage}</td>
                <td style={{ ...tableCell, ...mono, color: 'var(--primary)' }}>{v.winding}</td>
                <td style={tableCellDim}>{v.application}</td>
                <td style={tableCellDim}>{v.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Protection Devices */}
      <SectionTitle>Protection Devices</SectionTitle>
      {protectionDevices.map((p, i) => (
        <div key={i} style={{ ...card, borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{p.device}</div>
          <InfoRow label="Location" value={p.location} />
          <InfoRow label="Function" value={p.function} />
          <InfoRow label="Typical Setting" value={p.typicalSetting} />
          <InfoRow label="Standard" value={p.standard} valueColor="var(--primary)" />
        </div>
      ))}

      {/* Ratings Table */}
      <SectionTitle>Standard Portable Substation Ratings</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={tableHeader}>kVA</th>
              <th style={tableHeader}>Primary A (13.8kV)</th>
              <th style={tableHeader}>Primary A (4.16kV)</th>
              <th style={tableHeader}>Secondary A (600V)</th>
              <th style={tableHeader}>Weight (Approx)</th>
              <th style={tableHeader}>Dimensions (L\u00D7W\u00D7H)</th>
              <th style={tableHeader}>Impedance (%Z)</th>
            </tr>
          </thead>
          <tbody>
            {substationRatings.map((r) => (
              <tr key={r.kva}>
                <td style={{ ...tableCell, ...mono, color: 'var(--primary)', fontWeight: 700 }}>{r.kva}</td>
                <td style={{ ...tableCell, ...mono }}>{r.primaryAmps13_8}</td>
                <td style={{ ...tableCell, ...mono }}>{r.primaryAmps4_16}</td>
                <td style={{ ...tableCell, ...mono, color: '#4ade80' }}>{r.secondaryAmps600}</td>
                <td style={tableCellDim}>{r.approxWeight}</td>
                <td style={tableCellDim}>{r.approxDimensions}</td>
                <td style={{ ...tableCell, ...mono }}>{r.impedance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        Note: Amperage calculated as I = kVA / (\u221A3 \u00D7 V). Weights and dimensions are approximate and vary by manufacturer. Impedance per IEEE C57.12.00.
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Installation & Setup                                          */
/* ------------------------------------------------------------------ */

function InstallationTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={warningBox}>
        <strong>SAFETY FIRST:</strong> All installation work on portable substations shall be performed by or under the direct supervision of a licensed electrician holding a valid Ontario Certificate of Qualification (309A or 442A). Comply with O.Reg.854 (Mines and Mining Plants) at all times.
      </div>

      {/* Installation Steps */}
      <SectionTitle>Installation Procedure — Step by Step</SectionTitle>
      {installSteps.map((s) => (
        <div key={s.step} style={{ ...card, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={stepNumber}>{s.step}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 8px' }}>{s.description}</p>
              <BulletList items={s.details} color="var(--primary)" />
              {s.caution && (
                <div style={{ ...cautionBox, marginTop: 10 }}>
                  <strong>CAUTION:</strong> {s.caution}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Safety Requirements */}
      <SectionTitle>Safety Requirements</SectionTitle>
      {safetyRequirements.map((s, i) => (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${s.color}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{s.requirement}</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 6px' }}>{s.details}</p>
          <span style={tagStyle(s.color)}>{s.reference}</span>
        </div>
      ))}

      {/* O.Reg.854 Requirements */}
      <SectionTitle>O.Reg. 854 — Mine Substation Requirements</SectionTitle>
      <div style={{ ...infoBox, marginBottom: 4 }}>
        Ontario Regulation 854 (Mines and Mining Plants) sets specific requirements for electrical installations in mines. These apply in addition to the CEC and OESC.
      </div>
      {oregRequirements.map((r, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={tagStyle('#a78bfa')}>{r.section}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{r.title}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{r.requirement}</p>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Relocation Procedures                                         */
/* ------------------------------------------------------------------ */

function RelocationTab() {
  const phases = [...new Set(relocationSteps.map(s => s.phase))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={warningBox}>
        <strong>CRITICAL:</strong> Portable substation relocation is a high-risk activity. LOTO procedures must be followed at all times. All primary and secondary circuits must be de-energized and grounded before any disconnection work begins. Never assume a circuit is de-energized — always verify with a rated voltage detector.
      </div>

      {/* Relocation Steps by Phase */}
      {phases.map((phase) => (
        <div key={phase}>
          <SectionTitle>{phase}</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {relocationSteps.filter(s => s.phase === phase).map((s) => (
              <div key={s.step} style={{ ...card, borderLeft: `4px solid ${s.color}` }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={stepNumber}>{s.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.action}</div>
                    <BulletList items={s.details} color={s.color} />
                    {s.safetyNote && (
                      <div style={{ ...cautionBox, marginTop: 10 }}>
                        <strong>SAFETY:</strong> {s.safetyNote}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* De-energization Checklist */}
      <SectionTitle>De-energization & Isolation Checklist</SectionTitle>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'All downstream loads confirmed de-energized and disconnected',
            'Secondary main breaker OPEN and locked out',
            'Secondary voltage verified zero on all phases',
            'Primary disconnect OPEN and locked out',
            'Primary voltage verified zero with rated HV detector',
            'Safety grounds applied to primary cable (if required)',
            'Personal LOTO locks and tags applied at all isolation points',
            'Work permit/clearance issued and posted',
            'All personnel in area informed of isolation status',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                border: '2px solid var(--divider)', flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Re-commissioning Tests */}
      <SectionTitle>Re-Commissioning Tests After Relocation</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Test</th>
              <th style={tableHeader}>Purpose</th>
              <th style={tableHeader}>Accept Criteria</th>
              <th style={tableHeader}>Required</th>
            </tr>
          </thead>
          <tbody>
            {recommissionTests.map((t, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{t.test}</td>
                <td style={tableCellDim}>{t.purpose}</td>
                <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{t.acceptCriteria}</td>
                <td style={{ ...tableCell }}>
                  <span style={tagStyle(t.required === 'Always' ? '#4ade80' : '#ffd700')}>{t.required}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Documentation */}
      <SectionTitle>Relocation Documentation Requirements</SectionTitle>
      <div style={infoBox}>
        O.Reg.854 s.155 requires that single-line diagrams be maintained and updated within 30 days of any change. All relocation events must be documented for regulatory compliance and equipment history.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Document</th>
              <th style={tableHeader}>Purpose</th>
              <th style={tableHeader}>Retained By</th>
            </tr>
          </thead>
          <tbody>
            {relocationDocuments.map((d, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{d.document}</td>
                <td style={tableCellDim}>{d.purpose}</td>
                <td style={tableCellDim}>{d.retainedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transport Checklist */}
      <SectionTitle>Pre-Transport Checklist</SectionTitle>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Oil level verified at FULL — topped up if necessary',
            'All drain valves closed and caps secured',
            'All access doors and panel covers locked',
            'Tap changer handle removed or locked',
            'No active oil leaks — all gaskets tight',
            'Auxiliary power disconnected (fans, heaters, lights)',
            'Loose items removed or secured inside enclosure',
            'Lifting lugs/eyes inspected — no cracks or deformation',
            'Rigging inspected and rated for load',
            'Crane/forklift capacity verified (min 125% of unit weight)',
            'Transport route reviewed — clearances, grade, ground conditions',
            'Escort vehicle arranged if over-width load',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4,
                border: '2px solid var(--divider)', flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Maintenance & Testing                                         */
/* ------------------------------------------------------------------ */

function MaintenanceTab() {
  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={infoBox}>
        Preventive maintenance is critical for portable substations in mining environments. Dust, vibration from blasting, and frequent relocation increase wear on all components. Adhere to schedules strictly — a failed portable substation can halt production across an entire bench.
      </div>

      {/* Inspection Checklist by Frequency */}
      <SectionTitle>Routine Inspection Checklist</SectionTitle>
      {frequencies.map((freq) => {
        const items = inspectionChecklist.filter(item => item.frequency === freq)
        if (items.length === 0) return null
        return (
          <ExpandableCard
            key={freq}
            title={`${freq} Inspections (${items.length} items)`}
            color={items[0].color}
            defaultOpen={freq === 'Daily'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item, i) => (
                <div key={i} style={{ ...cardElevated, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      border: `2px solid ${item.color}`, flexShrink: 0, marginTop: 2,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{item.item}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 2 }}>{item.procedure}</div>
                      <div style={{ fontSize: 12, color: '#4ade80', ...mono }}>Accept: {item.acceptCriteria}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableCard>
        )
      })}

      {/* Oil Maintenance */}
      <SectionTitle>Oil-Filled Transformer Maintenance</SectionTitle>

      <ExpandableCard title="Dissolved Gas Analysis (DGA) — Interpretation Guide" color="#ff9f43">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            DGA is the single most important diagnostic tool for oil-filled transformers. Gas levels indicate the type and severity of internal faults. Per IEEE C57.104.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Gas</th>
                  <th style={tableHeader}>Symbol</th>
                  <th style={{ ...tableHeader, background: 'rgba(74, 222, 128, 0.1)' }}>Condition 1</th>
                  <th style={{ ...tableHeader, background: 'rgba(255, 215, 0, 0.1)' }}>Condition 2</th>
                  <th style={{ ...tableHeader, background: 'rgba(255, 107, 107, 0.1)' }}>Condition 3</th>
                  <th style={tableHeader}>Indicates</th>
                </tr>
              </thead>
              <tbody>
                {dgaGases.map((g, i) => (
                  <tr key={i}>
                    <td style={{ ...tableCell, fontWeight: 600, color: g.color }}>{g.gas}</td>
                    <td style={{ ...tableCell, ...mono }}>{g.symbol}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12, color: '#4ade80' }}>{g.condition1}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12, color: '#ffd700' }}>{g.condition2}</td>
                    <td style={{ ...tableCell, ...mono, fontSize: 12, color: '#ff6b6b' }}>{g.condition3}</td>
                    <td style={tableCellDim}>{g.indicates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={warningBox}>
            <strong>KEY:</strong> Condition 1 = Normal. Condition 2 = Caution, increase monitoring. Condition 3 = Warning, investigate immediately. ANY acetylene (C{'\u2082'}H{'\u2082'}) above 1 ppm requires immediate attention.
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>DGA Sampling Frequency:</strong> Annual for units in good condition. Every 3-6 months for units with Condition 2 gases. Monthly for units with Condition 3 gases or rapidly increasing trends. After every relocation if impact damage is suspected.
          </div>
        </div>
      </ExpandableCard>

      <ExpandableCard title="Oil Dielectric Testing" color="#60a5fa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InfoRow label="Test Standard" value="ASTM D1816 (1mm gap)" />
          <InfoRow label="Min. New Oil" value="\u2265 35 kV" valueColor="#4ade80" />
          <InfoRow label="Min. In-Service" value="\u2265 30 kV" valueColor="#ffd700" />
          <InfoRow label="Investigate If" value="< 25 kV" valueColor="#ff6b6b" />
          <InfoRow label="Frequency" value="Annual, or after any relocation" />
          <InfoRow label="Sample Method" value="ASTM D923 — syringe from bottom drain valve" />
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Low Breakdown Causes:</span>
            <BulletList items={[
              'Moisture contamination — most common cause',
              'Particulate contamination — carbon, fibers, metals',
              'Oil oxidation and aging — acid formation',
              'Dissolved gases from internal faults',
            ]} color="#ff9f43" />
          </div>
          <div style={infoBox}>
            <strong>Remediation:</strong> Oil with low dielectric strength can often be restored by vacuum dehydration and filtration (oil processing). If acid number is high or oxidation is advanced, oil replacement may be necessary.
          </div>
        </div>
      </ExpandableCard>

      <ExpandableCard title="Oil Moisture Content" color="#a78bfa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InfoRow label="Test Method" value="Karl Fischer titration (ASTM D1533)" />
          <InfoRow label="New Oil Max" value="\u2264 20 ppm" valueColor="#4ade80" />
          <InfoRow label="In-Service Max" value="\u2264 35 ppm" valueColor="#ffd700" />
          <InfoRow label="Investigate If" value="> 35 ppm" valueColor="#ff6b6b" />
          <InfoRow label="Critical Level" value="> 50 ppm" valueColor="#ff6b6b" />
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Moisture in oil drastically reduces dielectric strength. At 50 ppm, breakdown voltage can drop by 50%. Moisture also accelerates cellulose (paper insulation) degradation, reducing transformer life. Sources: seal leaks, breathing through deteriorated gaskets, and cellulose aging byproduct.
          </div>
        </div>
      </ExpandableCard>

      {/* Insulation Resistance */}
      <SectionTitle>Insulation Resistance — Minimum Values by Voltage Class</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Voltage Class</th>
              <th style={tableHeader}>Test Voltage</th>
              <th style={tableHeader}>Min New</th>
              <th style={tableHeader}>Min In-Service</th>
              <th style={tableHeader}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {insulationResistanceTable.map((r, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, ...mono, fontWeight: 700, color: 'var(--primary)' }}>{r.voltageClass}</td>
                <td style={{ ...tableCell, ...mono }}>{r.testVoltage}</td>
                <td style={{ ...tableCell, ...mono, color: '#4ade80' }}>{r.minNew}</td>
                <td style={{ ...tableCell, ...mono, color: '#ffd700' }}>{r.minService}</td>
                <td style={tableCellDim}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong>Temperature Correction:</strong> All insulation resistance readings must be corrected to 20{'\u00B0'}C for comparison. IR approximately halves for every 10{'\u00B0'}C increase above 20{'\u00B0'}C. Use IEEE C57.12.90 correction factors.
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <strong>Polarization Index (PI):</strong> Ratio of 10-minute to 1-minute IR reading. PI {'>'} 2.0 indicates dry insulation. PI {'<'} 1.5 may indicate moisture contamination. Trending PI over time is valuable for monitoring insulation condition.
      </div>

      {/* Protection Relay Testing */}
      <SectionTitle>Protection Relay Testing</SectionTitle>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Ground Fault Protection (GFP) — O.Reg.854 Mandatory</div>
          <InfoRow label="Test Frequency" value="Monthly minimum" valueColor="var(--primary)" />
          <InfoRow label="Test Method" value="Secondary injection via relay test set" />
          <InfoRow label="Pickup Verify" value="\u2264 100 mA" valueColor="#4ade80" />
          <InfoRow label="Trip Time" value="\u2264 200 ms" valueColor="#4ade80" />
          <InfoRow label="Trip Output" value="Verify relay trips secondary breaker" />
          <div style={warningBox}>
            <strong>MANDATORY:</strong> O.Reg.854 s.160 requires GFP testing at least monthly. Document all test results. A failed GFP test requires immediate repair before the substation can remain in service.
          </div>
        </div>
      </div>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Overcurrent Relay/Breaker Trip Unit</div>
          <InfoRow label="Test Frequency" value="Annual" />
          <InfoRow label="Test Method" value="Secondary injection, primary injection, or trip-test button" />
          <InfoRow label="Verify" value="Pickup current, time-delay curve, instantaneous trip" />
          <InfoRow label="Tolerance" value="\u00B1 5% of settings" />
        </div>
      </div>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Ground Check Monitor</div>
          <InfoRow label="Test Frequency" value="Monthly" />
          <InfoRow label="Test Method" value="Simulate pilot wire open circuit at far end" />
          <InfoRow label="Verify" value="Monitor trips and prevents energization" />
          <InfoRow label="Reference" value="O.Reg.854 s.161" valueColor="var(--primary)" />
        </div>
      </div>

      {/* Cooling System Maintenance */}
      <SectionTitle>Cooling System Maintenance</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Component</th>
              <th style={tableHeader}>Maintenance</th>
              <th style={tableHeader}>Frequency</th>
              <th style={tableHeader}>Failure Mode</th>
            </tr>
          </thead>
          <tbody>
            {coolingMaintenance.map((c, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{c.component}</td>
                <td style={tableCellDim}>{c.maintenance}</td>
                <td style={{ ...tableCell, ...mono, fontSize: 12 }}>{c.frequency}</td>
                <td style={{ ...tableCell, color: '#ff9f43', fontSize: 12 }}>{c.failureMode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bushing Maintenance */}
      <SectionTitle>Bushing Inspection & Cleaning</SectionTitle>
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Bushings are critical insulating components that bring conductors through the grounded transformer tank. Contamination or damage can lead to flashover and catastrophic failure.
          </div>
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Inspection Points:</span>
            <BulletList items={[
              'Porcelain/polymer surface: check for cracks, chips, tracking marks (dark lines)',
              'Oil level in oil-filled bushings: verify within sight-glass range',
              'Gasket seals at base: check for oil leaks or weeping',
              'Hardware: verify top terminal and connection hardware are tight',
              'Creepage distance: ensure no conductive deposits bridge skirts',
              'In mining: dust buildup is rapid — clean quarterly or more often in dusty conditions',
            ]} color="var(--primary)" />
          </div>
          <div style={cautionBox}>
            <strong>CLEANING:</strong> Always de-energize before cleaning bushings. Use lint-free cloth with approved solvent. Do not use abrasive materials. For heavy contamination, use low-pressure water rinse and allow to dry completely before re-energizing.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Troubleshooting                                               */
/* ------------------------------------------------------------------ */

function TroubleshootingTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={warningBox}>
        <strong>DANGER:</strong> Troubleshooting energized portable substations requires extreme caution. Maintain minimum approach distances per CSA Z462. Wear appropriate PPE including arc-rated clothing. Never work alone on energized HV equipment.
      </div>

      {/* Troubleshooting Items */}
      <SectionTitle>Common Issues & Diagnosis</SectionTitle>
      {troubleshootItems.map((t, idx) => (
        <ExpandableCard key={idx} title={`${t.icon} ${t.symptom}`} color={t.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Causes */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Possible Causes</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                {t.causes.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 16, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: t.color }}>{'\u2022'}</span>
                      {c.cause}
                    </span>
                    <span style={tagStyle(
                      c.likelihood === 'Common' ? '#4ade80' :
                      c.likelihood === 'Moderate' ? '#ffd700' : '#60a5fa'
                    )}>{c.likelihood}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics */}
            <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase' }}>Diagnostic Steps</span>
              <div style={{ marginTop: 4 }}>
                {t.diagnostics.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '3px 0' }}>
                    <span style={{ ...mono, fontSize: 12, color: 'var(--primary)', flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Action */}
            <div style={t.color === '#ff6b6b' ? warningBox : cautionBox}>
              <strong>IMMEDIATE ACTION:</strong> {t.immediateAction}
            </div>
          </div>
        </ExpandableCard>
      ))}

      {/* Emergency Procedures */}
      <SectionTitle>Emergency Procedures</SectionTitle>
      {emergencyProcedures.map((e, i) => (
        <ExpandableCard key={i} title={e.scenario} color={e.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase' }}>Immediate Actions</span>
              <div style={{ marginTop: 4 }}>
                {e.immediateActions.map((a, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '3px 0' }}>
                    <span style={{ ...mono, fontSize: 12, color: '#4ade80', flexShrink: 0 }}>{j + 1}.</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={warningBox}>
              <strong>DO NOT:</strong>
              {e.doNotActions.map((a, j) => (
                <div key={j} style={{ marginTop: 4 }}>{a}</div>
              ))}
            </div>

            <div style={{ ...infoBox }}>
              <strong>Notification:</strong> {e.notification}
            </div>
          </div>
        </ExpandableCard>
      ))}

      {/* Out of Service Criteria */}
      <SectionTitle>When to Take a Transformer Out of Service</SectionTitle>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Condition</th>
              <th style={tableHeader}>Action Required</th>
              <th style={tableHeader}>Urgency</th>
            </tr>
          </thead>
          <tbody>
            {outOfServiceCriteria.map((c, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600 }}>{c.condition}</td>
                <td style={tableCellDim}>{c.action}</td>
                <td style={tableCell}>
                  <span style={tagStyle(c.color)}>{c.urgency}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commissioning Checklist */}
      <SectionTitle>Commissioning Checklist (Complete)</SectionTitle>
      <div style={infoBox}>
        This comprehensive checklist covers all items that must be verified before a portable substation is energized — whether new installation or after relocation. All items must pass before energization is authorized.
      </div>
      {[...new Set(commissioningChecklist.map(c => c.category))].map((cat) => (
        <ExpandableCard key={cat} title={`${cat} (${commissioningChecklist.filter(c => c.category === cat).length} items)`} color="var(--primary)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {commissioningChecklist.filter(c => c.category === cat).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '4px 0', borderBottom: '1px solid var(--divider)' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: '2px solid var(--primary)', flexShrink: 0, marginTop: 2,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{item.item}</div>
                  <div style={{ fontSize: 12, color: '#4ade80', ...mono }}>{item.pass}</div>
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>
      ))}

      {/* Quick Reference: Key Thresholds */}
      <SectionTitle>Quick Reference — Critical Thresholds</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <div style={{ ...card, borderLeft: '4px solid #ff6b6b' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6b6b', textTransform: 'uppercase', marginBottom: 6 }}>Immediate De-energize</div>
          <InfoRow label="Acetylene (DGA)" value="> 9 ppm" valueColor="#ff6b6b" />
          <InfoRow label="Oil Dielectric" value="< 25 kV" valueColor="#ff6b6b" />
          <InfoRow label="Oil Below" value="Minimum mark" valueColor="#ff6b6b" />
          <InfoRow label="Pressure Relief" value="Operated" valueColor="#ff6b6b" />
          <InfoRow label="Partial Discharge" value="Audible" valueColor="#ff6b6b" />
        </div>
        <div style={{ ...card, borderLeft: '4px solid #ffd700' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd700', textTransform: 'uppercase', marginBottom: 6 }}>Caution — Investigate</div>
          <InfoRow label="Top Oil Temp" value="> 95\u00B0C" valueColor="#ffd700" />
          <InfoRow label="Oil Moisture" value="> 35 ppm" valueColor="#ffd700" />
          <InfoRow label="DGA Condition" value="2" valueColor="#ffd700" />
          <InfoRow label="Current Imbalance" value="> 5%" valueColor="#ffd700" />
          <InfoRow label="IR Below" value="Min for class" valueColor="#ffd700" />
        </div>
        <div style={{ ...card, borderLeft: '4px solid #4ade80' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', marginBottom: 6 }}>Normal Operation</div>
          <InfoRow label="Oil Dielectric" value="\u2265 30 kV" valueColor="#4ade80" />
          <InfoRow label="Oil Moisture" value="\u2264 35 ppm" valueColor="#4ade80" />
          <InfoRow label="DGA Condition" value="1" valueColor="#4ade80" />
          <InfoRow label="GFP Response" value="\u2264 100mA/200ms" valueColor="#4ade80" />
          <InfoRow label="Ground Resistance" value="\u2264 5\u03A9" valueColor="#4ade80" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PortableSubstationPage() {
  const [tab, setTab] = useState<TabKey>('types')

  return (
    <PageWrapper title="Portable Substations">
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

      {/* ---- Tab Content ---- */}
      {tab === 'types' && <TypesTab />}
      {tab === 'installation' && <InstallationTab />}
      {tab === 'relocation' && <RelocationTab />}
      {tab === 'maintenance' && <MaintenanceTab />}
      {tab === 'troubleshooting' && <TroubleshootingTab />}
    </PageWrapper>
  )
}
