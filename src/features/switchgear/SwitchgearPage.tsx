import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Switchgear Reference — Open Pit Mine Electricians                  */
/*  IEEE C37.20 series, CSA C22.2 No. 31, Ontario Reg. 854            */
/*  JBox PWA                                                            */
/* ------------------------------------------------------------------ */

type TabKey = 'types' | 'racking' | 'maintenance' | 'testing' | 'troubleshooting'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'types', label: 'Types & Ratings' },
  { key: 'racking', label: 'Racking' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'testing', label: 'Testing' },
  { key: 'troubleshooting', label: 'Troubleshoot' },
]

/* ------------------------------------------------------------------ */
/*  Tab 1: Types & Ratings Data                                        */
/* ------------------------------------------------------------------ */

interface SwitchgearType {
  name: string
  standard: string
  voltageRange: string
  description: string
  features: string[]
  miningUse: string
  tint: string
}

const switchgearTypes: SwitchgearType[] = [
  {
    name: 'Metal-Clad Switchgear',
    standard: 'IEEE C37.20.2 / CSA C22.2 No. 31',
    voltageRange: '4.76 kV - 38 kV',
    description: 'Highest grade of MV switchgear. All live parts fully enclosed in grounded metal compartments with separate sections for breaker, bus, and cable terminations. Drawout circuit breakers on rails with automatic shutters.',
    features: [
      'Drawout breakers on rails for easy maintenance',
      'Separate compartments: breaker, bus, cable',
      'Automatic shutters close when breaker is withdrawn',
      'Full interlock system prevents improper operation',
      'All primary bus and connections enclosed in grounded metal',
      'Grounded metal barriers between compartments',
      'Primary voltage instrument transformers (CTs, PTs) in dedicated compartments',
    ],
    miningUse: 'Primary switchgear for mine main substations. Feeds shovel and dragline pit distribution. Most common choice for new surface mine installations at 4.16 kV and 13.8 kV.',
    tint: '#ff6b6b',
  },
  {
    name: 'Metal-Enclosed Switchgear',
    standard: 'IEEE C37.20.3 / CSA C22.2 No. 31',
    voltageRange: '4.76 kV - 38 kV',
    description: 'Medium-grade MV switchgear. Metal enclosed but not all compartments are individually isolated with grounded metal. May use fixed or drawout breakers, load-break switches, or fused switches.',
    features: [
      'Fixed or drawout breaker designs available',
      'Not all compartments individually metal-enclosed',
      'May use load-break switches instead of circuit breakers',
      'Less expensive than metal-clad',
      'Adequate for many industrial and mining applications',
      'Can include fused switch units for transformer protection',
    ],
    miningUse: 'Secondary distribution at mine processing plants. Feeder switching for haul road lighting, conveyor substations, and auxiliary power distribution.',
    tint: '#ffd700',
  },
  {
    name: 'Low Voltage Switchgear',
    standard: 'IEEE C37.20.1 / CSA C22.2 No. 31',
    voltageRange: 'Up to 600V AC',
    description: 'Drawout power circuit breakers rated 600V class and below. Used for main distribution, large motor feeders, and tie breakers. Breakers are typically 800A to 5000A with electronic trip units.',
    features: [
      'Drawout breakers: 800A to 5000A frames',
      'Electronic trip units with adjustable settings',
      'Connected, Test, and Disconnected positions',
      'Interlocks between breaker and cubicle',
      'Bus ratings typically 2000A to 5000A',
      'Zone-selective interlocking (ZSI) capable',
    ],
    miningUse: 'Mine mill and crusher motor control centres, main 600V distribution for processing plants, generator paralleling switchgear, and pit substation secondary distribution.',
    tint: '#54a0ff',
  },
  {
    name: 'Arc-Resistant Switchgear',
    standard: 'IEEE C37.20.7',
    voltageRange: 'All voltage classes',
    description: 'Switchgear designed and tested to withstand internal arcing faults, directing arc energy away from personnel through pressure relief vents. Available as Type 1 (front only), Type 2 (front and rear), or Type 2B (front, rear, and sides).',
    features: [
      'Pressure relief venting directed away from operators',
      'Reinforced doors and latches withstand arc blast',
      'Type 1: accessible from front only',
      'Type 2: accessible from front and rear',
      'Type 2B: accessible from front, rear, and sides',
      'Doors remain closed and latched during arc event',
      'Arc duration typically limited to 0.5 seconds or less',
    ],
    miningUse: 'Recommended for ALL new mining switchgear installations. Personnel safety is paramount. Arc-resistant rated switchgear significantly reduces burn injury risk during internal arc faults.',
    tint: '#ff9f43',
  },
]

interface VoltageClass {
  kV: string
  maxVoltage: string
  bil: string
  typicalApps: string
  interruptingRange: string
}

const voltageClasses: VoltageClass[] = [
  { kV: '5 kV', maxVoltage: '4.76 kV', bil: '60 kV', typicalApps: 'Motor feeders, mine pit distribution (4.16 kV)', interruptingRange: '29 - 50 kA' },
  { kV: '15 kV', maxVoltage: '15.0 kV', bil: '95 kV', typicalApps: 'Primary distribution (13.8 kV), mine main substation', interruptingRange: '18 - 40 kA' },
  { kV: '27 kV', maxVoltage: '27.0 kV', bil: '125 kV', typicalApps: 'Utility primary (27.6 kV), Ontario Hydro feeds', interruptingRange: '16 - 25 kA' },
  { kV: '38 kV', maxVoltage: '38.0 kV', bil: '150 kV', typicalApps: 'Subtransmission (34.5 kV), large mine primary feeds', interruptingRange: '16 - 25 kA' },
]

interface MineSwitchgearRow {
  location: string
  voltage: string
  type: string
  rating: string
  enclosure: string
  notes: string
}

const mineSwitchgearTable: MineSwitchgearRow[] = [
  { location: 'Main Substation', voltage: '13.8 kV', type: 'Metal-Clad', rating: '1200A, 25kA', enclosure: 'Indoor', notes: 'Arc-resistant, utility incoming, main bus tie' },
  { location: 'Pit Distribution', voltage: '4.16 kV', type: 'Metal-Clad', rating: '1200A, 40kA', enclosure: 'Outdoor', notes: 'Feeds shovel trailing cables, portable substations' },
  { location: 'Crusher Substation', voltage: '4.16 kV', type: 'Metal-Clad', rating: '2000A, 50kA', enclosure: 'Indoor', notes: 'Large motor feeders, high short-circuit duty' },
  { location: 'Mill Building', voltage: '600V', type: 'LV Switchgear', rating: '3000A bus', enclosure: 'Indoor', notes: 'Main distribution, MCC feeders, capacitor banks' },
  { location: 'Shovel Substation', voltage: '4.16 kV', type: 'Metal-Enclosed', rating: '600A, 25kA', enclosure: 'Outdoor (NEMA 3R)', notes: 'Portable, skid-mounted for pit relocation' },
  { location: 'Conveyor Substation', voltage: '4.16 kV', type: 'Metal-Enclosed', rating: '600A, 25kA', enclosure: 'Outdoor', notes: 'Single or double-ended, auto-transfer capable' },
  { location: 'Pump House', voltage: '600V', type: 'LV Switchgear', rating: '2000A bus', enclosure: 'Indoor (NEMA 12)', notes: 'Dewatering pumps, VFD feeders' },
  { location: 'Generator Building', voltage: '13.8 kV', type: 'Metal-Clad', rating: '2000A, 40kA', enclosure: 'Indoor', notes: 'Generator paralleling, sync panels, tie breakers' },
]

interface KeySpec {
  spec: string
  description: string
  importance: string
}

const keySpecs: KeySpec[] = [
  { spec: 'Rated Maximum Voltage', description: 'Upper limit of operating voltage. Switchgear must be rated at or above system voltage.', importance: 'A 15kV class breaker cannot be used on a 27kV system. Always verify nameplate rating.' },
  { spec: 'Rated Continuous Current', description: 'Maximum continuous current the switchgear can carry without exceeding temperature limits. Common ratings: 600A, 1200A, 2000A, 3000A.', importance: 'Must exceed maximum load current including future expansion. Undersized bus = overheating.' },
  { spec: 'Short-Circuit Rating', description: 'Maximum fault current the switchgear can withstand for a specified duration (typically 2 seconds). Expressed in kA RMS symmetrical.', importance: 'Must exceed the available fault current at the point of installation. Critical for personnel safety.' },
  { spec: 'Interrupting Rating', description: 'Maximum fault current the circuit breaker can safely interrupt. Expressed in kA RMS symmetrical at rated voltage.', importance: 'Breaker must be able to interrupt the maximum fault current. Undersized breaker = catastrophic failure.' },
  { spec: 'BIL (Basic Impulse Level)', description: 'Withstand voltage for lightning or switching surges. Measured in kV peak for a 1.2/50 microsecond wave.', importance: 'Higher BIL needed for outdoor installations and areas with frequent lightning.' },
  { spec: 'Interrupting Time', description: 'Time from trip signal to arc extinguishing. Typically 3-5 cycles (50-83ms at 60Hz) for MV breakers.', importance: 'Faster interrupting time reduces arc flash energy. Critical for protection coordination.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Racking & Operation Data                                    */
/* ------------------------------------------------------------------ */

interface BreakerPosition {
  name: string
  description: string
  connections: string
  purpose: string
  tint: string
}

const breakerPositions: BreakerPosition[] = [
  {
    name: 'CONNECTED',
    description: 'Breaker is fully racked in. Primary disconnects are fully engaged. Breaker is connected to both line (bus) and load (cable) stabs.',
    connections: 'Primary stabs ENGAGED, control wiring CONNECTED, breaker operational',
    purpose: 'Normal operating position. Breaker can be opened or closed to control the circuit.',
    tint: '#22c55e',
  },
  {
    name: 'TEST',
    description: 'Breaker is partially withdrawn. Primary disconnects are DISENGAGED. Control wiring remains connected through secondary disconnect plugs. Automatic shutters are CLOSED.',
    connections: 'Primary stabs DISENGAGED, control wiring CONNECTED, shutters CLOSED',
    purpose: 'Allows testing of breaker operation (close/trip) and relay testing without energizing the primary circuit. Safe for maintenance testing.',
    tint: '#f59e0b',
  },
  {
    name: 'DISCONNECTED',
    description: 'Breaker is fully withdrawn from the cubicle. All primary and secondary connections are disengaged. Breaker can be rolled out for inspection or service.',
    connections: 'Primary stabs DISENGAGED, control wiring DISCONNECTED, shutters CLOSED',
    purpose: 'Full isolation for breaker maintenance, inspection, or removal. Breaker can be moved to maintenance bench.',
    tint: '#ef4444',
  },
]

interface RackingStep {
  step: number
  action: string
  detail: string
  warning?: string
}

const rackingOutSteps: RackingStep[] = [
  { step: 1, action: 'Notify Control Room', detail: 'Inform the control room and all affected personnel of the planned switching operation. Obtain switching permit if required.', warning: 'Never perform switching without authorization.' },
  { step: 2, action: 'Open the Circuit Breaker', detail: 'Trip/open the breaker from the local control panel or remotely. Verify OPEN indication on breaker position indicator and relay panel.', warning: 'NEVER rack a breaker under load! The breaker MUST be in the OPEN position.' },
  { step: 3, action: 'Verify Zero Energy', detail: 'Confirm breaker is open by checking mechanical position indicator, relay panel status, and if available, voltage indicators showing dead bus.', },
  { step: 4, action: 'Don PPE', detail: 'Put on appropriate arc-rated PPE for the voltage class. MV: arc-rated face shield, gloves, flash suit per arc flash study. Stand to the side, not directly in front of the cubicle.' },
  { step: 5, action: 'Insert Racking Handle', detail: 'Open the breaker compartment door (some designs require the breaker to be open first). Insert the racking crank into the racking mechanism. Some designs use a lever, others a crank handle.', warning: 'Use only the manufacturer-specified racking tool.' },
  { step: 6, action: 'Rack to TEST Position', detail: 'Turn the racking crank slowly and smoothly. Count the turns. The breaker will move from CONNECTED to TEST position. You will feel a detent or hear a click at the TEST position.', },
  { step: 7, action: 'Verify TEST Position', detail: 'Check the mechanical position indicator shows TEST. Primary stabs should be disengaged. Shutters should be closed. Control wiring is still connected in TEST.', },
  { step: 8, action: 'Continue to DISCONNECTED', detail: 'Continue turning the racking crank until the breaker reaches the DISCONNECTED position. The secondary disconnect plugs will disengage. Another detent or click confirms position.', },
  { step: 9, action: 'Verify DISCONNECTED', detail: 'Check position indicator shows DISCONNECTED. Both primary and secondary connections are disengaged. Remove racking handle and store it.', },
  { step: 10, action: 'Apply LOTO if Required', detail: 'If the breaker is being racked out for maintenance, apply lockout/tagout per site procedures. Lock the breaker compartment, lock the breaker in the open position, and tag with personnel information.', warning: 'LOTO is mandatory for any maintenance work downstream.' },
]

const rackingInSteps: RackingStep[] = [
  { step: 1, action: 'Verify Work Complete', detail: 'Confirm all maintenance or repair work is complete. All tools and materials removed. Personnel clear of the equipment. LOTO clearance obtained.', },
  { step: 2, action: 'Inspect Breaker', detail: 'Before racking in, visually inspect the breaker: primary stabs clean, secondary plugs intact, no visible damage, arc chutes in place, springs charged if applicable.', },
  { step: 3, action: 'Don PPE', detail: 'Full arc-rated PPE required per site arc flash analysis. Stand to the side of the cubicle, not directly in front.', },
  { step: 4, action: 'Verify Breaker is OPEN', detail: 'Confirm the breaker mechanism is in the OPEN position. Never rack in a closed breaker.', warning: 'NEVER attempt to rack in a CLOSED breaker.' },
  { step: 5, action: 'Insert Racking Handle', detail: 'Insert the racking crank into the racking mechanism. Ensure it is fully engaged and properly seated.', },
  { step: 6, action: 'Rack to TEST Position', detail: 'Turn the crank slowly and smoothly. Rack the breaker to the TEST position. You will feel a detent. Verify the position indicator reads TEST. Secondary plugs will engage first.', },
  { step: 7, action: 'Test at TEST Position', detail: 'With breaker in TEST: verify relay indications are normal, perform a close/trip test if required, verify all control functions. The primary circuit is NOT energized in TEST.', },
  { step: 8, action: 'Rack to CONNECTED', detail: 'Continue turning the crank to move the breaker to the CONNECTED position. The primary stabs will engage. A definite detent confirms full engagement. Remove the racking handle.', },
  { step: 9, action: 'Verify CONNECTED', detail: 'Position indicator shows CONNECTED. All primary and secondary connections engaged. Close and secure the breaker compartment door.', },
  { step: 10, action: 'Close Breaker', detail: 'Close the breaker from the local panel or remotely per switching order. Verify CLOSED indication. Monitor load current. Notify control room of completion.', },
]

interface InterlockInfo {
  interlock: string
  purpose: string
  consequence: string
}

const interlockSystems: InterlockInfo[] = [
  { interlock: 'Breaker Must Be Open to Rack', purpose: 'Prevents racking a closed breaker, which would cause the primary stabs to make/break under load — resulting in an arc flash event.', consequence: 'Racking mechanism is mechanically blocked when breaker is closed. Cannot insert or turn racking handle.' },
  { interlock: 'Door Interlock', purpose: 'Prevents opening the breaker compartment door when the breaker is in the CONNECTED position and closed.', consequence: 'Door remains locked. Breaker must be opened (tripped) before the door can be opened.' },
  { interlock: 'Shutter Mechanism', purpose: 'Automatic shutters close over the primary bus stabs when the breaker is withdrawn, preventing accidental contact with energized bus.', consequence: 'Shutters close automatically. Provides a physical barrier to energized bus bars.' },
  { interlock: 'Key Interlock System', purpose: 'Kirk key or similar system that enforces a switching sequence. Key can only be released when a specific device is in the required position.', consequence: 'Prevents out-of-sequence switching operations. Commonly used between breakers and disconnect switches.' },
  { interlock: 'Ground Switch Interlock', purpose: 'Prevents closing the breaker when the ground switch is in the closed (grounded) position. Prevents closing the ground switch when the breaker is closed.', consequence: 'Mechanical or electrical interlock between breaker and ground switch. Mutual exclusion enforced.' },
  { interlock: 'Racking Position Interlock', purpose: 'Prevents closing the breaker unless it is fully in the CONNECTED position or the TEST position. Intermediate positions are blocked.', consequence: 'Close circuit is interrupted unless breaker is in a valid position. Prevents partial engagement arcing.' },
]

const safetyRules: string[] = [
  'NEVER rack a circuit breaker under load. The breaker MUST be open before racking.',
  'NEVER defeat or bypass interlocks. They exist to protect your life.',
  'Always wear appropriate arc-rated PPE for the voltage class and incident energy level.',
  'Stand to the SIDE of the switchgear, not directly in front, when racking.',
  'Use ONLY the manufacturer-specified racking tool. Improvised tools can slip or break.',
  'Verify breaker position with BOTH the mechanical indicator and electrical indication.',
  'Apply LOTO before performing any maintenance on switchgear or downstream equipment.',
  'If the racking mechanism feels abnormally stiff or rough, STOP. Do not force it.',
  'Ensure spring charging mechanism is operational before racking in — a dead spring means the breaker cannot trip on fault.',
  'In open pit mines, check for moisture, dust, and animal intrusion before racking operations.',
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Maintenance Data                                            */
/* ------------------------------------------------------------------ */

interface MaintenanceTask {
  category: string
  frequency: string
  tasks: string[]
  tint: string
}

const maintenanceSchedule: MaintenanceTask[] = [
  {
    category: 'Monthly Visual Inspection',
    frequency: 'Monthly',
    tasks: [
      'Verify all indicator lights functioning (breaker status, alarm, power available)',
      'Check space heater operation — heaters must be ON when switchgear is de-energized',
      'Inspect for signs of moisture, condensation, or water intrusion',
      'Listen for abnormal sounds: buzzing, arcing, partial discharge (corona)',
      'Check for unusual odours: ozone smell indicates partial discharge or arcing',
      'Verify ventilation fans operating (if equipped)',
      'Check door seals and gaskets for damage or deterioration',
      'Inspect for dust accumulation — excessive dust is a flashover risk',
      'Verify all ground connections intact and not corroded',
      'Check battery backup for trip unit (if applicable)',
    ],
    tint: '#22c55e',
  },
  {
    category: 'Quarterly Inspection',
    frequency: 'Every 3 Months',
    tasks: [
      'Perform infrared thermography scan under load — compare all three phases',
      'Check and record breaker operation counter readings',
      'Verify all relay targets and indicators are clear (no tripped flags)',
      'Test breaker close/trip from local panel',
      'Inspect racking mechanism: lubrication, smooth operation, proper engagement',
      'Check cable terminations for signs of tracking or overheating',
      'Inspect bus connections visible through viewports',
      'Verify proper labelling: breaker ID, feeder name, voltage, arc flash labels',
      'Clean air filters on forced-air cooled switchgear',
      'Check surge arrester condition indicators (if equipped)',
    ],
    tint: '#54a0ff',
  },
  {
    category: 'Annual Maintenance',
    frequency: 'Annually',
    tasks: [
      'Rack out breakers and visually inspect primary stabs for wear, pitting, or discolouration',
      'Perform contact resistance test (DLRO) on each breaker — compare to baseline',
      'Perform insulation resistance test (Megger) phase-to-phase and phase-to-ground',
      'Test all protective relays: secondary injection test to verify trip settings',
      'Verify breaker trip free function and anti-pump feature',
      'Inspect arc chutes: look for cracking, erosion, carbon tracking',
      'Check mechanical operating mechanism: springs, latches, linkages',
      'Lubricate racking mechanism per manufacturer specifications',
      'Inspect shutters for proper operation and mechanical integrity',
      'Test all interlocks: door, racking, breaker position, key interlocks',
      'Verify torque on all accessible bus and cable connections',
      'Clean insulators and bus support with manufacturer-approved cleaner',
      'Review and update arc flash labels if system has changed',
    ],
    tint: '#ffd700',
  },
  {
    category: '3-5 Year Overhaul',
    frequency: 'Every 3-5 Years',
    tasks: [
      'Full circuit breaker service per manufacturer maintenance manual',
      'Replace arc chutes if erosion exceeds 50% of contact material',
      'Replace main contacts if wear indicators show replacement needed',
      'Rebuild operating mechanism: replace springs, pivots, latch components',
      'Perform primary injection test — verify breaker trips at correct current',
      'Perform hi-pot (dielectric withstand) test on bus and cable compartments',
      'Perform power factor / dissipation factor test on bushings',
      'Replace all gaskets, seals, and weatherstripping',
      'Repaint or touch up interior surfaces (rust prevention in mining environment)',
      'Replace space heaters if output has degraded',
      'Full calibration of all protective relays',
      'Update relay settings if the power system has changed',
    ],
    tint: '#ff6b6b',
  },
]

interface HousekeepingItem {
  item: string
  detail: string
}

const housekeepingItems: HousekeepingItem[] = [
  { item: 'Dust Control', detail: 'Open pit mines generate enormous dust. Keep switchgear room sealed. Replace air filters monthly. Positive pressure ventilation recommended to keep dust out. Clean switchgear with dry vacuum (NEVER compressed air — it drives dust into insulation).' },
  { item: 'Moisture Control', detail: 'Space heaters MUST be operational when switchgear is de-energized. Condensation on cold switchgear causes tracking and flashovers. Monitor humidity — maintain below 70% RH. Inspect roof and walls for leaks regularly.' },
  { item: 'Temperature Control', detail: 'Maintain switchgear room temperature between 5C and 40C. Excessive heat reduces current-carrying capacity. Extreme cold can affect lubrication and relay operation. HVAC or portable heating for seasonal extremes.' },
  { item: 'Pest Control', detail: 'Mice, snakes, and insects can cause flashovers and equipment damage. Seal all cable entries. Install pest deterrents. Inspect for nests during monthly rounds, especially in outdoor switchgear.' },
  { item: 'Access Control', detail: 'Switchgear rooms should be locked and access restricted to qualified electrical personnel. Maintain a visitor log. Emergency egress must be unobstructed. Two exits required per code.' },
  { item: 'Lighting', detail: 'Adequate lighting is essential for safe operation and maintenance. Emergency lighting required. Ensure all labels and nameplates are readable. Replace burned-out lamps immediately.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 4: Testing Data                                                */
/* ------------------------------------------------------------------ */

interface TestProcedure {
  name: string
  purpose: string
  equipment: string
  procedure: string[]
  acceptanceCriteria: string
  frequency: string
  tint: string
}

const testProcedures: TestProcedure[] = [
  {
    name: 'Contact Resistance (DLRO)',
    purpose: 'Measures the resistance across the closed breaker contacts. High resistance indicates worn, pitted, or contaminated contacts that will overheat under load.',
    equipment: 'Digital Low Resistance Ohmmeter (DLRO / micro-ohmmeter), 100A DC test current minimum',
    procedure: [
      'Rack breaker to DISCONNECTED or remove from switchgear',
      'Close the breaker (mechanically or electrically)',
      'Connect DLRO leads across each pole (line stab to load stab)',
      'Inject minimum 100A DC and record reading for each pole',
      'Compare readings between poles — should be within 50% of each other',
      'Compare to manufacturer baseline or previous test results',
    ],
    acceptanceCriteria: 'MV vacuum breakers: typically < 50 micro-ohms per pole. LV air breakers: typically < 100 micro-ohms per pole. Any reading > 200% of baseline indicates contact deterioration. All three poles should be within 50% of each other.',
    frequency: 'Annually, or after any fault interruption',
    tint: '#22c55e',
  },
  {
    name: 'Insulation Resistance (Megger)',
    purpose: 'Verifies the integrity of insulation between phases and between phase and ground. Low readings indicate moisture, contamination, or insulation deterioration.',
    equipment: 'Megger insulation resistance tester. MV: 2500V or 5000V DC. LV: 1000V DC.',
    procedure: [
      'Rack breaker out and ensure all circuits are de-energized and isolated',
      'Disconnect surge arresters and other low-impedance devices',
      'Test Phase A to Ground, Phase B to Ground, Phase C to Ground',
      'Test Phase A to B, Phase B to C, Phase A to C',
      'Apply test voltage for 1 minute and record reading',
      'Calculate Polarization Index (PI) = 10-min reading / 1-min reading',
    ],
    acceptanceCriteria: 'MV switchgear: minimum 100 megohms at 1 minute. LV switchgear: minimum 50 megohms. Polarization Index: > 2.0 is good, > 4.0 is excellent. < 1.0 indicates serious deterioration. Readings should be temperature-corrected.',
    frequency: 'Annually',
    tint: '#54a0ff',
  },
  {
    name: 'Primary Injection Test',
    purpose: 'Injects actual current through the breaker and CTs to verify the complete protection chain: CT ratio, relay pickup, relay timing, and breaker trip.',
    equipment: 'Primary injection test set (high-current source), timing equipment, ammeter',
    procedure: [
      'Rack breaker to TEST or CONNECTED position (depending on test plan)',
      'Connect primary injection set through the breaker primary stabs or cable connections',
      'Set relay to a known pickup value (e.g., 51 element at 150% pickup)',
      'Inject current in steps: 100%, 150%, 200%, 300% of pickup',
      'Record actual pickup current and trip time at each level',
      'Verify trip time matches relay time-current curve within tolerance',
      'Verify breaker trips mechanically (contacts open)',
    ],
    acceptanceCriteria: 'Relay pickup within +/- 5% of setting. Trip time within +/- 10% of curve or +/- 1 cycle, whichever is greater. Breaker must open within rated interrupting time.',
    frequency: 'Every 3-5 years, or after relay replacement/setting change',
    tint: '#ffd700',
  },
  {
    name: 'Secondary Injection Test',
    purpose: 'Injects current directly into relay current inputs (secondary side of CTs) to verify relay operation independently of CTs and breaker.',
    equipment: 'Secondary injection test set (e.g., Omicron, Doble, Megger), timing relay',
    procedure: [
      'Rack breaker to TEST position (control wiring connected, primary disconnected)',
      'Disconnect CT secondary leads from relay and connect injection test set',
      'Program test set with relay settings (pickup, time dial, curve type)',
      'Inject currents at multiple points on the time-current curve',
      'Verify pickup current, time delays, and instantaneous trip',
      'Test all enabled protection elements (50, 51, 50G, 51G, etc.)',
      'Reconnect CT leads and verify correct polarity',
    ],
    acceptanceCriteria: 'Pickup within +/- 5% of setting. Timing within +/- 5% or +/- 1 cycle of characteristic curve. Instantaneous element within +/- 10% of setting. All elements must trip the breaker.',
    frequency: 'Annually, or after any relay maintenance or setting change',
    tint: '#ff9f43',
  },
  {
    name: 'Hi-Pot (Dielectric Withstand) Test',
    purpose: 'Applies high voltage to the insulation system to verify it can withstand rated BIL and operating voltages without breakdown.',
    equipment: 'AC or DC hi-pot test set rated for the voltage class',
    procedure: [
      'De-energize, isolate, and ground the switchgear completely',
      'Disconnect surge arresters and any voltage-sensitive equipment',
      'Connect hi-pot set to each phase individually (other phases grounded)',
      'Apply test voltage gradually (not a sudden application)',
      'AC test: apply 75% of rated 1-minute withstand voltage for new equipment',
      'DC test: apply equivalent DC voltage per IEEE/CSA standards',
      'Hold for 1 minute. Monitor leakage current throughout',
      'If leakage current is unstable or rising rapidly, STOP the test',
    ],
    acceptanceCriteria: 'No breakdown or flashover during the test duration. Leakage current should be stable and within manufacturer limits. Any breakdown, flashover, or unstable leakage is a FAILURE.',
    frequency: 'After major overhaul or insulation repair. New installation acceptance. Every 5 years for critical switchgear.',
    tint: '#ff6b6b',
  },
  {
    name: 'Breaker Timing Test',
    purpose: 'Measures the opening and closing time of the circuit breaker mechanism. Verifies the breaker operates within rated speed for proper protection coordination.',
    equipment: 'Breaker timing analyzer, contact resistance timer, or high-speed oscillograph',
    procedure: [
      'Rack breaker to TEST or DISCONNECTED position',
      'Connect timing analyzer across each pole of the breaker',
      'Perform CLOSE operation — record close time for each pole',
      'Perform OPEN (TRIP) operation — record open time for each pole',
      'Perform CLOSE-OPEN (CO) operation — record complete cycle time',
      'Perform OPEN-CLOSE-OPEN (OCO) operation (reclose duty test)',
      'Compare pole-to-pole timing — simultaneous operation is critical',
    ],
    acceptanceCriteria: 'MV vacuum breaker typical: Open 33-50ms (2-3 cycles), Close 50-83ms (3-5 cycles). Pole scatter: all poles within 1/3 cycle (5.5ms at 60Hz) of each other. Deviation from manufacturer spec > 10% requires investigation.',
    frequency: 'Annually, after mechanism maintenance, after any fault interruption',
    tint: '#8b5cf6',
  },
  {
    name: 'Power Factor / Dissipation Factor Test',
    purpose: 'Measures the dielectric losses in insulation, bushings, and capacitors. Rising power factor indicates deteriorating insulation.',
    equipment: 'Power factor test set (e.g., Doble M4100, Megger Delta)',
    procedure: [
      'De-energize, isolate, and ground the switchgear',
      'Test bus support insulators individually',
      'Test bushings (if applicable) — compare nameplate PF to measured',
      'Test cable terminations and stress cones',
      'Perform GST (Grounded Specimen Test) and UST (Ungrounded Specimen Test)',
      'Record test voltage, current, watts loss, and power factor',
      'Temperature-correct all readings to 20C reference',
    ],
    acceptanceCriteria: 'New equipment: typically < 0.5% PF. In-service: < 1.0% is acceptable. > 2.0% requires investigation. Trending upward indicates deterioration even if absolute value is acceptable.',
    frequency: 'Every 3-5 years. Immediately if partial discharge is detected.',
    tint: '#06b6d4',
  },
]

interface ContactResistanceRef {
  breakerType: string
  typical: string
  investigate: string
  replace: string
}

const contactResistanceTable: ContactResistanceRef[] = [
  { breakerType: 'MV Vacuum (5kV, 1200A)', typical: '< 30 micro-ohm', investigate: '30 - 75 micro-ohm', replace: '> 75 micro-ohm' },
  { breakerType: 'MV Vacuum (15kV, 1200A)', typical: '< 50 micro-ohm', investigate: '50 - 100 micro-ohm', replace: '> 100 micro-ohm' },
  { breakerType: 'MV Vacuum (15kV, 2000A)', typical: '< 40 micro-ohm', investigate: '40 - 80 micro-ohm', replace: '> 80 micro-ohm' },
  { breakerType: 'LV Air (800A frame)', typical: '< 75 micro-ohm', investigate: '75 - 150 micro-ohm', replace: '> 150 micro-ohm' },
  { breakerType: 'LV Air (1600A frame)', typical: '< 50 micro-ohm', investigate: '50 - 100 micro-ohm', replace: '> 100 micro-ohm' },
  { breakerType: 'LV Air (3000A frame)', typical: '< 35 micro-ohm', investigate: '35 - 70 micro-ohm', replace: '> 70 micro-ohm' },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Troubleshooting Data                                        */
/* ------------------------------------------------------------------ */

interface TroubleshootItem {
  problem: string
  symptoms: string[]
  diagnostics: string[]
  solutions: string[]
  severity: 'critical' | 'high' | 'medium'
}

const troubleshootItems: TroubleshootItem[] = [
  {
    problem: 'Tripping on Faults (Frequent/Nuisance Trips)',
    symptoms: [
      'Breaker trips repeatedly on overcurrent or ground fault',
      'Relay targets show 50/51 or 50G/51G operation',
      'Downstream equipment loses power unexpectedly',
      'Event recorder shows recurring fault events',
    ],
    diagnostics: [
      'Review relay event log for fault current magnitude and type',
      'Check coordination with downstream devices — miscoordination causes nuisance trips',
      'Megger all downstream cables — insulation breakdown causes intermittent faults',
      'Check for water intrusion in cable terminations (very common in open pit mines)',
      'Inspect trailing cables for physical damage from mobile equipment',
      'Review load growth — are feeders now exceeding original design capacity?',
    ],
    solutions: [
      'Repair or replace damaged cables causing recurring faults',
      'Verify relay settings match coordination study — adjust if system has changed',
      'Install additional cable protection for areas with mobile equipment traffic',
      'Improve drainage around cable routes and junction boxes',
      'Consider relay upgrade if existing relays cannot provide adequate coordination',
      'Add downstream protection to limit fault zone and improve selectivity',
    ],
    severity: 'high',
  },
  {
    problem: 'Failure to Close',
    symptoms: [
      'Close command issued but breaker does not close',
      'No mechanical operation sound when close signal is applied',
      'Close coil energizes but breaker does not move',
      'Spring charged indicator shows springs NOT charged',
    ],
    diagnostics: [
      'Check closing spring status — springs must be charged before closing',
      'Verify close circuit continuity: close coil, auxiliary contacts, anti-pump relay',
      'Check spring charging motor operation — listen for motor running, verify power to motor',
      'Inspect mechanical latching mechanism for binding or damage',
      'Verify all interlocks are satisfied (position, key, ground switch)',
      'Measure close coil voltage — must be within 85-110% of rated voltage',
    ],
    solutions: [
      'If springs not charged: check spring motor, motor supply fuse/breaker, motor control circuit',
      'Replace close coil if open (infinite resistance) or shorted (very low resistance)',
      'Lubricate mechanism per manufacturer specifications if binding',
      'Replace anti-pump relay if it is preventing close operation falsely',
      'Check and reset any tripped interlocks preventing close',
      'If mechanical latching fails, the operating mechanism needs overhaul',
    ],
    severity: 'high',
  },
  {
    problem: 'Slow Operation',
    symptoms: [
      'Breaker timing test shows open or close time exceeds manufacturer specifications',
      'Pole scatter (timing difference between poles) exceeds 1/3 cycle',
      'Visible slow operation when manually tripping breaker',
      'Protection coordination issues (downstream devices clear before this breaker opens)',
    ],
    diagnostics: [
      'Perform breaker timing test — compare to manufacturer specifications',
      'Check operating mechanism lubrication — dried or contaminated lubricant causes drag',
      'Inspect trip and close springs for fatigue or damage',
      'Check dashpot (if equipped) for proper oil level and viscosity',
      'Inspect linkage pins, bushings, and pivot points for wear',
      'Verify adequate trip coil voltage (low voltage = slow trip)',
    ],
    solutions: [
      'Re-lubricate operating mechanism with manufacturer-specified lubricant',
      'Replace worn springs — do not attempt to re-tension old springs',
      'Replace worn linkage components (pins, bushings, rollers)',
      'Adjust dashpot per manufacturer procedures',
      'If trip coil voltage is low, check wiring, fuses, and battery/capacitor trip supply',
      'Full mechanism overhaul if multiple components are worn',
    ],
    severity: 'high',
  },
  {
    problem: 'Overheating',
    symptoms: [
      'Infrared scan shows hot spots on bus connections, cable terminations, or breaker stabs',
      'Discoloration of conductors or insulation near connections',
      'Burning smell in switchgear room',
      'Thermal paint or temperature indicators show excessive heat',
      'Reduced current-carrying capacity or nuisance trips',
    ],
    diagnostics: [
      'Perform detailed IR scan under load — identify exact hot spots',
      'Check all bolted connections for proper torque (loose connections = high resistance)',
      'Measure contact resistance on breaker poles (DLRO test)',
      'Verify bus and cable sizes are adequate for the current being carried',
      'Check for harmonic loading that may cause additional heating',
      'Inspect breaker primary stabs for wear, pitting, or misalignment',
    ],
    solutions: [
      'Re-torque all connections to manufacturer specifications — use calibrated torque wrench',
      'Replace breaker stabs if worn or pitted beyond limits',
      'Clean and coat bus connections with approved joint compound (e.g., Penetrox)',
      'Upgrade bus or cable if load has exceeded original design rating',
      'Install harmonic filters if harmonic content exceeds IEEE 519 limits',
      'In mining: increase ventilation or add cooling to switchgear room if ambient temp is high',
    ],
    severity: 'critical',
  },
  {
    problem: 'Partial Discharge (Corona)',
    symptoms: [
      'Audible buzzing, hissing, or crackling from within switchgear (especially at night or low ambient noise)',
      'Ozone smell (sharp, electrical odour) near switchgear',
      'UV camera shows discharge activity (purple/blue glow)',
      'Online PD monitor shows elevated discharge levels',
      'Pitting or white powder deposits on insulation surfaces',
    ],
    diagnostics: [
      'Perform ultrasonic partial discharge detection (contact or airborne sensor)',
      'Use UV-sensitive camera to locate discharge sites',
      'Perform power factor test on suspect insulators — elevated PF indicates deterioration',
      'Visual inspection for tracking marks (tree-like carbon paths on insulation)',
      'Check for contamination: dust, moisture, salt deposits on insulation surfaces',
      'Review operating voltage — is the equipment being operated above its rated voltage?',
    ],
    solutions: [
      'Clean contaminated insulation surfaces with approved solvent — dry thoroughly',
      'Replace insulators showing tracking, pitting, or mechanical damage',
      'Improve moisture control: repair space heaters, add dehumidifiers, seal enclosure',
      'In open pit mines: install pressurized switchgear rooms with filtered air',
      'Reduce operating voltage if possible (transformer tap change)',
      'If widespread: plan for switchgear replacement — PD indicates end of insulation life',
    ],
    severity: 'critical',
  },
  {
    problem: 'Moisture & Condensation Issues',
    symptoms: [
      'Visible water droplets or condensation on internal surfaces',
      'Rust or corrosion on metal components and bus bars',
      'Low insulation resistance readings (Megger test)',
      'Flashover marks on insulators or bus supports',
      'Space heaters not operating (check first!)',
    ],
    diagnostics: [
      'CHECK SPACE HEATERS IMMEDIATELY — most common cause in mining',
      'Measure humidity inside switchgear with hygrometer',
      'Inspect enclosure for leaks: roof penetrations, cable entries, door seals',
      'Check HVAC or ventilation system operation',
      'Review ambient temperature swings — large daily temp variation causes condensation',
      'Inspect cable entries and conduit seals for water ingress paths',
    ],
    solutions: [
      'Repair or replace space heaters — they must run whenever switchgear is de-energized',
      'Seal all enclosure penetrations with proper rated sealant',
      'Replace door gaskets and weatherstripping',
      'Install dehumidifier in switchgear room if humidity cannot be controlled otherwise',
      'Add additional drainage around switchgear building foundation',
      'For outdoor switchgear: verify NEMA 3R rating integrity, install rain shields over vents',
      'Emergency: if switchgear is wet, do NOT energize until insulation resistance tests pass',
    ],
    severity: 'critical',
  },
  {
    problem: 'Arc Chute Damage',
    symptoms: [
      'Visible cracks, chips, or erosion on arc chute plates',
      'Carbon deposits or soot on arc chute surfaces',
      'Breaker fails to interrupt current on fault — arc re-strikes',
      'Extended arcing time during trip operations',
      'Burning smell after fault interruption',
    ],
    diagnostics: [
      'Remove and visually inspect all arc chute plates (count of plates must match manufacturer spec)',
      'Measure arc chute plate thickness — compare to minimum allowed per manufacturer',
      'Check for cracked or broken ceramic/fiber arc plates',
      'Inspect arc runners and arc contacts for excessive erosion',
      'Review breaker fault interruption count — arc chutes have a finite life',
    ],
    solutions: [
      'Replace arc chute assembly if any plates are cracked, broken, or eroded past limits',
      'Replace COMPLETE set — do not mix old and new arc plates',
      'Clean arc chute housing and inspect for heat damage',
      'If fault interruption count is high, schedule full breaker overhaul',
      'In mining: keep spare arc chute assemblies on site — lead time can be 8-16 weeks',
    ],
    severity: 'high',
  },
  {
    problem: 'Contact Erosion / Wear',
    symptoms: [
      'Elevated contact resistance (DLRO) readings trending upward over time',
      'Visible pitting, cratering, or material transfer on contacts',
      'Contact wear indicator (if equipped) showing replacement needed',
      'Hot spots visible on IR scan at breaker pole connections',
      'Increased power consumption due to resistive losses at contacts',
    ],
    diagnostics: [
      'Perform DLRO test and compare to baseline and previous readings',
      'Visually inspect contacts for pitting depth, material transfer, and remaining material',
      'Check contact spring pressure with manufacturer-specified gauge',
      'Review fault interruption counter — high count accelerates wear',
      'For vacuum breakers: perform vacuum integrity test (hi-pot across open contacts)',
    ],
    solutions: [
      'Replace contacts if DLRO exceeds manufacturer limits or trend shows rapid increase',
      'For vacuum breakers: replace vacuum bottle if vacuum integrity test fails',
      'Always replace contacts as a complete set (all poles)',
      'After contact replacement: verify contact wipe, gap, and spring pressure',
      'Update maintenance baseline with new DLRO readings after replacement',
      'In mining: keep spare contact kits on-site for all critical breakers',
    ],
    severity: 'medium',
  },
]

interface RepairDecision {
  condition: string
  action: string
  reason: string
}

const replaceVsRepairTable: RepairDecision[] = [
  { condition: 'Contact resistance 2x baseline but within manufacturer limits', action: 'REPAIR: Clean or replace contacts', reason: 'Breaker is still serviceable with new contacts' },
  { condition: 'Contact resistance exceeds manufacturer limits', action: 'REPLACE breaker or contacts', reason: 'Operating beyond limits risks overheating and failure to interrupt' },
  { condition: 'Vacuum bottle integrity test fails (vacuum breaker)', action: 'REPLACE vacuum bottle', reason: 'Loss of vacuum means breaker cannot interrupt current safely' },
  { condition: 'Mechanism worn — slow operation but still within timing limits', action: 'REPAIR: Overhaul mechanism', reason: 'Lubrication and component replacement can restore performance' },
  { condition: 'Mechanism worn — timing exceeds limits after overhaul', action: 'REPLACE breaker', reason: 'Worn beyond repair — mechanism cannot be restored to spec' },
  { condition: 'Arc chutes eroded but plates intact', action: 'REPAIR: Replace arc chute plates', reason: 'New plates restore arc interrupting capability' },
  { condition: 'Insulation tracking or PD on bus supports', action: 'REPLACE affected insulators', reason: 'Tracking damage is progressive and cannot be reversed' },
  { condition: 'Breaker exceeds manufacturer fault interruption count', action: 'REPLACE breaker', reason: 'Exceeded designed fault interruption life — internal components are worn' },
  { condition: 'Breaker parts no longer available from manufacturer', action: 'REPLACE breaker (retrofit/upgrade)', reason: 'Obsolete equipment cannot be properly maintained' },
  { condition: 'Multiple systems failing simultaneously', action: 'REPLACE entire switchgear lineup', reason: 'End of equipment life — replacement is more cost-effective than ongoing repairs' },
]

const emergencyProcedures: { scenario: string; actions: string[] }[] = [
  {
    scenario: 'Switchgear Explosion / Arc Flash Event',
    actions: [
      'EVACUATE the area immediately — move all personnel away from the switchgear room',
      'Activate fire alarm if fire is present or suspected',
      'Call emergency services and mine rescue if personnel are injured',
      'Do NOT attempt to operate any switches or breakers in the affected equipment',
      'De-energize from UPSTREAM — open the next upstream breaker or switch at the source substation',
      'Do NOT re-enter until ventilation has cleared smoke and toxic gases (arc flash produces toxic fumes)',
      'Treat all burn victims per first aid protocol — arc flash burns can be severe',
      'Secure the area and preserve evidence for investigation',
      'Do NOT re-energize until a full investigation and inspection is complete',
    ],
  },
  {
    scenario: 'Switchgear Fire (Non-Explosion)',
    actions: [
      'EVACUATE the immediate area',
      'Use CO2 or clean agent fire extinguisher ONLY if safe to do so — NEVER use water on energized equipment',
      'De-energize from upstream if it can be done safely without approaching the fire',
      'Call fire department — inform them of voltage levels present',
      'Ensure switchgear room fire suppression system has activated (if equipped)',
      'Maintain safe approach distance until equipment is confirmed de-energized',
      'After fire is out: do NOT re-energize. Full inspection required by qualified personnel.',
    ],
  },
  {
    scenario: 'Loss of All Switchgear (Total Blackout)',
    actions: [
      'Initiate mine emergency power procedures — activate emergency generators',
      'Ensure critical systems have power: dewatering pumps, mine ventilation, emergency lighting',
      'Account for all personnel in the affected area',
      'Systematically check switchgear status — identify the cause of the blackout',
      'Start restoration from the source: verify incoming power, then energize bus, then feeders',
      'Do NOT rush restoration — verify each breaker can be safely closed before closing',
      'Monitor system closely during restoration for signs of faults or instability',
    ],
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

const tableHeader: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: 0.3, padding: '8px 10px',
  borderBottom: '1px solid var(--divider)', background: 'var(--surface-elevated)',
  textAlign: 'left' as const, whiteSpace: 'nowrap',
}

const tableCell: React.CSSProperties = {
  fontSize: 13, color: 'var(--text)', padding: '8px 10px',
  borderBottom: '1px solid var(--divider)', verticalAlign: 'top',
}

const warningBox: React.CSSProperties = {
  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
  fontSize: 13, color: '#ff6b6b', fontWeight: 600,
}

const miningNote: React.CSSProperties = {
  background: 'rgba(255,159,67,0.10)', border: '1px solid rgba(255,159,67,0.3)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
  fontSize: 13, color: '#ff9f43',
}

/* ------------------------------------------------------------------ */
/*  Collapsible Card                                                   */
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

export default function SwitchgearPage() {
  const [tab, setTab] = useState<TabKey>('types')
  const [expandedType, setExpandedType] = useState<number | null>(0)
  const [expandedTest, setExpandedTest] = useState<number | null>(null)
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(null)

  return (
    <>
      <Header title="Switchgear Reference" />
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
        {/*  TAB 1: Types & Ratings                                       */}
        {/* ============================================================ */}
        {tab === 'types' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionTitle}>Switchgear Types</div>

            {switchgearTypes.map((sg, idx) => (
              <div key={sg.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedType(expandedType === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--text)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedType === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{sg.name}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: '#000',
                    background: sg.tint, padding: '2px 8px', borderRadius: 10,
                  }}>
                    {sg.voltageRange}
                  </span>
                </button>
                {expandedType === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {sg.standard}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                      {sg.description}
                    </div>
                    <div style={subLabel}>Key Features</div>
                    {sg.features.map((f, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'var(--text)', paddingLeft: 12, borderLeft: `2px solid ${sg.tint}`, marginBottom: 4 }}>
                        {f}
                      </div>
                    ))}
                    <div style={miningNote}>
                      <strong>Mining Use:</strong> {sg.miningUse}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Voltage Classes Table */}
            <div style={sectionTitle}>Voltage Classes & Ratings</div>
            <div style={{ ...cardStyle, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Class</th>
                    <th style={tableHeader}>Max Voltage</th>
                    <th style={tableHeader}>BIL</th>
                    <th style={tableHeader}>Interrupting</th>
                    <th style={tableHeader}>Typical Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {voltageClasses.map(vc => (
                    <tr key={vc.kV}>
                      <td style={{ ...tableCell, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{vc.kV}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{vc.maxVoltage}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{vc.bil}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{vc.interruptingRange}</td>
                      <td style={tableCell}>{vc.typicalApps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mine Switchgear Table */}
            <div style={sectionTitle}>Common Switchgear in Open Pit Mines</div>
            <div style={{ ...cardStyle, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Location</th>
                    <th style={tableHeader}>Voltage</th>
                    <th style={tableHeader}>Type</th>
                    <th style={tableHeader}>Rating</th>
                    <th style={tableHeader}>Enclosure</th>
                    <th style={tableHeader}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {mineSwitchgearTable.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCell, fontWeight: 600 }}>{row.location}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)' }}>{row.voltage}</td>
                      <td style={tableCell}>{row.type}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{row.rating}</td>
                      <td style={tableCell}>{row.enclosure}</td>
                      <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key Specifications */}
            <div style={sectionTitle}>Key Switchgear Specifications</div>
            {keySpecs.map(ks => (
              <div key={ks.spec} style={{ ...cardStyle, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{ks.spec}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5 }}>{ks.description}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--primary)', paddingLeft: 10 }}>
                  {ks.importance}
                </div>
              </div>
            ))}

            {/* Indoor vs Outdoor */}
            <div style={sectionTitle}>Indoor vs Outdoor Rated</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ ...cardStyle, padding: 16, borderLeft: '4px solid #22c55e' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Indoor Switchgear</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  Installed in dedicated switchgear rooms or buildings. Climate controlled with HVAC. NEMA 1 or NEMA 12 enclosure rating. Requires weather protection structure. Easier to maintain and inspect. Longer insulation life due to controlled environment.
                </div>
              </div>
              <div style={{ ...cardStyle, padding: 16, borderLeft: '4px solid #54a0ff' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#54a0ff', marginBottom: 8 }}>Outdoor Switchgear</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  NEMA 3R or NEMA 4 enclosure rating. Exposed to weather, dust, temperature extremes. Critical for portable pit substations in open pit mines. Space heaters essential. More frequent maintenance required. UV-resistant insulation and corrosion-resistant hardware.
                </div>
              </div>
            </div>

            <div style={miningNote}>
              <strong>Open Pit Mine Note:</strong> Dust and moisture are the primary enemies of switchgear in open pit mines. Outdoor switchgear in the pit is exposed to haul truck dust, rain, freezing conditions, and extreme temperature swings. Arc-resistant switchgear is strongly recommended for all new installations to protect personnel.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Racking & Operation                                   */}
        {/* ============================================================ */}
        {tab === 'racking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Critical Warning */}
            <div style={warningBox}>
              NEVER rack a circuit breaker under load. The breaker MUST be in the OPEN position before racking in or out. Racking under load can cause an arc flash explosion.
            </div>

            {/* Breaker Positions */}
            <div style={sectionTitle}>Circuit Breaker Positions</div>
            {breakerPositions.map(pos => (
              <div key={pos.name} style={{ ...cardStyle, padding: 16, borderLeft: `4px solid ${pos.tint}` }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: pos.tint, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                  {pos.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 8 }}>
                  {pos.description}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', background: 'var(--surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 8 }}>
                  {pos.connections}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  <strong>Purpose:</strong> {pos.purpose}
                </div>
              </div>
            ))}

            {/* Position Diagram */}
            <div style={{ ...cardStyle, padding: 16 }}>
              <div style={subLabel}>Racking Sequence</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)',
                background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius-sm)',
                lineHeight: 1.6, whiteSpace: 'pre',
              }}>
{`CONNECTED ──> TEST ──> DISCONNECTED
  (in)       (mid)      (out)

  [=====]    [===  ]    [     ]
  Stabs IN   Stabs OUT  Fully OUT
  Ctrl ON    Ctrl ON    Ctrl OFF
  Shutters   Shutters   Shutters
   OPEN       CLOSED     CLOSED`}
              </div>
            </div>

            {/* Racking Out Procedure */}
            <CollapsibleCard title="Racking OUT Procedure (Step-by-Step)" defaultOpen accentColor="#ef4444">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rackingOutSteps.map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: 10 }}>
                    <div style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#000', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {s.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{s.action}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s.detail}</div>
                      {s.warning && (
                        <div style={{ ...warningBox, marginTop: 6, fontSize: 12 }}>{s.warning}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Racking In Procedure */}
            <CollapsibleCard title="Racking IN Procedure (Step-by-Step)" accentColor="#22c55e">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rackingInSteps.map(s => (
                  <div key={s.step} style={{ display: 'flex', gap: 10 }}>
                    <div style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#000', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {s.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{s.action}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s.detail}</div>
                      {s.warning && (
                        <div style={{ ...warningBox, marginTop: 6, fontSize: 12 }}>{s.warning}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleCard>

            {/* Interlock Systems */}
            <div style={sectionTitle}>Interlock Systems</div>
            {interlockSystems.map(il => (
              <div key={il.interlock} style={{ ...cardStyle, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{il.interlock}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 6 }}>{il.purpose}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', background: 'var(--surface-elevated)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                  Result: {il.consequence}
                </div>
              </div>
            ))}

            {/* Safety Rules */}
            <div style={sectionTitle}>Critical Safety Rules</div>
            <div style={cardStyle}>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {safetyRules.map((rule, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      flexShrink: 0, width: 8, height: 8, borderRadius: '50%',
                      background: '#ef4444', marginTop: 5,
                    }} />
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{rule}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={miningNote}>
              <strong>Mining Note:</strong> Never defeat interlocks — they exist for a reason. In the harsh mining environment, interlocks may become stiff or difficult to operate due to dust and corrosion. Lubricate and maintain them, but NEVER bypass them. If an interlock is not functioning correctly, take the equipment out of service until it is repaired.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Maintenance                                           */}
        {/* ============================================================ */}
        {tab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={miningNote}>
              <strong>Space Heaters:</strong> Must be operational whenever switchgear is de-energized. This is the #1 maintenance item for mining switchgear. Moisture condensation causes insulation breakdown, tracking, and flashovers. Check heaters on EVERY visit.
            </div>

            {/* Maintenance Schedule */}
            <div style={sectionTitle}>Preventive Maintenance Schedule</div>
            {maintenanceSchedule.map(mt => (
              <CollapsibleCard key={mt.category} title={`${mt.category} (${mt.frequency})`} accentColor={mt.tint} defaultOpen={mt.frequency === 'Monthly'}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {mt.tasks.map((task, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        flexShrink: 0, width: 20, height: 20, borderRadius: 4,
                        border: `2px solid ${mt.tint}`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: mt.tint,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{task}</div>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            ))}

            {/* IR Thermography */}
            <div style={sectionTitle}>Infrared Thermography</div>
            <div style={{ ...cardStyle, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                IR Scanning Schedule & Guidelines
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Frequency', detail: 'Quarterly in mining environment. Monthly for critical feeders (main incoming, shovel feeds).' },
                  { label: 'Load Condition', detail: 'Scan under normal load (minimum 40% of rated load). Not at startup, not at no-load.' },
                  { label: 'Phase Comparison', detail: 'Compare all three phases. Temperature difference > 10 degrees C between phases indicates a problem.' },
                  { label: 'Hot Spots', detail: '< 10 degrees C above ambient: monitor. 10-30 degrees C above: schedule repair. > 30 degrees C above: immediate action required.' },
                  { label: 'Common Findings', detail: 'Loose connections (highest risk), worn breaker stabs, overloaded conductors, failing insulation.' },
                  { label: 'Documentation', detail: 'Save thermal images with: max temp, load current, ambient temp, date, and equipment ID. Track trends over time.' },
                  { label: 'Baseline', detail: 'Establish baseline scans on new or recently maintained equipment. Compare future scans to baseline.' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: 'var(--primary)', width: 100 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Housekeeping */}
            <div style={sectionTitle}>Switchgear Room Housekeeping</div>
            {housekeepingItems.map(hk => (
              <div key={hk.item} style={{ ...cardStyle, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{hk.item}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{hk.detail}</div>
              </div>
            ))}

            {/* Maintenance Records */}
            <div style={sectionTitle}>Maintenance Records</div>
            <div style={{ ...cardStyle, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                Required Documentation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'Breaker operation counter reading (record at every maintenance visit)',
                  'Contact resistance (DLRO) values — track trend over time',
                  'Insulation resistance (Megger) values — track trend, note temperature',
                  'Relay test results — pickup values, timing, trip test pass/fail',
                  'Infrared scan images with temperature readings and load data',
                  'All maintenance actions performed, parts replaced, and by whom',
                  'Next scheduled maintenance date and required actions',
                  'Any deficiencies found and corrective actions planned',
                  'Arc flash study date and incident energy labels current status',
                  'Breaker fault interruption count (cumulative)',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', marginTop: 6 }} />
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={miningNote}>
              <strong>Mining Note:</strong> Regular IR scanning prevents catastrophic failures. In open pit mine environments, connections loosen faster due to vibration from blasting, temperature cycling, and heavy equipment operation. Quarterly IR scans have prevented more switchgear fires than any other single maintenance practice. Keep spare breakers on-site for critical feeders.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Testing                                               */}
        {/* ============================================================ */}
        {tab === 'testing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={sectionTitle}>Switchgear Tests</div>

            {testProcedures.map((tp, idx) => (
              <div key={tp.name} style={cardStyle}>
                <button
                  onClick={() => setExpandedTest(expandedTest === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--text)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedTest === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{tp.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#000',
                    background: tp.tint, padding: '2px 8px', borderRadius: 10,
                  }}>
                    {tp.frequency}
                  </span>
                </button>
                {expandedTest === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                      <strong>Purpose:</strong> {tp.purpose}
                    </div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', background: 'var(--surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                      Equipment: {tp.equipment}
                    </div>

                    <div style={subLabel}>Procedure</div>
                    {tp.procedure.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{
                          flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                          background: tp.tint, color: '#000', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{step}</div>
                      </div>
                    ))}

                    <div style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>ACCEPTANCE CRITERIA</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{tp.acceptanceCriteria}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Contact Resistance Reference Table */}
            <div style={sectionTitle}>Contact Resistance Reference (DLRO)</div>
            <div style={{ ...cardStyle, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Breaker Type</th>
                    <th style={{ ...tableHeader, color: '#22c55e' }}>Typical (Good)</th>
                    <th style={{ ...tableHeader, color: '#f59e0b' }}>Investigate</th>
                    <th style={{ ...tableHeader, color: '#ef4444' }}>Replace</th>
                  </tr>
                </thead>
                <tbody>
                  {contactResistanceTable.map(cr => (
                    <tr key={cr.breakerType}>
                      <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>{cr.breakerType}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: '#22c55e', fontSize: 12 }}>{cr.typical}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: '#f59e0b', fontSize: 12 }}>{cr.investigate}</td>
                      <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', color: '#ef4444', fontSize: 12 }}>{cr.replace}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Minimum/Maximum Pickup Testing */}
            <div style={sectionTitle}>Pickup Testing Guide</div>
            <div style={{ ...cardStyle, padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { element: '50 — Instantaneous Overcurrent', test: 'Inject current slightly above and below pickup setting. Verify relay picks up above setting and does not pick up below. Tolerance: +/- 10%.', note: 'Set to high value (typically 6-10x CT rating) to coordinate with downstream devices.' },
                  { element: '51 — Time Overcurrent', test: 'Inject at 150%, 200%, 300%, 500% of pickup. Record trip time at each point. Plot on relay TCC curve. Tolerance: +/- 5% pickup, +/- 10% timing.', note: 'Most common protection element. Time dial determines trip speed.' },
                  { element: '50G/51G — Ground Fault', test: 'Inject ground fault current through zero-sequence CT or residual connection. Test pickup and timing same as phase elements.', note: 'Critical for cable protection in mining. Ground faults are the most common fault type.' },
                  { element: '50/51 — Phase Fault', test: 'Test each phase independently. Verify all three phases trip within tolerance of each other. Check that the correct phase is indicated on relay display.', note: 'Phase-to-phase faults are less common but produce highest fault currents.' },
                  { element: '27 — Undervoltage', test: 'Reduce voltage to relay. Verify pickup at setting with correct time delay. Tolerance: +/- 2% of voltage setting.', note: 'Prevents reclosing into a fault. Common on motor feeders.' },
                ].map(item => (
                  <div key={item.element} style={{ borderBottom: '1px solid var(--divider)', paddingBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{item.element}</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, marginBottom: 4 }}>{item.test}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={miningNote}>
              <strong>Mining Note:</strong> Test records must be maintained for regulatory compliance. In Ontario, Ontario Reg. 854 (Mines and Mining Plants) requires that electrical equipment be maintained in safe operating condition. Testing records demonstrate due diligence and are reviewed during mine inspections.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Troubleshooting                                       */}
        {/* ============================================================ */}
        {tab === 'troubleshooting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={warningBox}>
              Always follow LOTO procedures before troubleshooting switchgear. Verify zero energy state before opening any compartments. Arc flash PPE required for all energized work.
            </div>

            <div style={sectionTitle}>Common Problems in Mining</div>

            {troubleshootItems.map((ti, idx) => (
              <div key={ti.problem} style={cardStyle}>
                <button
                  onClick={() => setExpandedTrouble(expandedTrouble === idx ? null : idx)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
                    color: 'var(--text)', background: 'transparent', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink: 0, transform: expandedTrouble === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                  <span style={{ flex: 1 }}>{ti.problem}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#000', padding: '2px 8px', borderRadius: 10,
                    background: ti.severity === 'critical' ? '#ef4444' : ti.severity === 'high' ? '#ff9f43' : '#ffd700',
                  }}>
                    {ti.severity.toUpperCase()}
                  </span>
                </button>
                {expandedTrouble === idx && (
                  <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                    <div style={subLabel}>Symptoms</div>
                    {ti.symptoms.map((s, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'var(--text)', paddingLeft: 12, borderLeft: '2px solid #ef4444', marginBottom: 2 }}>
                        {s}
                      </div>
                    ))}

                    <div style={subLabel}>Diagnostics</div>
                    {ti.diagnostics.map((d, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{
                          flexShrink: 0, width: 20, height: 20, borderRadius: 4,
                          border: '2px solid var(--primary)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{d}</div>
                      </div>
                    ))}

                    <div style={subLabel}>Solutions</div>
                    {ti.solutions.map((s, i) => (
                      <div key={i} style={{ fontSize: 13, color: 'var(--text)', paddingLeft: 12, borderLeft: '2px solid #22c55e', marginBottom: 2, lineHeight: 1.4 }}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Replace vs Repair */}
            <div style={sectionTitle}>Replace vs Repair Decision Guide</div>
            <div style={{ ...cardStyle, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>Condition</th>
                    <th style={tableHeader}>Action</th>
                    <th style={tableHeader}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {replaceVsRepairTable.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCell, fontSize: 12 }}>{row.condition}</td>
                      <td style={{
                        ...tableCell, fontSize: 12, fontWeight: 700,
                        color: row.action.startsWith('REPLACE') ? '#ef4444' : '#22c55e',
                      }}>
                        {row.action}
                      </td>
                      <td style={{ ...tableCell, fontSize: 12, color: 'var(--text-secondary)' }}>{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency Procedures */}
            <div style={sectionTitle}>Emergency Procedures</div>
            {emergencyProcedures.map(ep => (
              <CollapsibleCard key={ep.scenario} title={ep.scenario} accentColor="#ef4444">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ep.actions.map((action, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                        background: i === 0 ? '#ef4444' : 'var(--surface-elevated)',
                        color: i === 0 ? '#fff' : 'var(--text)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, fontWeight: i === 0 ? 700 : 400 }}>
                        {action}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            ))}

            <div style={miningNote}>
              <strong>Mining Note:</strong> Keep spare breakers on-site for all critical feeders. In open pit mines, a failed breaker on a shovel or crusher feeder means production stops. Having a tested spare breaker ready to rack in can reduce downtime from days to hours. Maintain a minimum of one spare for each breaker type and frame size in the mine inventory.
            </div>
          </div>
        )}

      </div>
    </>
  )
}
