import { useState } from 'react'
import Header from '../../layout/Header'

/* ------------------------------------------------------------------ */
/*  Arc Flash Reference — CSA Z462, NFPA 70E, IEEE 1584              */
/*  Comprehensive reference for Ontario mining electricians            */
/* ------------------------------------------------------------------ */

type TabKey = 'ppe' | 'boundaries' | 'labels' | 'risk' | 'prevention'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ppe', label: 'PPE Categories' },
  { key: 'boundaries', label: 'Boundaries' },
  { key: 'labels', label: 'Labels' },
  { key: 'risk', label: 'Risk Assessment' },
  { key: 'prevention', label: 'Prevention' },
]

/* ------------------------------------------------------------------ */
/*  PPE Category Data                                                  */
/* ------------------------------------------------------------------ */

interface PPECategory {
  category: number
  arcRating: number
  color: string
  ppeItems: string[]
  typicalLocations: string[]
  miningNotes: string
}

const ppeCategories: PPECategory[] = [
  {
    category: 1,
    arcRating: 4,
    color: '#4ade80',
    ppeItems: [
      'Arc-rated long-sleeve shirt and pants (min 4 cal/cm²)',
      'Arc-rated face shield OR arc-rated balaclava',
      'Safety glasses or safety goggles',
      'Hard hat (non-melting)',
      'Hearing protection',
      'Heavy-duty leather gloves',
      'Leather work boots',
    ],
    typicalLocations: [
      '120V panelboards with bolted fault current <10kA',
      'Small 208V control panels',
      'Lighting panels with current-limiting fuses',
      'Low-energy control circuits',
    ],
    miningNotes: 'Common for 120V mine lighting panels, control stations for ventilation fans, and low-voltage instrument circuits on surface facilities.',
  },
  {
    category: 2,
    arcRating: 8,
    color: '#ffd700',
    ppeItems: [
      'Arc-rated long-sleeve shirt and pants (min 8 cal/cm²)',
      'Arc-rated flash suit hood OR arc-rated face shield AND arc-rated balaclava',
      'Arc-rated hard hat liner',
      'Safety glasses or safety goggles (under face shield)',
      'Hearing protection (under balaclava)',
      'Heavy-duty leather gloves',
      'Leather work boots',
    ],
    typicalLocations: [
      '208V panelboards and switchboards',
      '240V panelboards (residential / small commercial)',
      '480V panelboards with current-limiting fuses',
      '600V motor control centers (with reduced fault current)',
      'Opening hinged covers for voltage testing',
    ],
    miningNotes: 'Typical for 208/240V panels at surface buildings, mine dry facilities, and smaller 600V distribution with current-limiting protection. Also for portable power distribution units.',
  },
  {
    category: 3,
    arcRating: 25,
    color: '#ff8c00',
    ppeItems: [
      'Arc-rated flash suit jacket and pants (min 25 cal/cm²)',
      'Arc-rated flash suit hood with viewing window',
      'Arc-rated hard hat liner',
      'Safety glasses or goggles (under hood)',
      'Hearing protection (under hood)',
      'Arc-rated gloves (rubber insulating with leather protectors)',
      'Leather work boots',
    ],
    typicalLocations: [
      '600V switchgear and switchboards',
      '600V motor control centers (standard)',
      '480V switchgear with higher fault currents',
      'Medium-voltage cable terminations (with reduced energy)',
      'Bus work in enclosed equipment',
    ],
    miningNotes: 'Common for underground mine power centers, 600V switchgear in surface substations, and primary distribution switchgear with arc-reduction maintenance switches engaged.',
  },
  {
    category: 4,
    arcRating: 40,
    color: '#ff3c3c',
    ppeItems: [
      'Arc-rated flash suit jacket and pants (min 40 cal/cm²)',
      'Arc-rated flash suit hood with viewing window',
      'Arc-rated hard hat liner',
      'Safety glasses or goggles (under hood)',
      'Hearing protection (under hood)',
      'Arc-rated gloves (rubber insulating with leather protectors)',
      'Leather work boots',
      'Arc-rated full body suit (may require multi-layer system)',
    ],
    typicalLocations: [
      '600V motor control centers with high fault current',
      '600V switchgear without current-limiting devices',
      '4160V switchgear and motor starters',
      '13.8kV switchgear',
      'Racking breakers in or out',
      'Medium-voltage cable splicing',
    ],
    miningNotes: 'Required for underground main switchgear (4160V), surface substation medium-voltage work, portable mine power center main breakers at 600V, and any 13.8kV switching operations.',
  },
]

interface TaskCategory {
  task: string
  typicalCat: string
  catColor: string
  notes: string
}

const taskCategories: TaskCategory[] = [
  { task: 'Reading panel meters / indicators', typicalCat: '1', catColor: '#4ade80', notes: 'Doors closed, normal operation' },
  { task: 'Operating a circuit breaker (closed door)', typicalCat: '1', catColor: '#4ade80', notes: 'Using standard operating handle' },
  { task: 'Opening hinged cover (voltage testing)', typicalCat: '2', catColor: '#ffd700', notes: 'Exposing live bus or components' },
  { task: 'Removing bolted covers', typicalCat: '2–3', catColor: '#ff8c00', notes: 'Depends on available fault current' },
  { task: 'Voltage testing (exposed conductors)', typicalCat: '2–3', catColor: '#ff8c00', notes: 'Contact with test probes near live parts' },
  { task: 'Racking breaker in/out', typicalCat: '3–4', catColor: '#ff3c3c', notes: 'High energy during racking operation' },
  { task: 'Inserting/removing MCC bucket', typicalCat: '3–4', catColor: '#ff3c3c', notes: 'Potential for arc during insertion' },
  { task: 'Cable termination work (energized)', typicalCat: '3–4', catColor: '#ff3c3c', notes: 'Working distance typically close' },
  { task: 'Applying safety grounds (after de-energizing)', typicalCat: '2', catColor: '#ffd700', notes: 'Risk from stored energy or backfeed' },
  { task: 'Operating disconnect (open-air, 600V)', typicalCat: '2', catColor: '#ffd700', notes: 'Visible break, potential arc on operation' },
  { task: 'IR scanning (closed doors)', typicalCat: '1', catColor: '#4ade80', notes: 'Through IR window, no exposed parts' },
  { task: 'Underground switchgear operation (4160V)', typicalCat: '4', catColor: '#ff3c3c', notes: 'Mining: high fault current, confined space' },
  { task: 'Surface substation MV switching', typicalCat: '3–4', catColor: '#ff3c3c', notes: 'Mining: depends on protection settings' },
  { task: 'Portable power center maintenance', typicalCat: '3', catColor: '#ff8c00', notes: 'Mining: 600V typical, verify label' },
]

/* ------------------------------------------------------------------ */
/*  Boundary Data                                                      */
/* ------------------------------------------------------------------ */

interface BoundaryRow {
  voltage: string
  flashProtection: string
  limited: string
  restricted: string
  prohibited: string
}

const boundaryTable: BoundaryRow[] = [
  { voltage: '120V', flashProtection: '1.2m (4 ft)*', limited: '1.1m (3.5 ft)', restricted: 'Avoid contact', prohibited: 'Avoid contact' },
  { voltage: '208V', flashProtection: '1.2m (4 ft)*', limited: '1.1m (3.5 ft)', restricted: '0.3m (1 ft)', prohibited: '25mm (1 in)' },
  { voltage: '480V', flashProtection: '1.5m (5 ft)*', limited: '1.1m (3.5 ft)', restricted: '0.3m (1 ft)', prohibited: '25mm (1 in)' },
  { voltage: '600V', flashProtection: '1.8m (6 ft)*', limited: '1.1m (3.5 ft)', restricted: '0.3m (1 ft)', prohibited: '25mm (1 in)' },
  { voltage: '4160V', flashProtection: '5.5m (18 ft)*', limited: '2.4m (8 ft)', restricted: '0.7m (2.3 ft)', prohibited: '0.2m (7 in)' },
  { voltage: '13.8kV', flashProtection: '7.6m (25 ft)*', limited: '3.6m (12 ft)', restricted: '1.1m (3.5 ft)', prohibited: '0.33m (13 in)' },
]

/* ------------------------------------------------------------------ */
/*  Labels Data                                                        */
/* ------------------------------------------------------------------ */

interface LabelField {
  field: string
  description: string
  example: string
  critical: boolean
}

const labelFields: LabelField[] = [
  { field: 'Incident Energy', description: 'Arc flash energy at working distance in cal/cm². This determines the PPE category required.', example: '8.5 cal/cm² at 18 inches', critical: true },
  { field: 'Flash Protection Boundary', description: 'Distance where incident energy drops to 1.2 cal/cm² (onset of second-degree burns). All personnel inside this boundary must wear PPE.', example: '1.5 m (5 ft)', critical: true },
  { field: 'PPE Required', description: 'Minimum PPE category or specific PPE items required for work inside the flash protection boundary.', example: 'PPE Category 2', critical: true },
  { field: 'Nominal Voltage', description: 'Operating voltage of the equipment. Required for selecting proper voltage-rated PPE.', example: '600V 3-Phase', critical: false },
  { field: 'Limited Approach Boundary', description: 'Only qualified persons may cross this boundary. Applies to shock hazard.', example: '1.1 m (3.5 ft)', critical: false },
  { field: 'Restricted Approach Boundary', description: 'Qualified persons must use PPE and an energized work permit to cross. Treated similarly to direct contact.', example: '0.3 m (1 ft)', critical: false },
  { field: 'Available Fault Current', description: 'Maximum fault current available at the equipment. Used in arc flash analysis.', example: '22 kA', critical: false },
  { field: 'Clearing Time', description: 'Time for the upstream protective device to clear the fault. Shorter = less energy.', example: '0.05 sec (3 cycles)', critical: false },
]

/* ------------------------------------------------------------------ */
/*  Risk Assessment Data                                               */
/* ------------------------------------------------------------------ */

interface RiskStep {
  step: number
  title: string
  details: string[]
  critical?: boolean
}

const riskSteps: RiskStep[] = [
  {
    step: 1,
    title: 'Identify the Hazard',
    details: [
      'Determine if equipment will be worked on while energized or if there is potential for exposure to energized parts',
      'Identify all energy sources (primary feed, backfeed, stored energy in capacitors, UPS systems)',
      'Review one-line diagram to determine system configuration',
      'Mining: identify if power center has multiple feeds or tie breakers',
    ],
    critical: true,
  },
  {
    step: 2,
    title: 'Estimate Severity (Incident Energy)',
    details: [
      'Use equipment arc flash labels if available and current',
      'If no label: use CSA Z462 table method based on equipment type',
      'For detailed study: use IEEE 1584 calculation with actual fault current and clearing time',
      'Document the incident energy value and working distance',
    ],
  },
  {
    step: 3,
    title: 'Determine PPE Category',
    details: [
      'Match incident energy to PPE category (Cat 1: ≤4, Cat 2: ≤8, Cat 3: ≤25, Cat 4: ≤40 cal/cm²)',
      'If incident energy exceeds 40 cal/cm²: DO NOT WORK ENERGIZED — no PPE is rated above 40 cal/cm²',
      'Select all required PPE items for the category',
      'Verify PPE arc ratings meet or exceed the incident energy',
    ],
    critical: true,
  },
  {
    step: 4,
    title: 'Establish Boundaries',
    details: [
      'Mark the Flash Protection Boundary — all persons inside must wear arc-rated PPE',
      'Mark the Limited Approach Boundary — only qualified persons may enter',
      'Mark the Restricted Approach Boundary — requires energized work permit',
      'Use barricades, tape, or cones to clearly identify boundaries',
    ],
  },
  {
    step: 5,
    title: 'Implement Safety Procedures',
    details: [
      'Complete an energized work permit if required',
      'Conduct a job briefing with all workers (hazards, PPE, boundaries, emergency plan)',
      'Position rescue equipment and ensure trained rescuer is available',
      'Ensure only qualified persons perform the work',
      'Mining: notify shift supervisor, control room, and fire watch if required',
    ],
  },
  {
    step: 6,
    title: 'Document Everything',
    details: [
      'Record the risk assessment results',
      'File the energized work permit (keep copies for minimum 2 years per O. Reg. 854)',
      'Report any incidents, near misses, or unexpected conditions',
      'Update arc flash labels if conditions have changed',
      'Mining: document in shift log and report to JHSC if near miss',
    ],
  },
]

interface EquipmentTypicalEnergy {
  equipment: string
  typicalEnergy: string
  typicalCategory: string
  catColor: string
  notes: string
}

const equipmentEnergy: EquipmentTypicalEnergy[] = [
  { equipment: '120V panelboard', typicalEnergy: '0.5–2 cal/cm²', typicalCategory: '1', catColor: '#4ade80', notes: 'Low risk but still verify' },
  { equipment: '208V panelboard', typicalEnergy: '1–4 cal/cm²', typicalCategory: '1–2', catColor: '#ffd700', notes: 'Depends on transformer size' },
  { equipment: '480V panelboard', typicalEnergy: '4–12 cal/cm²', typicalCategory: '2–3', catColor: '#ff8c00', notes: 'Higher with large transformers' },
  { equipment: '600V MCC (bucket)', typicalEnergy: '5–25 cal/cm²', typicalCategory: '2–3', catColor: '#ff8c00', notes: 'Varies by bus configuration' },
  { equipment: '600V switchgear', typicalEnergy: '8–40 cal/cm²', typicalCategory: '3–4', catColor: '#ff3c3c', notes: 'Verify with study' },
  { equipment: '4160V switchgear', typicalEnergy: '15–40+ cal/cm²', typicalCategory: '3–4', catColor: '#ff3c3c', notes: 'Often exceeds Cat 4' },
  { equipment: '13.8kV switchgear', typicalEnergy: '20–65+ cal/cm²', typicalCategory: '4+', catColor: '#ff3c3c', notes: 'Detailed study required' },
  { equipment: 'Mine portable power center (600V)', typicalEnergy: '8–30 cal/cm²', typicalCategory: '3–4', catColor: '#ff3c3c', notes: 'Mining: check label on unit' },
  { equipment: 'Underground main switchgear (4160V)', typicalEnergy: '20–40+ cal/cm²', typicalCategory: '4+', catColor: '#ff3c3c', notes: 'Mining: highest risk area' },
]

/* ------------------------------------------------------------------ */
/*  Prevention Data                                                    */
/* ------------------------------------------------------------------ */

interface PreventionItem {
  title: string
  details: string
  category: 'engineering' | 'administrative' | 'practice' | 'mining'
}

const preventionItems: PreventionItem[] = [
  // Engineering Controls
  { title: 'Current-Limiting Fuses', details: 'Class RK1, Class J, or Class L fuses can reduce let-through energy by 50–80%. They clear in less than half a cycle (≤0.004 sec) for high fault currents, dramatically reducing incident energy. Retrofit existing MCC with CL fuses where possible.', category: 'engineering' },
  { title: 'Faster Breaker Clearing Times', details: 'Use instantaneous trip settings where selective coordination allows. Reducing clearing time from 30 cycles to 6 cycles cuts incident energy by ~80%. Zone-selective interlocking can enable faster tripping.', category: 'engineering' },
  { title: 'Zone-Selective Interlocking (ZSI)', details: 'Communication between upstream and downstream breakers allows the breaker closest to the fault to trip instantly while upstream breakers wait. Reduces arc duration without sacrificing coordination.', category: 'engineering' },
  { title: 'Arc-Resistant Switchgear', details: 'Equipment designed and tested per IEEE C37.20.7 to contain and redirect arc energy through exhaust plenums. Rated for specific fault current and duration. Standard for new mine switchgear installations.', category: 'engineering' },
  { title: 'Bus Differential Relays', details: 'Detect current imbalance between incoming and outgoing feeders. Trip in 1–3 cycles for internal bus faults. Most effective protection for large switchgear and motor control centers.', category: 'engineering' },
  { title: 'Optical Arc Flash Detection', details: 'Light sensors combined with overcurrent detection trigger breaker trip in <1 cycle. Fastest arc flash mitigation technology available. Common in modern mining substations.', category: 'engineering' },
  { title: 'Arc Reduction Maintenance Switch', details: 'A switch on the breaker that changes trip settings to instantaneous for maintenance mode. Reduces arc flash energy during maintenance. Must be returned to normal after work is complete.', category: 'engineering' },
  // Administrative Controls
  { title: 'De-energize When Possible', details: 'The most effective control is eliminating the hazard entirely. CSA Z462 requires a documented justification if work is performed energized. De-energizing, locking out, and verifying zero energy is always the first choice.', category: 'administrative' },
  { title: 'Remote Racking / Remote Operation', details: 'Use remote racking devices to rack breakers from outside the arc flash boundary. Remote switching systems allow operation from a safe distance. Eliminates worker exposure during the highest-risk operations.', category: 'administrative' },
  { title: 'Infrared (IR) Windows', details: 'Permanently installed IR-transparent viewing ports allow thermal scanning without opening panel covers. Eliminates exposure during routine thermal inspections. CSA Z462 recognizes this as a best practice.', category: 'administrative' },
  { title: 'Energized Work Permits', details: 'Required for any work inside the restricted approach boundary on energized equipment. Must document: justification for energized work, hazard analysis, PPE required, shock boundaries, safe work practices, and emergency procedures.', category: 'administrative' },
  { title: 'Regular Arc Flash Studies', details: 'Update arc flash study every 5 years or when significant changes occur (transformer replacement, breaker settings changed, bus configuration modified). Ensures labels remain accurate.', category: 'administrative' },
  // Work Practices
  { title: 'Stand to the Side', details: 'Never stand directly in front of equipment when operating breakers or switches. Arc blast pressure (up to 2000 psi) and molten metal shrapnel are directed outward from the equipment front. Stand to the side and reach.', category: 'practice' },
  { title: 'Turn Face Away', details: 'When operating switches or breakers, turn your face away from the equipment at the moment of operation. Even with PPE, reducing direct exposure to the flash provides an additional layer of protection.', category: 'practice' },
  { title: 'One-Hand Rule', details: 'Use only one hand when working near energized conductors to prevent current from passing through the chest (hand-to-hand path across the heart). Keep the other hand behind your back or in your pocket.', category: 'practice' },
  { title: 'Remove Conductive Items', details: 'Remove watches, rings, necklaces, and other conductive jewelry before working on or near energized equipment. These items can bridge conductors, initiate an arc, or cause severe localized burns.', category: 'practice' },
  { title: 'Verify Test Equipment', details: 'Test your voltage tester on a known live source BEFORE and AFTER testing the circuit. This confirms the tester is functioning. Use properly rated CAT III or CAT IV test equipment.', category: 'practice' },
  // Mining-Specific
  { title: 'Mine Power Center Arc Flash Mitigation', details: 'Portable mine power centers typically have ground fault relay protection that limits arc duration. Ensure GFR is set to trip within 12 cycles maximum. Monthly testing of GFR trip time per O. Reg. 854 is mandatory.', category: 'mining' },
  { title: 'Ground Fault Protection Limiting Arc Duration', details: 'Underground mine systems >300V must have ground fault protection tripping at ≤100mA (O. Reg. 854 s.153). This fast-acting protection can significantly reduce arc flash duration for ground faults, the most common fault type.', category: 'mining' },
  { title: 'Underground Confined Space Considerations', details: 'Underground switchgear rooms have limited egress. Arc blast pressure in confined spaces is amplified. Ensure ventilation is adequate for arc byproducts (toxic gases including ozone, nitrogen oxides, and vaporized copper). Position escape route away from equipment front.', category: 'mining' },
  { title: 'Authorization for Energized Work Underground', details: 'Per O. Reg. 854, the supervisor in charge of the mine (or their designate) must authorize energized electrical work underground. A competent person (licensed electrician) must be assigned. Documentation must be maintained.', category: 'mining' },
  { title: 'Surface Substation Procedures', details: 'Surface substations feeding the mine often operate at 13.8kV–44kV. Arc flash incidents at these voltages can be fatal even with Cat 4 PPE. Remote operation is strongly recommended. Coordinate with utility for switching operations.', category: 'mining' },
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

const dangerCard: React.CSSProperties = {
  ...card,
  border: '1px solid rgba(255, 60, 60, 0.3)',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--input-bg)',
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
  background: 'var(--input-bg)',
  border: '2px solid var(--input-border)',
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

/* ------------------------------------------------------------------ */
/*  Incident Energy Calculator (IEEE 1584 Simplified)                  */
/* ------------------------------------------------------------------ */

function calcIncidentEnergy(
  voltage: number,
  faultCurrent: number,
  clearingTime: number,
  workingDistance: number,
): { energy: number; category: string; catNum: number; catColor: string; boundary: number } | null {
  if (voltage <= 0 || faultCurrent <= 0 || clearingTime <= 0 || workingDistance <= 0) return null

  // IEEE 1584 simplified: E = 4.184 * Cf * En * (t/0.2) * (610^x / D^x)
  // Cf = 1.0 for voltage > 1kV, 1.5 for voltage <= 1kV
  // En = normalized incident energy
  // Simplified estimation approach for field use:
  // For voltages 208V-15kV, IEEE 1584 empirical model:
  // log(En) = K1 + K2 + 1.081*log(Ia) + 0.0011*G
  // Simplified here for quick field estimation:

  const Cf = voltage <= 1000 ? 1.5 : 1.0
  const Ia = faultCurrent // kA

  // Simplified normalized energy calculation
  // Using Lee method for quick estimation: E = 5.12 * 10^5 * V * Ibf * t * (1/D^2)
  // Where V in kV, Ibf in kA, t in seconds, D in mm
  const V_kv = voltage / 1000
  const t = clearingTime
  const D_mm = workingDistance * 25.4 // inches to mm

  let energy: number

  if (voltage <= 600) {
    // IEEE 1584 empirical (simplified for field estimation)
    // Typical gap: 25mm for panelboards, 32mm for MCC, 25-32mm for switchgear
    const G = voltage <= 240 ? 25 : 32 // gap in mm
    const K1 = -0.792 // open air: -0.792, box: -0.555
    const K2 = 0 // grounded system: -0.113, ungrounded: 0
    const logEn = K1 + K2 + 1.081 * Math.log10(Ia) + 0.0011 * G
    const En = Math.pow(10, logEn)
    // x exponent based on gap
    const x = voltage <= 240 ? 1.641 : 1.473
    energy = 4.184 * Cf * En * (t / 0.2) * Math.pow(610, x) / Math.pow(D_mm, x)
  } else {
    // Lee method for medium voltage (> 600V)
    energy = 5.12e5 * V_kv * Ia * t / (D_mm * D_mm)
  }

  // Determine category
  let category: string
  let catNum: number
  let catColor: string
  if (energy <= 4) {
    category = 'Category 1 (4 cal/cm²)'
    catNum = 1
    catColor = '#4ade80'
  } else if (energy <= 8) {
    category = 'Category 2 (8 cal/cm²)'
    catNum = 2
    catColor = '#ffd700'
  } else if (energy <= 25) {
    category = 'Category 3 (25 cal/cm²)'
    catNum = 3
    catColor = '#ff8c00'
  } else if (energy <= 40) {
    category = 'Category 4 (40 cal/cm²)'
    catNum = 4
    catColor = '#ff3c3c'
  } else {
    category = 'EXCEEDS CAT 4 — DO NOT WORK ENERGIZED'
    catNum = 5
    catColor = '#ff3c3c'
  }

  // Flash protection boundary: distance where energy = 1.2 cal/cm²
  // Approximate by scaling: FPB = D * (E / 1.2)^(1/x)
  const x = voltage <= 600 ? (voltage <= 240 ? 1.641 : 1.473) : 2
  const boundary = workingDistance * 25.4 * Math.pow(energy / 1.2, 1 / x) // in mm
  const boundaryM = boundary / 1000 // convert to meters

  return { energy: Math.round(energy * 10) / 10, category, catNum, catColor, boundary: Math.round(boundaryM * 10) / 10 }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ArcFlashPage() {
  const [tab, setTab] = useState<TabKey>('ppe')

  // Calculator state
  const [calcVoltage, setCalcVoltage] = useState('')
  const [calcFaultCurrent, setCalcFaultCurrent] = useState('')
  const [calcClearingTime, setCalcClearingTime] = useState('')
  const [calcWorkingDist, setCalcWorkingDist] = useState('18')

  const calcResult = calcIncidentEnergy(
    parseFloat(calcVoltage),
    parseFloat(calcFaultCurrent),
    parseFloat(calcClearingTime),
    parseFloat(calcWorkingDist),
  )

  // Prevention filter
  const [prevFilter, setPrevFilter] = useState<'all' | 'engineering' | 'administrative' | 'practice' | 'mining'>('all')

  return (
    <>
      <Header title="Arc Flash Reference" />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Danger banner */}
        <div style={{
          background: 'rgba(255, 60, 60, 0.12)',
          border: '1px solid rgba(255, 60, 60, 0.4)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{'⚡'}</span>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            <strong style={{ color: '#ff3c3c' }}>ARC FLASH CAN KILL.</strong> This is a reference tool only.
            Always use your site-specific arc flash study, equipment labels, and follow CSA Z462 / your company's
            safe work procedures. When incident energy exceeds 40 cal/cm<sup>2</sup>, <strong>do not work energized</strong>.
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
        {/*  TAB 1: PPE Categories                                       */}
        {/* ============================================================ */}
        {tab === 'ppe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>CSA Z462 / NFPA 70E PPE Categories</div>

            {/* Category cards */}
            {ppeCategories.map(cat => (
              <div key={cat.category} style={{
                ...card,
                borderLeft: `4px solid ${cat.color}`,
              }}>
                {/* Category header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: cat.color,
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {cat.category}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                      Category {cat.category}
                    </div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: cat.color,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {'≤'} {cat.arcRating} cal/cm{'²'}
                    </div>
                  </div>
                </div>

                {/* Required PPE */}
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}>
                  Required PPE Items
                </div>
                <div style={{
                  background: 'var(--input-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  marginBottom: 12,
                }}>
                  {cat.ppeItems.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 13,
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      padding: '3px 0',
                      paddingLeft: 16,
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: cat.color,
                        fontWeight: 700,
                      }}>{'✓'}</span>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Typical locations */}
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}>
                  Typical Equipment / Locations
                </div>
                <div style={{ marginBottom: 12 }}>
                  {cat.typicalLocations.map((loc, i) => (
                    <div key={i} style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      padding: '2px 0',
                      paddingLeft: 16,
                      position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--text-secondary)' }}>{'•'}</span>
                      {loc}
                    </div>
                  ))}
                </div>

                {/* Mining notes */}
                <div style={{
                  background: 'rgba(255, 140, 0, 0.1)',
                  border: '1px solid rgba(255, 140, 0, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'var(--text)',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: '#ff8c00' }}>{'⛏'} Mining:</strong> {cat.miningNotes}
                </div>
              </div>
            ))}

            {/* Task vs Category table */}
            <div style={sectionHeading}>Task vs. Typical PPE Category</div>
            <div style={{
              ...card,
              padding: 0,
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                  <thead>
                    <tr style={{ background: 'var(--input-bg)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Task</th>
                      <th style={{ ...tableHeader, textAlign: 'center', width: 60 }}>Cat.</th>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskCategories.map((tc, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>
                          {tc.task}
                        </td>
                        <td style={{
                          ...tableCell,
                          textAlign: 'center',
                          fontWeight: 700,
                          color: tc.catColor,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                        }}>
                          {tc.typicalCat}
                        </td>
                        <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>
                          {tc.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{
                padding: '10px 12px',
                background: 'var(--input-bg)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                borderTop: '1px solid var(--divider)',
              }}>
                <strong>Note:</strong> These are <em>typical</em> categories. Always verify with the equipment's arc flash label
                or a current arc flash study. Actual incident energy depends on fault current, clearing time, and working distance.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 2: Boundary Distances                                    */}
        {/* ============================================================ */}
        {tab === 'boundaries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Boundary definitions */}
            <div style={sectionHeading}>Arc Flash & Shock Protection Boundaries</div>

            <div style={{
              ...dangerCard,
              borderLeft: '4px solid #ff3c3c',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ff3c3c', marginBottom: 6 }}>
                Flash Protection Boundary
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                The distance from energized equipment where incident energy equals <strong>1.2 cal/cm{'²'}</strong> (onset
                of second-degree burns on unprotected skin). All persons inside this boundary must wear appropriate
                arc-rated PPE. This is the outermost boundary for arc flash protection.
              </div>
            </div>

            <div style={{ ...card, borderLeft: '4px solid #ff8c00' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ff8c00', marginBottom: 6 }}>
                Limited Approach Boundary
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                The shock protection boundary. Only <strong>qualified persons</strong> may cross this boundary.
                Unqualified persons must remain outside unless continuously escorted by a qualified person.
              </div>
            </div>

            <div style={{ ...card, borderLeft: '4px solid #ffd700' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ffd700', marginBottom: 6 }}>
                Restricted Approach Boundary
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                Qualified persons crossing this boundary must use appropriate PPE and an <strong>energized work permit</strong>.
                An approach closer than this is treated as direct contact with energized parts.
              </div>
            </div>

            <div style={{ ...card, borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                Prohibited Approach Boundary
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                Crossing this boundary is considered <strong>the same as making contact</strong> with the energized
                conductor. Requires the same protection as direct contact. Only approach with full PPE and
                insulated tools rated for the voltage.
              </div>
            </div>

            {/* Boundary table by voltage */}
            <div style={sectionHeading}>Approach Boundaries by Voltage (AC)</div>
            <div style={{
              ...card,
              padding: 0,
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ background: 'var(--input-bg)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Voltage</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ff3c3c' }}>Flash Prot.</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ff8c00' }}>Limited</th>
                      <th style={{ ...tableHeader, textAlign: 'center', color: '#ffd700' }}>Restricted</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Prohibited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boundaryTable.map(row => (
                      <tr key={row.voltage}>
                        <td style={{
                          ...tableCell,
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {row.voltage}
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', color: '#ff3c3c', fontWeight: 600 }}>
                          {row.flashProtection}
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', color: '#ff8c00', fontWeight: 500 }}>
                          {row.limited}
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', color: '#ffd700', fontWeight: 500 }}>
                          {row.restricted}
                        </td>
                        <td style={{ ...tableCell, textAlign: 'center', color: 'var(--text-secondary)' }}>
                          {row.prohibited}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{
                padding: '10px 12px',
                background: 'var(--input-bg)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                borderTop: '1px solid var(--divider)',
              }}>
                * Flash Protection Boundary varies with available fault current and clearing time.
                Values shown are typical minimums. Use equipment labels or study results for actual values.
                Based on CSA Z462 tables for AC systems, exposed movable conductors.
              </div>
            </div>

            {/* Interactive Calculator */}
            <div style={sectionHeading}>Incident Energy Estimator (IEEE 1584 Simplified)</div>

            <div style={{
              background: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: 'var(--radius)',
              padding: '12px 14px',
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: 4,
            }}>
              <strong style={{ color: 'var(--primary)' }}>Estimation Only:</strong> This uses a simplified IEEE 1584 method
              for quick field estimation. It does not replace a proper engineering arc flash study. Results may vary from
              actual conditions. Always use equipment labels when available.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Voltage input */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  System Voltage (V)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={calcVoltage}
                  onChange={e => setCalcVoltage(e.target.value)}
                  placeholder="e.g., 480 or 4160"
                  style={inputStyle}
                />
              </div>

              {/* Fault current input */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  Available Fault Current (kA)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcFaultCurrent}
                  onChange={e => setCalcFaultCurrent(e.target.value)}
                  placeholder="e.g., 22"
                  style={inputStyle}
                />
              </div>

              {/* Clearing time input */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  Clearing Time (seconds)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={calcClearingTime}
                  onChange={e => setCalcClearingTime(e.target.value)}
                  placeholder="e.g., 0.083 (5 cycles)"
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  1 cycle = 0.0167s | 3 cycles = 0.05s | 5 cycles = 0.083s | 30 cycles = 0.5s
                </div>
              </div>

              {/* Working distance input */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  Working Distance (inches)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={calcWorkingDist}
                  onChange={e => setCalcWorkingDist(e.target.value)}
                  placeholder="18"
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Typical: 18" for panelboards/MCC, 24" for switchgear, 36" for MV switchgear
                </div>
              </div>
            </div>

            {/* Calculator result */}
            {calcResult && (
              <div style={{
                background: calcResult.catNum >= 5 ? 'rgba(255, 60, 60, 0.15)' : 'var(--surface)',
                border: calcResult.catNum >= 5
                  ? '2px solid rgba(255, 60, 60, 0.6)'
                  : `2px solid ${calcResult.catColor}`,
                borderRadius: 'var(--radius)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {calcResult.catNum >= 5 && (
                  <div style={{
                    background: 'rgba(255, 60, 60, 0.2)',
                    border: '1px solid rgba(255, 60, 60, 0.5)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#ff3c3c',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}>
                    {'⛔'} DANGER: Exceeds 40 cal/cm{'²'} {'—'} DO NOT WORK ENERGIZED
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Estimated Incident Energy
                    </div>
                    <div style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: calcResult.catColor,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {calcResult.energy} <span style={{ fontSize: 14 }}>cal/cm{'²'}</span>
                    </div>
                  </div>
                  <div style={{
                    background: calcResult.catColor,
                    color: '#000',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 14px',
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {calcResult.catNum <= 4 ? `PPE Cat ${calcResult.catNum}` : 'NO PPE RATED'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}>
                  <div style={{
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>
                      PPE Category
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                      {calcResult.category}
                    </div>
                  </div>
                  <div style={{
                    background: 'var(--input-bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>
                      Flash Protection Boundary
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {'≈'} {calcResult.boundary} m ({(calcResult.boundary * 3.281).toFixed(1)} ft)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formula reference */}
            <div style={{
              ...card,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
                IEEE 1584 Simplified Formulas
              </div>
              <div style={{ overflowX: 'auto' }}>
                <div>{'log(En) = K1 + K2 + 1.081·log(Ia) + 0.0011·G'}</div>
                <div>{'E = 4.184 · Cf · En · (t/0.2) · (610^x / D^x)'}</div>
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                  Where: En = normalized energy, Ia = arcing current (kA), G = conductor gap (mm),
                  Cf = calculation factor (1.5 for {'≤'}1kV, 1.0 for {'>'}1kV), t = clearing time (s),
                  D = working distance (mm), x = distance exponent
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'var(--font-sans)' }}>
                  Lee Method ({'>'}600V): E = 5.12{'×'}10{'⁵'} {'·'} V {'·'} Ibf {'·'} t / D{'²'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 3: Labels                                                */}
        {/* ============================================================ */}
        {tab === 'labels' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>How to Read Arc Flash Labels (CSA Z462)</div>

            {/* Example label mock */}
            <div style={{
              background: '#fff',
              border: '3px solid #ff6600',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <div style={{
                background: '#ff6600',
                padding: '8px 14px',
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: 1 }}>
                  {'⚡'} WARNING {'⚡'}
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>
                  ARC FLASH AND SHOCK HAZARD
                </div>
              </div>
              <div style={{
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                color: '#000',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Incident Energy:</span>
                  <span style={{ fontWeight: 700, color: '#cc0000' }}>8.5 cal/cm{'²'} @ 18 in.</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Flash Protection Boundary:</span>
                  <span>1.5 m (5 ft)</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>PPE Required:</span>
                  <span style={{ fontWeight: 700, color: '#cc0000' }}>Category 2</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Nominal Voltage:</span>
                  <span>600V 3-Phase</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Limited Approach:</span>
                  <span>1.1 m (3.5 ft)</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Restricted Approach:</span>
                  <span>0.3 m (1 ft)</span>
                </div>
                <div style={{ borderBottom: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
                  <span>Available Fault Current:</span>
                  <span>22 kA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
                  <span>Clearing Time:</span>
                  <span>5 cycles (0.083 sec)</span>
                </div>
                <div style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: '#666',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                  Study Date: 2024-01-15 | Equipment ID: MCC-01
                </div>
              </div>
            </div>

            {/* Label field descriptions */}
            <div style={sectionHeading}>Label Fields Explained</div>
            {labelFields.map((lf, i) => (
              <div key={i} style={{
                ...card,
                borderLeft: lf.critical ? '4px solid #ff3c3c' : '4px solid var(--primary)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 6,
                }}>
                  {lf.critical && <span style={{ color: '#ff3c3c', fontWeight: 700 }}>{'●'}</span>}
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    {lf.field}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  {lf.description}
                </div>
                <div style={badge}>
                  Example: {lf.example}
                </div>
              </div>
            ))}

            {/* Unlabeled equipment */}
            <div style={sectionHeading}>If Equipment is NOT Labeled</div>
            <div style={{
              ...dangerCard,
              borderLeft: '4px solid #ff3c3c',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ff3c3c', marginBottom: 8 }}>
                {'⚠'} Unlabeled Equipment Procedure
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'STOP — Do not assume the equipment is safe.',
                  'Treat as potentially hazardous. Use the CSA Z462 table-based method to estimate the PPE category based on equipment type and voltage.',
                  'Report the missing label to your supervisor immediately.',
                  'Request an arc flash study be performed on the equipment.',
                  'In the meantime, use the maximum PPE category for the equipment type and voltage, or de-energize before performing any work.',
                  'Document the finding and corrective action taken.',
                ].map((step, i) => (
                  <div key={i} style={{
                    fontSize: 14,
                    color: 'var(--text)',
                    lineHeight: 1.6,
                    paddingLeft: 28,
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      fontWeight: 700,
                      color: '#ff3c3c',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                    }}>
                      {i + 1}.
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Mining label requirements */}
            <div style={sectionHeading}>Mining Label Requirements (O. Reg. 854)</div>
            <div style={{
              ...card,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { rule: 'O. Reg. 854, s. 152', text: 'All electrical equipment in mines must be clearly labeled with voltage, capacity, and hazard warnings.' },
                  { rule: 'CSA Z462-21, s. 4.2', text: 'Arc flash labels are required on equipment likely to be worked on while energized or where there is a potential for exposure to arc flash hazard.' },
                  { rule: 'O. Reg. 854, s. 159', text: 'Warning signs must be posted at electrical rooms and near high-voltage equipment identifying shock and arc flash hazards.' },
                  { rule: 'Mining Best Practice', text: 'Portable power centers and underground switchgear should have arc flash labels on every section (main breaker, bus, individual motor starters). Labels must be updated when equipment is relocated to a different feeder.' },
                ].map((item, i) => (
                  <div key={i} style={{ lineHeight: 1.6 }}>
                    <div style={badge}>{item.rule}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common label formats */}
            <div style={sectionHeading}>Common Label Formats</div>
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div>
                  <strong style={{ color: '#ff6600' }}>Orange/White Standard Labels:</strong> The most common format.
                  Orange header with "WARNING" text, white body with hazard details.
                  Required information: incident energy, flash protection boundary, PPE category.
                </div>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Detailed Engineering Labels:</strong> Include additional data such
                  as available fault current, clearing time, and date of study. Preferred for mining applications where
                  conditions may change.
                </div>
                <div>
                  <strong style={{ color: '#ff3c3c' }}>Danger Labels ({'>'}40 cal/cm{'²'}):</strong> Red header with
                  "DANGER" text. Indicates equipment must be de-energized before any work. No PPE is rated for this level.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 4: Risk Assessment                                       */}
        {/* ============================================================ */}
        {tab === 'risk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={sectionHeading}>CSA Z462 Table-Based Method (Simplified)</div>

            <div style={{
              ...card,
              borderLeft: '4px solid var(--primary)',
            }}>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>
                The <strong>table-based method</strong> provides a simplified approach for determining PPE requirements when a
                detailed arc flash study is not available. It uses equipment type, voltage, and fault current parameters
                to estimate the PPE category. This method is acceptable when:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'Equipment parameters fall within the table ranges',
                  'System fault current is known and within table limits',
                  'Clearing time of the upstream protective device is known',
                  'The task matches one of the table task descriptions',
                ].map((item, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    paddingLeft: 16,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>{'✓'}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              ...dangerCard,
              borderLeft: '4px solid #ff3c3c',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ff3c3c', marginBottom: 6 }}>
                When a Detailed Study IS Required
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'Equipment parameters exceed the table limits',
                  'Fault current exceeds 65 kA (maximum for tables)',
                  'Non-standard configurations or multiple source feeds',
                  'Equipment with modified protection settings',
                  'New installations or major system modifications',
                  'When incident energy is suspected to exceed 40 cal/cm²',
                  'Mining: portable power centers relocated to different feeders',
                ].map((item, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: 'var(--text)',
                    lineHeight: 1.6,
                    paddingLeft: 16,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff3c3c' }}>{'•'}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment typical energy table */}
            <div style={sectionHeading}>Typical Incident Energy by Equipment Type</div>
            <div style={{
              ...card,
              padding: 0,
              overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 450 }}>
                  <thead>
                    <tr style={{ background: 'var(--input-bg)' }}>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Equipment</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Typical Energy</th>
                      <th style={{ ...tableHeader, textAlign: 'center' }}>Cat.</th>
                      <th style={{ ...tableHeader, textAlign: 'left' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentEnergy.map((ee, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCell, color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>
                          {ee.equipment}
                        </td>
                        <td style={{
                          ...tableCell,
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontSize: 13,
                        }}>
                          {ee.typicalEnergy}
                        </td>
                        <td style={{
                          ...tableCell,
                          textAlign: 'center',
                          fontWeight: 700,
                          color: ee.catColor,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                        }}>
                          {ee.typicalCategory}
                        </td>
                        <td style={{ ...tableCell, color: 'var(--text-secondary)', fontSize: 12 }}>
                          {ee.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6-Step Risk Assessment Procedure */}
            <div style={sectionHeading}>6-Step Arc Flash Risk Assessment Procedure</div>
            {riskSteps.map(rs => (
              <div key={rs.step} style={{
                ...(rs.critical ? dangerCard : card),
                borderLeft: rs.critical ? '4px solid #ff3c3c' : '4px solid var(--primary)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: rs.critical ? '#ff3c3c' : 'var(--primary)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                    flexShrink: 0,
                  }}>
                    {rs.step}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                    {rs.title}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 46 }}>
                  {rs.details.map((d, i) => (
                    <div key={i} style={{
                      fontSize: 14,
                      color: d.startsWith('Mining:') ? '#ff8c00' : 'var(--text-secondary)',
                      lineHeight: 1.6,
                      paddingLeft: 16,
                      position: 'relative',
                      fontWeight: d.startsWith('Mining:') ? 600 : 400,
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: d.startsWith('Mining:') ? '#ff8c00' : 'var(--text-secondary)',
                      }}>{d.startsWith('Mining:') ? '⛏' : '•'}</span>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Energized Work Permit */}
            <div style={sectionHeading}>Energized Work Permit</div>
            <div style={{
              ...dangerCard,
              borderLeft: '4px solid #ff8c00',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ff8c00', marginBottom: 10 }}>
                When Required & What It Must Include
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 10 }}>
                An energized work permit is <strong>required</strong> whenever qualified persons must cross the
                restricted approach boundary on energized equipment, unless performing tasks that are part of normal
                operation (reading meters, operating switches with doors closed).
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: 6,
                letterSpacing: 0.3,
              }}>
                Permit Must Include:
              </div>
              <div style={{
                background: 'var(--input-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                marginBottom: 12,
              }}>
                {[
                  'Description of the work to be performed',
                  'Justification for why work cannot be done de-energized',
                  'Description of hazards and equipment involved',
                  'Shock protection boundaries and arc flash boundary',
                  'Incident energy level and required PPE',
                  'Means to restrict unqualified persons from the work area',
                  'Evidence of job briefing completion',
                  'Emergency procedures and rescue plan',
                  'Signature of authorizing supervisor',
                ].map((item, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: 'var(--text)',
                    lineHeight: 1.6,
                    padding: '2px 0',
                    paddingLeft: 16,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: '#ff8c00' }}>{'✓'}</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Mining authorization */}
              <div style={{
                background: 'rgba(255, 140, 0, 0.1)',
                border: '1px solid rgba(255, 140, 0, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ff8c00', marginBottom: 4 }}>
                  {'⛏'} Mining: Who Can Authorize Energized Work Underground
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                  Per O. Reg. 854, the <strong>supervisor in charge of the mine</strong> (or their designated competent
                  person) must authorize all energized electrical work underground. The worker performing the work must be
                  a <strong>licensed electrician</strong> holding a valid Ontario Certificate of Qualification. The mine's
                  Joint Health and Safety Committee (JHSC) should be informed of any planned energized work. All work must
                  be documented in the shift log and kept for a minimum of 2 years.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB 5: Prevention                                            */}
        {/* ============================================================ */}
        {tab === 'prevention' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={sectionHeading}>Reducing Arc Flash Risk</div>

            {/* Category filter pills */}
            <div style={pillRow}>
              {([
                { key: 'all' as const, label: 'All' },
                { key: 'engineering' as const, label: 'Engineering' },
                { key: 'administrative' as const, label: 'Administrative' },
                { key: 'practice' as const, label: 'Work Practices' },
                { key: 'mining' as const, label: 'Mining' },
              ]).map(f => (
                <button
                  key={f.key}
                  style={prevFilter === f.key ? pillActive : pillBase}
                  onClick={() => setPrevFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Hierarchy of controls note */}
            {prevFilter === 'all' && (
              <div style={{
                ...card,
                borderLeft: '4px solid var(--primary)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                  Hierarchy of Controls
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>1. Elimination:</strong> De-energize the equipment (most effective){' '}
                  <strong style={{ color: 'var(--text)' }}>2. Engineering:</strong> Reduce energy through design (fuses, relays, arc-resistant gear){' '}
                  <strong style={{ color: 'var(--text)' }}>3. Administrative:</strong> Procedures, permits, training{' '}
                  <strong style={{ color: 'var(--text)' }}>4. PPE:</strong> Personal protective equipment (last resort)
                </div>
              </div>
            )}

            {/* Prevention items */}
            {preventionItems
              .filter(item => prevFilter === 'all' || item.category === prevFilter)
              .map((item, i) => {
                const catColors: Record<string, string> = {
                  engineering: '#4ade80',
                  administrative: '#ffd700',
                  practice: '#60a5fa',
                  mining: '#ff8c00',
                }
                const catLabels: Record<string, string> = {
                  engineering: 'Engineering Control',
                  administrative: 'Administrative Control',
                  practice: 'Work Practice',
                  mining: 'Mining-Specific',
                }
                const borderColor = catColors[item.category]

                return (
                  <div key={i} style={{
                    ...card,
                    borderLeft: `4px solid ${borderColor}`,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 8,
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                        {item.title}
                      </div>
                      <span style={{
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.3,
                        color: borderColor,
                        background: `${borderColor}15`,
                        padding: '3px 8px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                      }}>
                        {catLabels[item.category]}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}>
                      {item.details}
                    </div>
                  </div>
                )
              })}

            {/* Standards reference */}
            <div style={sectionHeading}>Standards Reference</div>
            <div style={{
              ...card,
              padding: 0,
              overflow: 'hidden',
            }}>
              {[
                { std: 'CSA Z462', title: 'Workplace Electrical Safety', desc: 'Canadian standard for arc flash risk assessment, PPE categories, boundaries, and safe work practices. Primary reference for Canadian mines.' },
                { std: 'IEEE 1584', title: 'Guide for Performing Arc Flash Hazard Calculations', desc: 'Engineering standard for calculating incident energy and arc flash boundaries. Used for detailed studies.' },
                { std: 'NFPA 70E', title: 'Standard for Electrical Safety in the Workplace', desc: 'US standard (harmonized with CSA Z462). Referenced by many equipment manufacturers for PPE categories.' },
                { std: 'O. Reg. 854', title: 'Mines and Mining Plants (Ontario)', desc: 'Ontario mining regulation covering electrical safety requirements including ground fault protection, inspection, and competent persons.' },
                { std: 'CSA Z463', title: 'Guideline for Maintenance of Electrical Systems', desc: 'Maintenance practices for electrical distribution systems. Covers testing, maintenance intervals, and procedures.' },
                { std: 'IEEE C37.20.7', title: 'Guide for Testing Metal-Enclosed Switchgear for Internal Arcing Faults', desc: 'Testing standard for arc-resistant switchgear. Defines Type 1, 2, and 2B accessibility ratings.' },
              ].map((s, i, arr) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : undefined,
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    fontSize: 13,
                    minWidth: 100,
                    flexShrink: 0,
                  }}>
                    {s.std}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer reference */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text)' }}>References:</strong> CSA Z462-21, NFPA 70E-2024,
          IEEE 1584-2018, O. Reg. 854 (Mines and Mining Plants), CSA Z463, IEEE C37.20.7.
          This tool provides reference information only and does not replace a qualified engineering arc flash study.
        </div>
      </div>
    </>
  )
}
