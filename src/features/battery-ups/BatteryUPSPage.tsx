import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Battery & UPS Systems – Ontario Electrical Apprentice Reference     */
/*  SparkCalc PWA – comprehensive single-file component                */
/* ------------------------------------------------------------------ */

type TabKey = 'ups' | 'battery' | 'sizing' | 'install' | 'maint'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ups', label: 'UPS Types' },
  { key: 'battery', label: 'Battery Types' },
  { key: 'sizing', label: 'Sizing Calc' },
  { key: 'install', label: 'Install & CEC' },
  { key: 'maint', label: 'Maintenance' },
]

/* ========================== SHARED STYLES ========================= */

const card: React.CSSProperties = {
  background: 'var(--surface)',
  borderRadius: 'var(--radius)',
  padding: 16,
  marginBottom: 14,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--primary)',
  margin: '0 0 10px 0',
}

const subTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text)',
  margin: '12px 0 6px 0',
}

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.55,
  margin: '0 0 8px 0',
}

const mono: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 13,
  color: 'var(--primary)',
}

const diagBox: React.CSSProperties = {
  background: '#12121f',
  borderRadius: 8,
  padding: 12,
  overflowX: 'auto',
  marginBottom: 10,
  border: '1px solid var(--divider)',
}

const diagPre: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 11,
  lineHeight: 1.45,
  color: '#c8c8d8',
  margin: 0,
  whiteSpace: 'pre',
}

const tableWrap: React.CSSProperties = {
  overflowX: 'auto',
  marginBottom: 12,
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--primary)',
  borderBottom: '1px solid var(--divider)',
  whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '7px 10px',
  fontSize: 12,
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--divider)',
  verticalAlign: 'top',
}

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 6,
  background: color + '22',
  color,
  marginRight: 6,
  marginBottom: 4,
})

const prosConsBox = (type: 'pro' | 'con'): React.CSSProperties => ({
  background: type === 'pro' ? '#22c55e12' : '#ef444412',
  borderLeft: `3px solid ${type === 'pro' ? '#22c55e' : '#ef4444'}`,
  borderRadius: '0 8px 8px 0',
  padding: '8px 12px',
  marginBottom: 8,
})

const inputStyle: React.CSSProperties = {
  background: '#12121f',
  border: '1px solid var(--divider)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--text)',
  fontSize: 15,
  fontFamily: 'monospace',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 'var(--touch-min)',
}

const resultBox: React.CSSProperties = {
  background: 'var(--primary)' + '15',
  border: '1px solid var(--primary)',
  borderRadius: 8,
  padding: 14,
  marginBottom: 12,
}

const cecRef: React.CSSProperties = {
  display: 'inline-block',
  background: '#3b82f622',
  color: '#60a5fa',
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 7px',
  borderRadius: 5,
  marginLeft: 4,
}

const warningBox: React.CSSProperties = {
  background: '#f59e0b18',
  border: '1px solid #f59e0b55',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
}

/* ========================== UPS DIAGRAMS ========================== */

const offlineDiagram = `
  AC Input ───┬──────────── Transfer ──────────── Output
              │             Switch                  Load
              │               ↑
              │               │  (switches on
              │               │   power failure)
              └──► Charger ──► Battery ──► Inverter ─┘
                   (trickle)   (standby)   (offline)

  Normal:  AC passes straight through switch to load
  Outage:  Switch flips to inverter (4-12ms transfer)
`

const lineInteractiveDiagram = `
  AC Input ──► AVR ──┬──── Transfer ──────────── Output
              (Auto   │     Switch                  Load
              Voltage  │       ↑
              Reg.)    │       │
                       └► Charger/Inverter ◄── Battery
                         (bi-directional)

  Normal:  AC passes through AVR (bucks/boosts voltage)
  Outage:  Inverter takes over (2-4ms transfer)
           AVR handles sags/swells WITHOUT battery
`

const onlineDiagram = `
  AC Input ──► Rectifier ──► DC Bus ──► Inverter ──► Output
                  │                                   Load
                  │          Battery
                  └──────►  (always
                   Charger   connected    Static
                             to DC bus)   Bypass ──┐
                                                    │
  AC Input ─────────────── Bypass Switch ───────────┘

  Normal:  ALL power converted AC→DC→AC continuously
  Outage:  Battery feeds DC bus – ZERO transfer time
  Bypass:  Static switch for overload / UPS failure
`

/* ====================== UPS COMPARISON DATA ====================== */

interface UPSCompRow {
  feature: string
  offline: string
  lineInt: string
  online: string
}

const upsComparison: UPSCompRow[] = [
  { feature: 'Transfer Time', offline: '4-12 ms', lineInt: '2-4 ms', online: '0 ms' },
  { feature: 'Voltage Regulation', offline: 'None', lineInt: 'AVR (buck/boost)', online: 'Full regeneration' },
  { feature: 'Frequency Regulation', offline: 'None', lineInt: 'None', online: 'Full regulation' },
  { feature: 'Efficiency', offline: '95-98%', lineInt: '94-97%', online: '90-94% (eco: 98%)' },
  { feature: 'Output Waveform', offline: 'Simulated sine or stepped', lineInt: 'Sine wave', online: 'Pure sine wave' },
  { feature: 'Surge Protection', offline: 'Basic', lineInt: 'Good (AVR)', online: 'Excellent (isolated)' },
  { feature: 'Cost (relative)', offline: '$ (lowest)', lineInt: '$$ (moderate)', online: '$$$ (highest)' },
  { feature: 'Heat Output', offline: 'Lowest', lineInt: 'Low', online: 'Highest' },
  { feature: 'Typical Sizes', offline: '0.3-1.5 kVA', lineInt: '0.5-5 kVA', online: '1-500+ kVA' },
  { feature: 'Mining/Industrial Use', offline: 'Rarely', lineInt: 'Office/light PLC', online: 'Critical systems' },
  { feature: 'Harmonic Distortion', offline: 'Passes through', lineInt: 'Passes through', online: 'Generates clean power' },
  { feature: 'Battery Life Impact', offline: 'Longest standby', lineInt: 'Good', online: 'Moderate (constant use)' },
]

/* ====================== BATTERY TYPE DATA ======================== */

interface BatteryCompRow {
  feature: string
  leadAcid: string
  lithium: string
  nicd: string
}

const batteryComparison: BatteryCompRow[] = [
  { feature: 'Voltage per Cell', leadAcid: '2.0 V nominal', lithium: '3.2 V (LFP)', nicd: '1.2 V nominal' },
  { feature: 'Energy Density (Wh/kg)', leadAcid: '30-50', lithium: '90-160', nicd: '40-60' },
  { feature: 'Cycle Life', leadAcid: '200-500 (VRLA)', lithium: '2000-5000+', nicd: '1000-2000' },
  { feature: 'Calendar Life', leadAcid: '3-5 yr (VRLA)', lithium: '10-15 yr', nicd: '15-25 yr' },
  { feature: 'Temp Range (Discharge)', leadAcid: '-20 to 50 C', lithium: '-20 to 60 C', nicd: '-40 to 60 C' },
  { feature: 'Optimal Temp', leadAcid: '20-25 C', lithium: '15-35 C', nicd: '0-45 C' },
  { feature: 'Self-Discharge (%/month)', leadAcid: '3-5%', lithium: '1-3%', nicd: '10-20%' },
  { feature: 'Maintenance', leadAcid: 'Low (VRLA) / Med (flooded)', lithium: 'None (BMS handles)', nicd: 'Low to Medium' },
  { feature: 'Upfront Cost', leadAcid: '$ (lowest)', lithium: '$$$ (highest)', nicd: '$$ (moderate)' },
  { feature: 'Total Cost of Ownership', leadAcid: '$$ (frequent replace)', lithium: '$$ (long life)', nicd: '$$$ (niche)' },
  { feature: 'Recycling', leadAcid: '99% recyclable', lithium: 'Developing programs', nicd: 'Hazardous – special' },
  { feature: 'Weight (relative)', leadAcid: 'Heaviest', lithium: 'Lightest', nicd: 'Heavy' },
  { feature: 'Hydrogen Gas Risk', leadAcid: 'Yes (ventilation req)', lithium: 'No', nicd: 'Yes (less than LA)' },
  { feature: 'Spill Risk', leadAcid: 'Yes (flooded) / No (VRLA)', lithium: 'No', nicd: 'Yes (KOH electrolyte)' },
  { feature: 'CEC Battery Room Req.', leadAcid: 'Full Section 64', lithium: 'Modified requirements', nicd: 'Full Section 64' },
]

/* ====================== STANDARD UPS SIZES ====================== */

interface UPSSize {
  kva: string
  kw: string
  typicalInput: string
  typicalBreaker: string
  batteryV: string
  application: string
}

const standardUPSSizes: UPSSize[] = [
  { kva: '1', kw: '0.8-0.9', typicalInput: '120V/15A 1-ph', typicalBreaker: '15A', batteryV: '24-36', application: 'Single workstation' },
  { kva: '2', kw: '1.6-1.8', typicalInput: '120V/20A 1-ph', typicalBreaker: '20A', batteryV: '48-72', application: 'Small server, PLC rack' },
  { kva: '3', kw: '2.4-2.7', typicalInput: '120V/30A 1-ph', typicalBreaker: '30A', batteryV: '72-96', application: 'Server rack, HMI systems' },
  { kva: '5', kw: '4-4.5', typicalInput: '208V/30A 1-ph', typicalBreaker: '30A', batteryV: '120-192', application: 'Small server room' },
  { kva: '6', kw: '4.8-5.4', typicalInput: '208V/40A 1-ph', typicalBreaker: '40A', batteryV: '192-240', application: 'Network closet' },
  { kva: '10', kw: '8-9', typicalInput: '208V/60A 1-ph', typicalBreaker: '60A', batteryV: '192-240', application: 'Server room, mine comms' },
  { kva: '15', kw: '12-13.5', typicalInput: '208V/3-ph/50A', typicalBreaker: '50A/3P', batteryV: '240-384', application: 'Medium data room' },
  { kva: '20', kw: '16-18', typicalInput: '208V/3-ph/60A', typicalBreaker: '60A/3P', batteryV: '384-480', application: 'Data center row' },
  { kva: '30', kw: '24-27', typicalInput: '208V/3-ph/100A', typicalBreaker: '100A/3P', batteryV: '384-480', application: 'Medium data center' },
  { kva: '40', kw: '32-36', typicalInput: '480V/3-ph/60A', typicalBreaker: '60A/3P', batteryV: '384-480', application: 'Large IT room' },
  { kva: '60', kw: '48-54', typicalInput: '480V/3-ph/80A', typicalBreaker: '80A/3P', batteryV: '480', application: 'Process control center' },
  { kva: '80', kw: '64-72', typicalInput: '480V/3-ph/100A', typicalBreaker: '100A/3P', batteryV: '480', application: 'Large data center' },
  { kva: '100', kw: '80-90', typicalInput: '480V/3-ph/125A', typicalBreaker: '125A/3P', batteryV: '480', application: 'Critical facility' },
  { kva: '150', kw: '120-135', typicalInput: '480V/3-ph/200A', typicalBreaker: '200A/3P', batteryV: '480', application: 'Hospital, mine mill' },
  { kva: '200', kw: '160-180', typicalInput: '480V/3-ph/250A', typicalBreaker: '250A/3P', batteryV: '480', application: 'Large industrial' },
  { kva: '300', kw: '240-270', typicalInput: '480V/3-ph/400A', typicalBreaker: '400A/3P', batteryV: '480', application: 'Campus/plant-wide' },
  { kva: '500', kw: '400-450', typicalInput: '480V/3-ph/600A', typicalBreaker: '600A/3P', batteryV: '480', application: 'Enterprise critical' },
]

/* =================== CEC INSTALLATION DATA ====================== */

interface CECRequirement {
  title: string
  cecRef: string
  details: string[]
}

const cecSection64: CECRequirement[] = [
  {
    title: 'Scope & Application',
    cecRef: 'CEC 64-000',
    details: [
      'Section 64 applies to all stationary battery installations exceeding 48V nominal or having a stored energy capacity of more than 20 kWh.',
      'Applies to installations in dedicated battery rooms and battery enclosures.',
      'Covers lead-acid, nickel-cadmium, lithium-ion, and other rechargeable technologies.',
      'Does not apply to batteries integral to listed equipment (e.g., UPS with internal batteries under 48V) unless they are in a separate battery room.',
    ],
  },
  {
    title: 'Battery Room Requirements',
    cecRef: 'CEC 64-100 to 64-114',
    details: [
      'Battery rooms shall be dedicated to battery equipment and associated chargers/controllers.',
      'Room shall have a self-closing, self-locking door with signage per 64-114.',
      'Floor shall be resistant to electrolyte and rated for the combined weight of all equipment.',
      'Adequate lighting (min 200 lux at working level) with emergency lighting.',
      'Temperature control: maintain 20-25 degrees C for optimal battery life.',
      'Walls and ceiling shall have acid/alkali resistant finish as applicable.',
      'No other utilities (gas, water, steam) shall pass through the battery room unless required for the installation.',
    ],
  },
  {
    title: 'Ventilation Requirements',
    cecRef: 'CEC 64-104',
    details: [
      'Ventilation shall be provided to prevent hydrogen gas accumulation above 1% by volume (25% of LEL of 4%).',
      'Ventilation can be natural or mechanical; mechanical preferred for reliability.',
      'Air exhaust shall be taken from the highest point in the room (hydrogen rises).',
      'Make-up air shall enter at floor level on the opposite side from exhaust.',
      'Ventilation system shall operate continuously or be interlocked with the charger.',
      'Rate: Q = 0.0167 x N x I (m3/min) where N = number of cells, I = charging current in amps.',
      'For sealed (VRLA) batteries, ventilation requirements may be reduced but not eliminated.',
    ],
  },
  {
    title: 'Disconnecting Means',
    cecRef: 'CEC 64-200',
    details: [
      'A disconnecting means shall be provided for each battery string or group.',
      'Disconnect shall be located adjacent to the battery and be lockable in the open position.',
      'Disconnect shall be rated for the maximum battery voltage and available fault current.',
      'For systems over 48V, the disconnect shall be a switch or circuit breaker (not a fuse alone).',
      'Disconnect shall interrupt the ungrounded conductor(s).',
      'Where multiple strings are paralleled, each string shall have its own disconnect.',
    ],
  },
  {
    title: 'Overcurrent Protection',
    cecRef: 'CEC 64-202',
    details: [
      'Overcurrent protection shall be provided in each ungrounded conductor.',
      'Rating shall not exceed the ampacity of the battery conductors.',
      'Must be rated for DC operation and the maximum battery voltage.',
      'Interrupting rating shall meet or exceed the maximum available short-circuit current.',
      'For lead-acid batteries, available fault current can be estimated as: Isc = C/0.01 (where C = Ah capacity).',
      'Class T, Class L, or Class J fuses are commonly used for DC battery protection.',
      'Circuit breakers must be DC rated (AC breakers CANNOT be used on DC circuits).',
    ],
  },
  {
    title: 'Grounding Requirements',
    cecRef: 'CEC 64-300',
    details: [
      'Battery systems over 48V shall have one conductor grounded (typically the negative).',
      'Ground fault detection shall be provided for ungrounded battery systems.',
      'Equipment grounding shall be provided for all battery racks, cabinets, and enclosures.',
      'Bonding conductor size per CEC Table 16 based on overcurrent device rating.',
      'Battery racks shall be bonded to the equipment grounding system.',
      'For two-wire DC systems, the grounded conductor shall be the negative conductor.',
    ],
  },
  {
    title: 'Signage Requirements',
    cecRef: 'CEC 64-114',
    details: [
      'Battery room door: "BATTERY ROOM – AUTHORIZED PERSONNEL ONLY"',
      'Warning signs for: electrical hazard, chemical hazard (acid/alkali), explosive gas (hydrogen)',
      'Emergency procedures shall be posted inside the room.',
      'Location of nearest eyewash station and first aid kit shall be indicated.',
      'Signs shall indicate the nominal voltage and type of batteries.',
      'PPE requirements shall be posted at the entrance.',
      'Signs shall comply with CSA Z321 or ANSI Z535 standards.',
    ],
  },
  {
    title: 'Conductor Sizing',
    cecRef: 'CEC 64-204, Table 17',
    details: [
      'Battery circuit conductors shall be sized per Table 17 for DC ampacity.',
      'Minimum conductor size: 10 AWG for battery circuits.',
      'Temperature rating of conductor insulation must match the ambient temperature in the battery room.',
      'Voltage drop should not exceed 3% from battery terminals to the DC distribution panel.',
      'Use 75 degrees C or 90 degrees C rated conductors (e.g., RW90, RWU90).',
      'Apply correction factors for ambient temperature per Table 5A.',
      'For parallel strings, each conductor shall be sized for the full string current.',
    ],
  },
]

const cecSection46: CECRequirement[] = [
  {
    title: 'Emergency Lighting – Battery Requirements',
    cecRef: 'CEC 46-300 to 46-304',
    details: [
      'Emergency lighting shall be provided in all exit routes, stairwells, and corridors.',
      'Battery-operated emergency lights shall maintain illumination for minimum 30 minutes (60 minutes in some jurisdictions).',
      'Batteries shall be automatically recharged within 24 hours after full discharge.',
      'Unit equipment shall have a test switch and indicator lamp.',
      'Central battery systems shall comply with Section 64 for battery room requirements.',
      'Monthly 30-second functional test and annual 30-minute (or 60-minute) full duration test required.',
      'Self-diagnostic units with automatic testing are now preferred/required in many jurisdictions.',
    ],
  },
]

/* ==================== MAINTENANCE DATA ========================== */

interface MaintenanceTask {
  task: string
  frequency: string
  method: string
  acceptance: string
  action: string
}

const maintenanceTasks: MaintenanceTask[] = [
  {
    task: 'Visual Inspection',
    frequency: 'Monthly',
    method: 'Walk-through inspection of all battery cells, connections, and room conditions',
    acceptance: 'No swelling, leaks, corrosion, cracks, or unusual odors. Room temp 20-25 C.',
    action: 'Document findings. Clean any corrosion with baking soda solution (lead-acid) or water (NiCd).',
  },
  {
    task: 'Float Voltage Check',
    frequency: 'Monthly',
    method: 'Measure float voltage at charger output and across each cell/jar with calibrated DMM',
    acceptance: 'Total float voltage within +/- 1% of setpoint. Individual cells within +/- 0.03 VPC of average.',
    action: 'Investigate any cell deviating more than 0.05V from average. May indicate failing cell.',
  },
  {
    task: 'Electrolyte Level (Flooded)',
    frequency: 'Monthly',
    method: 'Check electrolyte level in each cell. Should be between min and max lines.',
    acceptance: 'All cells within marked range. No cells below minimum.',
    action: 'Add distilled water ONLY. Never add acid. Record water consumption – increasing use = problem.',
  },
  {
    task: 'Specific Gravity (Flooded)',
    frequency: 'Quarterly',
    method: 'Use temperature-corrected hydrometer to measure SG of pilot cells (monthly) and all cells (quarterly)',
    acceptance: 'SG 1.215 +/- 0.010 at 25 C (for most lead-acid). All cells within 0.015 of average.',
    action: 'Low SG = undercharged or failing. High SG = overcharged. Equalize charge if spread exceeds 0.015.',
  },
  {
    task: 'Connection Resistance',
    frequency: 'Quarterly',
    method: 'Measure inter-cell and terminal connection resistance using DLRO (micro-ohmmeter)',
    acceptance: 'Connection resistance should not exceed 20% above baseline. Typically < 100 micro-ohms.',
    action: 'Retorque connections per manufacturer spec. Clean and re-coat with anti-oxidant compound.',
  },
  {
    task: 'Internal Impedance/Conductance',
    frequency: 'Quarterly',
    method: 'Use battery impedance tester (e.g., Megger BITE, Midtronics) on each cell',
    acceptance: 'Impedance within 20% of baseline. Conductance > 80% of baseline.',
    action: 'Cells exceeding 50% above baseline impedance should be flagged for replacement.',
  },
  {
    task: 'Charger Output Verification',
    frequency: 'Quarterly',
    method: 'Verify float voltage, equalize voltage, current limiting, and ripple current',
    acceptance: 'Float: per mfr spec (+/- 1%). Ripple current < 5A per 100Ah. Current limit functional.',
    action: 'Adjust charger settings. Excessive ripple = charger rectifier failure. Causes battery heating.',
  },
  {
    task: 'Load/Discharge Test',
    frequency: 'Annually',
    method: 'Discharge battery at rated load for specified duration. Record voltage vs. time curve.',
    acceptance: 'Battery shall deliver min 80% of rated capacity at rated discharge rate.',
    action: 'Battery below 80% capacity should be replaced. Plan replacement 12-18 months out.',
  },
  {
    task: 'Thermal Scan',
    frequency: 'Annually',
    method: 'IR thermography of all connections, cells, and charger components',
    acceptance: 'No hot spots. Connection temps within 5 C of adjacent bus. No cell > 5 C above ambient.',
    action: 'Hot connections = high resistance. Hot cells = internal short or overcharging.',
  },
  {
    task: 'Seismic Restraint Check',
    frequency: 'Annually',
    method: 'Inspect rack anchoring, cell restraints, and seismic bracing',
    acceptance: 'All fasteners tight, restraints intact, no rack deformation.',
    action: 'Retighten or replace hardware. Verify rack is rated for current battery weight.',
  },
  {
    task: 'Room Ventilation Verification',
    frequency: 'Annually',
    method: 'Measure airflow at exhaust. Verify fan operation. Check hydrogen detector calibration.',
    acceptance: 'Airflow meets calculated requirement. H2 detector alarms at 1% concentration.',
    action: 'Clean or replace fan filters. Recalibrate H2 detector. Verify interlock with charger.',
  },
  {
    task: 'Full Capacity Test',
    frequency: 'Every 5 years (or per mfr)',
    method: 'Full discharge to end voltage at rated current. Record every cell voltage at intervals.',
    acceptance: 'Capacity >= 80% of rated Ah. No cell reversal during discharge.',
    action: 'Replace entire string if capacity < 80%. Individual weak cells indicate string aging.',
  },
]

interface FailureMode {
  symptom: string
  possibleCause: string
  diagnostics: string
  remedy: string
  urgency: string
}

const failureModes: FailureMode[] = [
  {
    symptom: 'Low float voltage on one cell',
    possibleCause: 'Internal short, dried-out cell, sulfation',
    diagnostics: 'Measure impedance, check SG, inspect plates if accessible',
    remedy: 'Replace cell. If VRLA, replace entire battery (matched set).',
    urgency: 'High',
  },
  {
    symptom: 'High float voltage on one cell',
    possibleCause: 'Open cell, high resistance connection, charger imbalance',
    diagnostics: 'Check connection resistance, verify charger mid-point voltage',
    remedy: 'Retorque connections. If cell open, replace immediately.',
    urgency: 'High',
  },
  {
    symptom: 'Battery not holding charge',
    possibleCause: 'Sulfation, end of life, charger failure, excessive load',
    diagnostics: 'Load test, impedance test, verify charger output',
    remedy: 'Equalize charge (flooded). Replace if capacity < 80%.',
    urgency: 'High',
  },
  {
    symptom: 'Excessive water consumption (flooded)',
    possibleCause: 'Overcharging, high ambient temp, cracked case',
    diagnostics: 'Verify float voltage, check room temp, inspect cases',
    remedy: 'Adjust charger. Lower room temp. Replace cracked cells.',
    urgency: 'Medium',
  },
  {
    symptom: 'Swollen or bulging case (VRLA)',
    possibleCause: 'Thermal runaway, overcharging, internal short',
    diagnostics: 'Measure cell temp and voltage. DISCONNECT if hot.',
    remedy: 'Replace immediately. Investigate charger for overvoltage.',
    urgency: 'CRITICAL',
  },
  {
    symptom: 'Hydrogen alarm in battery room',
    possibleCause: 'Ventilation failure, overcharging, rapid charging',
    diagnostics: 'Check vent fan operation, charger output, room temp',
    remedy: 'Evacuate if > 2%. Restore ventilation. Reduce charge rate.',
    urgency: 'CRITICAL',
  },
  {
    symptom: 'Corrosion at terminals',
    possibleCause: 'Electrolyte mist, overfilling, seal failure',
    diagnostics: 'Inspect vent caps, post seals, electrolyte levels',
    remedy: 'Clean with baking soda, retorque, apply anti-oxidant.',
    urgency: 'Medium',
  },
  {
    symptom: 'Ground fault alarm',
    possibleCause: 'Electrolyte on rack, damaged insulation, condensation',
    diagnostics: 'Measure insulation resistance. Divide and conquer to isolate.',
    remedy: 'Clean contamination. Repair insulation. Check for leaks.',
    urgency: 'High',
  },
  {
    symptom: 'UPS on battery with mains present',
    possibleCause: 'Input breaker trip, contactor failure, voltage out of window',
    diagnostics: 'Check input voltage, breaker status, UPS input parameters',
    remedy: 'Reset breaker, adjust input voltage window, check wiring.',
    urgency: 'High',
  },
  {
    symptom: 'Short backup time (less than expected)',
    possibleCause: 'Battery aging, load higher than sized, high temperature',
    diagnostics: 'Load test, verify actual load vs. design, check temps',
    remedy: 'Replace batteries. Reduce non-critical load. Improve cooling.',
    urgency: 'High',
  },
]

const safetyPrecautions = [
  {
    category: 'PPE Requirements',
    items: [
      'Safety glasses with splash guards (minimum ANSI Z87.1 rated)',
      'Face shield when working above battery cells or making/breaking connections',
      'Chemical-resistant gloves (neoprene or nitrile – NOT leather)',
      'Chemical-resistant apron (lead-acid: acid resistant; NiCd: alkali resistant)',
      'Steel-toe boots with non-slip, chemical-resistant soles',
      'Remove all metal jewelry, watches, rings before working on batteries',
      'Use insulated tools rated for the maximum system voltage',
    ],
  },
  {
    category: 'Hydrogen Safety',
    items: [
      'Hydrogen is lighter than air and accumulates at ceiling level',
      'LEL of hydrogen is 4% by volume in air – explosive above this',
      'Battery rooms must keep H2 below 1% (25% of LEL) per CEC',
      'No open flames, sparks, or smoking within 3m of batteries',
      'Use non-sparking tools (bronze, brass, or plastic) near vented cells',
      'Verify ventilation is operating BEFORE entering battery room',
      'Allow 15 minutes of ventilation after charging before performing work',
    ],
  },
  {
    category: 'Acid/Alkali Handling',
    items: [
      'Lead-acid electrolyte is sulfuric acid (H2SO4) – pH < 1, severe burns',
      'NiCd electrolyte is potassium hydroxide (KOH) – pH > 13, severe burns',
      'Eyewash station must be within 3m (10 ft) of battery area',
      'Emergency shower must be within 15m (50 ft) of battery area',
      'Neutralizer on hand: baking soda for acid, vinegar for alkali',
      'Flush acid/alkali exposure with water for minimum 15 minutes',
      'WHMIS SDS sheets for all electrolytes must be available in room',
    ],
  },
  {
    category: 'Electrical Safety',
    items: [
      'Battery strings can deliver thousands of amps of fault current',
      'DC arcs do NOT self-extinguish (no zero-crossing like AC)',
      'Always verify LOTO before working on battery systems',
      'Use one-hand rule when measuring – keep other hand behind back',
      'Cover exposed terminals with insulating blankets when adjacent cells are energized',
      'Torque all connections per manufacturer spec – under-torque causes arcing, over-torque damages posts',
      'Never lay tools or metal objects on top of batteries',
    ],
  },
]

/* ================================================================ */
/*  MAIN COMPONENT                                                    */
/* ================================================================ */

export default function BatteryUPSPage() {
  const nav = useNavigate()
  const [tab, setTab] = useState<TabKey>('ups')

  /* ---------- Sizing Calculator State ---------- */
  const [loadKVA, setLoadKVA] = useState(10)
  const [powerFactor, setPowerFactor] = useState(0.8)
  const [backupMin, setBackupMin] = useState(15)
  const [batteryVoltage, setBatteryVoltage] = useState(192)
  const [inverterEff, setInverterEff] = useState(0.92)
  const [ambientTemp, setAmbientTemp] = useState(25)
  const [agingFactor] = useState(1.25)

  /* ---------- Ventilation Calculator State ---------- */
  const [numCells, setNumCells] = useState(24)
  const [chargeCurrent, setChargeCurrent] = useState(50)

  /* ---------- DC Cable Sizing State ---------- */
  const [dcAmps, setDcAmps] = useState(100)
  const [dcLength, setDcLength] = useState(15)
  const [dcVoltage, setDcVoltage] = useState(48)
  const [maxDropPct] = useState(3)

  /* ---------- Collapsible sections ---------- */
  const [expandedUPS, setExpandedUPS] = useState<string | null>('offline')
  const [expandedBatt, setExpandedBatt] = useState<string | null>('lead-acid')
  const [expandedCEC, setExpandedCEC] = useState<string | null>(null)
  const [expandedMaint, setExpandedMaint] = useState<string | null>(null)
  const [expandedSafety, setExpandedSafety] = useState<string | null>(null)

  /* ============== SIZING CALCULATIONS ============== */

  const loadKW = loadKVA * powerFactor
  const loadWatts = loadKW * 1000
  const backupHours = backupMin / 60

  // Temperature derating factor (every 8C above 25C reduces capacity ~10%)
  const tempDerate = ambientTemp <= 25 ? 1.0 : 1 / (1 - ((ambientTemp - 25) / 8) * 0.10)

  // Required Wh from battery bank (accounting for inverter efficiency)
  const requiredWh = (loadWatts * backupHours) / inverterEff

  // Required Ah (at nominal battery voltage)
  const rawAh = requiredWh / batteryVoltage

  // Apply aging factor and temperature derating
  const designAh = rawAh * agingFactor * tempDerate

  // Number of cells (assuming lead-acid 2V cells)
  const cellsPerString = Math.round(batteryVoltage / 2)

  // Parallel strings (based on common battery sizes)
  const standardAhSizes = [50, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500]
  let selectedAh = standardAhSizes[standardAhSizes.length - 1]
  let numStrings = 1
  for (const sz of standardAhSizes) {
    const strings = Math.ceil(designAh / sz)
    if (strings * sz >= designAh) {
      selectedAh = sz
      numStrings = strings
      break
    }
  }

  const totalAh = selectedAh * numStrings
  const totalBatteries = cellsPerString * numStrings

  // Estimated runtime with selected batteries
  const actualWh = totalAh * batteryVoltage
  const actualRunMin = (actualWh * inverterEff) / loadWatts * 60

  // DC current at full load
  const dcFullLoad = loadWatts / (batteryVoltage * inverterEff)

  /* ============== VENTILATION CALCULATION ============== */
  // Q = 0.0167 x N x I (m3/min) per CEC 64-104
  const ventFlow = 0.0167 * numCells * chargeCurrent // L/min of hydrogen generated
  // Dilute to below 1% H2: need 100x the H2 volume
  const ventCFM = (ventFlow * 100) / 28.317 // convert L/min to CFM (1 CFM = 28.317 L/min)
  const ventM3Min = ventFlow * 100 / 1000

  /* ============== DC CABLE CALCULATION ============== */
  // V_drop = 2 * L * I * R_per_m (factor of 2 for + and - conductors)
  const maxDropVolts = dcVoltage * (maxDropPct / 100)
  const maxResistancePerM = maxDropVolts / (2 * dcLength * dcAmps)

  // AWG copper resistances at 75C (ohms per meter, approximate)
  const cableSizes = [
    { awg: '14', area: 2.08, rPerM: 0.00884, ampacity: 15 },
    { awg: '12', area: 3.31, rPerM: 0.00556, ampacity: 20 },
    { awg: '10', area: 5.26, rPerM: 0.00351, ampacity: 30 },
    { awg: '8', area: 8.37, rPerM: 0.00221, ampacity: 40 },
    { awg: '6', area: 13.3, rPerM: 0.00139, ampacity: 55 },
    { awg: '4', area: 21.2, rPerM: 0.000874, ampacity: 70 },
    { awg: '3', area: 26.7, rPerM: 0.000693, ampacity: 85 },
    { awg: '2', area: 33.6, rPerM: 0.000551, ampacity: 95 },
    { awg: '1', area: 42.4, rPerM: 0.000437, ampacity: 110 },
    { awg: '1/0', area: 53.5, rPerM: 0.000346, ampacity: 125 },
    { awg: '2/0', area: 67.4, rPerM: 0.000275, ampacity: 145 },
    { awg: '3/0', area: 85.0, rPerM: 0.000218, ampacity: 165 },
    { awg: '4/0', area: 107, rPerM: 0.000173, ampacity: 195 },
    { awg: '250', area: 127, rPerM: 0.000146, ampacity: 215 },
    { awg: '300', area: 152, rPerM: 0.000122, ampacity: 240 },
    { awg: '350', area: 177, rPerM: 0.000105, ampacity: 260 },
    { awg: '500', area: 253, rPerM: 0.0000735, ampacity: 320 },
  ]

  // Find minimum cable size for voltage drop
  const dropSized = cableSizes.find(c => c.rPerM <= maxResistancePerM)
  // Find minimum cable size for ampacity
  const ampSized = cableSizes.find(c => c.ampacity >= dcAmps)
  // Pick the larger of the two
  let recommendedCable = cableSizes[cableSizes.length - 1]
  if (dropSized && ampSized) {
    const dropIdx = cableSizes.indexOf(dropSized)
    const ampIdx = cableSizes.indexOf(ampSized)
    recommendedCable = cableSizes[Math.max(dropIdx, ampIdx)]
  } else if (dropSized) {
    recommendedCable = dropSized
  } else if (ampSized) {
    recommendedCable = ampSized
  }
  const actualDrop = 2 * dcLength * dcAmps * recommendedCable.rPerM
  const actualDropPct = (actualDrop / dcVoltage) * 100

  /* ================================================================ */
  /*  RENDER HELPERS                                                    */
  /* ================================================================ */

  const renderInputRow = (
    label: string,
    value: number,
    setter: (v: number) => void,
    unit: string,
    min?: number,
    max?: number,
    step?: number
  ) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          value={value}
          onChange={e => setter(Number(e.target.value))}
          min={min}
          max={max}
          step={step || 1}
          style={{ ...inputStyle, flex: 1 }}
        />
        <span style={{ ...mono, minWidth: 36 }}>{unit}</span>
      </div>
    </div>
  )

  const renderCollapsible = (
    id: string,
    title: string,
    expanded: string | null,
    setExpanded: (v: string | null) => void,
    color: string,
    children: React.ReactNode
  ) => (
    <div style={{ ...card, borderLeft: `3px solid ${color}` }}>
      <button
        onClick={() => setExpanded(expanded === id ? null : id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text)',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '4px 0',
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 'var(--touch-min)',
        }}
      >
        <span>{title}</span>
        <span style={{ color: 'var(--primary)', fontSize: 18, transition: 'transform 0.2s', transform: expanded === id ? 'rotate(90deg)' : 'none' }}>
          {'>'}
        </span>
      </button>
      {expanded === id && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  )

  /* ================================================================ */
  /*  TAB 1: UPS TYPES                                                 */
  /* ================================================================ */

  const renderUPSTypes = () => (
    <div style={{ padding: '12px 16px' }}>
      <p style={bodyText}>
        Uninterruptible Power Supplies protect critical loads from power disturbances.
        Understanding the three main topologies is essential for selecting the right UPS
        for industrial and mining applications.
      </p>

      {/* --- Offline/Standby --- */}
      {renderCollapsible('offline', 'Offline / Standby UPS', expandedUPS, setExpandedUPS, '#3b82f6', (
        <>
          <p style={bodyText}>
            The simplest and most economical UPS type. Under normal conditions, the load is
            powered directly from the utility. The inverter only activates when mains power
            fails, resulting in a brief transfer time.
          </p>
          <div style={diagBox}><pre style={diagPre}>{offlineDiagram}</pre></div>

          <p style={subTitle}>How It Works</p>
          <p style={bodyText}>
            The transfer switch normally routes utility power directly to the load. A small
            charger keeps the battery topped up. When mains fail, the switch transfers the
            load to the inverter. This mechanical or electronic transfer takes 4-12 ms.
          </p>

          <p style={subTitle}>Transfer Time: <span style={mono}>4-12 ms</span></p>
          <p style={bodyText}>
            Most modern computer PSUs and electronic equipment can ride through 10-20 ms
            interruptions using their internal capacitors. However, sensitive PLCs, VFDs,
            and process controllers may not tolerate this gap.
          </p>

          <div style={prosConsBox('pro')}>
            <p style={{ ...bodyText, color: '#22c55e', fontWeight: 600, margin: '0 0 4px 0' }}>Advantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>Lowest cost UPS topology</li>
              <li>Highest efficiency (95-98%) – least heat output</li>
              <li>Simple design – fewer components to fail</li>
              <li>Longest battery life (battery only used during outage)</li>
              <li>Compact and lightweight</li>
            </ul>
          </div>
          <div style={prosConsBox('con')}>
            <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: '0 0 4px 0' }}>Disadvantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>4-12 ms transfer time – not suitable for critical loads</li>
              <li>No voltage regulation – load sees all sags/swells</li>
              <li>No frequency regulation</li>
              <li>Output waveform may be simulated (stepped) sine wave</li>
              <li>No protection from surges or noise</li>
              <li>Limited to small sizes (typically up to 1.5 kVA)</li>
            </ul>
          </div>

          <p style={subTitle}>Typical Applications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Home desktop computers and modems</li>
            <li>Non-critical office equipment</li>
            <li>Point-of-sale terminals</li>
            <li>Basic network switches (not suitable for managed switches)</li>
          </ul>

          <div style={warningBox}>
            <p style={{ ...bodyText, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px 0' }}>
              Industrial/Mining Note
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              Offline UPS units are NOT recommended for industrial or mining environments.
              The transfer time can cause PLC faults, VFD DC bus trips, and process interruptions.
              Voltage and frequency regulation is essential in mining where power quality is often poor.
            </p>
          </div>
        </>
      ))}

      {/* --- Line-Interactive --- */}
      {renderCollapsible('line-interactive', 'Line-Interactive UPS', expandedUPS, setExpandedUPS, '#22c55e', (
        <>
          <p style={bodyText}>
            The most popular topology for small to medium applications. Adds an autotransformer
            (AVR) that regulates voltage without using the battery, providing superior power
            conditioning compared to offline units.
          </p>
          <div style={diagBox}><pre style={diagPre}>{lineInteractiveDiagram}</pre></div>

          <p style={subTitle}>Auto Voltage Regulation (AVR)</p>
          <p style={bodyText}>
            The AVR uses transformer tap switching to boost or buck the voltage. When input
            voltage sags (brownout), the AVR boosts it back to nominal. When voltage surges,
            the AVR bucks it down. This happens WITHOUT using the battery, extending battery
            life significantly in areas with poor power quality.
          </p>
          <p style={bodyText}>
            Typical AVR range: +/- 12-25% correction without battery. Some models provide up
            to +/- 30% regulation. Below the AVR range, the unit switches to battery.
          </p>

          <p style={subTitle}>Transfer Time: <span style={mono}>2-4 ms</span></p>
          <p style={bodyText}>
            Faster transfer than offline because the charger/inverter is bi-directional and
            already connected to the battery. The inverter can start producing power almost
            immediately. Most electronic loads tolerate this brief interruption.
          </p>

          <div style={prosConsBox('pro')}>
            <p style={{ ...bodyText, color: '#22c55e', fontWeight: 600, margin: '0 0 4px 0' }}>Advantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>AVR handles voltage sags/swells without battery use</li>
              <li>Good efficiency (94-97%)</li>
              <li>Faster transfer time (2-4 ms) than offline</li>
              <li>True sine wave output (most models)</li>
              <li>Good balance of cost and performance</li>
              <li>Available in sizes from 0.5-5 kVA</li>
              <li>Extended battery life due to AVR reducing battery cycling</li>
            </ul>
          </div>
          <div style={prosConsBox('con')}>
            <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: '0 0 4px 0' }}>Disadvantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>Still has 2-4 ms transfer time</li>
              <li>No frequency regulation</li>
              <li>Load still exposed to some power anomalies</li>
              <li>Limited to smaller sizes (typically up to 5 kVA)</li>
              <li>Not suitable for the most critical loads</li>
            </ul>
          </div>

          <p style={subTitle}>Typical Applications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Small server racks and network equipment</li>
            <li>PLC cabinets in non-critical processes</li>
            <li>Office IT infrastructure</li>
            <li>HMI workstations</li>
            <li>Mine surface communication equipment</li>
          </ul>

          <div style={warningBox}>
            <p style={{ ...bodyText, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px 0' }}>
              Industrial/Mining Note
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              Line-interactive UPS units are suitable for non-critical industrial equipment where
              a 2-4 ms transfer is acceptable. The AVR feature is particularly valuable in mining
              environments where supply voltage can vary widely due to long feeders and heavy
              intermittent loads. Not recommended for process-critical systems.
            </p>
          </div>
        </>
      ))}

      {/* --- Online/Double-Conversion --- */}
      {renderCollapsible('online', 'Online / Double-Conversion UPS', expandedUPS, setExpandedUPS, '#8b5cf6', (
        <>
          <p style={bodyText}>
            The gold standard for critical power protection. ALL power is continuously converted
            from AC to DC to AC, completely isolating the load from the utility supply. The battery
            is always connected to the DC bus, providing zero transfer time.
          </p>
          <div style={diagBox}><pre style={diagPre}>{onlineDiagram}</pre></div>

          <p style={subTitle}>How It Works</p>
          <p style={bodyText}>
            Incoming AC is rectified to DC, which charges the battery and feeds the inverter.
            The inverter generates a clean, regulated AC output. Because the battery is always
            connected to the DC bus, there is truly zero transfer time – the battery simply
            picks up the DC bus load when rectifier input is lost.
          </p>

          <p style={subTitle}>Transfer Time: <span style={mono}>0 ms</span></p>
          <p style={bodyText}>
            There is no transfer at all. The battery is already connected to the DC bus and
            begins discharging the instant the rectifier output drops. The inverter continues
            producing output with zero interruption. The static bypass switch only activates
            for overload conditions or UPS internal failure.
          </p>

          <p style={subTitle}>Static Bypass</p>
          <p style={bodyText}>
            An electronic (SCR-based) switch that can instantly route utility power directly to
            the load, bypassing the inverter. Activates automatically during:
          </p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Sustained overload beyond UPS rating</li>
            <li>Internal UPS fault or inverter failure</li>
            <li>Manual maintenance bypass activated</li>
            <li>Inrush current events (e.g., motor starting)</li>
          </ul>

          <p style={subTitle}>Eco Mode</p>
          <p style={bodyText}>
            Many online UPS units offer an "eco mode" where the unit operates like a
            line-interactive UPS during normal conditions (efficiency up to 98%). The unit
            switches to full double-conversion when power anomalies are detected. Trade-off:
            higher efficiency vs. 2-4 ms transfer time in eco mode.
          </p>

          <div style={prosConsBox('pro')}>
            <p style={{ ...bodyText, color: '#22c55e', fontWeight: 600, margin: '0 0 4px 0' }}>Advantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>Zero transfer time – truly uninterruptible</li>
              <li>Complete isolation from utility power anomalies</li>
              <li>Full voltage AND frequency regulation</li>
              <li>Pure sine wave output at all times</li>
              <li>Excellent surge and noise protection</li>
              <li>Available from 1 kVA to 500+ kVA</li>
              <li>Scalable – parallel units for redundancy (N+1)</li>
              <li>Compatible with generators (frequency regulation)</li>
            </ul>
          </div>
          <div style={prosConsBox('con')}>
            <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: '0 0 4px 0' }}>Disadvantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>Highest cost (2-3x line-interactive for same kVA)</li>
              <li>Lower efficiency (90-94%) due to double conversion</li>
              <li>More heat output – requires more cooling</li>
              <li>Larger physical footprint and weight</li>
              <li>More complex – more components that can fail</li>
              <li>Generates input harmonics (mitigated with active front end)</li>
              <li>Battery may see more stress (continuous DC bus connection)</li>
            </ul>
          </div>

          <p style={subTitle}>Typical Industrial/Mining Applications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Process control servers and DCS/SCADA systems</li>
            <li>Safety-critical PLC systems (fire, gas detection, ventilation)</li>
            <li>Underground communication infrastructure (leaky feeder, WiFi)</li>
            <li>Mine shaft signaling and hoist control systems</li>
            <li>Data centers and server rooms</li>
            <li>Medical imaging and life-safety equipment</li>
            <li>Assay lab analytical instruments</li>
            <li>Emergency lighting central battery systems</li>
          </ul>
        </>
      ))}

      {/* --- Comparison Table --- */}
      <div style={card}>
        <p style={sectionTitle}>UPS Topology Comparison</p>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={th}>Feature</th>
                <th style={{ ...th, color: '#3b82f6' }}>Offline</th>
                <th style={{ ...th, color: '#22c55e' }}>Line-Interactive</th>
                <th style={{ ...th, color: '#8b5cf6' }}>Online</th>
              </tr>
            </thead>
            <tbody>
              {upsComparison.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row.feature}</td>
                  <td style={td}>{row.offline}</td>
                  <td style={td}>{row.lineInt}</td>
                  <td style={td}>{row.online}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- When to Use Each --- */}
      <div style={card}>
        <p style={sectionTitle}>Selection Guide for Industrial/Mining</p>

        <div style={{ ...prosConsBox('pro'), borderLeftColor: '#8b5cf6' }}>
          <p style={{ ...bodyText, color: '#8b5cf6', fontWeight: 600, margin: '0 0 4px 0' }}>
            Always Use Online/Double-Conversion For:
          </p>
          <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
            <li>Any safety-critical system (fire alarm, gas detection, emergency comms)</li>
            <li>Process control (DCS, SCADA, critical PLCs)</li>
            <li>Systems fed by generators (frequency regulation needed)</li>
            <li>Any load where a brief outage causes production loss</li>
            <li>Loads sensitive to voltage/frequency variation</li>
            <li>Parallel/redundant (N+1) applications</li>
          </ul>
        </div>

        <div style={{ ...prosConsBox('pro'), borderLeftColor: '#22c55e' }}>
          <p style={{ ...bodyText, color: '#22c55e', fontWeight: 600, margin: '0 0 4px 0' }}>
            Line-Interactive Acceptable For:
          </p>
          <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
            <li>Non-critical HMI and operator workstations</li>
            <li>Office IT equipment in industrial settings</li>
            <li>Network switches for non-safety communication</li>
            <li>Small PLC systems where 2-4 ms transfer is tolerable</li>
          </ul>
        </div>

        <div style={{ ...prosConsBox('con'), borderLeftColor: '#ef4444' }}>
          <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: '0 0 4px 0' }}>
            Avoid Offline/Standby For:
          </p>
          <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
            <li>All industrial and mining applications</li>
            <li>Any application where a 10 ms transfer causes problems</li>
            <li>Sites with poor power quality (voltage sags, surges)</li>
          </ul>
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  TAB 2: BATTERY TYPES                                             */
  /* ================================================================ */

  const renderBatteryTypes = () => (
    <div style={{ padding: '12px 16px' }}>
      <p style={bodyText}>
        Battery selection significantly impacts UPS reliability, maintenance requirements,
        and total cost of ownership. Understanding the characteristics of each battery
        technology is critical for proper system design and maintenance.
      </p>

      {/* --- Lead-Acid --- */}
      {renderCollapsible('lead-acid', 'Lead-Acid (VRLA & Flooded)', expandedBatt, setExpandedBatt, '#3b82f6', (
        <>
          <p style={bodyText}>
            Lead-acid remains the most common battery technology for UPS systems due to low upfront
            cost and well-understood characteristics. Two main categories: flooded (vented) and
            VRLA (Valve Regulated Lead-Acid), also called "sealed."
          </p>

          <p style={subTitle}>VRLA – AGM (Absorbed Glass Mat)</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Electrolyte absorbed in fiberglass mat separators</li>
            <li>Most common for UPS applications (90%+ of installations)</li>
            <li>Nominal voltage: <span style={mono}>2.0 V</span> per cell</li>
            <li>Float voltage: <span style={mono}>2.25-2.30 VPC</span> at 25 degrees C</li>
            <li>Equalize voltage: Not recommended for most VRLA AGM</li>
            <li>Typical life: 3-5 years (standard) or 8-12 years (front-terminal/long-life)</li>
            <li>No electrolyte maintenance – truly sealed</li>
            <li>Can be mounted in any orientation (except inverted)</li>
            <li>Lower gas emission than flooded – but ventilation still required per CEC</li>
          </ul>

          <p style={subTitle}>VRLA – Gel</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Electrolyte is a silica-based gel (thixotropic)</li>
            <li>Better deep-cycle performance than AGM</li>
            <li>More tolerant of high temperatures</li>
            <li>Lower charge acceptance – requires lower float voltage (<span style={mono}>2.20-2.25 VPC</span>)</li>
            <li>More expensive than AGM</li>
            <li>Preferred for applications with frequent cycling (solar, telecom)</li>
            <li>Less common in UPS (AGM dominates)</li>
          </ul>

          <p style={subTitle}>Flooded (Vented) Lead-Acid</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Liquid sulfuric acid electrolyte – requires regular watering</li>
            <li>Available in much larger capacities (up to 4000+ Ah)</li>
            <li>Longer life: 15-25 years with proper maintenance</li>
            <li>Float voltage: <span style={mono}>2.17-2.25 VPC</span></li>
            <li>Equalize voltage: <span style={mono}>2.33-2.40 VPC</span> (periodic)</li>
            <li>Must be installed upright – risk of electrolyte spillage</li>
            <li>Generates more hydrogen – requires robust ventilation per CEC Section 64</li>
            <li>Requires dedicated battery room with spill containment</li>
            <li>Specific gravity testing needed (SG ~1.215 at full charge)</li>
          </ul>

          <p style={subTitle}>Charging Profiles</p>
          <div style={diagBox}>
            <pre style={diagPre}>{`  Charging Stages for Lead-Acid Batteries:

  Stage 1: BULK (Constant Current)
  ├── Charger delivers max current (typically C/10)
  ├── Voltage rises steadily
  └── Until voltage reaches absorption setpoint

  Stage 2: ABSORPTION (Constant Voltage)
  ├── Charger holds voltage at absorption setpoint
  ├── Current tapers as battery accepts charge
  └── Until current drops to ~C/100 or timer expires

  Stage 3: FLOAT (Constant Voltage – lower)
  ├── Voltage reduced to float setpoint (2.25 VPC)
  ├── Small trickle current maintains full charge
  └── Continues indefinitely during normal standby

  Stage 4: EQUALIZE (Periodic – flooded only)
  ├── Voltage raised to 2.33-2.40 VPC
  ├── Stirs electrolyte, reduces sulfation
  ├── Duration: 8-12 hours
  └── Quarterly or when SG spread > 0.015`}</pre>
          </div>

          <p style={subTitle}>Temperature Effects on Lead-Acid</p>
          <div style={warningBox}>
            <p style={{ ...bodyText, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px 0' }}>
              Critical: Temperature Directly Affects Battery Life
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              For every 8-10 degrees C above 25 degrees C, battery life is reduced by approximately
              50%. A battery rated for 5 years at 25 degrees C will last only 2.5 years at 33 degrees C
              and approximately 15 months at 41 degrees C. Temperature-compensated charging is
              essential (reduce float voltage by 3-5 mV per cell per degree C above 25 degrees C).
            </p>
          </div>
        </>
      ))}

      {/* --- Lithium-Ion --- */}
      {renderCollapsible('lithium', 'Lithium-Ion (LFP)', expandedBatt, setExpandedBatt, '#22c55e', (
        <>
          <p style={bodyText}>
            Lithium Iron Phosphate (LiFePO4 / LFP) is emerging as the preferred lithium chemistry
            for UPS applications due to its thermal stability and long cycle life.
          </p>

          <p style={subTitle}>Key Specifications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Nominal voltage: <span style={mono}>3.2 V</span> per cell</li>
            <li>Full charge: <span style={mono}>3.65 V</span> per cell</li>
            <li>Discharge cutoff: <span style={mono}>2.5 V</span> per cell</li>
            <li>Cycle life: 2000-5000+ cycles at 80% DOD</li>
            <li>Calendar life: 10-15 years</li>
            <li>Weight: 60-70% less than equivalent lead-acid</li>
            <li>Footprint: 50-60% less than equivalent lead-acid</li>
          </ul>

          <p style={subTitle}>Advantages for UPS Applications</p>
          <div style={prosConsBox('pro')}>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>3-4x longer calendar life than VRLA (10-15 years vs. 3-5 years)</li>
              <li>10x more cycle life (critical for sites with frequent outages)</li>
              <li>Better performance at elevated temperatures</li>
              <li>Faster recharge capability (1-2 hours vs. 6-12 hours)</li>
              <li>No hydrogen gas generation – reduced ventilation requirements</li>
              <li>No watering, equalization, or specific gravity checks</li>
              <li>Smaller, lighter – valuable in space-constrained installations</li>
              <li>Lower total cost of ownership over 10+ year period</li>
            </ul>
          </div>

          <p style={subTitle}>Battery Management System (BMS)</p>
          <p style={bodyText}>
            Every lithium UPS battery must include an integrated BMS that provides:
          </p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Cell-level voltage monitoring and balancing</li>
            <li>Temperature monitoring of each cell group</li>
            <li>Overcurrent and short-circuit protection</li>
            <li>Over/under voltage cutoff</li>
            <li>State of charge (SOC) and state of health (SOH) reporting</li>
            <li>Communication with UPS controller (Modbus, CAN bus, or proprietary)</li>
            <li>Thermal runaway detection and isolation (disconnect contactors)</li>
          </ul>

          <p style={subTitle}>CEC Considerations for Lithium UPS Batteries</p>
          <div style={warningBox}>
            <p style={{ ...bodyText, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px 0' }}>
              Evolving Code Requirements
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              The CEC is adapting to lithium battery technology. Key considerations include:
              certification to UL 1973 or equivalent, fire suppression requirements for lithium
              battery rooms (may require clean agent or water mist systems), spacing and
              separation requirements between battery modules, and the requirement for the
              BMS to provide remote monitoring and alarm capabilities. Always verify local
              AHJ requirements as these are evolving rapidly.
            </p>
          </div>
        </>
      ))}

      {/* --- Nickel-Cadmium --- */}
      {renderCollapsible('nicd', 'Nickel-Cadmium (NiCd)', expandedBatt, setExpandedBatt, '#f59e0b', (
        <>
          <p style={bodyText}>
            NiCd batteries excel in extreme environments and very long service life applications.
            Despite higher cost and environmental concerns, they remain preferred for certain
            industrial and military applications.
          </p>

          <p style={subTitle}>Key Specifications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Nominal voltage: <span style={mono}>1.2 V</span> per cell</li>
            <li>Float voltage: <span style={mono}>1.40-1.42 VPC</span></li>
            <li>Electrolyte: Potassium hydroxide (KOH) solution</li>
            <li>Temperature range: -40 to +60 degrees C (unmatched by other chemistries)</li>
            <li>Cycle life: 1000-2000+ cycles</li>
            <li>Calendar life: 15-25 years (industry-leading)</li>
          </ul>

          <p style={subTitle}>Industrial Applications</p>
          <ul style={{ ...bodyText, paddingLeft: 18 }}>
            <li>Extreme temperature environments (Arctic mines, outdoor substations)</li>
            <li>High-vibration environments (mobile substations, marine)</li>
            <li>Applications requiring 20+ year battery life</li>
            <li>Railway signaling and traction power</li>
            <li>Oil and gas offshore platforms</li>
            <li>Nuclear power plants</li>
          </ul>

          <p style={subTitle}>Memory Effect – Myth vs. Reality</p>
          <div style={{ background: '#3b82f622', borderLeft: '3px solid #3b82f6', borderRadius: '0 8px 8px 0', padding: '8px 12px', marginBottom: 8 }}>
            <p style={{ ...bodyText, color: '#60a5fa', fontWeight: 600, margin: '0 0 4px 0' }}>
              Clarification
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              The "memory effect" in NiCd batteries is widely misunderstood. True memory effect
              (voltage depression) only occurs under very specific conditions: repeated shallow
              discharges to EXACTLY the same depth over many cycles. In UPS applications, this
              virtually never happens because discharge events are random in depth and duration.
              Modern sintered-plate NiCd cells are largely immune to this effect. The occasional
              full discharge during capacity testing is sufficient to prevent any voltage depression.
            </p>
          </div>

          <div style={prosConsBox('con')}>
            <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: '0 0 4px 0' }}>Disadvantages</p>
            <ul style={{ ...bodyText, margin: 0, paddingLeft: 18 }}>
              <li>Cadmium is toxic – special disposal/recycling requirements</li>
              <li>Higher self-discharge rate (10-20% per month)</li>
              <li>Higher initial cost than lead-acid</li>
              <li>More cells needed per string (1.2V vs. 2.0V per cell)</li>
              <li>KOH electrolyte is corrosive alkali</li>
              <li>RoHS restrictions limiting availability in some markets</li>
            </ul>
          </div>
        </>
      ))}

      {/* --- Comparison Table --- */}
      <div style={card}>
        <p style={sectionTitle}>Battery Technology Comparison</p>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={th}>Feature</th>
                <th style={{ ...th, color: '#3b82f6' }}>Lead-Acid</th>
                <th style={{ ...th, color: '#22c55e' }}>Lithium (LFP)</th>
                <th style={{ ...th, color: '#f59e0b' }}>NiCd</th>
              </tr>
            </thead>
            <tbody>
              {batteryComparison.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{row.feature}</td>
                  <td style={td}>{row.leadAcid}</td>
                  <td style={td}>{row.lithium}</td>
                  <td style={td}>{row.nicd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Battery Room Requirements Summary --- */}
      <div style={card}>
        <p style={sectionTitle}>Battery Room Requirements (CEC Section 64 Summary)</p>
        <span style={cecRef}>CEC 64-100 to 64-114</span>
        <div style={{ marginTop: 10 }}>
          {[
            { label: 'Ventilation', detail: 'Mechanical exhaust from ceiling level, make-up air at floor. Keep H2 below 1%.', icon: '💨' },
            { label: 'Floor', detail: 'Acid/alkali resistant, rated for equipment weight. Spill containment curbing.', icon: '🏗' },
            { label: 'Temperature', detail: 'Maintain 20-25 degrees C. HVAC required for optimal battery life.', icon: '🌡' },
            { label: 'Lighting', detail: 'Min 200 lux. Emergency lighting with separate battery backup.', icon: '💡' },
            { label: 'Safety Equipment', detail: 'Eyewash within 3m, emergency shower within 15m, neutralizer, PPE, SDS.', icon: '🚿' },
            { label: 'Signage', detail: 'Battery room, authorized personnel, electrical/chemical/explosive gas hazards.', icon: '⚠' },
            { label: 'Fire Protection', detail: 'Per local fire code. Sprinklers may need acid-resistant heads. No water on lithium.', icon: '🧯' },
            { label: 'Access', detail: 'Self-closing, self-locking door. Adequate aisle width for maintenance (min 900mm).', icon: '🚪' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--divider)' : 'none' }}>
              <span style={{ fontSize: 20, minWidth: 28 }}>{item.icon}</span>
              <div>
                <p style={{ ...bodyText, color: 'var(--text)', fontWeight: 600, margin: '0 0 2px 0' }}>{item.label}</p>
                <p style={{ ...bodyText, margin: 0 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  TAB 3: SIZING CALCULATOR                                         */
  /* ================================================================ */

  const renderSizingCalc = () => (
    <div style={{ padding: '12px 16px' }}>
      <div style={card}>
        <p style={sectionTitle}>UPS Battery Sizing Calculator</p>
        <p style={bodyText}>
          Enter your load parameters to calculate the required battery capacity. All calculations
          update live and include industry-standard derating factors.
        </p>

        {renderInputRow('Load Rating', loadKVA, setLoadKVA, 'kVA', 0.5, 1000, 0.5)}
        {renderInputRow('Power Factor', powerFactor, setPowerFactor, 'PF', 0.5, 1.0, 0.01)}
        {renderInputRow('Backup Time Required', backupMin, setBackupMin, 'min', 1, 480, 1)}
        {renderInputRow('Battery System Voltage', batteryVoltage, setBatteryVoltage, 'VDC', 12, 600, 12)}
        {renderInputRow('Inverter Efficiency', inverterEff, setInverterEff, '', 0.80, 0.98, 0.01)}
        {renderInputRow('Ambient Temperature', ambientTemp, setAmbientTemp, 'C', -20, 55, 1)}

        <div style={{ background: '#12121f', borderRadius: 8, padding: 12, marginTop: 12, marginBottom: 12 }}>
          <p style={{ ...bodyText, color: 'var(--primary)', fontWeight: 600, margin: '0 0 8px 0' }}>
            Fixed Factors Applied:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={badge('#8b5cf6')}>Aging Factor: {agingFactor}x</span>
            <span style={badge('#f59e0b')}>Temp Derate: {tempDerate.toFixed(3)}x</span>
            <span style={badge('#3b82f6')}>Inverter Eff: {(inverterEff * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* --- Results --- */}
      <div style={resultBox}>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', margin: '0 0 12px 0' }}>
          Calculation Results
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Load (kW)</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{loadKW.toFixed(1)}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Load (Watts)</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{loadWatts.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Required Energy (Wh)</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{requiredWh.toFixed(0)}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Raw Ah Required</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{rawAh.toFixed(1)}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Design Ah (derated)</p>
            <p style={{ ...mono, fontSize: 22, margin: 0, color: '#22c55e' }}>{designAh.toFixed(1)}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>DC Full-Load Current</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{dcFullLoad.toFixed(1)} A</p>
          </div>
        </div>
      </div>

      {/* --- Recommended Configuration --- */}
      <div style={{ ...card, borderLeft: '3px solid #22c55e' }}>
        <p style={sectionTitle}>Recommended Battery Configuration</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Battery Model Size</p>
            <p style={{ ...mono, fontSize: 20, margin: 0, color: '#22c55e' }}>{selectedAh} Ah</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Parallel Strings</p>
            <p style={{ ...mono, fontSize: 20, margin: 0, color: '#22c55e' }}>{numStrings}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Cells per String</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{cellsPerString}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Total Batteries</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{totalBatteries}</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Total Ah Installed</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{totalAh} Ah</p>
          </div>
          <div>
            <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Estimated Runtime</p>
            <p style={{ ...mono, fontSize: 18, margin: 0 }}>{actualRunMin.toFixed(1)} min</p>
          </div>
        </div>
      </div>

      {/* --- Show the math --- */}
      <div style={card}>
        <p style={sectionTitle}>Formulas Used</p>
        <div style={diagBox}>
          <pre style={diagPre}>{`  UPS Battery Sizing Formulas
  ═══════════════════════════════════════════════════

  1. Load in Watts:
     P(W) = kVA x PF x 1000
     P(W) = ${loadKVA} x ${powerFactor} x 1000 = ${loadWatts.toLocaleString()} W

  2. Backup Energy Required (Wh):
     E(Wh) = P(W) x t(hrs) / eff
     E(Wh) = ${loadWatts.toLocaleString()} x ${backupHours.toFixed(3)} / ${inverterEff}
     E(Wh) = ${requiredWh.toFixed(0)} Wh

  3. Raw Ah at Battery Voltage:
     Ah = E(Wh) / V(battery)
     Ah = ${requiredWh.toFixed(0)} / ${batteryVoltage} = ${rawAh.toFixed(1)} Ah

  4. Design Ah (with derating):
     Ah(design) = Ah(raw) x aging x temp_derate
     Ah(design) = ${rawAh.toFixed(1)} x ${agingFactor} x ${tempDerate.toFixed(3)}
     Ah(design) = ${designAh.toFixed(1)} Ah

  5. Temperature Derating Factor:
     For every 8°C above 25°C, capacity drops ~10%
     derate = 1 / (1 - ((T - 25) / 8) x 0.10)
     derate = ${tempDerate.toFixed(3)} at ${ambientTemp}°C

  6. Number of Lead-Acid Cells:
     N(cells) = V(battery) / V(per cell)
     N(cells) = ${batteryVoltage} / 2.0 = ${cellsPerString} cells

  7. DC Full-Load Current:
     I(dc) = P(W) / (V(battery) x eff)
     I(dc) = ${loadWatts.toLocaleString()} / (${batteryVoltage} x ${inverterEff})
     I(dc) = ${dcFullLoad.toFixed(1)} A`}</pre>
        </div>
      </div>

      {/* --- Standard UPS Sizes Reference --- */}
      <div style={card}>
        <p style={sectionTitle}>Standard UPS Sizes Reference</p>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={th}>kVA</th>
                <th style={th}>kW (0.8-0.9 PF)</th>
                <th style={th}>Typical Input</th>
                <th style={th}>Input Breaker</th>
                <th style={th}>Battery V</th>
                <th style={th}>Application</th>
              </tr>
            </thead>
            <tbody>
              {standardUPSSizes.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#ffffff06' }}>
                  <td style={{ ...td, ...mono, fontWeight: 600 }}>{row.kva}</td>
                  <td style={{ ...td, ...mono }}>{row.kw}</td>
                  <td style={td}>{row.typicalInput}</td>
                  <td style={{ ...td, ...mono }}>{row.typicalBreaker}</td>
                  <td style={{ ...td, ...mono }}>{row.batteryV}</td>
                  <td style={td}>{row.application}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Quick Sizing Rules of Thumb --- */}
      <div style={card}>
        <p style={sectionTitle}>Quick Sizing Rules of Thumb</p>
        <ul style={{ ...bodyText, paddingLeft: 18 }}>
          <li>
            <strong>1 kVA per 3-4 standard desktops</strong> (with monitors)
          </li>
          <li>
            <strong>1 kVA per 2 servers</strong> (typical 1U/2U rack servers)
          </li>
          <li>
            <strong>5-10 kVA for a PLC rack</strong> with I/O cards and HMI
          </li>
          <li>
            <strong>10-20 kVA for a small server room</strong> (2-3 racks)
          </li>
          <li>
            <strong>Standard battery gives ~5-15 min</strong> at full load (internal batteries)
          </li>
          <li>
            <strong>Extended battery packs</strong> needed for 30+ min runtime
          </li>
          <li>
            <strong>Always size UPS at 60-80% load</strong> – leave room for growth and efficiency
          </li>
          <li>
            <strong>Battery Ah doubles ≈ doubles runtime</strong> (approximately linear for UPS loads)
          </li>
          <li>
            <strong>Recharge time ≈ 10x discharge time</strong> (typical charger sizing)
          </li>
        </ul>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  TAB 4: INSTALLATION & CEC                                        */
  /* ================================================================ */

  const renderInstallation = () => (
    <div style={{ padding: '12px 16px' }}>
      <p style={bodyText}>
        Battery and UPS installations in Ontario must comply with the Canadian Electrical Code
        (CEC), particularly Section 64 (Battery Installations) and Section 46 (Emergency Systems).
        The following covers key requirements with practical installation guidance.
      </p>

      {/* --- CEC Section 64 Requirements --- */}
      {cecSection64.map((req, i) => (
        renderCollapsible(`cec-${i}`, req.title, expandedCEC, setExpandedCEC, '#3b82f6', (
          <div key={i}>
            <span style={cecRef}>{req.cecRef}</span>
            <ul style={{ ...bodyText, paddingLeft: 18, marginTop: 8 }}>
              {req.details.map((d, j) => (
                <li key={j} style={{ marginBottom: 4 }}>{d}</li>
              ))}
            </ul>
          </div>
        ))
      ))}

      {/* --- Emergency Lighting --- */}
      {cecSection46.map((req, i) => (
        renderCollapsible(`s46-${i}`, req.title, expandedCEC, setExpandedCEC, '#22c55e', (
          <div key={i}>
            <span style={cecRef}>{req.cecRef}</span>
            <ul style={{ ...bodyText, paddingLeft: 18, marginTop: 8 }}>
              {req.details.map((d, j) => (
                <li key={j} style={{ marginBottom: 4 }}>{d}</li>
              ))}
            </ul>
          </div>
        ))
      ))}

      {/* --- Ventilation Calculator --- */}
      <div style={{ ...card, borderLeft: '3px solid #f59e0b' }}>
        <p style={sectionTitle}>Battery Room Ventilation Calculator</p>
        <span style={cecRef}>CEC 64-104</span>
        <p style={{ ...bodyText, marginTop: 8 }}>
          Calculate the required ventilation rate to keep hydrogen concentration below 1% by
          volume during charging. This formula applies to lead-acid and nickel-cadmium batteries.
        </p>

        {renderInputRow('Number of Cells', numCells, setNumCells, 'cells', 1, 500, 1)}
        {renderInputRow('Maximum Charge Current', chargeCurrent, setChargeCurrent, 'A', 1, 2000, 1)}

        <div style={resultBox}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: '0 0 10px 0' }}>
            Ventilation Results
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>H2 Generation Rate</p>
              <p style={{ ...mono, fontSize: 16, margin: 0 }}>{ventFlow.toFixed(2)} L/min</p>
            </div>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Required Airflow</p>
              <p style={{ ...mono, fontSize: 18, margin: 0, color: '#22c55e' }}>{ventCFM.toFixed(1)} CFM</p>
            </div>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Required Airflow (metric)</p>
              <p style={{ ...mono, fontSize: 16, margin: 0 }}>{ventM3Min.toFixed(2)} m3/min</p>
            </div>
          </div>
        </div>

        <div style={diagBox}>
          <pre style={diagPre}>{`  Ventilation Formula (CEC 64-104):
  ════════════════════════════════════

  H2 volume = 0.0167 x N x I  (L/min)
  Where: N = ${numCells} cells, I = ${chargeCurrent} A

  H2 rate = 0.0167 x ${numCells} x ${chargeCurrent}
          = ${ventFlow.toFixed(2)} L/min of hydrogen

  To dilute below 1% concentration:
  Airflow = H2 rate x 100 (safety factor)
          = ${ventFlow.toFixed(2)} x 100
          = ${(ventFlow * 100).toFixed(1)} L/min
          = ${ventCFM.toFixed(1)} CFM

  Note: Always round UP to next fan size.
  Add 25% safety margin in practice.
  Recommended: ${(ventCFM * 1.25).toFixed(0)} CFM minimum`}</pre>
        </div>
      </div>

      {/* --- DC Cable Sizing Calculator --- */}
      <div style={{ ...card, borderLeft: '3px solid #8b5cf6' }}>
        <p style={sectionTitle}>DC Battery Cable Sizing</p>
        <span style={cecRef}>CEC 64-204, Table 17</span>
        <p style={{ ...bodyText, marginTop: 8 }}>
          Size DC battery cables for both ampacity and voltage drop. The maximum allowable voltage
          drop for battery circuits is typically 3% from battery terminals to the DC distribution panel.
        </p>

        {renderInputRow('DC Current (Full Load)', dcAmps, setDcAmps, 'A', 1, 2000, 1)}
        {renderInputRow('One-Way Cable Length', dcLength, setDcLength, 'm', 1, 200, 1)}
        {renderInputRow('System Voltage', dcVoltage, setDcVoltage, 'VDC', 12, 600, 1)}

        <div style={resultBox}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', margin: '0 0 10px 0' }}>
            Cable Sizing Results
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Max Voltage Drop ({maxDropPct}%)</p>
              <p style={{ ...mono, fontSize: 16, margin: 0 }}>{maxDropVolts.toFixed(2)} V</p>
            </div>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Recommended Cable</p>
              <p style={{ ...mono, fontSize: 20, margin: 0, color: '#22c55e' }}>
                {recommendedCable.awg} AWG
              </p>
            </div>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Actual Voltage Drop</p>
              <p style={{ ...mono, fontSize: 16, margin: 0 }}>{actualDrop.toFixed(2)} V ({actualDropPct.toFixed(1)}%)</p>
            </div>
            <div>
              <p style={{ ...bodyText, margin: '0 0 2px 0' }}>Cable Ampacity (75C)</p>
              <p style={{ ...mono, fontSize: 16, margin: 0 }}>{recommendedCable.ampacity} A</p>
            </div>
          </div>
          {dcAmps > recommendedCable.ampacity && (
            <div style={{ ...warningBox, marginTop: 10, marginBottom: 0 }}>
              <p style={{ ...bodyText, color: '#ef4444', fontWeight: 600, margin: 0 }}>
                Warning: Current ({dcAmps}A) exceeds cable ampacity ({recommendedCable.ampacity}A).
                Use parallel conductors or increase cable size.
              </p>
            </div>
          )}
        </div>

        <div style={diagBox}>
          <pre style={diagPre}>{`  DC Cable Sizing Formula:
  ════════════════════════════════

  Voltage Drop = 2 x L x I x R/m
  (Factor of 2 accounts for + and - conductors)

  Max allowable drop = ${dcVoltage}V x ${maxDropPct}% = ${maxDropVolts.toFixed(2)}V
  Max R/m = ${maxDropVolts.toFixed(2)} / (2 x ${dcLength} x ${dcAmps})
         = ${(maxResistancePerM * 1000).toFixed(4)} mΩ/m

  Selected: ${recommendedCable.awg} AWG
  R/m = ${(recommendedCable.rPerM * 1000).toFixed(4)} mΩ/m
  Actual drop = 2 x ${dcLength} x ${dcAmps} x ${recommendedCable.rPerM}
             = ${actualDrop.toFixed(2)}V (${actualDropPct.toFixed(1)}%)

  CEC Notes:
  - Min conductor size for battery: 10 AWG
  - Use RW90 or RWU90 insulation (75°C/90°C)
  - Apply Table 5A correction for ambient temp
  - DC breakers required (AC breakers NOT rated)`}</pre>
        </div>
      </div>

      {/* --- Practical Installation Tips --- */}
      <div style={card}>
        <p style={sectionTitle}>Practical Installation Tips</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Cable Routing', detail: 'Keep DC battery cables as short as possible. Route positive and negative conductors together to minimize inductance. Use cable tray or conduit rated for the environment.' },
            { title: 'Torque Specifications', detail: 'Always torque battery terminal connections per manufacturer specs. Under-torque causes high resistance and arcing. Over-torque damages lead battery posts. Use calibrated torque wrench and apply anti-oxidant compound.' },
            { title: 'Rack Installation', detail: 'Battery racks must be seismically rated for the installation zone. Anchor to floor with appropriate fasteners. Ensure adequate aisle spacing (min 900mm) for maintenance access.' },
            { title: 'Commissioning', detail: 'After installation: verify all cell polarities (a reversed cell can destroy the string), measure each cell/jar voltage, record baseline impedance values, perform acceptance load test.' },
            { title: 'UPS Input/Output Wiring', detail: 'Input and output circuits must be on separate breakers. Maintenance bypass must be mechanically interlocked. Use Kirk-key interlock for systems > 100 kVA. Label all circuits clearly.' },
            { title: 'Grounding', detail: 'Bond battery racks to equipment ground. For systems > 48V, ground one DC conductor (typically negative). Provide ground fault detection for ungrounded systems.' },
          ].map((tip, i) => (
            <div key={i} style={{ borderBottom: i < 5 ? '1px solid var(--divider)' : 'none', paddingBottom: 8 }}>
              <p style={{ ...bodyText, color: 'var(--text)', fontWeight: 600, margin: '0 0 4px 0' }}>
                {tip.title}
              </p>
              <p style={{ ...bodyText, margin: 0 }}>{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  TAB 5: MAINTENANCE                                               */
  /* ================================================================ */

  const renderMaintenance = () => (
    <div style={{ padding: '12px 16px' }}>
      <p style={bodyText}>
        Regular battery maintenance is critical for UPS reliability. A failed battery is the
        number one cause of UPS load drops. Proper testing and documentation extend battery
        life and prevent unexpected failures during critical power events.
      </p>

      {/* --- Testing Procedures --- */}
      <div style={card}>
        <p style={sectionTitle}>Battery Testing Methods</p>
        {[
          {
            name: 'Impedance / Conductance Testing',
            detail: 'Non-invasive test that measures internal cell impedance or conductance. Trending these values over time identifies weakening cells BEFORE they fail. An increase of 20% above baseline indicates investigation needed. 50% above baseline = replace.',
            tool: 'Megger BITE series, Midtronics CTM/CAT, Alber Cellcorder',
            color: '#3b82f6',
          },
          {
            name: 'Load / Discharge Testing',
            detail: 'The definitive test of battery capacity. Apply rated load and measure runtime until end voltage is reached. Battery should deliver at least 80% of rated Ah capacity. Ideally test to IEEE 450 (lead-acid) or IEEE 1188 (VRLA) standards.',
            tool: 'Alber BCT-128, Torkel load bank, Eagle Eye BDS series',
            color: '#22c55e',
          },
          {
            name: 'Float Voltage Monitoring',
            detail: 'Measure voltage across each cell during normal float charge. All cells should be within +/- 0.03 VPC of the average. Deviations indicate cell health issues. Should be done monthly minimum.',
            tool: 'Calibrated digital multimeter (min 0.01V resolution)',
            color: '#f59e0b',
          },
          {
            name: 'Specific Gravity (Flooded Only)',
            detail: 'Measure electrolyte density with a temperature-corrected hydrometer. Full charge SG typically 1.215 at 25C. All cells within 0.015 of average. Higher SG = overcharge. Lower SG = undercharge or failing cell.',
            tool: 'Temperature-compensating hydrometer, refractometer',
            color: '#8b5cf6',
          },
          {
            name: 'IR Thermography',
            detail: 'Scan all connections and cells with infrared camera. Hot spots indicate high-resistance connections or internal cell problems. Connections should be within 5C of adjacent bus. Cells should not exceed ambient by more than 5C.',
            tool: 'Fluke Ti400+, FLIR E-series, or equivalent',
            color: '#ef4444',
          },
        ].map((test, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${test.color}`, padding: '8px 12px', marginBottom: 8, borderRadius: '0 8px 8px 0' }}>
            <p style={{ ...bodyText, color: 'var(--text)', fontWeight: 600, margin: '0 0 4px 0' }}>
              {test.name}
            </p>
            <p style={{ ...bodyText, margin: '0 0 4px 0' }}>{test.detail}</p>
            <p style={{ ...bodyText, margin: 0, fontSize: 12 }}>
              <strong>Instruments:</strong> {test.tool}
            </p>
          </div>
        ))}
      </div>

      {/* --- Maintenance Schedule --- */}
      <div style={card}>
        <p style={sectionTitle}>Maintenance Schedule</p>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={th}>Task</th>
                <th style={th}>Frequency</th>
                <th style={th}>Method</th>
                <th style={th}>Acceptance Criteria</th>
                <th style={th}>Corrective Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceTasks.map((t, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#ffffff06' }}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{t.task}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    <span style={badge(
                      t.frequency === 'Monthly' ? '#3b82f6' :
                      t.frequency === 'Quarterly' ? '#22c55e' :
                      t.frequency === 'Annually' ? '#f59e0b' : '#8b5cf6'
                    )}>
                      {t.frequency}
                    </span>
                  </td>
                  <td style={td}>{t.method}</td>
                  <td style={td}>{t.acceptance}</td>
                  <td style={td}>{t.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Failure Modes --- */}
      {renderCollapsible('failures', 'Common Failure Modes & Troubleshooting', expandedMaint, setExpandedMaint, '#ef4444', (
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={th}>Symptom</th>
                <th style={th}>Possible Cause</th>
                <th style={th}>Diagnostics</th>
                <th style={th}>Remedy</th>
                <th style={th}>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {failureModes.map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#ffffff06' }}>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--text)' }}>{f.symptom}</td>
                  <td style={td}>{f.possibleCause}</td>
                  <td style={td}>{f.diagnostics}</td>
                  <td style={td}>{f.remedy}</td>
                  <td style={td}>
                    <span style={badge(
                      f.urgency === 'CRITICAL' ? '#ef4444' :
                      f.urgency === 'High' ? '#f59e0b' : '#3b82f6'
                    )}>
                      {f.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* --- Battery Replacement Criteria --- */}
      <div style={card}>
        <p style={sectionTitle}>Battery Replacement Criteria</p>
        <p style={bodyText}>
          Replace batteries when ANY of the following conditions are met:
        </p>
        <ul style={{ ...bodyText, paddingLeft: 18 }}>
          <li>
            <strong>Capacity below 80%</strong> of rated Ah as measured by load test (IEEE standard end-of-life definition)
          </li>
          <li>
            <strong>Individual cell impedance</strong> exceeds 50% above baseline
          </li>
          <li>
            <strong>Physical damage:</strong> swollen cases, cracked jars, electrolyte leaks, melted posts
          </li>
          <li>
            <strong>Age exceeds manufacturer warranty</strong> (VRLA: 3-5 years standard, 8-12 years long-life)
          </li>
          <li>
            <strong>Float current trending upward</strong> while cell voltages remain consistent
          </li>
          <li>
            <strong>Repeated thermal events</strong> or ground faults traced to battery string
          </li>
          <li>
            <strong>Excessive water consumption</strong> (flooded) not explained by charging parameters
          </li>
          <li>
            <strong>Note on VRLA:</strong> If replacing cells in a VRLA string, replace the ENTIRE string. Mixing old and new VRLA cells causes charge imbalance and premature failure of both.
          </li>
        </ul>
      </div>

      {/* --- Safety Precautions --- */}
      {safetyPrecautions.map((cat, i) => (
        renderCollapsible(`safety-${i}`, cat.category, expandedSafety, setExpandedSafety,
          i === 0 ? '#3b82f6' : i === 1 ? '#ef4444' : i === 2 ? '#f59e0b' : '#8b5cf6',
          (
            <ul style={{ ...bodyText, paddingLeft: 18 }}>
              {cat.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          )
        )
      ))}

      {/* --- Temperature Monitoring --- */}
      <div style={card}>
        <p style={sectionTitle}>Temperature Monitoring Importance</p>
        <p style={bodyText}>
          Temperature is the single most important factor affecting battery life and safety.
        </p>
        <div style={diagBox}>
          <pre style={diagPre}>{`  Battery Life vs. Temperature (VRLA Lead-Acid)
  ═══════════════════════════════════════════════
  Temp (C)    Life Factor    5-yr rated    10-yr rated
  ────────    ───────────    ──────────    ───────────
    20°C        1.25x         6.3 years     12.5 years
    25°C        1.00x         5.0 years     10.0 years
    30°C        0.75x         3.8 years      7.5 years
    33°C        0.60x         3.0 years      6.0 years
    35°C        0.50x         2.5 years      5.0 years
    40°C        0.30x         1.5 years      3.0 years
    45°C        0.18x         0.9 years      1.8 years

  Rule: Every 8-10°C above 25°C halves battery life

  Recommended Actions:
  • Install ambient temp sensor in battery room
  • Install cell temp sensors on pilot cells
  • Set alarm at 30°C, critical alarm at 35°C
  • Use temp-compensated charger
  • Adjust float voltage: -3 to -5 mV/cell/°C above 25°C`}</pre>
        </div>
      </div>

      {/* --- Record Keeping --- */}
      <div style={card}>
        <p style={sectionTitle}>Record Keeping Requirements</p>
        <p style={bodyText}>
          Proper documentation is essential for trending, warranty claims, and compliance.
          Maintain the following records:
        </p>
        <ul style={{ ...bodyText, paddingLeft: 18 }}>
          <li><strong>Installation records:</strong> date, manufacturer, model, serial numbers, warranty info, baseline impedance readings</li>
          <li><strong>Monthly inspection forms:</strong> visual condition, room temperature, float voltage, any anomalies</li>
          <li><strong>Quarterly test results:</strong> individual cell voltages, impedance/conductance values, connection resistance (DLRO), specific gravity (flooded)</li>
          <li><strong>Annual test reports:</strong> load test results with discharge curve, thermal scan images, ventilation verification, full capacity test results</li>
          <li><strong>Event log:</strong> all battery events (discharges, alarms, maintenance actions, cell replacements)</li>
          <li><strong>Water addition log (flooded):</strong> date, cells watered, volume added. Increasing water consumption indicates end of life.</li>
          <li><strong>Trend charts:</strong> plot impedance, float voltage, and capacity over time for each cell. Helps predict failures before they occur.</li>
        </ul>

        <div style={warningBox}>
          <p style={{ ...bodyText, color: '#f59e0b', fontWeight: 600, margin: '0 0 4px 0' }}>
            Practical Tip
          </p>
          <p style={{ ...bodyText, margin: 0 }}>
            Many modern battery monitoring systems (BMS for lithium, or aftermarket monitors for
            lead-acid like Vertiv/Canara) provide continuous monitoring, automatic data logging,
            and alarm notifications. For critical UPS installations, a battery monitoring system
            pays for itself by preventing a single unplanned outage.
          </p>
        </div>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '18px 16px 10px',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
      }}>
        <button
          onClick={() => nav(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: 22,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Battery & UPS Systems
        </h1>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
        padding: '0 8px',
        gap: 2,
        WebkitOverflowScrolling: 'touch',
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 'none',
              padding: '12px 14px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === t.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: tab === t.key ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: 'var(--touch-min)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'ups' && renderUPSTypes()}
      {tab === 'battery' && renderBatteryTypes()}
      {tab === 'sizing' && renderSizingCalc()}
      {tab === 'install' && renderInstallation()}
      {tab === 'maint' && renderMaintenance()}
    </div>
  )
}
