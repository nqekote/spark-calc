import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Emergency & Standby Power Reference - Ontario Electrical Apprentice */
/*  CEC Section 46 | NFPA 110 | CSA Z32                                */
/* ------------------------------------------------------------------ */

type TabKey = 'types' | 'transfer' | 'generators' | 'cec' | 'testing'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'types', label: 'System Types' },
  { key: 'transfer', label: 'Transfer' },
  { key: 'generators', label: 'Generators' },
  { key: 'cec', label: 'CEC Rules' },
  { key: 'testing', label: 'Testing' },
]

/* ------------------------------------------------------------------ */
/*  Shared style constants                                              */
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
  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 8,
}
const subLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6,
}
const mono: React.CSSProperties = {
  fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
}
const tableHeader: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--primary)',
  textTransform: 'uppercase', letterSpacing: 0.3,
  padding: '10px 8px', borderBottom: '2px solid var(--primary)',
  textAlign: 'left', whiteSpace: 'nowrap',
}
const tableCell: React.CSSProperties = {
  fontSize: 13, color: 'var(--text)', padding: '10px 8px',
  borderBottom: '1px solid var(--divider)', lineHeight: 1.5,
  verticalAlign: 'top',
}
const inputStyle: React.CSSProperties = {
  width: '100%', minHeight: 48, padding: '0 12px',
  background: 'var(--bg)', border: '1px solid var(--divider)',
  borderRadius: 8, color: 'var(--text)', fontSize: 15,
  ...mono, outline: 'none',
}
const resultBox: React.CSSProperties = {
  background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: 'var(--radius)', padding: 16,
}
const codeRef: React.CSSProperties = {
  display: 'inline-block', fontSize: 11, fontWeight: 700,
  color: 'var(--primary)', background: 'rgba(255,215,0,0.1)',
  padding: '2px 8px', borderRadius: 6, ...mono,
}
const bulletItem: React.CSSProperties = {
  fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
  padding: '4px 0 4px 12px', borderLeft: '2px solid var(--divider)',
}
const noteBanner: React.CSSProperties = {
  fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
  padding: 12, borderRadius: 8,
  background: 'rgba(255,215,0,0.06)',
  border: '1px solid rgba(255,215,0,0.15)',
}

/* ------------------------------------------------------------------ */
/*  Tab 1: System Types Data                                            */
/* ------------------------------------------------------------------ */

interface SystemDef {
  name: string
  cecRef: string
  description: string
  transferTime: string
  examples: string[]
  wiringReqs: string
  tint: string
}

const systemDefs: SystemDef[] = [
  {
    name: 'Emergency Systems',
    cecRef: 'CEC 46-002 / 46-100',
    description: 'Systems legally required to operate during a utility failure to protect life safety. These are mandated by building codes and fire codes. Must have a power source completely independent of the normal supply. Automatic connection within 10 seconds of power loss. Emergency systems receive the highest priority for power restoration.',
    transferTime: '10 seconds maximum',
    examples: [
      'Exit sign illumination',
      'Emergency egress lighting',
      'Fire alarm systems',
      'Smoke control and stairwell pressurization fans',
      'Fire pump controllers (where sole source)',
      'Elevator car lighting, communication, and signal systems',
      'Emergency communication systems (voice alarm, PA)',
      'Ventilation for smoke removal in underground areas',
    ],
    wiringReqs: 'Completely independent wiring. Separate raceways, cables, boxes, and cabinets. Must not share raceways with normal or standby circuits. Fire-rated cable or protected raceways required in many installations.',
    tint: '#ef4444',
  },
  {
    name: 'Legally Required Standby',
    cecRef: 'CEC 46-002 / 46-200',
    description: 'Systems required by municipal, provincial, or federal codes that are important to safety but whose failure is less critical than emergency systems. These facilitate firefighting operations, rescue activities, and orderly shutdown of hazardous processes. Lower restoration priority than emergency systems.',
    transferTime: '60 seconds maximum',
    examples: [
      'Heating systems in cold climates (where required by code)',
      'Refrigeration of medical supplies',
      'Communication systems (non-emergency)',
      'Ventilation and smoke removal systems (non-smoke control)',
      'Sewage disposal and water supply for life safety',
      'Lighting for large buildings (areas not served by emergency lighting)',
      'Industrial processes where shutdown could create hazards',
    ],
    wiringReqs: 'Separate raceways independent of normal wiring preferred. May share raceways with emergency circuits in some cases per AHJ approval. Cannot share raceways with normal (non-emergency) supply wiring.',
    tint: '#f59e0b',
  },
  {
    name: 'Optional Standby',
    cecRef: 'CEC 46-002 / 46-300',
    description: 'Systems not legally required. Installed to protect property, support business continuity, or provide convenience during power outages. Owner selects the loads to be connected. No code-mandated transfer time. Transfer can be manual or automatic depending on owner preference.',
    transferTime: 'No code requirement (owner determined)',
    examples: [
      'Data centers and server rooms',
      'Commercial refrigeration',
      'Industrial process loads (not life-safety)',
      'Residential standby generators',
      'Farm operations (milking, ventilation)',
      'Retail and office building convenience loads',
      'Telecommunications equipment',
      'HVAC comfort systems',
    ],
    wiringReqs: 'No special separation required from normal wiring. Standard CEC wiring rules apply. Transfer equipment must prevent interconnection of normal and standby sources.',
    tint: '#3b82f6',
  },
]

const comparisonTable = [
  { feature: 'Code Mandate', emergency: 'Yes - required', legalStandby: 'Yes - required', optionalStandby: 'No - owner choice' },
  { feature: 'Transfer Time', emergency: '10 sec max', legalStandby: '60 sec max', optionalStandby: 'None specified' },
  { feature: 'Auto Transfer', emergency: 'Required', legalStandby: 'Required', optionalStandby: 'Optional' },
  { feature: 'Wiring Separation', emergency: 'Full separation', legalStandby: 'Separate preferred', optionalStandby: 'Not required' },
  { feature: 'Raceway Sharing', emergency: 'Prohibited', legalStandby: 'Limited', optionalStandby: 'Allowed' },
  { feature: 'Source Independence', emergency: 'Complete', legalStandby: 'Complete', optionalStandby: 'Required for transfer' },
  { feature: 'Testing Required', emergency: 'Monthly + annual', legalStandby: 'Monthly + annual', optionalStandby: 'Owner determined' },
  { feature: 'Load Priority', emergency: 'Highest', legalStandby: 'Second', optionalStandby: 'Lowest' },
  { feature: 'CEC Section', emergency: '46-100', legalStandby: '46-200', optionalStandby: '46-300' },
  { feature: 'Panel Colour', emergency: 'Marked per 46', legalStandby: 'Marked per 46', optionalStandby: 'Standard' },
]

/* ------------------------------------------------------------------ */
/*  Tab 2: Transfer Switches Data                                       */
/* ------------------------------------------------------------------ */

interface TransferType {
  name: string
  abbr: string
  description: string
  operation: string
  advantages: string[]
  limitations: string[]
  typicalUse: string
  tint: string
}

const transferTypes: TransferType[] = [
  {
    name: 'Automatic Transfer Switch (ATS) - Open Transition',
    abbr: 'ATS-OT',
    description: 'The most common type. Monitors normal power, automatically starts generator on failure, and transfers load. "Open transition" means there is a brief interruption (break-before-make) during transfer. The load is momentarily disconnected from both sources.',
    operation: '1. Normal power fails or drops below threshold. 2. ATS sends start signal to generator. 3. Generator starts and reaches rated voltage/frequency. 4. ATS verifies generator output is within tolerance. 5. ATS opens normal-side contacts. 6. Brief dead time (50-100ms typical). 7. ATS closes emergency-side contacts. 8. Load is now on generator. 9. When normal power returns and stabilizes (adjustable time delay), ATS retransfers load to normal.',
    advantages: [
      'Simple and reliable mechanism',
      'No risk of paralleling sources',
      'Lower cost than closed transition',
      'No utility approval required for interconnection',
      'Suitable for most emergency and standby applications',
    ],
    limitations: [
      'Brief power interruption during transfer (50-100ms)',
      'Sensitive electronic loads may be affected by brief outage',
      'Motor loads may experience inrush on retransfer',
      'Not suitable for loads requiring zero interruption',
    ],
    typicalUse: 'Emergency lighting, fire alarm, HVAC, general building loads, industrial standby. Standard choice for most CEC Section 46 applications.',
    tint: '#3b82f6',
  },
  {
    name: 'Automatic Transfer Switch (ATS) - Closed Transition',
    abbr: 'ATS-CT',
    description: 'Also called "make-before-break." Both sources are momentarily paralleled (typically less than 100ms) during transfer. The load experiences no interruption. Requires utility approval as generator is briefly connected to the grid.',
    operation: '1. Normal power fails and generator starts (same as open transition). 2. When retransferring back to normal: ATS synchronizes generator output with utility. 3. When in phase, ATS closes normal-side contacts while emergency contacts are still closed. 4. Both sources supply load simultaneously for less than 100ms. 5. ATS opens emergency-side contacts. 6. Load is seamlessly transferred with no interruption.',
    advantages: [
      'Zero interruption during transfer (seamless)',
      'No motor re-acceleration inrush',
      'No voltage dip during retransfer',
      'Ideal for sensitive electronic loads',
      'Better for large motor loads',
    ],
    limitations: [
      'Requires synchronization equipment',
      'Utility approval required (brief parallel operation)',
      'Higher cost than open transition',
      'More complex controls and maintenance',
      'Some utilities prohibit any paralleling',
    ],
    typicalUse: 'Data centers, hospitals, process loads with sensitive equipment, large motor loads. Used when momentary interruption is unacceptable.',
    tint: '#22c55e',
  },
  {
    name: 'Manual Transfer Switch (MTS)',
    abbr: 'MTS',
    description: 'Requires operator to physically switch load between sources. Mechanically interlocked to prevent paralleling. Used where automatic transfer is not code-required (optional standby) or as a maintenance bypass.',
    operation: '1. Normal power fails. 2. Operator starts generator manually or via panel. 3. Generator reaches rated output. 4. Operator moves transfer switch handle from NORMAL to EMERGENCY position. 5. Mechanical interlock ensures break-before-make. 6. Load is now on generator. 7. When normal returns, operator reverses the process.',
    advantages: [
      'Simple and low cost',
      'No complex controls or programming',
      'High reliability (fewer components)',
      'Operator can verify source quality before transferring',
      'No risk of automatic false transfers',
    ],
    limitations: [
      'Requires trained operator on site',
      'Transfer time depends on operator response',
      'Cannot meet 10-second or 60-second code requirements',
      'Not suitable for emergency or legally required standby',
    ],
    typicalUse: 'Residential standby generators, small commercial optional standby, farm operations, portable generator connections. CEC 46-300 applications only.',
    tint: '#a78bfa',
  },
]

interface SizingParam {
  param: string
  description: string
  typical: string
}

const atsSizingParams: SizingParam[] = [
  { param: 'Voltage Rating', description: 'Must match system voltage. Common: 120/208V, 347/600V, 120/240V', typical: '600V max for most' },
  { param: 'Continuous Amperage', description: 'Must equal or exceed calculated load current. Standard sizes follow breaker ratings.', typical: '30A to 4000A' },
  { param: 'Number of Poles', description: '2-pole (single phase), 3-pole (3-phase no switched neutral), 4-pole (3-phase with switched neutral)', typical: '3P or 4P' },
  { param: 'Withstand Rating', description: 'Short-circuit withstand current (kAIC). Must be coordinated with upstream OCPD.', typical: '42kA to 200kA' },
  { param: 'Transfer Time', description: 'Time to mechanically transfer contacts. Must meet code requirements for system type.', typical: '60ms to 500ms' },
  { param: 'Frequency', description: 'Must match system frequency.', typical: '60 Hz' },
  { param: 'Enclosure Type', description: 'NEMA 1 (indoor), NEMA 3R (outdoor), NEMA 4 (watertight)', typical: 'NEMA 1 or 3R' },
]

const transferSchemes: { loadType: string; recommended: string; reason: string }[] = [
  { loadType: 'Exit Signs & Emergency Lighting', recommended: 'ATS - Open Transition', reason: 'CEC 46-100 requires automatic transfer within 10 seconds. Battery units provide bridge during transfer gap.' },
  { loadType: 'Fire Alarm System', recommended: 'ATS - Open Transition', reason: 'Fire alarm panels have internal batteries (24 hours standby). Open transition is standard and cost-effective.' },
  { loadType: 'Fire Pump', recommended: 'ATS - Open Transition', reason: 'Dedicated ATS per CEC 32-200. Motor will re-accelerate after brief transfer. Sized for locked-rotor current.' },
  { loadType: 'Elevator Systems', recommended: 'ATS - Open Transition', reason: 'Elevator controllers handle power transitions. Pre-transfer signal allows controlled stop before transfer.' },
  { loadType: 'Data Center / IT', recommended: 'ATS - Closed Transition + UPS', reason: 'UPS bridges any gap. Closed transition prevents break on retransfer. Dual utility feeds common.' },
  { loadType: 'Hospital Critical', recommended: 'ATS - Open Transition', reason: 'CSA Z32 requires ATS. Critical branch, life safety branch, equipment branch each on separate ATS.' },
  { loadType: 'Residential Standby', recommended: 'Manual Transfer Switch', reason: 'CEC 46-300. No automatic transfer required. MTS with mechanical interlock is standard.' },
  { loadType: 'HVAC Chillers', recommended: 'ATS - Closed Transition', reason: 'Large motor loads benefit from seamless retransfer. Avoids chiller restart delays.' },
  { loadType: 'Process / Manufacturing', recommended: 'ATS - Closed or Soft Load', reason: 'Soft load transfer ramps load onto generator gradually. Prevents voltage/frequency transients.' },
  { loadType: 'Smoke Control Fans', recommended: 'ATS - Open Transition', reason: 'Emergency system per CEC 46-100. Must operate within 10 seconds. Fans re-accelerate quickly.' },
]

/* ------------------------------------------------------------------ */
/*  Tab 3: Generator Data                                               */
/* ------------------------------------------------------------------ */

const fuelComparison = [
  { param: 'Fuel Cost', diesel: 'Moderate', natGas: 'Low', propane: 'Moderate-High' },
  { param: 'Fuel Storage', diesel: 'On-site tanks required', natGas: 'Utility supply (piped)', propane: 'On-site tanks required' },
  { param: 'Run Time', diesel: 'Limited by tank size', natGas: 'Unlimited (utility gas)', propane: 'Limited by tank size' },
  { param: 'Starting Reliability', diesel: 'Excellent', natGas: 'Good (needs gas pressure)', propane: 'Good' },
  { param: 'Emissions', diesel: 'Higher (particulates)', natGas: 'Lowest', propane: 'Low' },
  { param: 'Noise Level', diesel: 'Higher (85-100 dBA)', natGas: 'Moderate (75-90 dBA)', propane: 'Moderate (75-90 dBA)' },
  { param: 'Maintenance', diesel: 'More (fuel filters, water separator)', natGas: 'Less (cleaner combustion)', propane: 'Moderate' },
  { param: 'Size Range', diesel: '10 kW to 3+ MW', natGas: '10 kW to 2 MW', propane: '10 kW to 500 kW' },
  { param: 'Cold Start', diesel: 'Block heater required', natGas: 'Good if gas available', propane: 'Vaporizer may be needed' },
  { param: 'Shelf Life', diesel: 'Degrades (treat/rotate)', natGas: 'N/A (piped)', propane: 'Indefinite' },
  { param: 'CEC Application', diesel: 'Emergency & standby', natGas: 'Standby (if gas reliable)', propane: 'Standby' },
  { param: 'Typical Use', diesel: 'Hospitals, high-rise, critical', natGas: 'Commercial, residential', propane: 'Rural, no gas service' },
]

const genSizingSteps = [
  { step: 1, title: 'Identify All Loads', detail: 'List every load that must be on emergency/standby power. Include nameplate ratings in kW and kVA. Note motor HP ratings separately.' },
  { step: 2, title: 'Determine Running Load', detail: 'Sum all connected running loads. For motors, use kW running (HP x 0.746 / efficiency). For resistive loads, kW = kVA. Record total running kW and kVA.' },
  { step: 3, title: 'Calculate Motor Starting Impact', detail: 'The largest motor starting creates the peak kVA demand. Motor starting kVA = 6x to 8x full-load kVA (depending on starting method). This often determines generator size, not running load.' },
  { step: 4, title: 'Determine Starting Sequence', detail: 'Sequence motor starts with time delays (load shedding/adding). Starting the largest motor first onto an unloaded generator is often the worst case. Stagger other motor starts by 5-10 seconds.' },
  { step: 5, title: 'Apply Derating Factors', detail: 'Altitude: derate 3.5% per 300m (1000 ft) above 150m. Temperature: derate for ambient above 40C. Power factor: generator must supply the full kVA at the load power factor.' },
  { step: 6, title: 'Select Generator Rating', detail: 'Generator kW rating must exceed total running kW. Generator kVA rating must handle the worst-case starting transient while maintaining voltage within 15-20% dip. Select next standard size above calculated requirement.' },
  { step: 7, title: 'Verify Voltage Dip', detail: 'During largest motor start, voltage dip must not exceed the generator manufacturer limit (typically 15-20% for diesel). Sensitive loads may require <10% dip. Use manufacturer motor starting capability curves.' },
  { step: 8, title: 'Confirm Fuel and Run Time', detail: 'For CEC emergency systems, fuel storage must provide minimum run time per code (typically 2 hours minimum, 8-72 hours per AHJ). Size fuel tank accordingly.' },
]

const STANDARD_GEN_SIZES = [
  10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100, 125, 150, 175,
  200, 250, 300, 350, 400, 500, 600, 750, 800, 1000, 1250, 1500, 2000, 2500, 3000,
]

function getNextGenSize(kw: number): number {
  for (const size of STANDARD_GEN_SIZES) {
    if (size >= kw) return size
  }
  return Math.ceil(kw / 100) * 100
}

/* ------------------------------------------------------------------ */
/*  Tab 4: CEC Requirements Data                                        */
/* ------------------------------------------------------------------ */

interface CecRule {
  section: string
  title: string
  summary: string
  details: string[]
}

const cecRules: CecRule[] = [
  {
    section: '46-002',
    title: 'Scope and Classification',
    summary: 'Defines three classes of emergency power systems and their requirements.',
    details: [
      'Emergency systems: circuits and equipment legally required to be automatically supplied from an alternate source within 10 seconds',
      'Legally required standby: systems required by code but with lower criticality than emergency',
      'Optional standby: systems not required by code but installed for owner convenience or business continuity',
      'All systems must prevent inadvertent interconnection of normal and emergency sources',
    ],
  },
  {
    section: '46-100',
    title: 'Emergency Systems - General',
    summary: 'Requirements for systems that must operate automatically within 10 seconds of normal power failure.',
    details: [
      'Automatic transfer to emergency source within 10 seconds',
      'Source must be independent of normal supply (generator, battery, separate utility)',
      'Wiring must be completely separate from all other wiring',
      'Emergency circuits must be kept entirely independent',
      'Overcurrent protection must be accessible only to authorized persons',
      'Transfer equipment must prevent paralleling unless designed for it',
      'Ground fault indication (not protection) may be required on emergency systems',
    ],
  },
  {
    section: '46-104',
    title: 'Emergency Lighting',
    summary: 'Specific requirements for emergency lighting circuits and equipment.',
    details: [
      'Emergency lighting must illuminate means of egress and exit signs',
      'Must operate for minimum 30 minutes (OBC) or 2 hours (some occupancies)',
      'Battery-powered units acceptable as emergency source for lighting',
      'Self-contained battery units must be tested monthly (30-second test) and annually (full duration)',
      'Emergency lighting circuits must be on dedicated branch circuits',
      'Switch controls must not allow emergency lights to be turned off from public areas',
    ],
  },
  {
    section: '46-108',
    title: 'Emergency System Wiring',
    summary: 'Wiring methods and installation requirements for emergency circuits.',
    details: [
      'Emergency circuit wiring must be kept entirely independent of all other wiring',
      'Separate raceways, cables, boxes, and enclosures required',
      'Cannot route emergency wiring through areas where it could be damaged by structural failure',
      'Fire-rated cable (FAS-105 or equivalent) or cables in fire-rated enclosures for areas requiring fire resistance',
      'Minimum 1-hour fire rating for cables serving emergency loads in high buildings',
      'Vertical runs in high buildings must use fire-rated cable or be in 2-hour rated shafts',
    ],
  },
  {
    section: '46-200',
    title: 'Legally Required Standby Systems',
    summary: 'Requirements for standby systems required by law but not classified as emergency.',
    details: [
      'Automatic transfer to standby source within 60 seconds',
      'Wiring must be kept separate from normal wiring where practicable',
      'May share raceways with emergency system wiring with AHJ approval',
      'Must not share raceways or enclosures with normal supply wiring',
      'Transfer equipment same requirements as emergency systems',
      'Overcurrent protection accessible to authorized persons only',
    ],
  },
  {
    section: '46-300',
    title: 'Optional Standby Systems',
    summary: 'Requirements for voluntary standby installations not mandated by code.',
    details: [
      'No specific transfer time requirement',
      'Manual or automatic transfer permitted',
      'Transfer equipment must prevent interconnection of sources',
      'Standard CEC wiring rules apply (no special separation)',
      'Portable generators may be used with proper connection method',
      'Inlet boxes and connection means must be rated for the application',
      'Interlock required to prevent backfeed to utility',
    ],
  },
  {
    section: '46-400',
    title: 'Power Sources',
    summary: 'Acceptable alternate power sources for emergency and standby systems.',
    details: [
      'Storage batteries: acceptable for emergency lighting (limited duration)',
      'Generator sets: diesel, gas turbine, or gas engine driven (most common)',
      'Separate utility service: acceptable if truly independent from normal supply',
      'Fuel cell systems: where approved by AHJ',
      'Unit equipment: self-contained battery units with charger for emergency lighting',
      'Generator must reach rated voltage and frequency within code transfer time',
      'Fuel supply adequate for expected duration (minimum 2 hours typical)',
    ],
  },
  {
    section: '32-200',
    title: 'Fire Pump Supply',
    summary: 'Power supply requirements for electric fire pumps.',
    details: [
      'Fire pump must have reliable power source',
      'Where normal supply is sole source, supplied ahead of main disconnect',
      'Alternate supply via dedicated ATS when generator backup provided',
      'Fire pump disconnecting means must be lockable open',
      'Overcurrent protection must be sized to allow motor to run under locked-rotor conditions',
      'Supervisory power loss signal to fire alarm system required',
      'Fire pump circuit wiring must be fire-rated or protected (2-hour minimum)',
    ],
  },
]

const wiringMethods = [
  { method: 'MI Cable (Mineral Insulated)', fireRating: '2+ hours', application: 'Highest integrity. Fire pump, emergency in high-rise. Maintains circuit integrity in fire conditions.', cecRef: '46-108' },
  { method: 'Fire-Rated Cable (FAS-105)', fireRating: '1-2 hours', application: 'Common for emergency circuits. ULC-listed fire-rated cable maintains circuit for rated period. Simpler to install than MI.', cecRef: '46-108' },
  { method: 'EMT in Fire-Rated Assembly', fireRating: '1-2 hours', application: 'Standard conduit within fire-rated shaft or enclosure. Economical but limited by enclosure routing.', cecRef: '46-108' },
  { method: 'Rigid Metal Conduit', fireRating: 'Limited', application: 'Provides mechanical protection but limited fire rating without enclosure. Used where fire rating is not specifically required.', cecRef: '12-100' },
  { method: 'Armoured Cable (AC90/ACWU)', fireRating: 'None rated', application: 'Not suitable for fire-rated emergency circuits. Acceptable for optional standby and non-fire-rated emergency where permitted.', cecRef: '12-600' },
  { method: 'TECK Cable', fireRating: 'None rated', application: 'Industrial feeder cable with armour. Not fire-rated. Suitable for optional standby and generator feeder connections.', cecRef: '12-2200' },
]

const signsRequired = [
  { location: 'Transfer Switch', sign: '"EMERGENCY POWER" or "STANDBY POWER" with system type', cecRef: '46-108' },
  { location: 'Generator Room', sign: 'Room identification, fuel type, electrical hazard warnings', cecRef: '46-108' },
  { location: 'Emergency Panels', sign: '"EMERGENCY PANEL - DO NOT DISCONNECT" with identifying number', cecRef: '46-108' },
  { location: 'Emergency Circuits', sign: 'Red marking or other approved identification on all emergency raceways', cecRef: '46-108' },
  { location: 'Normal Panel', sign: 'Identify which loads are transferred to emergency/standby', cecRef: '46-108' },
  { location: 'Fuel Storage', sign: 'WHMIS/TDG placards, fuel type, capacity, emergency contacts', cecRef: 'Fire Code' },
  { location: 'Generator Disconnect', sign: '"GENERATOR DISCONNECT" with voltage and amperage rating', cecRef: '46-108' },
  { location: 'Utility Disconnect', sign: 'Indicate presence of multiple power sources on premise', cecRef: '2-300' },
]

/* ------------------------------------------------------------------ */
/*  Tab 5: Testing & Maintenance Data                                   */
/* ------------------------------------------------------------------ */

interface TestSchedule {
  frequency: string
  items: { task: string; detail: string; standard: string }[]
}

const testSchedules: TestSchedule[] = [
  {
    frequency: 'Weekly',
    items: [
      { task: 'Generator exercise run', detail: 'Start generator, run for 30 minutes minimum under no load or light load. Verify start sequence, oil pressure, coolant temp, battery voltage.', standard: 'NFPA 110 / CEC 46' },
      { task: 'Visual inspection', detail: 'Check for fluid leaks (fuel, coolant, oil), unusual noises, exhaust condition, block heater operation.', standard: 'NFPA 110' },
      { task: 'Battery charger check', detail: 'Verify charger output voltage and current. Check battery electrolyte level (if applicable). Note any low-battery alarms.', standard: 'NFPA 110' },
    ],
  },
  {
    frequency: 'Monthly',
    items: [
      { task: 'Generator run under load', detail: 'Run generator with building load via ATS transfer. Verify voltage, frequency, and load acceptance. Run for 30 minutes minimum.', standard: 'NFPA 110 / CEC 46' },
      { task: 'ATS transfer test', detail: 'Simulate utility failure. Verify generator auto-start, ATS transfer within rated time, and retransfer on utility restore.', standard: 'CEC 46-108' },
      { task: 'Fluid level check', detail: 'Check engine oil level, coolant level, fuel level. Top up as needed. Record quantities added.', standard: 'NFPA 110' },
      { task: 'Emergency lighting test', detail: 'Activate emergency lighting for 30 seconds minimum. Verify all units illuminate. Record any failures.', standard: 'OBC / CEC 46-104' },
      { task: 'Generator battery test', detail: 'Check starting battery terminal voltage under load (cranking). Clean terminals. Verify electrolyte specific gravity.', standard: 'NFPA 110' },
    ],
  },
  {
    frequency: 'Semi-Annual',
    items: [
      { task: 'Fuel system inspection', detail: 'Inspect fuel tank for water contamination, sediment. Test fuel quality. Check fuel lines, filters, and connections.', standard: 'NFPA 110' },
      { task: 'Cooling system service', detail: 'Check coolant concentration (antifreeze), hose condition, radiator for debris, thermostat operation.', standard: 'Manufacturer' },
      { task: 'Belt and hose inspection', detail: 'Inspect drive belts for tension, cracks, glazing. Check all hoses for deterioration, leaks, soft spots.', standard: 'Manufacturer' },
    ],
  },
  {
    frequency: 'Annual',
    items: [
      { task: 'Load bank test', detail: 'Full rated load test for minimum 2 hours. Verify generator can sustain full rated kW output. Required if monthly loaded runs do not achieve 30% of rated load.', standard: 'NFPA 110' },
      { task: 'Full ATS operation test', detail: 'Complete operational test of all ATS functions: normal-to-emergency, emergency-to-normal, time delays, engine cool-down.', standard: 'CEC 46' },
      { task: 'Emergency lighting full test', detail: 'Full duration test (30 min or 2 hours depending on occupancy). Replace any failed units or batteries.', standard: 'OBC / CEC 46-104' },
      { task: 'Engine oil and filter change', detail: 'Change engine oil and oil filter. Replace fuel filters. Replace air filter if needed.', standard: 'Manufacturer' },
      { task: 'Comprehensive electrical check', detail: 'Torque all electrical connections. IR scan switchgear. Verify protective relay settings. Test ground fault indication.', standard: 'NFPA 110 / CSA' },
      { task: 'Fuel tank cleaning', detail: 'Drain water from tank bottom. Test fuel sample. Consider tank cleaning if contamination found. Refill with fresh fuel.', standard: 'NFPA 110' },
      { task: 'Exhaust system inspection', detail: 'Inspect exhaust piping, flexible connectors, muffler, rain cap. Check for leaks, corrosion, or blockage.', standard: 'Manufacturer' },
    ],
  },
]

const loadBankSteps = [
  { step: 1, title: 'Pre-Test Preparation', detail: 'Notify building management and fire department (if required). Verify load bank is rated for generator output. Connect load bank to generator output terminals with properly sized cables. Ensure adequate ventilation for load bank heat rejection.' },
  { step: 2, title: 'Generator Warm-Up', detail: 'Start generator and allow to warm up for 15 minutes at no load. Verify oil pressure, coolant temperature, and battery charging. Record initial readings: voltage, frequency, oil pressure, coolant temp.' },
  { step: 3, title: 'Step Loading - 25%', detail: 'Apply 25% of rated load. Allow 15 minutes for stabilization. Record voltage, frequency, amperage, kW, oil pressure, coolant temp, exhaust temp. Verify no alarms or abnormal conditions.' },
  { step: 4, title: 'Step Loading - 50%', detail: 'Increase to 50% of rated load. Allow 15 minutes for stabilization. Record all parameters. Monitor exhaust colour (slight haze acceptable). Check for vibration or unusual noise.' },
  { step: 5, title: 'Step Loading - 75%', detail: 'Increase to 75% of rated load. Allow 15 minutes for stabilization. Record all parameters. Verify voltage regulation within +/- 5%. Verify frequency regulation within +/- 0.5 Hz.' },
  { step: 6, title: 'Full Load - 100%', detail: 'Increase to 100% of rated load. Run for minimum 2 hours at full load. Record parameters every 15 minutes. Monitor all temperatures against manufacturer limits. This is the critical test period.' },
  { step: 7, title: 'Overload Test (if required)', detail: 'Some specifications require brief overload test at 110% for 1 hour. Only perform if generator is rated for overload. Monitor closely for overheating.' },
  { step: 8, title: 'Cool-Down and Shutdown', detail: 'Reduce load in 25% steps, allowing 5 minutes at each level. Remove all load and run at no load for 15 minutes cool-down. Stop generator per normal procedure. Disconnect load bank.' },
  { step: 9, title: 'Documentation', detail: 'Complete test report with all recorded readings. Note any anomalies, alarms, or maintenance needs discovered. File report with building records. Schedule any follow-up maintenance identified.' },
]

const failureModes = [
  { failure: 'Generator fails to start', causes: 'Dead starting battery, low fuel, block heater failure, starter motor fault, fuel solenoid stuck', remedy: 'Test battery, check fuel level and supply valves, verify block heater, inspect starter, check fuel solenoid and wiring' },
  { failure: 'Generator starts but no voltage', causes: 'AVR failure, loss of residual magnetism, broken exciter winding, voltage regulator fault', remedy: 'Check AVR, flash field to restore residual magnetism, test exciter winding, inspect voltage regulator' },
  { failure: 'ATS fails to transfer', causes: 'Control logic fault, transfer motor failure, mechanical binding, utility-sense relay fault', remedy: 'Check control power, test transfer mechanism manually, inspect contacts, verify sensing voltage settings' },
  { failure: 'Generator runs but trips on load', causes: 'Overload, low oil pressure, high coolant temp, overcurrent relay, motor starting kVA too high', remedy: 'Verify load does not exceed rating, check oil level, check coolant system, review relay settings, sequence motor starts' },
  { failure: 'Unstable voltage or frequency', causes: 'Governor fault, AVR fault, overloaded generator, harmonic distortion from VFDs, fuel supply restriction', remedy: 'Inspect governor actuator, check AVR settings, reduce load, add line reactors, check fuel filters' },
  { failure: 'Generator runs rough / black smoke', causes: 'Dirty air filter, fuel contamination, injector fault, incorrect timing, overloaded', remedy: 'Replace air filter, test fuel quality, service injectors, check timing, verify load within rating' },
  { failure: 'Battery charger fault', causes: 'Charger output fuse blown, AC supply lost, charger circuit board fault, battery failed', remedy: 'Check fuses, verify AC supply, test charger output, load-test battery and replace if needed' },
  { failure: 'Coolant leak or overheat', causes: 'Hose failure, radiator leak, thermostat stuck, water pump failure, low coolant', remedy: 'Inspect hoses and clamps, pressure test radiator, replace thermostat, inspect water pump, refill coolant' },
]

const maintenanceChecklist = [
  { category: 'Engine', items: ['Oil level and condition', 'Coolant level and concentration', 'Fuel level and quality', 'Air filter condition', 'Belt tension and condition', 'Hose condition', 'Exhaust system integrity', 'Block heater operation'] },
  { category: 'Electrical', items: ['Starting battery voltage (min 24V or 12V)', 'Battery terminal condition (clean, tight)', 'Battery charger output', 'Generator output voltage (all phases)', 'Connection torque (annual)', 'Control panel indicators', 'Wiring insulation condition', 'Ground connections'] },
  { category: 'Fuel System', items: ['Fuel tank level (min 2/3 full recommended)', 'Water in fuel tank (drain weekly)', 'Fuel line connections', 'Fuel filter condition', 'Day tank operation (if equipped)', 'Transfer pump operation', 'Fuel return line', 'Tank vent'] },
  { category: 'Cooling System', items: ['Radiator core cleanliness', 'Fan blade condition', 'Thermostat operation', 'Coolant pH and freeze point', 'Water pump seals', 'Overflow tank level', 'Louver operation (if equipped)', 'Remote radiator connections'] },
  { category: 'Transfer Switch', items: ['Contact condition and alignment', 'Mechanism operation (smooth, no binding)', 'Control relay operation', 'Time delay settings verified', 'Sensing voltage thresholds', 'Exercise clock settings', 'Arc chute condition', 'Enclosure condition and seals'] },
]

/* ------------------------------------------------------------------ */
/*  Collapsible Card Component                                          */
/* ------------------------------------------------------------------ */

function Collapsible({ title, children, defaultOpen, accentColor, badge }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  accentColor?: string
  badge?: string
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div style={{ ...cardStyle, borderLeft: accentColor ? `4px solid ${accentColor}` : undefined }}>
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
            background: 'var(--bg)', padding: '2px 8px', borderRadius: 10,
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
/*  Tab Render Functions                                                 */
/* ------------------------------------------------------------------ */

function TabSystemTypes() {
  const [expandedSys, setExpandedSys] = useState<number | null>(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={sectionTitle}>Emergency Power Classifications</div>
      <div style={noteBanner}>
        CEC Section 46 classifies emergency power into three tiers based on life-safety criticality.
        The classification determines transfer time, wiring method, and testing requirements.
      </div>

      {systemDefs.map((sys, idx) => (
        <div key={sys.name} style={cardStyle}>
          <button
            onClick={() => setExpandedSys(expandedSys === idx ? null : idx)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
              color: sys.tint, background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
              style={{ flexShrink: 0, transform: expandedSys === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span style={{ flex: 1 }}>{sys.name}</span>
            <span style={codeRef}>{sys.cecRef}</span>
          </button>

          {expandedSys === idx && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                {sys.description}
              </div>

              <div style={{
                background: 'var(--bg)', borderRadius: 8, padding: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Transfer Time
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: sys.tint, ...mono }}>
                  {sys.transferTime}
                </div>
              </div>

              <div>
                <div style={{ ...subLabel, color: sys.tint }}>Required Loads</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {sys.examples.map((ex, i) => (
                    <div key={i} style={{ ...bulletItem, borderLeftColor: sys.tint }}>
                      {ex}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12 }}>
                <div style={{ ...subLabel, color: 'var(--primary)' }}>Wiring Requirements</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  {sys.wiringReqs}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* One-Line Diagram */}
      <div style={sectionTitle}>Typical Emergency/Standby Arrangement</div>
      <div style={cardStyle}>
        <div style={{ padding: 16 }}>
          <div style={{ ...subLabel, marginBottom: 12 }}>One-Line Diagram</div>
          <div style={{
            background: 'var(--bg)', borderRadius: 8, padding: 16,
            fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
            fontSize: 11, lineHeight: 1.6, color: 'var(--text)', overflowX: 'auto',
            whiteSpace: 'pre',
          }}>
{`  UTILITY SUPPLY
       |
  [Main Switchboard]
       |
  [Normal Bus]----[ATS-1]----[Emergency Bus]
       |              |            |
  [Normal Loads]  [Generator]  [Exit Signs]
       |              |        [Fire Alarm]
  [ATS-2]--------+   |        [Smoke Control]
       |              |        [Emerg Lighting]
  [Legally Req'd      |
   Standby Bus]       |
       |              |
  [Heating]      [ATS-3]----[Optional Bus]
  [Ventilation]       |          |
  [Communications]    |     [Data Center]
                      |     [Refrigeration]
                      |     [HVAC Comfort]

  PRIORITY:  Emergency > Legal Standby > Optional

  TRANSFER TIMES:
  ATS-1: 10 sec max (Emergency)
  ATS-2: 60 sec max (Legal Standby)
  ATS-3: As needed  (Optional)`}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={sectionTitle}>System Comparison</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Feature</th>
              <th style={{ ...tableHeader, color: '#ef4444' }}>Emergency</th>
              <th style={{ ...tableHeader, color: '#f59e0b' }}>Legal Standby</th>
              <th style={{ ...tableHeader, color: '#3b82f6' }}>Optional</th>
            </tr>
          </thead>
          <tbody>
            {comparisonTable.map((row, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, color: 'var(--primary)', fontSize: 12 }}>{row.feature}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>{row.emergency}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>{row.legalStandby}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>{row.optionalStandby}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CEC 46.2 Required Emergency Loads Detail */}
      <div style={sectionTitle}>CEC 46-200 Series: Required Emergency Loads</div>
      <Collapsible title="Exit Signs & Egress Lighting" accentColor="#ef4444" badge="46-104">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Exit signs must be illuminated at all times the building is occupied</div>
          <div style={bulletItem}>Emergency lighting along means of egress: corridors, stairways, exits</div>
          <div style={bulletItem}>Minimum illumination: 10 lux at floor level in exit paths</div>
          <div style={bulletItem}>Duration: 30 minutes minimum (OBC), 2 hours for assembly and high-rise</div>
          <div style={bulletItem}>Self-contained battery units with integral charger are acceptable</div>
          <div style={bulletItem}>Central battery systems or generator are alternatives</div>
        </div>
      </Collapsible>
      <Collapsible title="Fire Alarm Systems" accentColor="#ef4444" badge="46-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Fire alarm panels require emergency power backup</div>
          <div style={bulletItem}>Internal batteries provide 24-hour standby + 5-minute alarm</div>
          <div style={bulletItem}>Generator backup provides extended operation</div>
          <div style={bulletItem}>Dual supply from normal and emergency panel typical</div>
          <div style={bulletItem}>Supervision of power supply required per CAN/ULC-S524</div>
        </div>
      </Collapsible>
      <Collapsible title="Smoke Control Systems" accentColor="#ef4444" badge="46-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Stairwell pressurization fans are emergency loads</div>
          <div style={bulletItem}>Smoke exhaust fans classified as emergency</div>
          <div style={bulletItem}>Must operate within 10 seconds of power failure</div>
          <div style={bulletItem}>Typically large motor loads - critical for generator sizing</div>
          <div style={bulletItem}>Fire-rated wiring required to smoke control equipment</div>
        </div>
      </Collapsible>
      <Collapsible title="Elevator Systems" accentColor="#f59e0b" badge="46-200">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Elevator car lighting and communication are emergency loads</div>
          <div style={bulletItem}>Elevator operation may be legally required standby in high-rise</div>
          <div style={bulletItem}>Firefighter emergency operation requires power</div>
          <div style={bulletItem}>Pre-transfer signal to elevator controller prevents entrapment</div>
          <div style={bulletItem}>Typically one elevator at a time served by generator (sequential)</div>
        </div>
      </Collapsible>
    </div>
  )
}

function TabTransferSwitches() {
  const [expandedTs, setExpandedTs] = useState<number | null>(0)
  const [selectorLoad, setSelectorLoad] = useState('')

  const selectedScheme = transferSchemes.find(s =>
    s.loadType.toLowerCase().includes(selectorLoad.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={sectionTitle}>Transfer Switch Types</div>

      {transferTypes.map((ts, idx) => (
        <div key={ts.abbr} style={cardStyle}>
          <button
            onClick={() => setExpandedTs(expandedTs === idx ? null : idx)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
              color: ts.tint, background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
              style={{ flexShrink: 0, transform: expandedTs === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span style={{ flex: 1 }}>{ts.name}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
              background: `${ts.tint}22`, color: ts.tint, ...mono,
            }}>{ts.abbr}</span>
          </button>

          {expandedTs === idx && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                {ts.description}
              </div>

              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12 }}>
                <div style={{ ...subLabel, color: ts.tint }}>Operation Sequence</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {ts.operation}
                </div>
              </div>

              <div>
                <div style={{ ...subLabel, color: '#22c55e' }}>Advantages</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {ts.advantages.map((a, i) => (
                    <div key={i} style={{ ...bulletItem, borderLeftColor: '#22c55e' }}>{a}</div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ ...subLabel, color: '#ef4444' }}>Limitations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {ts.limitations.map((l, i) => (
                    <div key={i} style={{ ...bulletItem, borderLeftColor: '#ef4444' }}>{l}</div>
                  ))}
                </div>
              </div>

              <div style={noteBanner}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Typical Use: </span>
                {ts.typicalUse}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ATS Sizing Parameters */}
      <div style={sectionTitle}>Transfer Switch Sizing Parameters</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 450 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Parameter</th>
              <th style={tableHeader}>Description</th>
              <th style={tableHeader}>Typical</th>
            </tr>
          </thead>
          <tbody>
            {atsSizingParams.map((p, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, color: 'var(--primary)', fontSize: 12, whiteSpace: 'nowrap' }}>{p.param}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>{p.description}</td>
                <td style={{ ...tableCell, fontSize: 12, ...mono, whiteSpace: 'nowrap' }}>{p.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bypass Isolation */}
      <div style={sectionTitle}>Bypass Isolation Switches</div>
      <Collapsible title="Purpose and Requirements" accentColor="#a78bfa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            A bypass isolation switch allows the ATS to be completely removed from the circuit for maintenance
            or replacement without interrupting power to the load. The bypass switch provides a manual means
            to connect the load directly to either source.
          </div>
          <div style={{ ...subLabel, color: '#a78bfa' }}>When Required</div>
          <div style={bulletItem}>Critical facilities where load cannot be dropped for ATS maintenance</div>
          <div style={bulletItem}>Hospitals and healthcare facilities (CSA Z32)</div>
          <div style={bulletItem}>Data centers and telecommunications</div>
          <div style={bulletItem}>Facilities with single ATS serving critical loads</div>
          <div style={bulletItem}>Any application where ATS failure means complete loss of backup</div>
          <div style={{ ...subLabel, color: '#a78bfa', marginTop: 8 }}>Operation</div>
          <div style={bulletItem}>Bypass switch connects load to selected source (normal or emergency)</div>
          <div style={bulletItem}>Isolation contacts disconnect ATS from both sources</div>
          <div style={bulletItem}>ATS can be safely removed for repair with load still powered</div>
          <div style={bulletItem}>Bypass switch is manually operated - no automatic transfer capability</div>
          <div style={bulletItem}>Drawout ATS designs allow quick replacement</div>
        </div>
      </Collapsible>

      {/* Interactive Selector */}
      <div style={sectionTitle}>Transfer Scheme Selector</div>
      <div style={cardStyle}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={subLabel}>Select Load Type</div>
          <select
            value={selectorLoad}
            onChange={e => setSelectorLoad(e.target.value)}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'auto',
            }}
          >
            <option value="">-- Choose a load type --</option>
            {transferSchemes.map(s => (
              <option key={s.loadType} value={s.loadType}>{s.loadType}</option>
            ))}
          </select>

          {selectorLoad && selectedScheme && (
            <div style={resultBox}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
                Recommended Transfer Scheme
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginBottom: 8, ...mono }}>
                {selectedScheme.recommended}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                {selectedScheme.reason}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Transfer Scheme Table */}
      <Collapsible title="All Load Types & Recommended Schemes" badge={`${transferSchemes.length} types`}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Load Type</th>
                <th style={tableHeader}>Recommended</th>
                <th style={tableHeader}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {transferSchemes.map((s, i) => (
                <tr key={i}>
                  <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>{s.loadType}</td>
                  <td style={{ ...tableCell, fontSize: 12, color: 'var(--primary)', ...mono }}>{s.recommended}</td>
                  <td style={{ ...tableCell, fontSize: 11 }}>{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>

      {/* Common ATS Manufacturers */}
      <div style={sectionTitle}>Common ATS Manufacturers</div>
      <div style={cardStyle}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { maker: 'ASCO (Emerson)', models: 'Series 300, 7000, 4000', note: 'Industry leader. Full range 30A-4000A. Bypass isolation available.' },
            { maker: 'Eaton', models: 'ATC-300, ATC-800, ATC-900', note: 'Wide range. Integrated with Eaton switchgear. Power Xpert controls.' },
            { maker: 'Generac', models: 'RTSD, RTSN, RTSE', note: 'Residential and light commercial. Pairs with Generac generators.' },
            { maker: 'Russelectric', models: 'RMTD, RPTB', note: 'Heavy-duty industrial. Known for reliability. Bypass isolation standard.' },
            { maker: 'Cummins', models: 'OTEC, BTPC, PowerCommand', note: 'Integrated with Cummins generators. Cloud monitoring available.' },
            { maker: 'Kohler', models: 'KSS, KCC, KCP', note: 'Matched with Kohler generators. Decision-Maker controls.' },
            { maker: 'Siemens', models: 'STS Series', note: 'Integrated with Siemens switchgear. Full building automation support.' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: '10px 12px', background: 'var(--bg)', borderRadius: 8,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{m.maker}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', ...mono }}>{m.models}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabGenerators() {
  /* Calculator state */
  const [loads, setLoads] = useState([
    { id: 1, name: 'Lighting', kw: '', pf: '1.0', type: 'resistive' as const },
    { id: 2, name: 'Motor 1', kw: '', pf: '0.8', type: 'motor' as const },
  ])
  const [largestMotorHp, setLargestMotorHp] = useState('')
  const [startingMethod, setStartingMethod] = useState('DOL')
  const [altitude, setAltitude] = useState('')
  const [ambientTemp, setAmbientTemp] = useState('')

  let nextLoadId = loads.length > 0 ? Math.max(...loads.map(l => l.id)) + 1 : 1

  function addLoad() {
    setLoads(prev => [...prev, { id: nextLoadId++, name: '', kw: '', pf: '1.0', type: 'resistive' as const }])
  }
  function removeLoad(id: number) {
    if (loads.length <= 1) return
    setLoads(prev => prev.filter(l => l.id !== id))
  }
  function updateLoad(id: number, field: string, value: string) {
    setLoads(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  /* Calculations */
  const totalRunningKw = loads.reduce((sum, l) => {
    const kw = parseFloat(l.kw) || 0
    return sum + kw
  }, 0)

  const totalRunningKva = loads.reduce((sum, l) => {
    const kw = parseFloat(l.kw) || 0
    const pf = parseFloat(l.pf) || 1
    return sum + (pf > 0 ? kw / pf : kw)
  }, 0)

  const motorHp = parseFloat(largestMotorHp) || 0
  const motorKw = motorHp * 0.746
  const startMultiplier = startingMethod === 'DOL' ? 6 : startingMethod === 'WYE_DELTA' ? 2 : startingMethod === 'SOFT' ? 3 : startingMethod === 'VFD' ? 1.5 : 6
  const motorStartKva = (motorKw / 0.85) * startMultiplier

  const altMeters = parseFloat(altitude) || 0
  const altDerate = altMeters > 150 ? ((altMeters - 150) / 300) * 0.035 : 0
  const tempC = parseFloat(ambientTemp) || 25
  const tempDerate = tempC > 40 ? (tempC - 40) * 0.01 : 0
  const totalDerate = 1 - altDerate - tempDerate

  const peakKva = totalRunningKva + motorStartKva
  const requiredKw = totalDerate > 0 ? totalRunningKw / totalDerate : totalRunningKw
  const requiredKva = totalDerate > 0 ? peakKva / totalDerate : peakKva
  const recommendedSize = getNextGenSize(Math.max(requiredKw, requiredKva * 0.8))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Fuel Comparison */}
      <div style={sectionTitle}>Fuel Type Comparison</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 550 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Parameter</th>
              <th style={{ ...tableHeader, color: '#f59e0b' }}>Diesel</th>
              <th style={{ ...tableHeader, color: '#3b82f6' }}>Natural Gas</th>
              <th style={{ ...tableHeader, color: '#22c55e' }}>Propane</th>
            </tr>
          </thead>
          <tbody>
            {fuelComparison.map((row, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, fontSize: 11, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{row.param}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{row.diesel}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{row.natGas}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{row.propane}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sizing Methodology */}
      <div style={sectionTitle}>Generator Sizing Methodology</div>
      {genSizingSteps.map(s => (
        <div key={s.step} style={{
          ...cardStyle, padding: 16,
          display: 'flex', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--primary)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>
            {s.step}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.detail}</div>
          </div>
        </div>
      ))}

      {/* Motor Starting Impact */}
      <div style={sectionTitle}>Motor Starting Impact on Generator Sizing</div>
      <Collapsible title="Starting kVA Multipliers by Method" defaultOpen accentColor="#f59e0b">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeader}>Starting Method</th>
                <th style={tableHeader}>kVA Multiplier</th>
                <th style={tableHeader}>Typical Voltage Dip</th>
                <th style={tableHeader}>Application</th>
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'Direct On Line (DOL)', mult: '6x - 8x FLA', dip: '20-35%', app: 'Small motors < 10 HP' },
                { method: 'Wye-Delta', mult: '2x - 3x FLA', dip: '10-15%', app: 'Pumps, fans, compressors' },
                { method: 'Autotransformer', mult: '2.5x - 4x FLA', dip: '12-18%', app: 'Large motors, limited starting torque OK' },
                { method: 'Soft Starter', mult: '3x - 4x FLA', dip: '8-15%', app: 'Most motor types, adjustable ramp' },
                { method: 'VFD', mult: '1x - 1.5x FLA', dip: '< 5%', app: 'Variable speed, best for gen sizing' },
                { method: 'Part Winding', mult: '4x - 6x FLA', dip: '15-25%', app: 'Dual-winding motors only' },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>{row.method}</td>
                  <td style={{ ...tableCell, fontSize: 13, ...mono, color: 'var(--primary)' }}>{row.mult}</td>
                  <td style={{ ...tableCell, fontSize: 13, ...mono }}>{row.dip}</td>
                  <td style={{ ...tableCell, fontSize: 11 }}>{row.app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>

      {/* Interactive Calculator */}
      <div style={sectionTitle}>Generator Sizing Calculator</div>
      <div style={cardStyle}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={subLabel}>Connected Loads</div>

          {loads.map(l => (
            <div key={l.id} style={{
              background: 'var(--bg)', borderRadius: 8, padding: 12,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  value={l.name}
                  onChange={e => updateLoad(l.id, 'name', e.target.value)}
                  placeholder="Load name"
                  style={{ ...inputStyle, flex: 1, minHeight: 40 }}
                />
                <button
                  onClick={() => removeLoad(l.id)}
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'rgba(239,68,68,0.15)', border: 'none',
                    color: '#ef4444', fontSize: 18, cursor: 'pointer',
                  }}
                >
                  x
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>kW</div>
                  <input
                    type="number"
                    value={l.kw}
                    onChange={e => updateLoad(l.id, 'kw', e.target.value)}
                    placeholder="0"
                    style={{ ...inputStyle, minHeight: 40 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>PF</div>
                  <input
                    type="number"
                    value={l.pf}
                    onChange={e => updateLoad(l.id, 'pf', e.target.value)}
                    placeholder="1.0"
                    step="0.05"
                    style={{ ...inputStyle, minHeight: 40 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Type</div>
                  <select
                    value={l.type}
                    onChange={e => updateLoad(l.id, 'type', e.target.value)}
                    style={{ ...inputStyle, minHeight: 40, cursor: 'pointer', appearance: 'auto' }}
                  >
                    <option value="resistive">Resistive</option>
                    <option value="motor">Motor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addLoad}
            style={{
              minHeight: 48, borderRadius: 8,
              background: 'rgba(255,215,0,0.1)', border: '1px dashed var(--primary)',
              color: 'var(--primary)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Load
          </button>

          <div style={{ height: 1, background: 'var(--divider)' }} />

          <div style={subLabel}>Largest Motor Starting</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Largest Motor (HP)</div>
              <input
                type="number"
                value={largestMotorHp}
                onChange={e => setLargestMotorHp(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Starting Method</div>
              <select
                value={startingMethod}
                onChange={e => setStartingMethod(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
              >
                <option value="DOL">DOL (6x)</option>
                <option value="WYE_DELTA">Wye-Delta (2x)</option>
                <option value="SOFT">Soft Start (3x)</option>
                <option value="VFD">VFD (1.5x)</option>
              </select>
            </div>
          </div>

          <div style={subLabel}>Derating Factors</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Altitude (meters)</div>
              <input
                type="number"
                value={altitude}
                onChange={e => setAltitude(e.target.value)}
                placeholder="150"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Ambient Temp (C)</div>
              <input
                type="number"
                value={ambientTemp}
                onChange={e => setAmbientTemp(e.target.value)}
                placeholder="25"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Results */}
          <div style={{ height: 1, background: 'var(--divider)' }} />
          <div style={resultBox}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
              Sizing Results
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Running Load</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', ...mono }}>{totalRunningKw.toFixed(1)} kW</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Running kVA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', ...mono }}>{totalRunningKva.toFixed(1)} kVA</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Motor Start kVA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b', ...mono }}>{motorStartKva.toFixed(1)} kVA</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Peak kVA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', ...mono }}>{peakKva.toFixed(1)} kVA</div>
              </div>
              {(altDerate > 0 || tempDerate > 0) && (
                <>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Altitude Derate</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', ...mono }}>{(altDerate * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Temp Derate</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', ...mono }}>{(tempDerate * 100).toFixed(1)}%</div>
                  </div>
                </>
              )}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Required kW (derated)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', ...mono }}>{requiredKw.toFixed(1)} kW</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Required kVA (derated)</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', ...mono }}>{requiredKva.toFixed(1)} kVA</div>
              </div>
            </div>

            <div style={{
              marginTop: 16, padding: 16, borderRadius: 8,
              background: 'rgba(255,215,0,0.12)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Recommended Generator Size
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', ...mono, marginTop: 4 }}>
                {recommendedSize} kW
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Next standard size above calculated requirement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Storage */}
      <div style={sectionTitle}>Fuel Storage Requirements</div>
      <Collapsible title="Diesel Fuel Storage" accentColor="#f59e0b" badge="Fire Code">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Indoor storage: maximum 2,500 litres in approved tank within generator room</div>
          <div style={bulletItem}>Sub-base tanks (integral to generator): most common indoor configuration</div>
          <div style={bulletItem}>Outdoor above-ground tanks: double-wall required, secondary containment (110% capacity)</div>
          <div style={bulletItem}>Underground tanks: TSSA regulated, leak detection required</div>
          <div style={bulletItem}>Minimum run time: 2 hours (CEC minimum), 8-72 hours per AHJ for critical facilities</div>
          <div style={bulletItem}>Fuel consumption rate: approximately 0.27 L/kW/hr at full load for diesel</div>
          <div style={bulletItem}>Day tank required if main tank is remote (typically 1-4 hours supply)</div>
          <div style={bulletItem}>Fuel treatment additive required for stored diesel (biocide, stabilizer)</div>
          <div style={bulletItem}>Annual fuel testing recommended (water content, microbial growth, cetane number)</div>
        </div>
      </Collapsible>

      {/* Exhaust and Ventilation */}
      <Collapsible title="Exhaust & Ventilation Requirements" accentColor="#ef4444">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#ef4444' }}>Exhaust System</div>
          <div style={bulletItem}>Exhaust must terminate outdoors, directed away from air intakes and openings</div>
          <div style={bulletItem}>Flexible connector between engine and rigid exhaust piping (vibration isolation)</div>
          <div style={bulletItem}>Exhaust piping must slope toward engine (condensation drainage)</div>
          <div style={bulletItem}>Rain cap on exhaust outlet to prevent water entry</div>
          <div style={bulletItem}>Minimum clearance from combustibles per fire code (typically 50mm with insulation)</div>
          <div style={bulletItem}>Thimble or fire-rated penetration through walls/floors</div>
          <div style={{ ...subLabel, color: '#3b82f6', marginTop: 8 }}>Ventilation</div>
          <div style={bulletItem}>Generator room requires combustion air supply: approximately 7 m3/min per 100 kW</div>
          <div style={bulletItem}>Cooling air: radiator-cooled generators reject heat to room; air must be exhausted</div>
          <div style={bulletItem}>Remote radiator eliminates room heat rejection (common for indoor installations)</div>
          <div style={bulletItem}>Room temperature should not exceed 50C during operation</div>
          <div style={bulletItem}>Motorized louvers for combustion air intake and hot air exhaust</div>
          <div style={bulletItem}>Louvers must open before generator starts (interlock required)</div>
        </div>
      </Collapsible>

      {/* Noise and Enclosures */}
      <Collapsible title="Noise Considerations & Enclosures" accentColor="#a78bfa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Typical open generator: 85-105 dBA at 1 meter (depends on size and type)</div>
          <div style={bulletItem}>Sound-attenuated enclosure: reduces noise 15-35 dBA</div>
          <div style={bulletItem}>Hospital/residential grade enclosure: 65-75 dBA at 7 meters</div>
          <div style={bulletItem}>Critical grade (ultra-quiet): 55-65 dBA at 7 meters</div>
          <div style={bulletItem}>Municipal noise bylaws typically limit 45-55 dBA at property line (nighttime)</div>
          <div style={bulletItem}>Sound barriers, walls, and distance all contribute to noise reduction</div>
          <div style={bulletItem}>Exhaust silencer grades: residential (12-18 dB), critical (25-35 dB), super critical (35+ dB)</div>
        </div>
      </Collapsible>

      {/* Paralleling */}
      <Collapsible title="Paralleling Generators" accentColor="#22c55e">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#22c55e' }}>Why Parallel</div>
          <div style={bulletItem}>Redundancy: N+1 configuration allows one unit to fail without losing load</div>
          <div style={bulletItem}>Scalability: add generator capacity as facility grows</div>
          <div style={bulletItem}>Efficiency: run fewer units at higher load (better fuel efficiency)</div>
          <div style={bulletItem}>Maintenance: service one unit while others carry the load</div>
          <div style={{ ...subLabel, color: '#22c55e', marginTop: 8 }}>Requirements</div>
          <div style={bulletItem}>Synchronization: voltage, frequency, phase angle must match before paralleling</div>
          <div style={bulletItem}>Load sharing controls: isochronous or droop mode governor control</div>
          <div style={bulletItem}>Paralleling switchgear: breakers, CTs, PTs, sync check relay, protective relays</div>
          <div style={bulletItem}>Reverse power relay (32): prevents motoring of generator</div>
          <div style={bulletItem}>All generators should be same voltage and frequency rating</div>
          <div style={bulletItem}>Mixed sizes allowed but complicates load sharing</div>
        </div>
      </Collapsible>

      {/* Load Bank Testing */}
      <Collapsible title="Load Bank Testing" accentColor="#3b82f6">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>
            Load bank testing applies a controlled resistive (and sometimes reactive) load to the generator
            to verify it can deliver full rated output. Required annually if monthly loaded runs do not
            achieve at least 30% of rated load (wet stacking prevention).
          </div>
          <div style={bulletItem}>Resistive load bank: most common, tests kW output, pure resistive (PF=1.0)</div>
          <div style={bulletItem}>Reactive load bank: tests kVA output at reduced power factor</div>
          <div style={bulletItem}>Combined load bank: tests both kW and kVAR simultaneously</div>
          <div style={bulletItem}>Trailer-mounted load banks available for rental (100 kW to 3000 kW)</div>
          <div style={bulletItem}>Connection via properly sized temporary cables to generator output terminals</div>
          <div style={bulletItem}>Load bank generates significant heat: ensure adequate clearance and ventilation</div>
        </div>
      </Collapsible>
    </div>
  )
}

function TabCecRequirements() {
  const [expandedRule, setExpandedRule] = useState<number | null>(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={sectionTitle}>CEC Section 46: Emergency Power Rules</div>
      <div style={noteBanner}>
        CEC Section 46 governs all emergency power installations in Ontario. The rules are organized
        by system type (emergency, legally required standby, optional standby) with increasing
        requirements as criticality increases. Always verify with current edition of CEC.
      </div>

      {cecRules.map((rule, idx) => (
        <div key={rule.section} style={cardStyle}>
          <button
            onClick={() => setExpandedRule(expandedRule === idx ? null : idx)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 600,
              color: 'var(--text)', background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
              style={{ flexShrink: 0, transform: expandedRule === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span style={{ flex: 1 }}>{rule.title}</span>
            <span style={codeRef}>{rule.section}</span>
          </button>

          {expandedRule === idx && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>
                {rule.summary}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rule.details.map((d, i) => (
                  <div key={i} style={bulletItem}>{d}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Wiring Methods */}
      <div style={sectionTitle}>Wiring Methods for Emergency Circuits</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 550 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Wiring Method</th>
              <th style={tableHeader}>Fire Rating</th>
              <th style={tableHeader}>Application</th>
              <th style={tableHeader}>CEC Ref</th>
            </tr>
          </thead>
          <tbody>
            {wiringMethods.map((wm, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, fontSize: 12 }}>{wm.method}</td>
                <td style={{ ...tableCell, fontSize: 12, ...mono, color: wm.fireRating.includes('hour') ? '#22c55e' : '#ef4444' }}>{wm.fireRating}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{wm.application}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>
                  <span style={codeRef}>{wm.cecRef}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overcurrent Protection */}
      <div style={sectionTitle}>Overcurrent Protection</div>
      <Collapsible title="Emergency System OCP Requirements" accentColor="#ef4444" badge="46-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>OCPDs for emergency circuits must be accessible to authorized persons only</div>
          <div style={bulletItem}>Use locked panel covers or locate in restricted electrical rooms</div>
          <div style={bulletItem}>Coordinate with upstream protective devices for selective coordination</div>
          <div style={bulletItem}>Ground fault indication (not protection) on emergency systems to avoid nuisance tripping</div>
          <div style={bulletItem}>Emergency panel breakers should be clearly identified (red handle ties common)</div>
          <div style={bulletItem}>Selective coordination: a fault on one emergency branch should not trip upstream devices</div>
          <div style={bulletItem}>Series-rated combinations should be avoided on emergency systems</div>
          <div style={noteBanner}>
            <strong>Key Principle:</strong> Emergency system OCP is designed to keep circuits energized.
            Ground fault protection (GFPE) on the main may be replaced with ground fault indication
            to prevent a ground fault from de-energizing the entire emergency system.
          </div>
        </div>
      </Collapsible>

      {/* Grounding */}
      <div style={sectionTitle}>Grounding of Emergency Systems</div>
      <Collapsible title="Generator Grounding Requirements" accentColor="#22c55e" badge="10-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Generator frame must be bonded to building grounding electrode system</div>
          <div style={bulletItem}>If generator is a separately derived system: requires its own grounding electrode</div>
          <div style={bulletItem}>Neutral-ground bond at generator OR at first disconnect (not both to avoid parallel ground paths)</div>
          <div style={bulletItem}>3-pole ATS: neutral is not switched, N-G bond typically at generator</div>
          <div style={bulletItem}>4-pole ATS: neutral is switched, N-G bond at generator AND at service (both isolated by 4th pole)</div>
          <div style={bulletItem}>Portable generators: frame grounding per CEC 10-100, bonding to building ground</div>
          <div style={bulletItem}>Ground fault sensing must be compatible with grounding scheme</div>
          <div style={{
            background: 'var(--bg)', borderRadius: 8, padding: 12, marginTop: 8,
            fontFamily: '"SF Mono", "Cascadia Code", "Consolas", monospace',
            fontSize: 11, lineHeight: 1.6, color: 'var(--text)', whiteSpace: 'pre',
          }}>
{`3-POLE ATS (Unswitched Neutral):
  Generator ── N-G bond at gen
       |
  [3P ATS] ─── neutral continuous through
       |
  Service ── N-G bond at service disconnect
  CAUTION: Parallel neutral path exists

4-POLE ATS (Switched Neutral):
  Generator ── N-G bond at gen
       |
  [4P ATS] ─── neutral switched (isolated)
       |
  Service ── N-G bond at service disconnect
  PREFERRED: No parallel neutral path`}
          </div>
        </div>
      </Collapsible>

      {/* Signage */}
      <div style={sectionTitle}>Signage & Identification Requirements</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={tableHeader}>Location</th>
              <th style={tableHeader}>Required Sign</th>
              <th style={tableHeader}>Ref</th>
            </tr>
          </thead>
          <tbody>
            {signsRequired.map((s, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{s.location}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>{s.sign}</td>
                <td style={{ ...tableCell, fontSize: 12 }}>
                  <span style={codeRef}>{s.cecRef}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fire Pump */}
      <div style={sectionTitle}>Fire Pump Power Supply</div>
      <Collapsible title="CEC 32-200: Fire Pump Requirements" accentColor="#ef4444" badge="32-200">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Fire pump must be supplied from a reliable source ahead of main building disconnect</div>
          <div style={bulletItem}>Tap ahead of main disconnect ensures fire pump operates even if main is opened</div>
          <div style={bulletItem}>Fire pump disconnect must be lockable in the open position only</div>
          <div style={bulletItem}>Fire pump OCP must NOT open on locked-rotor current (allow pump to run under any conditions)</div>
          <div style={bulletItem}>Where generator backup is provided, dedicated ATS for fire pump required</div>
          <div style={bulletItem}>ATS for fire pump must transfer within 10 seconds</div>
          <div style={bulletItem}>Fire pump wiring must be fire-rated: MI cable or equivalent 2-hour rated</div>
          <div style={bulletItem}>Loss of power to fire pump must send supervisory signal to fire alarm panel</div>
          <div style={bulletItem}>Phase reversal protection required for three-phase fire pumps</div>
          <div style={bulletItem}>Jockey pump on same supply, separate overcurrent protection</div>
        </div>
      </Collapsible>

      {/* Healthcare */}
      <div style={sectionTitle}>Healthcare Facility Requirements</div>
      <Collapsible title="CSA Z32: Electrical Safety in Healthcare" accentColor="#a78bfa" badge="CSA Z32">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#a78bfa' }}>Essential Electrical System Branches</div>
          <div style={bulletItem}>Life Safety Branch: exit lights, alarm systems, communication, generator accessories</div>
          <div style={bulletItem}>Critical Branch: task lighting at surgical tables, ICU/CCU power, pharmacy refrigeration</div>
          <div style={bulletItem}>Equipment Branch: HVAC for critical areas, elevators, supply/exhaust fans</div>
          <div style={{ ...subLabel, color: '#a78bfa', marginTop: 8 }}>Key Requirements</div>
          <div style={bulletItem}>Each branch served by separate ATS for selective load management</div>
          <div style={bulletItem}>Generator must restore power within 10 seconds</div>
          <div style={bulletItem}>Minimum two generators recommended (redundancy)</div>
          <div style={bulletItem}>Fuel supply for 96 hours (4 days) of operation recommended</div>
          <div style={bulletItem}>Isolated power systems in wet procedure locations (operating rooms)</div>
          <div style={bulletItem}>Line isolation monitors (LIM) required for isolated power panels</div>
          <div style={bulletItem}>Monthly generator load tests, annual full-load tests (4 hours)</div>
          <div style={bulletItem}>Type 1 essential electrical system for hospitals, Type 2 for nursing homes</div>
        </div>
      </Collapsible>

      {/* Testing Requirements per CEC */}
      <div style={sectionTitle}>Testing & Maintenance per CEC</div>
      <Collapsible title="CEC Section 46 Testing Rules" accentColor="#3b82f6" badge="46-108">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={bulletItem}>Emergency systems must be tested periodically to ensure operation</div>
          <div style={bulletItem}>Written records of tests must be maintained and available for inspection</div>
          <div style={bulletItem}>Testing must simulate actual power failure conditions</div>
          <div style={bulletItem}>ATS transfer and retransfer must be tested</div>
          <div style={bulletItem}>Generator must be tested under load (building load or load bank)</div>
          <div style={bulletItem}>Battery-powered emergency lighting: monthly 30-second test, annual full-duration test</div>
          <div style={bulletItem}>Test records must include: date, duration, load, deficiencies found, corrective actions</div>
          <div style={bulletItem}>AHJ may require specific testing schedules beyond CEC minimum</div>
        </div>
      </Collapsible>
    </div>
  )
}

function TabTesting() {
  const [expandedSchedule, setExpandedSchedule] = useState<number | null>(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Testing Schedules */}
      <div style={sectionTitle}>Testing Schedules</div>
      <div style={noteBanner}>
        Testing schedules are based on NFPA 110 (referenced by Ontario codes), CEC Section 46,
        and manufacturer recommendations. Always follow the most stringent applicable requirement.
      </div>

      {testSchedules.map((sched, idx) => (
        <div key={sched.frequency} style={cardStyle}>
          <button
            onClick={() => setExpandedSchedule(expandedSchedule === idx ? null : idx)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', minHeight: 56, fontSize: 15, fontWeight: 700,
              color: idx === 0 ? '#22c55e' : idx === 1 ? '#3b82f6' : idx === 2 ? '#f59e0b' : '#ef4444',
              background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"
              style={{ flexShrink: 0, transform: expandedSchedule === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span style={{ flex: 1 }}>{sched.frequency} Testing</span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
              background: 'var(--bg)', padding: '2px 8px', borderRadius: 10,
            }}>
              {sched.items.length} items
            </span>
          </button>

          {expandedSchedule === idx && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sched.items.map((item, i) => (
                <div key={i} style={{
                  background: 'var(--bg)', borderRadius: 8, padding: 12,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{item.task}</div>
                    <span style={codeRef}>{item.standard}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Load Bank Testing Procedure */}
      <div style={sectionTitle}>Load Bank Testing Procedure</div>
      {loadBankSteps.map(s => (
        <div key={s.step} style={{
          ...cardStyle, padding: 16,
          display: 'flex', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: s.step <= 2 ? '#3b82f6' : s.step <= 7 ? '#f59e0b' : '#22c55e',
            color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>
            {s.step}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.detail}</div>
          </div>
        </div>
      ))}

      {/* NFPA 110 */}
      <div style={sectionTitle}>NFPA 110 Requirements</div>
      <Collapsible title="NFPA 110: Standard for Emergency and Standby Power" accentColor="#ef4444" badge="Referenced">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>
            NFPA 110 is the primary standard for emergency and standby power systems in North America.
            While a US standard, it is referenced by Ontario codes and widely adopted as best practice
            for generator installation, testing, and maintenance.
          </div>
          <div style={{ ...subLabel, color: '#ef4444' }}>Key NFPA 110 Requirements</div>
          <div style={bulletItem}>Level 1 systems (life safety): 10-second transfer, Type 10 classification</div>
          <div style={bulletItem}>Level 2 systems (less critical): 60-second transfer, Type 60 classification</div>
          <div style={bulletItem}>Class defines run time: Class 0.083 (5 min) to Class 48 (48 hours)</div>
          <div style={bulletItem}>Monthly testing under load for minimum 30 minutes</div>
          <div style={bulletItem}>Annual load bank test if monthly tests do not achieve 30% of nameplate rating</div>
          <div style={bulletItem}>Diesel generators should be exercised at minimum 30% load to prevent wet stacking</div>
          <div style={bulletItem}>Written maintenance schedule and test records required</div>
          <div style={bulletItem}>Fuel quality testing at least annually</div>
          <div style={bulletItem}>Battery replacement schedule based on manufacturer recommendations</div>
          <div style={bulletItem}>Exercise under load at least once per month (transfer to building loads)</div>
        </div>
      </Collapsible>

      {/* Maintenance Checklist */}
      <div style={sectionTitle}>Maintenance Checklist</div>
      {maintenanceChecklist.map(cat => (
        <Collapsible key={cat.category} title={cat.category} badge={`${cat.items.length} items`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: i < cat.items.length - 1 ? '1px solid var(--divider)' : 'none',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: '2px solid var(--divider)', flexShrink: 0,
                }} />
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{item}</div>
              </div>
            ))}
          </div>
        </Collapsible>
      ))}

      {/* ATS Testing */}
      <div style={sectionTitle}>ATS Testing & Exercising</div>
      <Collapsible title="ATS Test Procedure" accentColor="#3b82f6" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#3b82f6' }}>Monthly Exercise Test</div>
          <div style={bulletItem}>1. Notify building management and monitoring station</div>
          <div style={bulletItem}>2. Simulate utility failure at ATS (test switch or utility disconnect)</div>
          <div style={bulletItem}>3. Verify generator auto-starts within programmed time delay</div>
          <div style={bulletItem}>4. Verify ATS transfers load to generator within rated time</div>
          <div style={bulletItem}>5. Run on generator for minimum 30 minutes under building load</div>
          <div style={bulletItem}>6. Record voltage, frequency, amperage on all phases</div>
          <div style={bulletItem}>7. Restore normal power (or simulate restoration)</div>
          <div style={bulletItem}>8. Verify ATS retransfers to normal after time delay</div>
          <div style={bulletItem}>9. Verify generator cool-down timer runs, then generator stops</div>
          <div style={bulletItem}>10. Verify ATS returns to normal monitoring mode</div>
          <div style={{ ...subLabel, color: '#f59e0b', marginTop: 8 }}>ATS Settings to Verify</div>
          <div style={bulletItem}>Under-voltage trip point (typically 85-90% of nominal)</div>
          <div style={bulletItem}>Time delay on start (typically 1-5 seconds, avoids momentary outages)</div>
          <div style={bulletItem}>Time delay on transfer to emergency (per code requirement)</div>
          <div style={bulletItem}>Time delay on retransfer to normal (typically 5-30 minutes)</div>
          <div style={bulletItem}>Engine cool-down timer (typically 5-15 minutes unloaded)</div>
          <div style={bulletItem}>Exercise clock settings (day, time, duration, with/without load)</div>
        </div>
      </Collapsible>

      {/* Battery Charger Testing */}
      <div style={sectionTitle}>Generator Starting Battery</div>
      <Collapsible title="Battery & Charger Testing" accentColor="#f59e0b">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#f59e0b' }}>Battery Types</div>
          <div style={bulletItem}>Lead-acid (flooded): most common, requires electrolyte maintenance, 3-5 year life</div>
          <div style={bulletItem}>AGM (Absorbed Glass Mat): maintenance-free, 4-6 year life, higher cost</div>
          <div style={bulletItem}>Gel cell: maintenance-free, vibration resistant, 4-6 year life</div>
          <div style={{ ...subLabel, color: '#f59e0b', marginTop: 8 }}>Testing Procedure</div>
          <div style={bulletItem}>Float voltage check: 13.2-13.8V (12V battery), 26.4-27.6V (24V system)</div>
          <div style={bulletItem}>Specific gravity: 1.260-1.280 at full charge (flooded cells only)</div>
          <div style={bulletItem}>Load test: apply 50% of CCA rating for 15 seconds, voltage should stay above 9.6V (12V) or 19.2V (24V)</div>
          <div style={bulletItem}>Check charger output: should maintain float voltage with battery connected</div>
          <div style={bulletItem}>Equalization charge quarterly for flooded lead-acid (per manufacturer)</div>
          <div style={bulletItem}>Clean and tighten terminals, check for corrosion, apply protective compound</div>
          <div style={bulletItem}>Replace batteries on a schedule, not just when they fail (proactive replacement)</div>
        </div>
      </Collapsible>

      {/* Record Keeping */}
      <div style={sectionTitle}>Record Keeping Requirements</div>
      <Collapsible title="Required Documentation" accentColor="#22c55e" badge="NFPA 110">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...subLabel, color: '#22c55e' }}>Test Log Must Include</div>
          <div style={bulletItem}>Date and time of test</div>
          <div style={bulletItem}>Name of person conducting test</div>
          <div style={bulletItem}>Type of test (weekly exercise, monthly load, annual load bank)</div>
          <div style={bulletItem}>Duration of test and load applied</div>
          <div style={bulletItem}>Generator readings: voltage (all phases), frequency, amperage, kW, oil pressure, coolant temp</div>
          <div style={bulletItem}>ATS operation: transfer time, retransfer time, proper sequencing</div>
          <div style={bulletItem}>Deficiencies found and corrective actions taken</div>
          <div style={bulletItem}>Fuel consumed and fuel level before/after test</div>
          <div style={bulletItem}>Battery voltage before and after cranking</div>
          <div style={{ ...subLabel, color: '#22c55e', marginTop: 8 }}>Retention</div>
          <div style={bulletItem}>Maintain records for minimum 3 years (or as required by AHJ)</div>
          <div style={bulletItem}>Records must be available for inspection by AHJ and fire department</div>
          <div style={bulletItem}>Digital records acceptable if backed up and accessible</div>
          <div style={bulletItem}>Include manufacturer maintenance records and warranty documentation</div>
        </div>
      </Collapsible>

      {/* Common Failure Modes */}
      <div style={sectionTitle}>Common Failure Modes & Troubleshooting</div>
      <div style={{ ...cardStyle, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ ...tableHeader, width: '20%' }}>Failure</th>
              <th style={{ ...tableHeader, width: '35%' }}>Common Causes</th>
              <th style={{ ...tableHeader, width: '45%' }}>Remedy</th>
            </tr>
          </thead>
          <tbody>
            {failureModes.map((fm, i) => (
              <tr key={i}>
                <td style={{ ...tableCell, fontWeight: 600, fontSize: 12, color: '#ef4444' }}>{fm.failure}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{fm.causes}</td>
                <td style={{ ...tableCell, fontSize: 11 }}>{fm.remedy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pre-Transfer Inspection Checklist */}
      <div style={sectionTitle}>Pre-Transfer Inspection Checklist</div>
      <Collapsible title="Before Transferring to Generator" accentColor="#f59e0b" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            'Verify generator is in AUTO mode and ready to start',
            'Check fuel level is adequate for expected run time',
            'Verify coolant level and no visible leaks',
            'Check oil level on dipstick (within operating range)',
            'Verify block heater is energized and engine is warm',
            'Check battery charger is operating (float voltage normal)',
            'Verify ATS is in NORMAL position with no alarms',
            'Confirm all emergency circuit breakers are closed (on)',
            'Check generator room ventilation louvers operate freely',
            'Verify exhaust system is intact and unobstructed',
            'Ensure generator disconnect is in the CLOSED position',
            'Check for any maintenance lockouts or tags',
            'Verify fire suppression system in generator room is armed',
            'Confirm monitoring station has been notified of planned test',
            'Ensure emergency lighting battery units are charged',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderBottom: i < 14 ? '1px solid var(--divider)' : 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 4,
                border: '2px solid var(--primary)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--primary)', fontWeight: 700, ...mono,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function EmergencyPowerPage() {
  const nav = useNavigate()
  const [tab, setTab] = useState<TabKey>('types')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '18px 16px 10px',
        borderBottom: '1px solid var(--divider)',
        background: 'var(--surface)',
      }}>
        <button
          onClick={() => nav(-1)}
          style={{
            background: 'none', border: 'none', color: 'var(--primary)',
            fontSize: 22, cursor: 'pointer', padding: 4,
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Emergency & Standby Power
        </h1>
      </div>

      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Tab pills */}
        <div style={{ ...pillRow, marginTop: 12 }}>
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

        {/* Tab Content */}
        {tab === 'types' && <TabSystemTypes />}
        {tab === 'transfer' && <TabTransferSwitches />}
        {tab === 'generators' && <TabGenerators />}
        {tab === 'cec' && <TabCecRequirements />}
        {tab === 'testing' && <TabTesting />}
      </div>
    </div>
  )
}
