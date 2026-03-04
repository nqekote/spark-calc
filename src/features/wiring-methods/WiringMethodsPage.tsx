import { useState } from 'react'
import PageWrapper from '../../layout/PageWrapper'

/* ================================================================== */
/*  Wiring Methods Comprehensive Reference                             */
/*  CEC 2021 + Ontario Mining Regs (O. Reg. 854)                       */
/*  For Ontario electrical / mining apprentices                        */
/* ================================================================== */

type TabKey = 'overview' | 'selection' | 'emt' | 'teck' | 'tray' | 'underground'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'selection', label: 'Selection' },
  { key: 'emt', label: 'EMT' },
  { key: 'teck', label: 'TECK90' },
  { key: 'tray', label: 'Cable Tray' },
  { key: 'underground', label: 'Underground' },
]

/* ======================== STYLES ================================== */

const s = {
  tabBar: {
    display: 'flex',
    gap: 4,
    overflowX: 'auto' as const,
    paddingBottom: 8,
    marginBottom: 12,
    borderBottom: '1px solid #333',
    WebkitOverflowScrolling: 'touch' as const,
  },
  tab: (active: boolean) => ({
    minHeight: 56,
    minWidth: 56,
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    background: active ? '#b8860b' : '#1e1e1e',
    color: active ? '#000' : '#ccc',
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    transition: 'background 0.2s',
  }),
  card: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#daa520',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#daa520',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    marginTop: 4,
  },
  text: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  label: {
    color: '#999',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  value: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 8,
  },
  tag: (color: string) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: color,
    color: '#000',
    marginRight: 6,
    marginBottom: 4,
  }),
  allowed: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: '#2d6a2d',
    color: '#8f8',
    marginRight: 6,
    marginBottom: 4,
  },
  notAllowed: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: '#6a2d2d',
    color: '#f88',
    marginRight: 6,
    marginBottom: 4,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 13,
    marginBottom: 12,
  },
  th: {
    background: '#252525',
    color: '#daa520',
    padding: '10px 8px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #444',
    fontSize: 12,
    fontWeight: 700,
  },
  td: {
    padding: '8px 8px',
    borderBottom: '1px solid #2a2a2a',
    color: '#ccc',
    verticalAlign: 'top' as const,
  },
  selectBtn: (active: boolean) => ({
    minHeight: 56,
    minWidth: 56,
    padding: '12px 16px',
    border: active ? '2px solid #daa520' : '1px solid #444',
    borderRadius: 10,
    background: active ? '#2a2207' : '#1a1a1a',
    color: active ? '#daa520' : '#ccc',
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.2s',
  }),
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#daa520',
    color: '#000',
    fontWeight: 700,
    fontSize: 14,
    marginRight: 10,
    flexShrink: 0,
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  warn: {
    background: '#3d2e00',
    border: '1px solid #daa520',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#ffd700',
    fontSize: 13,
    lineHeight: 1.5,
  },
  danger: {
    background: '#3d0000',
    border: '1px solid #ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#ff8888',
    fontSize: 13,
    lineHeight: 1.5,
  },
  tip: {
    background: '#002a1a',
    border: '1px solid #2d8a5e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#7dcea0',
    fontSize: 13,
    lineHeight: 1.5,
  },
}

/* ================================================================== */
/*  TAB 1 DATA: WIRING METHODS OVERVIEW                                */
/* ================================================================== */

interface WiringMethod {
  name: string
  shortName: string
  cecSection: string
  description: string
  allowed: string[]
  notAllowed: string[]
  typicalApps: string[]
  category: 'conduit' | 'cable' | 'other'
}

const wiringMethods: WiringMethod[] = [
  {
    name: 'Electrical Metallic Tubing',
    shortName: 'EMT',
    cecSection: 'CEC 12-1500',
    description: 'Thin-wall steel or aluminum tubing. Lightest metallic raceway. Uses compression or set-screw fittings, not threaded.',
    category: 'conduit',
    allowed: [
      'Dry commercial/industrial locations',
      'Concealed in walls/ceilings',
      'Exposed where not subject to severe damage',
      'Above suspended ceilings',
      'Concrete-encased (with approved fittings)',
    ],
    notAllowed: [
      'Where subject to severe physical damage',
      'Underground direct burial (unless concrete encased)',
      'Hazardous locations (unless specifically approved)',
      'Wet locations exposed to corrosion (unless coated)',
      'Underground mines (not robust enough)',
    ],
    typicalApps: [
      'Commercial office wiring',
      'Retail store branch circuits',
      'Above-ceiling runs in commercial buildings',
      'Exposed wiring in dry mechanical rooms',
    ],
  },
  {
    name: 'Rigid PVC Conduit',
    shortName: 'PVC',
    cecSection: 'CEC 12-1100',
    description: 'Non-metallic rigid conduit. Schedule 40 for above ground, Schedule 80 for direct burial or where subject to damage. Requires separate bonding conductor.',
    category: 'conduit',
    allowed: [
      'Underground direct burial',
      'Concrete encasement',
      'Wet and corrosive locations',
      'Chemical/processing plants',
      'Outdoor exposed (UV rated)',
    ],
    notAllowed: [
      'Where ambient temperature exceeds 50 deg C',
      'Where subject to physical damage (Sched 40)',
      'Support of fixtures/equipment',
      'Hazardous locations (unless approved)',
      'Where fire rating of wall/floor must be maintained without firestopping',
    ],
    typicalApps: [
      'Underground service entrance',
      'Outdoor lighting circuits',
      'Corrosive chemical environments',
      'Underground parking garage feeders',
    ],
  },
  {
    name: 'Rigid Metal Conduit (IMC/RMC)',
    shortName: 'RMC/IMC',
    cecSection: 'CEC 12-1000 / 12-1050',
    description: 'Heavy-wall threaded steel conduit. IMC is intermediate weight. RMC is the heaviest. Both provide excellent physical protection and serve as grounding path.',
    category: 'conduit',
    allowed: [
      'All locations including hazardous',
      'Underground direct burial',
      'Wet locations',
      'Exposed where subject to physical damage',
      'Through concrete slabs and walls',
      'Hazardous locations (Classes I, II, III)',
    ],
    notAllowed: [
      'Severely corrosive conditions (unless PVC coated)',
      'Where dissimilar metals cause galvanic corrosion',
    ],
    typicalApps: [
      'Hazardous area wiring',
      'Service entrance masts',
      'Underground mine surface buildings',
      'Heavy industrial power feeders',
      'Outdoor exposed runs subject to damage',
    ],
  },
  {
    name: 'Flexible Metal Conduit',
    shortName: 'FMC',
    cecSection: 'CEC 12-1600',
    description: 'Spiral-wound interlocked metal armor. Provides flexibility for connections to vibrating equipment or where bends are impractical.',
    category: 'conduit',
    allowed: [
      'Dry locations',
      'Final connections to motors/equipment',
      'Recessed luminaires',
      'Where flexibility is needed',
      'Accessible locations',
    ],
    notAllowed: [
      'Wet locations (use LFMC instead)',
      'Underground or embedded in concrete',
      'Hazardous locations (except short whips)',
      'Where subject to physical damage',
      'Lengths over 1.8 m for grounding path',
    ],
    typicalApps: [
      'Motor connections (vibration isolation)',
      'Transformer final connections',
      'Equipment whips in suspended ceilings',
      'HVAC unit connections',
    ],
  },
  {
    name: 'Liquid-Tight Flexible Metal Conduit',
    shortName: 'LFMC',
    cecSection: 'CEC 12-1650',
    description: 'Flexible metal conduit with liquid-tight plastic jacket. Suitable for wet locations and where exposure to oils/coolants is expected.',
    category: 'conduit',
    allowed: [
      'Wet locations',
      'Where exposed to oils, coolants, cutting fluids',
      'Outdoor equipment connections',
      'Motor connections in wet areas',
      'Food processing / wash-down areas',
    ],
    notAllowed: [
      'Where subject to severe physical damage',
      'Lengths over 1.8 m for grounding (need separate bond)',
      'Ambient temperatures exceeding rating',
      'Underground direct burial',
    ],
    typicalApps: [
      'CNC machine connections',
      'Outdoor motor/pump connections',
      'Car wash equipment',
      'Industrial wash-down areas',
      'Mining pump connections (surface)',
    ],
  },
  {
    name: 'Non-Metallic Sheathed Cable',
    shortName: 'NMD90',
    cecSection: 'CEC 12-500',
    description: 'Common "Romex" cable. Copper conductors with thermoplastic insulation and non-metallic outer jacket. 90 deg C insulation rating.',
    category: 'cable',
    allowed: [
      'Residential wiring (primary use)',
      'Concealed in wood-frame walls/ceilings',
      'Single/two-family dwellings',
      'Agricultural buildings (with restrictions)',
    ],
    notAllowed: [
      'Commercial buildings (above 3 floors)',
      'Exposed on masonry/concrete surfaces',
      'Wet locations or direct burial',
      'Any hazardous location',
      'Underground mines',
      'Where subject to physical damage',
      'In raceways (except short sleeves through framing)',
    ],
    typicalApps: [
      'House wiring (branch circuits, lighting)',
      'Residential basement finishing',
      'Wood-frame townhouse wiring',
    ],
  },
  {
    name: 'Armoured Cable',
    shortName: 'AC90 (BX)',
    cecSection: 'CEC 12-600',
    description: 'Insulated conductors wrapped in interlocking steel armor. Has internal bonding strip. Commonly called BX. 90 deg C rating.',
    category: 'cable',
    allowed: [
      'Commercial and industrial dry locations',
      'Concealed in walls, ceilings, floors',
      'Exposed runs in dry areas',
      'Above suspended ceilings',
      'Multi-story commercial buildings',
    ],
    notAllowed: [
      'Wet locations or direct burial',
      'Hazardous locations (unless approved)',
      'Where exposed to corrosive fumes',
      'Underground mines (use TECK or ACWU)',
      'Embedded in concrete',
    ],
    typicalApps: [
      'Commercial branch circuit wiring',
      'Office building circuits',
      'Hospital wiring (with HCF variants)',
      'Retrofit wiring in existing buildings',
    ],
  },
  {
    name: 'TECK90 Cable',
    shortName: 'TECK90',
    cecSection: 'CEC 12-700',
    description: 'Thermoplastic/nylon insulated conductors with interlocking aluminum or steel armor and overall PVC jacket. The workhorse of Ontario mining and heavy industrial.',
    category: 'cable',
    allowed: [
      'Industrial and mining installations',
      'Wet and dry locations',
      'Direct burial',
      'Cable tray',
      'Hazardous locations (with proper glands)',
      'Underground mines',
      'Exposed runs in industrial areas',
      'Corrosive environments (PVC jacket)',
    ],
    notAllowed: [
      'Where subject to severe mechanical impact without additional protection',
      'As a substitute for flexible cord (no repeated flexing)',
    ],
    typicalApps: [
      'Underground mine power distribution',
      'Industrial motor feeders',
      'Cable tray runs in plants',
      'Direct-buried mine power runs',
      'Hazardous area power and control',
    ],
  },
  {
    name: 'Armoured Cable With PVC Jacket',
    shortName: 'ACWU90',
    cecSection: 'CEC 12-600',
    description: 'Similar to AC90 but with moisture-resistant jacket. The "W" means wet-rated, "U" means underground. Interlocking armor with overall PVC jacket.',
    category: 'cable',
    allowed: [
      'Wet and dry locations',
      'Direct burial',
      'Exposed outdoor installations',
      'Underground duct banks',
      'Concrete-encased',
      'Industrial installations',
    ],
    notAllowed: [
      'Hazardous locations (unless listed)',
      'Underground mines (TECK90 preferred per O.Reg.854)',
    ],
    typicalApps: [
      'Service entrance cables',
      'Outdoor feeder runs',
      'Underground to surface building transitions',
      'Wet mechanical rooms',
    ],
  },
  {
    name: 'Cable Tray Wiring',
    shortName: 'Cable Tray',
    cecSection: 'CEC 12-2200',
    description: 'Open support system for cables. Types include ladder, ventilated trough, solid bottom, wire mesh, and channel tray. Not a wiring method itself but a support system.',
    category: 'other',
    allowed: [
      'Industrial/commercial power distribution',
      'Where accessible for maintenance',
      'Mining surface installations',
      'Process plants',
      'Data centers',
    ],
    notAllowed: [
      'Residential installations',
      'Underground mines (typically)',
      'Concealed above non-accessible ceilings (without provisions)',
    ],
    typicalApps: [
      'Mine surface mill wiring',
      'Process plant cable routing',
      'Power plant cable distribution',
      'Data center structured cabling',
    ],
  },
  {
    name: 'Busway / Bus Duct',
    shortName: 'Busway',
    cecSection: 'CEC 12-2000',
    description: 'Factory-assembled bus bars in a metal enclosure. Available as feeder busway or plug-in busway for distributed loads. High current capacity.',
    category: 'other',
    allowed: [
      'Industrial power distribution',
      'Commercial buildings (feeder runs)',
      'Accessible locations for maintenance',
      'Dry locations (standard types)',
    ],
    notAllowed: [
      'Hazardous locations',
      'Outdoors (unless rated)',
      'Underground or direct burial',
      'Where subject to corrosive vapours',
      'Hoistways',
    ],
    typicalApps: [
      'Main power distribution in large buildings',
      'Factory floor plug-in power',
      'Data center power distribution',
      'High-rise feeder risers',
    ],
  },
  {
    name: 'Mineral-Insulated Cable',
    shortName: 'MI Cable',
    cecSection: 'CEC 12-800',
    description: 'Copper conductors in magnesium oxide insulation inside a seamless copper or stainless steel sheath. Extremely fire resistant.',
    category: 'cable',
    allowed: [
      'All locations including hazardous',
      'Fire alarm circuits requiring survivability',
      'Wet and dry locations',
      'Exposed or concealed',
      'Concrete-embedded',
      'High temperature environments',
    ],
    notAllowed: [
      'Where sheath would be attacked by corrosive conditions (copper)',
      'Where subject to excessive moisture without proper terminations',
    ],
    typicalApps: [
      'Emergency generator feeders',
      'Fire alarm survivability circuits',
      'High-temperature kiln wiring',
      'Critical hospital circuits',
      'Nuclear installations',
    ],
  },
  {
    name: 'Tray Cable',
    shortName: 'TC Cable',
    cecSection: 'CEC 12-2200',
    description: 'Multiconductor cable specifically listed for use in cable tray. Has a flame-retardant jacket. Power, control, and instrumentation types available.',
    category: 'cable',
    allowed: [
      'Cable tray installations',
      'Industrial power and control',
      'Between cable tray and equipment (up to 1.8 m)',
      'Outdoor in tray (if sunlight rated)',
    ],
    notAllowed: [
      'Direct burial (unless dual rated)',
      'Installed exposed outside of cable tray (except short drops)',
      'Hazardous locations (unless listed)',
    ],
    typicalApps: [
      'Industrial cable tray systems',
      'Control wiring in process plants',
      'Instrumentation cable runs',
    ],
  },
  {
    name: 'SHD-GC / Mining Trailing Cable',
    shortName: 'SHD-GC',
    cecSection: 'O.Reg.854 / CSA M422',
    description: 'Super Hard Duty mining cable with Ground Check conductor. Round, heavy rubber jacket. Designed for portable mining equipment. Includes monitoring conductors.',
    category: 'cable',
    allowed: [
      'Underground mine mobile equipment',
      'Surface mine mobile equipment',
      'Portable/relocatable mining machinery',
      'Where ground-check monitoring is required',
    ],
    notAllowed: [
      'Permanent fixed wiring',
      'Non-mining commercial/residential',
      'Direct burial as permanent installation',
    ],
    typicalApps: [
      'Jumbo drill supply cables',
      'Scoop tram trailing cables',
      'Shuttle car cables',
      'Underground bolting machine supply',
    ],
  },
]

/* ================================================================== */
/*  TAB 2 DATA: WIRING METHOD SELECTION MATRIX                         */
/* ================================================================== */

type LocationKey = 'residential' | 'commercial' | 'industrial' | 'hazardous' | 'mine_ug' | 'outdoor' | 'burial' | 'wet' | 'corrosive'

interface LocationInfo {
  key: LocationKey
  label: string
  description: string
  allowedMethods: string[]
  preferredMethods: string[]
  cecNotes: string
}

const locations: LocationInfo[] = [
  {
    key: 'residential',
    label: 'Residential',
    description: 'Single/multi-family dwellings, townhouses, low-rise apartments (3 floors or less wood frame).',
    allowedMethods: ['NMD90', 'AC90', 'EMT', 'Rigid PVC', 'RMC/IMC', 'ACWU90'],
    preferredMethods: ['NMD90', 'AC90'],
    cecNotes: 'CEC 12-500 governs NMD90. NMD90 is the primary residential method in wood-frame construction. AC90 used where physical protection needed.',
  },
  {
    key: 'commercial',
    label: 'Commercial',
    description: 'Office buildings, retail stores, schools, hospitals, multi-storey buildings over 3 floors.',
    allowedMethods: ['AC90', 'EMT', 'RMC/IMC', 'Rigid PVC', 'ACWU90', 'FMC', 'LFMC', 'MI Cable', 'Busway'],
    preferredMethods: ['AC90', 'EMT'],
    cecNotes: 'NMD90 NOT permitted in commercial over 3 storeys or non-combustible construction. AC90 and EMT are the workhorses of commercial wiring.',
  },
  {
    key: 'industrial',
    label: 'Industrial',
    description: 'Manufacturing plants, process facilities, mills, surface mining buildings.',
    allowedMethods: ['TECK90', 'AC90', 'ACWU90', 'EMT', 'RMC/IMC', 'Cable Tray', 'Busway', 'FMC', 'LFMC', 'TC Cable', 'MI Cable'],
    preferredMethods: ['TECK90', 'Cable Tray', 'EMT'],
    cecNotes: 'TECK90 in cable tray is the most common industrial method. EMT for lighter-duty branch circuits. Rigid metal for exposed runs subject to damage.',
  },
  {
    key: 'hazardous',
    label: 'Hazardous Location',
    description: 'Zone 0/1/2, Zone 20/21/22, Class I/II/III environments with flammable gases, vapours, or combustible dusts.',
    allowedMethods: ['RMC/IMC', 'TECK90 (with listed glands)', 'MI Cable', 'Rigid PVC (Zone 2 only with metal cover)'],
    preferredMethods: ['RMC/IMC', 'TECK90'],
    cecNotes: 'CEC Section 18 and 20. Rigid metal conduit with explosion-proof fittings is the standard. TECK90 with listed cable glands is accepted per CEC 18-072/18-152. All seals, drains per CEC requirements.',
  },
  {
    key: 'mine_ug',
    label: 'Underground Mine',
    description: 'Underground mine drifts, shafts, stopes, headings. Governed by O. Reg. 854 and CEC.',
    allowedMethods: ['TECK90', 'SHD-GC', 'RMC/IMC', 'MI Cable', 'ACWU90'],
    preferredMethods: ['TECK90', 'SHD-GC'],
    cecNotes: 'O. Reg. 854 governs underground mines. TECK90 is standard for fixed wiring. SHD-GC for trailing cables on mobile equipment. Ground fault protection mandatory. Armor provides mechanical protection.',
  },
  {
    key: 'outdoor',
    label: 'Outdoor / Exposed',
    description: 'Outdoor equipment, parking lots, building exteriors, exposed to weather but not buried.',
    allowedMethods: ['RMC/IMC', 'Rigid PVC (UV rated)', 'TECK90', 'ACWU90', 'LFMC', 'MI Cable'],
    preferredMethods: ['RMC/IMC', 'Rigid PVC'],
    cecNotes: 'Weatherproof fittings and boxes required. Drip loops at service heads. PVC must be UV rated (grey). All connections weathertight. Expansion joints in long PVC runs.',
  },
  {
    key: 'burial',
    label: 'Underground Burial',
    description: 'Direct buried cables or conduits below grade. Service laterals, parking lot lighting, etc.',
    allowedMethods: ['Rigid PVC (Sched 40/80)', 'RMC/IMC', 'TECK90', 'ACWU90', 'Direct burial rated cables'],
    preferredMethods: ['Rigid PVC', 'TECK90'],
    cecNotes: 'CEC Table 53 governs burial depths. Warning tape required 300 mm above. Sand bed recommended. PVC Schedule 80 where subject to damage. Rigid metal for stub-ups.',
  },
  {
    key: 'wet',
    label: 'Wet Location',
    description: 'Areas subject to saturation: underground vaults, foundations, car washes, outdoor, below grade.',
    allowedMethods: ['RMC/IMC', 'Rigid PVC', 'TECK90', 'ACWU90', 'LFMC', 'MI Cable'],
    preferredMethods: ['Rigid PVC', 'TECK90'],
    cecNotes: 'All wiring methods must be rated for wet locations. Conductors must have W designation (RW90, TWN). Boxes and fittings must be weatherproof or listed for wet locations.',
  },
  {
    key: 'corrosive',
    label: 'Corrosive Environment',
    description: 'Chemical plants, battery rooms, water treatment, salt storage, fertilizer plants.',
    allowedMethods: ['Rigid PVC', 'TECK90 (PVC jacket)', 'PVC-coated RMC', 'MI Cable (stainless)', 'LFMC'],
    preferredMethods: ['Rigid PVC', 'TECK90'],
    cecNotes: 'CEC 2-116. Non-metallic conduit is standard for corrosive areas. If metal required, PVC-coated rigid metal or stainless steel. TECK90 PVC jacket resists most chemicals.',
  },
]

/* ================================================================== */
/*  TAB 3 DATA: EMT INSTALLATION                                       */
/* ================================================================== */

interface EmtSize {
  trade: string
  od: string
  id: string
  maxSupportSpacing: string
  maxCond12AWG: number
  maxCond10AWG: number
  bendRadius: string
}

const emtSizes: EmtSize[] = [
  { trade: '1/2"', od: '17.9 mm', id: '15.8 mm', maxSupportSpacing: '1.5 m', maxCond12AWG: 9, maxCond10AWG: 5, bendRadius: '102 mm' },
  { trade: '3/4"', od: '23.4 mm', id: '20.9 mm', maxSupportSpacing: '1.5 m', maxCond12AWG: 16, maxCond10AWG: 10, bendRadius: '114 mm' },
  { trade: '1"', od: '29.5 mm', id: '26.6 mm', maxSupportSpacing: '1.5 m', maxCond12AWG: 26, maxCond10AWG: 16, bendRadius: '140 mm' },
  { trade: '1-1/4"', od: '38.4 mm', id: '35.1 mm', maxSupportSpacing: '2.0 m', maxCond12AWG: 46, maxCond10AWG: 28, bendRadius: '184 mm' },
  { trade: '1-1/2"', od: '44.5 mm', id: '40.9 mm', maxSupportSpacing: '2.0 m', maxCond12AWG: 60, maxCond10AWG: 38, bendRadius: '210 mm' },
  { trade: '2"', od: '57.2 mm', id: '52.9 mm', maxSupportSpacing: '2.0 m', maxCond12AWG: 100, maxCond10AWG: 62, bendRadius: '254 mm' },
  { trade: '2-1/2"', od: '70.3 mm', id: '66.2 mm', maxSupportSpacing: '2.5 m', maxCond12AWG: 155, maxCond10AWG: 98, bendRadius: '330 mm' },
  { trade: '3"', od: '82.6 mm', id: '77.9 mm', maxSupportSpacing: '2.5 m', maxCond12AWG: 216, maxCond10AWG: 136, bendRadius: '381 mm' },
  { trade: '3-1/2"', od: '95.3 mm', id: '90.1 mm', maxSupportSpacing: '2.5 m', maxCond12AWG: 288, maxCond10AWG: 182, bendRadius: '406 mm' },
  { trade: '4"', od: '107.9 mm', id: '102.3 mm', maxSupportSpacing: '2.5 m', maxCond12AWG: 370, maxCond10AWG: 234, bendRadius: '457 mm' },
]

interface ConnectorType {
  type: string
  pros: string[]
  cons: string[]
  bestFor: string
}

const connectorTypes: ConnectorType[] = [
  {
    type: 'Compression (Raintight)',
    pros: ['Best electrical connection', 'Raintight when specified', 'Most reliable for grounding', 'Required for wet locations'],
    cons: ['Most expensive', 'Requires compression tool', 'Slightly slower to install'],
    bestFor: 'Wet locations, exposed outdoor, anywhere grounding integrity is critical. Required by many AHJs for all exposed work.',
  },
  {
    type: 'Set-Screw',
    pros: ['Fast installation', 'No special tools', 'Reusable', 'Moderate cost'],
    cons: ['Not raintight', 'Screws can loosen from vibration', 'Less reliable ground path', 'Not suitable for wet locations'],
    bestFor: 'Dry indoor locations, above suspended ceilings, concealed work. Most common for interior commercial work.',
  },
  {
    type: 'Push-On (Snap-In)',
    pros: ['Fastest installation', 'No tools needed', 'Lowest cost'],
    cons: ['Cannot be removed', 'Poorest grounding', 'Dry locations only', 'Limited sizes'],
    bestFor: 'Light-duty concealed dry work only. Not recommended for exposed or accessible wiring.',
  },
]

/* ================================================================== */
/*  TAB 4 DATA: TECK90 INSTALLATION                                    */
/* ================================================================== */

interface GlandStep {
  step: number
  title: string
  detail: string
  warning?: string
}

const glandSteps: GlandStep[] = [
  { step: 1, title: 'Measure and Cut Cable', detail: 'Mark the cable at the desired length. Use a cable cutter or hacksaw to cut squarely. Do not use a torch. Leave at least 300 mm extra for termination.' },
  { step: 2, title: 'Strip Outer PVC Jacket', detail: 'Score the PVC jacket approximately 100-150 mm from the end using a utility knife. Do NOT cut into the armor. Peel back and remove the jacket. Clean any residue.', warning: 'Cutting too deep will nick the armor and weaken the cable. Score lightly and peel.' },
  { step: 3, title: 'Unwind Interlocking Armor', detail: 'Using armor stripping pliers (Klein 53725), grip one armor strip and unwind it. The armor unwinds like a spring -- turn counterclockwise (looking at the end). Unwind back to the jacket cut. Alternatively, use armour cutters (Roto-Split).' },
  { step: 4, title: 'Install Anti-Short Bushing', detail: 'Place a red anti-short bushing (Redhead) between the armor and the conductors. This protects conductor insulation from the sharp cut armor edge. REQUIRED by CEC.', warning: 'Never omit the anti-short bushing. Inspectors will always look for it and its absence is an automatic fail.' },
  { step: 5, title: 'Slide on Gland Components', detail: 'In order, slide onto the cable: (1) Lock nut, (2) Outer gland body, (3) Armor cone/collet. The cone/collet seats over the armor end. Ensure the cone engages the interlocking armor.' },
  { step: 6, title: 'Seat the Gland Body', detail: 'Push the cable through the knockout/opening. From inside the enclosure, thread the gland body into the knockout. Hand-tight plus 1/4 turn with a wrench on the outer body.' },
  { step: 7, title: 'Tighten the Lock Nut', detail: 'From outside the enclosure, tighten the lock nut against the enclosure wall. This compresses the cone onto the armor, creating the mechanical and ground connection.', warning: 'Torque to manufacturer spec. Over-torque can crack the gland body. Under-torque means the armor is not properly bonded.' },
  { step: 8, title: 'Verify Grounding', detail: 'The interlocking armor is the bonding path. Verify continuity between the armor/gland and the enclosure. Resistance should be less than 1 ohm for short runs.' },
  { step: 9, title: 'Dress and Terminate Conductors', detail: 'Strip conductor insulation to the proper length for the terminal. Ensure no bare copper is exposed outside the terminal. Torque all terminals to specification.' },
]

interface TeckSupportSpacing {
  cableSize: string
  horizontalSpacing: string
  verticalSpacing: string
}

const teckSupports: TeckSupportSpacing[] = [
  { cableSize: '14 - 8 AWG', horizontalSpacing: '1.0 m', verticalSpacing: '1.5 m' },
  { cableSize: '6 - 2 AWG', horizontalSpacing: '1.5 m', verticalSpacing: '2.0 m' },
  { cableSize: '1/0 - 4/0 AWG', horizontalSpacing: '1.8 m', verticalSpacing: '2.5 m' },
  { cableSize: '250 - 500 MCM', horizontalSpacing: '2.0 m', verticalSpacing: '3.0 m' },
]

/* ================================================================== */
/*  TAB 5 DATA: CABLE TRAY SYSTEMS                                     */
/* ================================================================== */

interface TrayTypeInfo {
  name: string
  description: string
  advantages: string[]
  bestFor: string
  cecNotes: string
}

const trayTypes: TrayTypeInfo[] = [
  {
    name: 'Ladder Tray',
    description: 'Open rungs between two side rails, like a ladder laid flat. Provides maximum ventilation and cable access.',
    advantages: ['Best heat dissipation', 'Easy cable installation and removal', 'Economical for large cables', 'Allows drainage in outdoor installations'],
    bestFor: 'Power cables in industrial and mining surface buildings. The most common tray type for TECK90 and large power cables.',
    cecNotes: 'CEC 12-2200. Single-layer of cables touching: use Table 5C ampacities. Cables must be secured at intervals.',
  },
  {
    name: 'Solid Bottom Tray',
    description: 'Continuous solid metal bottom with side rails. May have cover. Provides EMI shielding and physical protection.',
    advantages: ['EMI/RFI shielding', 'Physical protection for cables', 'Can be covered for additional protection', 'Suitable for control/instrumentation'],
    bestFor: 'Control cables, instrumentation, data cables. Where EMI shielding is needed near VFDs or high-power circuits.',
    cecNotes: 'CEC 12-2200. Reduced ampacity compared to ladder due to less ventilation. Cover further reduces ampacity.',
  },
  {
    name: 'Wire Mesh Tray (Basket Tray)',
    description: 'Open mesh construction from welded wire. Lightweight and easy to install. Good for data and low-voltage control.',
    advantages: ['Very lightweight', 'Easy field modification', 'Excellent ventilation', 'Low cost', 'Quick installation'],
    bestFor: 'Data centers, structured cabling, low-voltage control wiring. Not suitable for heavy power cables.',
    cecNotes: 'Must be listed/approved. Not suitable for all cable types. Check load capacity for cable weight.',
  },
  {
    name: 'Channel Tray',
    description: 'Small single-channel section for routing individual cables or small bundles. Essentially a C-shaped channel.',
    advantages: ['Simple installation', 'Good for single cable runs', 'Low profile', 'Easy to support'],
    bestFor: 'Single cable drops, branch runs from main tray, retrofit installations.',
    cecNotes: 'CEC 12-2200 applies. Limited to smaller cable quantities. Must maintain fill requirements.',
  },
]

interface TrayFillRule {
  cableType: string
  trayType: string
  fillRule: string
  cecRef: string
}

const trayFillRules: TrayFillRule[] = [
  { cableType: 'Multi-conductor (TECK, AC90)', trayType: 'Ladder/Ventilated', fillRule: 'Max fill = tray cross-section area x 40%', cecRef: 'CEC 12-2202' },
  { cableType: 'Multi-conductor (TECK, AC90)', trayType: 'Solid Bottom', fillRule: 'Max fill = tray cross-section area x 40%', cecRef: 'CEC 12-2202' },
  { cableType: 'Single conductors (1/0 and larger)', trayType: 'Ladder', fillRule: 'Single layer only. Cables touching OK.', cecRef: 'CEC 12-2202' },
  { cableType: 'Single conductors (smaller than 1/0)', trayType: 'Ladder/Ventilated', fillRule: 'Max fill = tray cross-section area x 40%', cecRef: 'CEC 12-2202' },
  { cableType: 'Control / signal cables', trayType: 'Any', fillRule: 'Max fill = tray cross-section area x 50%', cecRef: 'CEC 12-2202' },
]

/* ================================================================== */
/*  TAB 6 DATA: UNDERGROUND & OUTDOOR                                  */
/* ================================================================== */

interface BurialDepth {
  method: string
  underBuildings: string
  underRoadways: string
  underDriveways: string
  otherAreas: string
}

const burialDepths: BurialDepth[] = [
  { method: 'Rigid Metal Conduit (RMC/IMC)', underBuildings: '0 (slab)', underRoadways: '600 mm', underDriveways: '450 mm', otherAreas: '450 mm' },
  { method: 'Rigid PVC (Sched 40)', underBuildings: '0 (slab)', underRoadways: '600 mm', underDriveways: '450 mm', otherAreas: '450 mm' },
  { method: 'Rigid PVC (concrete encased)', underBuildings: '0 (slab)', underRoadways: '450 mm', underDriveways: '300 mm', otherAreas: '300 mm' },
  { method: 'Direct Burial Cable (600V)', underBuildings: '0 (slab)', underRoadways: '900 mm', underDriveways: '600 mm', otherAreas: '600 mm' },
  { method: 'TECK90 Direct Burial', underBuildings: '0 (slab)', underRoadways: '900 mm', underDriveways: '600 mm', otherAreas: '600 mm' },
  { method: 'Low Voltage (Class 2)', underBuildings: '0 (slab)', underRoadways: '450 mm', underDriveways: '300 mm', otherAreas: '150 mm' },
]

/* ================================================================== */
/*  TAB RENDERERS                                                      */
/* ================================================================== */

/* ---- TAB 1: OVERVIEW ---- */

function OverviewTab() {
  const [filter, setFilter] = useState<'all' | 'conduit' | 'cable' | 'other'>('all')
  const filtered = filter === 'all' ? wiringMethods : wiringMethods.filter(m => m.category === filter)
  return (
    <>
      <div style={s.sectionTitle}>CEC Wiring Methods Reference</div>
      <div style={{ ...s.text, marginBottom: 12 }}>
        Every wiring method recognized by the Canadian Electrical Code with key rules on where each is allowed and prohibited.
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['all', 'conduit', 'cable', 'other'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={s.selectBtn(filter === f)}>
            {f === 'all' ? 'All Methods' : f === 'conduit' ? 'Raceways/Conduit' : f === 'cable' ? 'Cables' : 'Other'}
          </button>
        ))}
      </div>
      {filtered.map((m, i) => (
        <div key={i} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={s.cardTitle}>{m.shortName}</div>
            <span style={s.tag('#daa520')}>{m.cecSection}</span>
          </div>
          <div style={{ ...s.text, fontWeight: 600, marginBottom: 4 }}>{m.name}</div>
          <div style={s.text}>{m.description}</div>
          <div style={s.label}>Where Allowed</div>
          {m.allowed.map((a, j) => (
            <div key={j} style={{ ...s.value, paddingLeft: 8 }}>+ {a}</div>
          ))}
          <div style={{ ...s.label, marginTop: 8 }}>Where NOT Allowed</div>
          {m.notAllowed.map((n, j) => (
            <div key={j} style={{ ...s.value, color: '#f88', paddingLeft: 8 }}>- {n}</div>
          ))}
          <div style={{ ...s.label, marginTop: 8 }}>Typical Applications</div>
          {m.typicalApps.map((t, j) => (
            <div key={j} style={{ ...s.value, paddingLeft: 8, color: '#aad' }}>{t}</div>
          ))}
        </div>
      ))}
    </>
  )
}

/* ---- TAB 2: SELECTION ---- */

function SelectionTab() {
  const [selected, setSelected] = useState<LocationKey | null>(null)
  const loc = locations.find(l => l.key === selected)
  return (
    <>
      <div style={s.sectionTitle}>Wiring Method Selection Matrix</div>
      <div style={{ ...s.text, marginBottom: 12 }}>
        Pick a location type below to see which CEC wiring methods are permitted. Preferred methods for that environment are highlighted.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {locations.map(l => (
          <button key={l.key} onClick={() => setSelected(l.key)} style={s.selectBtn(selected === l.key)}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{l.label}</div>
            <div style={{ fontSize: 12, color: selected === l.key ? '#ccc' : '#888' }}>{l.description}</div>
          </button>
        ))}
      </div>
      {loc && (
        <div style={s.card}>
          <div style={s.cardTitle}>{loc.label} -- Allowed Methods</div>
          <div style={{ ...s.label, marginBottom: 8 }}>Preferred Methods</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {loc.preferredMethods.map((m, i) => (
              <span key={i} style={s.tag('#daa520')}>{m}</span>
            ))}
          </div>
          <div style={{ ...s.label, marginBottom: 8 }}>All Allowed Methods</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {loc.allowedMethods.map((m, i) => (
              <span key={i} style={s.allowed}>{m}</span>
            ))}
          </div>
          <div style={{ ...s.label, marginBottom: 4 }}>CEC Notes</div>
          <div style={s.text}>{loc.cecNotes}</div>
        </div>
      )}

      {/* Quick comparison table */}
      <div style={{ ...s.card, marginTop: 8 }}>
        <div style={s.cardTitle}>Quick Comparison: Method vs Location</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Method</th>
                <th style={s.th}>Res</th>
                <th style={s.th}>Comm</th>
                <th style={s.th}>Ind</th>
                <th style={s.th}>Haz</th>
                <th style={s.th}>Mine</th>
                <th style={s.th}>Wet</th>
                <th style={s.th}>Burial</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: 'NMD90', vals: [true, false, false, false, false, false, false] },
                { m: 'AC90', vals: [true, true, true, false, false, false, false] },
                { m: 'EMT', vals: [true, true, true, false, false, false, false] },
                { m: 'TECK90', vals: [false, false, true, true, true, true, true] },
                { m: 'RMC/IMC', vals: [true, true, true, true, true, true, true] },
                { m: 'PVC', vals: [true, true, true, false, false, true, true] },
                { m: 'ACWU90', vals: [true, true, true, false, false, true, true] },
                { m: 'MI Cable', vals: [true, true, true, true, true, true, false] },
                { m: 'SHD-GC', vals: [false, false, false, false, true, false, false] },
                { m: 'FMC', vals: [true, true, true, false, false, false, false] },
                { m: 'LFMC', vals: [false, true, true, false, false, true, false] },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600, color: '#daa520' }}>{row.m}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} style={{ ...s.td, textAlign: 'center', color: v ? '#8f8' : '#f44' }}>
                      {v ? 'Yes' : '--'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* ---- TAB 3: EMT ---- */

function EmtTab() {
  return (
    <>
      <div style={s.sectionTitle}>EMT Installation Guide</div>
      <div style={s.text}>
        Electrical Metallic Tubing (EMT) is the most commonly used raceway in commercial construction. Governed by CEC Section 12-1500.
      </div>

      {/* Where allowed / not allowed */}
      <div style={s.card}>
        <div style={s.cardTitle}>Where EMT Is Allowed</div>
        {[
          'Concealed and exposed in dry locations',
          'Commercial and residential construction',
          'Above suspended ceilings',
          'Embedded in concrete (with approved fittings)',
          'Supported on building structure',
        ].map((item, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>+ {item}</div>)}
        <div style={{ ...s.cardTitle, marginTop: 12 }}>Where EMT Is NOT Allowed</div>
        {[
          'Where subject to severe physical damage (CEC 12-1502)',
          'In cinder fill subject to permanent moisture',
          'Underground direct burial (unless concrete encased)',
          'Hazardous locations (unless specifically listed)',
          'Underground mines (insufficient mechanical protection)',
          'Where galvanic corrosion will occur',
        ].map((item, i) => <div key={i} style={{ ...s.value, color: '#f88', paddingLeft: 8 }}>- {item}</div>)}
      </div>

      {/* Sizes table */}
      <div style={s.card}>
        <div style={s.cardTitle}>EMT Trade Sizes and Specifications</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Trade Size</th>
                <th style={s.th}>OD</th>
                <th style={s.th}>ID</th>
                <th style={s.th}>Max Support</th>
                <th style={s.th}>Bend Radius</th>
                <th style={s.th}>#12 Max</th>
                <th style={s.th}>#10 Max</th>
              </tr>
            </thead>
            <tbody>
              {emtSizes.map((sz, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600, color: '#daa520' }}>{sz.trade}</td>
                  <td style={s.td}>{sz.od}</td>
                  <td style={s.td}>{sz.id}</td>
                  <td style={s.td}>{sz.maxSupportSpacing}</td>
                  <td style={s.td}>{sz.bendRadius}</td>
                  <td style={s.td}>{sz.maxCond12AWG}</td>
                  <td style={s.td}>{sz.maxCond10AWG}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...s.text, fontSize: 11, color: '#888', marginTop: 4 }}>
          Conductor counts based on T90 conductors per CEC Table 8. Actual fill depends on conductor type and insulation.
        </div>
      </div>

      {/* Support rules */}
      <div style={s.card}>
        <div style={s.cardTitle}>Support Requirements (CEC Table 21)</div>
        <div style={s.text}>EMT must be securely fastened within 300 mm of each box, cabinet, or fitting, and at intervals not exceeding:</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>EMT Size</th>
                <th style={s.th}>Max Support Spacing</th>
                <th style={s.th}>Max from Box/Fitting</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: '1/2" - 1"', spacing: '1.5 m', fromBox: '300 mm' },
                { size: '1-1/4" - 2"', spacing: '2.0 m', fromBox: '300 mm' },
                { size: '2-1/2" - 4"', spacing: '2.5 m', fromBox: '300 mm' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.size}</td>
                  <td style={s.td}>{r.spacing}</td>
                  <td style={s.td}>{r.fromBox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bending rules */}
      <div style={s.card}>
        <div style={s.cardTitle}>Bending Rules</div>
        <div style={s.warn}>
          MAXIMUM 360 degrees total bends between pull points (CEC 12-942). This means no more than four 90-degree bends between boxes or conduit bodies.
        </div>
        <div style={s.text}>Key bending rules:</div>
        {[
          'Maximum 360 degrees of total bends between pull points',
          'Use proper bender matched to EMT size (DO NOT use rigid bender on EMT)',
          'Do not kink or flatten the tubing -- re-round if slightly deformed',
          'Minimum bending radius per CEC Table 7 (shown in specs above)',
          'Cut ends must be reamed to remove sharp edges that could damage insulation',
          'Back-to-back bends: measure center-to-center distance',
          'Offset bends: calculate offset multiplier (6x for 30 deg, 2.6x for 22 deg)',
          'Saddle bends: 3-point saddle or 4-point saddle for crossing obstructions',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Cutting and deburring */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cutting and Deburring</div>
        {[
          { step: 1, text: 'Mark the cut location. Use a square or tape measure for accuracy.' },
          { step: 2, text: 'Cut with a hacksaw (32 TPI blade), tubing cutter, or reciprocating saw. Keep the cut square.' },
          { step: 3, text: 'Deburr the inside edge with a reamer tool. This is CRITICAL -- sharp edges will cut insulation during wire pulling.' },
          { step: 4, text: 'File the outside edge smooth for proper connector fit.' },
          { step: 5, text: 'Verify the cut is square -- angled cuts prevent proper connector seating.' },
        ].map((st, i) => (
          <div key={i} style={s.stepRow}>
            <span style={s.stepNumber}>{st.step}</span>
            <span style={s.text}>{st.text}</span>
          </div>
        ))}
        <div style={s.danger}>
          NEVER use a pipe cutter on EMT. It leaves a large internal burr that is difficult to ream and will damage conductor insulation.
        </div>
      </div>

      {/* Connector types */}
      <div style={s.card}>
        <div style={s.cardTitle}>Connector and Coupling Types</div>
        {connectorTypes.map((ct, i) => (
          <div key={i} style={{ ...s.card, background: '#222' }}>
            <div style={{ color: '#daa520', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{ct.type}</div>
            <div style={s.label}>Advantages</div>
            {ct.pros.map((p, j) => <div key={j} style={{ ...s.value, paddingLeft: 8, color: '#8f8' }}>+ {p}</div>)}
            <div style={{ ...s.label, marginTop: 6 }}>Disadvantages</div>
            {ct.cons.map((c, j) => <div key={j} style={{ ...s.value, paddingLeft: 8, color: '#f88' }}>- {c}</div>)}
            <div style={{ ...s.label, marginTop: 6 }}>Best For</div>
            <div style={s.text}>{ct.bestFor}</div>
          </div>
        ))}
      </div>

      {/* Grounding */}
      <div style={s.card}>
        <div style={s.cardTitle}>Grounding Through EMT</div>
        <div style={s.text}>
          EMT is recognized as an equipment grounding conductor per CEC Rule 10-906, provided all connections are tight and continuous.
        </div>
        <div style={s.tip}>
          Key grounding requirements for EMT:
        </div>
        {[
          'All fittings must be tightened to maintain a continuous grounding path',
          'Set-screw fittings: screws must be seated tight against the EMT wall',
          'Compression fittings: provide the most reliable grounding connection',
          'Maximum length for FMC/LFMC whip (1.8 m) before separate bonding conductor required',
          'Verify continuity with a low-resistance ohmmeter after installation',
          'EMT-to-box connections must be made with listed connectors (not just pushed in)',
          'Concentric and eccentric knockouts: remove only the rings needed for the connector size',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Fill calculation tip */}
      <div style={s.card}>
        <div style={s.cardTitle}>Conduit Fill Quick Rules</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Number of Conductors</th>
                <th style={s.th}>Max Fill %</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={s.td}>1 conductor</td><td style={s.td}>53%</td></tr>
              <tr><td style={s.td}>2 conductors</td><td style={s.td}>31%</td></tr>
              <tr><td style={s.td}>3+ conductors</td><td style={s.td}>40%</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ ...s.text, fontSize: 12, color: '#888' }}>Per CEC Table 6 and 8. Use the Conduit Fill calculator in this app for exact calculations.</div>
      </div>
    </>
  )
}

/* ---- TAB 4: TECK90 ---- */

function TeckTab() {
  return (
    <>
      <div style={s.sectionTitle}>TECK90 Installation Guide</div>
      <div style={s.text}>
        TECK90 is the primary wiring method for Ontario mining and heavy industrial. Interlocking aluminum (or steel) armor with an overall PVC jacket rated 90 deg C, wet and dry. CEC Section 12-700.
      </div>

      {/* Gland selection */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cable Gland Selection by Size</div>
        <div style={s.text}>Gland size must match the cable armor OD. Always verify with the manufacturer catalog. Common sizes:</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Cable Size</th>
                <th style={s.th}>Gland Trade Size</th>
                <th style={s.th}>Armor OD Range</th>
                <th style={s.th}>Torque (Nm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cable: '14-10 AWG (3C)', gland: '1/2"', armor: '12-16 mm', torque: '20-27' },
                { cable: '8-6 AWG (3C)', gland: '3/4"', armor: '16.5-21 mm', torque: '35-41' },
                { cable: '4-2 AWG (3C)', gland: '1"', armor: '21-26 mm', torque: '47-54' },
                { cable: '1 - 1/0 AWG (3C)', gland: '1-1/4"', armor: '26.5-31 mm', torque: '68-75' },
                { cable: '2/0 - 3/0 AWG (3C)', gland: '1-1/2"', armor: '30.5-35.5 mm', torque: '75-82' },
                { cable: '4/0 - 250 MCM (3C)', gland: '2"', armor: '35.5-41 mm', torque: '95-102' },
                { cable: '350 MCM (3C)', gland: '2-1/2"', armor: '43-46 mm', torque: '122-136' },
                { cable: '500 MCM (3C)', gland: '3"', armor: '50-53 mm', torque: '163-176' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.cable}</td>
                  <td style={{ ...s.td, color: '#daa520', fontWeight: 700 }}>{r.gland}</td>
                  <td style={s.td}>{r.armor}</td>
                  <td style={s.td}>{r.torque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.warn}>
          Always measure the actual armor OD with calipers before selecting a gland. Cable dimensions vary between manufacturers.
        </div>
      </div>

      {/* Gland assembly step by step */}
      <div style={s.card}>
        <div style={s.cardTitle}>Gland Assembly -- Step by Step</div>
        {glandSteps.map(gs => (
          <div key={gs.step} style={{ marginBottom: 16 }}>
            <div style={s.stepRow}>
              <span style={s.stepNumber}>{gs.step}</span>
              <div>
                <div style={{ color: '#daa520', fontWeight: 600, marginBottom: 2 }}>{gs.title}</div>
                <div style={s.text}>{gs.detail}</div>
              </div>
            </div>
            {gs.warning && <div style={s.danger}>{gs.warning}</div>}
          </div>
        ))}
      </div>

      {/* Support spacing */}
      <div style={s.card}>
        <div style={s.cardTitle}>TECK90 Support Spacing</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Cable Size</th>
                <th style={s.th}>Horizontal Spacing</th>
                <th style={s.th}>Vertical Spacing</th>
              </tr>
            </thead>
            <tbody>
              {teckSupports.map((ts, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{ts.cableSize}</td>
                  <td style={s.td}>{ts.horizontalSpacing}</td>
                  <td style={s.td}>{ts.verticalSpacing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.text}>
          Cable must be supported within 300 mm of each termination point. Use cable hangers, J-hooks, cable cleats, or cable tray for support.
        </div>
      </div>

      {/* Bending radius */}
      <div style={s.card}>
        <div style={s.cardTitle}>Bending Radius</div>
        <div style={s.text}>
          Minimum bending radius for TECK90 is 12 times the overall cable diameter for cables 1" and larger, and 8 times for smaller cables (CEC 12-710). Never kink TECK cable -- the interlocking armor will separate and lose its grounding path.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Cable OD</th>
                <th style={s.th}>Multiplier</th>
                <th style={s.th}>Min Bend Radius</th>
              </tr>
            </thead>
            <tbody>
              {[
                { od: '15 mm (14 AWG 3C)', mult: '8x', radius: '120 mm' },
                { od: '20 mm (8 AWG 3C)', mult: '8x', radius: '160 mm' },
                { od: '25 mm (4 AWG 3C)', mult: '8x', radius: '200 mm' },
                { od: '33 mm (1/0 AWG 3C)', mult: '12x', radius: '396 mm' },
                { od: '41 mm (4/0 AWG 3C)', mult: '12x', radius: '492 mm' },
                { od: '57 mm (500 MCM 3C)', mult: '12x', radius: '684 mm' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={s.td}>{r.od}</td>
                  <td style={{ ...s.td, color: '#daa520' }}>{r.mult}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.radius}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TECK in cable tray */}
      <div style={s.card}>
        <div style={s.cardTitle}>TECK90 in Cable Tray</div>
        {[
          'TECK90 is the most common cable in industrial cable tray installations',
          'Single layer of cables touching: use CEC Table 5C ampacities',
          'Multi-layer stacking: derate per CEC Table 5C notes',
          'Cables must be secured where they enter and exit the tray',
          'Maintain proper fill per CEC 12-2202 (40% for multi-conductor cables)',
          'Separate power and control/signal cables in separate trays or with barriers',
          'Fire barriers required where tray passes through fire-rated walls/floors',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* TECK direct burial */}
      <div style={s.card}>
        <div style={s.cardTitle}>TECK90 Direct Burial</div>
        <div style={s.text}>
          TECK90 is rated for direct burial. The PVC jacket protects against moisture and soil conditions.
        </div>
        {[
          'Minimum burial depth per CEC Table 53: 600 mm under driveways, 900 mm under roadways',
          'Lay on a 75 mm sand bed, cover with 75 mm sand before backfill',
          'Place warning tape 300 mm above the cable',
          'Use rigid conduit or Schedule 80 PVC for the stub-up (last 1.8 m above grade)',
          'Seal conduit ends to prevent moisture migration',
          'Direct-buried TECK does not require additional conduit protection in most cases',
          'In rocky ground, concrete encasement or additional mechanical protection is recommended',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* TECK in hazardous locations */}
      <div style={s.card}>
        <div style={s.cardTitle}>TECK90 in Hazardous Locations</div>
        <div style={s.warn}>
          TECK90 IS permitted in hazardous locations per CEC 18-072 (Zone 1) and 18-152 (Zone 2) when installed with LISTED cable glands specifically approved for the classification. Verify gland listing before use.
        </div>
        {[
          'Cable glands must be listed for the specific zone/class/division',
          'Common listed glands: CMP, Appleton, Hubbell, Crouse-Hinds TMC series',
          'Gland must provide seal equivalent to explosion-proof fitting',
          'Armor provides the bonding path -- verify continuity after gland installation',
          'Seal-off fittings at boundary crossings per CEC 18-100',
          'In underground mines: TECK90 is standard, glands must meet O. Reg. 854',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Anti-short bushings */}
      <div style={s.card}>
        <div style={s.cardTitle}>Anti-Short Bushings (Redheads)</div>
        <div style={s.danger}>
          Anti-short bushings are REQUIRED by CEC. Inspectors will look for the red bushing visible at every TECK termination. Failure to install is an automatic code violation.
        </div>
        <div style={s.text}>
          The bushing is a red fiber or plastic sleeve that sits between the cut armor edge and the conductor insulation. It prevents the sharp armor from cutting into wire insulation during installation and thermal expansion/contraction cycles.
        </div>
        {[
          'Must be visible from outside the enclosure (inspectors check for red color)',
          'Size must match the cable -- too small and it will not stay in place',
          'Install BEFORE threading conductors through the gland',
          'If the bushing falls out during installation, fish it back in and re-seat',
          'Some glands have built-in anti-short features, but a separate bushing is still best practice',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Termination at disconnects */}
      <div style={s.card}>
        <div style={s.cardTitle}>TECK90 Termination at Disconnects</div>
        {[
          { step: 1, text: 'Select the correct gland size based on cable armor OD measurement.' },
          { step: 2, text: 'Remove the appropriate knockout from the disconnect enclosure. Use a knockout punch for clean holes.' },
          { step: 3, text: 'Install the gland per the step-by-step procedure above. Ensure the bonding cone seats fully on the armor.' },
          { step: 4, text: 'Route conductors to the terminals. Leave a service loop for future re-termination if needed.' },
          { step: 5, text: 'Terminate phase conductors to the line-side lugs. Match wire size to lug rating.' },
          { step: 6, text: 'Terminate the ground conductor to the ground bus or lug inside the disconnect.' },
          { step: 7, text: 'Verify all terminal torque values match the disconnect manufacturer specs.' },
          { step: 8, text: 'Perform insulation resistance test (Megger) before energizing -- minimum 1 Megohm at 500V DC.' },
        ].map((st, i) => (
          <div key={i} style={s.stepRow}>
            <span style={s.stepNumber}>{st.step}</span>
            <span style={s.text}>{st.text}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ---- TAB 5: CABLE TRAY ---- */

function CableTrayTab() {
  return (
    <>
      <div style={s.sectionTitle}>Cable Tray Systems</div>
      <div style={s.text}>
        Cable tray is an open support system for cables governed by CEC Section 12-2200. It is the backbone of industrial and mining surface cable distribution.
      </div>

      {/* Tray types */}
      {trayTypes.map((tt, i) => (
        <div key={i} style={s.card}>
          <div style={s.cardTitle}>{tt.name}</div>
          <div style={s.text}>{tt.description}</div>
          <div style={{ ...s.label, marginTop: 8 }}>Advantages</div>
          {tt.advantages.map((a, j) => <div key={j} style={{ ...s.value, paddingLeft: 8, color: '#8f8' }}>+ {a}</div>)}
          <div style={{ ...s.label, marginTop: 8 }}>Best For</div>
          <div style={s.text}>{tt.bestFor}</div>
          <div style={{ ...s.label, marginTop: 8 }}>CEC Notes</div>
          <div style={{ ...s.text, color: '#aad' }}>{tt.cecNotes}</div>
        </div>
      ))}

      {/* Sizing per CEC */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cable Tray Sizing (CEC 12-2200)</div>
        <div style={s.text}>Standard tray widths and usable cross-section areas for fill calculations:</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Width (mm)</th>
                <th style={s.th}>Depth (mm)</th>
                <th style={s.th}>Usable Area (mm2)</th>
                <th style={s.th}>40% Fill (mm2)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { w: 150, d: 75, area: 11250 },
                { w: 150, d: 100, area: 15000 },
                { w: 300, d: 75, area: 22500 },
                { w: 300, d: 100, area: 30000 },
                { w: 450, d: 100, area: 45000 },
                { w: 600, d: 100, area: 60000 },
                { w: 600, d: 150, area: 90000 },
                { w: 750, d: 100, area: 75000 },
                { w: 900, d: 100, area: 90000 },
                { w: 900, d: 150, area: 135000 },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.w}</td>
                  <td style={s.td}>{r.d}</td>
                  <td style={s.td}>{r.area.toLocaleString()}</td>
                  <td style={{ ...s.td, color: '#daa520' }}>{(r.area * 0.4).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allowed cable types */}
      <div style={s.card}>
        <div style={s.cardTitle}>Allowed Cable Types in Tray</div>
        {[
          'TECK90 -- most common power cable in tray',
          'ACWU90 -- armoured cable with PVC jacket',
          'AC90 -- in dry locations only',
          'TC (Tray Cable) -- specifically rated for tray',
          'MI Cable -- mineral insulated',
          'NMD90 -- in residential cable tray only (rare)',
          'Control and instrumentation cables -- with proper separation from power',
          'Fiber optic cables -- in separate tray or with inner-duct',
        ].map((item, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {item}</div>)}
      </div>

      {/* Fill rules table */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cable Fill Rules (CEC 12-2202)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Cable Type</th>
                <th style={s.th}>Tray Type</th>
                <th style={s.th}>Fill Rule</th>
                <th style={s.th}>CEC Ref</th>
              </tr>
            </thead>
            <tbody>
              {trayFillRules.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.cableType}</td>
                  <td style={s.td}>{r.trayType}</td>
                  <td style={s.td}>{r.fillRule}</td>
                  <td style={{ ...s.td, color: '#daa520' }}>{r.cecRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cable spacing */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cable Spacing Rules</div>
        {[
          'Power cables rated over 5 kV: maintain 1 cable diameter spacing between cables',
          'Multi-conductor power cables (600V): may be touching in single layer (ladder tray)',
          'Stacked cables: derate ampacity per CEC Table 5C correction factors',
          'Control and power cables: separate by barrier or 150 mm minimum spacing',
          'Signal/instrumentation cables: separate from power by barrier or in separate tray',
          'Fire alarm cables: separate tray or maintain required separation per CEC Section 32',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Fire barriers */}
      <div style={s.card}>
        <div style={s.cardTitle}>Fire Barriers and Penetrations</div>
        <div style={s.danger}>
          Cable tray passing through fire-rated walls or floors MUST have fire barriers installed to maintain the fire rating. This is a life-safety requirement.
        </div>
        {[
          'Fire barrier pillows, putty, or intumescent wraps at all rated penetrations',
          'Maintain the original fire rating of the assembly (1 hr, 2 hr, etc.)',
          'Listed firestop systems required (STI, 3M, Hilti, Specified Technologies)',
          'Through-penetration firestop must be inspected before concealment',
          'Leave space in tray for future cables at fire barrier locations',
          'Document all firestop installations for inspection records',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Grounding tray */}
      <div style={s.card}>
        <div style={s.cardTitle}>Cable Tray Grounding (CEC 10-906)</div>
        <div style={s.text}>
          Metal cable tray is recognized as an equipment grounding conductor when properly bonded.
        </div>
        {[
          'All tray sections must be bonded together with listed bonding jumpers',
          'Tray must be bonded to the grounding electrode system',
          'Splice plates alone are NOT sufficient for bonding -- use bonding jumpers or listed hardware',
          'Tray must be grounded at each end and at intervals not exceeding 15 m',
          'Where tray crosses expansion joints, use flexible bonding jumpers',
          'Verify bonding continuity after installation with low-resistance ohmmeter (less than 1 ohm)',
          'If using tray as sole grounding path, cross-sectional area must meet CEC Table 16',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Support spacing */}
      <div style={s.card}>
        <div style={s.cardTitle}>Tray Support Spacing</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Tray Width</th>
                <th style={s.th}>Max Support Span (Straight)</th>
                <th style={s.th}>Max Cantilever</th>
              </tr>
            </thead>
            <tbody>
              {[
                { width: '150-300 mm', span: '2.4 m', cantilever: '600 mm' },
                { width: '450-600 mm', span: '3.0 m', cantilever: '900 mm' },
                { width: '750-900 mm', span: '3.0 m', cantilever: '900 mm' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.width}</td>
                  <td style={s.td}>{r.span}</td>
                  <td style={s.td}>{r.cantilever}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...s.text, fontSize: 12, color: '#888' }}>
          Spans depend on cable load. Reduce span for heavy cable loads. Consult manufacturer load tables.
        </div>
      </div>
    </>
  )
}

/* ---- TAB 6: UNDERGROUND & OUTDOOR ---- */

function UndergroundTab() {
  return (
    <>
      <div style={s.sectionTitle}>Underground and Outdoor Wiring</div>
      <div style={s.text}>
        Underground and outdoor installations must address burial depths, weather protection, expansion/contraction, and ground fault protection. CEC Table 53 and Section 12 govern these installations.
      </div>

      {/* Burial depths table */}
      <div style={s.card}>
        <div style={s.cardTitle}>Minimum Burial Depths (CEC Table 53)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Wiring Method</th>
                <th style={s.th}>Under Buildings</th>
                <th style={s.th}>Roadways</th>
                <th style={s.th}>Driveways</th>
                <th style={s.th}>Other Areas</th>
              </tr>
            </thead>
            <tbody>
              {burialDepths.map((bd, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{bd.method}</td>
                  <td style={s.td}>{bd.underBuildings}</td>
                  <td style={s.td}>{bd.underRoadways}</td>
                  <td style={s.td}>{bd.underDriveways}</td>
                  <td style={s.td}>{bd.otherAreas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.warn}>
          Burial depths are measured from the TOP of the conduit or cable to finished grade. In areas subject to cultivation, add 150 mm to depths.
        </div>
      </div>

      {/* Required protection */}
      <div style={s.card}>
        <div style={s.cardTitle}>Underground Protection Requirements</div>
        {[
          'Lay cable or conduit on a 75 mm minimum sand or screened earth bed',
          'Cover with 75 mm of sand or screened earth before backfill',
          'Do not backfill with rocks, debris, or frozen chunks that could damage conduit',
          'Compact backfill in lifts (layers) to prevent settling',
          'Where underground wiring crosses other utilities, maintain 300 mm separation',
          'Protect cables from damage where they emerge from ground: use rigid conduit for last 1.8 m',
          'Underground splices require listed splice kits rated for direct burial',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Warning tape */}
      <div style={s.card}>
        <div style={s.cardTitle}>Warning Tape Requirements</div>
        <div style={s.text}>
          CEC requires a warning ribbon or tape to be installed above underground wiring to alert future excavators.
        </div>
        {[
          'Place warning tape 300 mm (12 inches) above the cable or conduit',
          'Tape must be durable, weather-resistant, and brightly colored (red for power)',
          'Tape should be wide enough to be visible (minimum 75 mm / 3 inches)',
          'Mark tape with "CAUTION: BURIED ELECTRIC LINE" or equivalent',
          'For multiple circuits, use tape above each run',
          'Some jurisdictions also require marker posts at grade level at each change of direction',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Conduit requirements underground */}
      <div style={s.card}>
        <div style={s.cardTitle}>Conduit Requirements Underground</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Conduit Type</th>
                <th style={s.th}>Use</th>
                <th style={s.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'PVC Schedule 40', use: 'Standard underground', notes: 'Must have 50 mm concrete cover if less than 450 mm deep' },
                { type: 'PVC Schedule 80', use: 'Subject to physical damage', notes: 'Required where conduit is exposed or within 50 mm of grade' },
                { type: 'Rigid Metal (RMC)', use: 'Stub-ups to equipment', notes: 'Use for above-grade transitions. Thread all joints.' },
                { type: 'HDPE', use: 'Long runs, directional boring', notes: 'Must be listed. Sweep bends preferred. Pull rope during install.' },
                { type: 'PVC DB (direct burial)', use: 'Non-pressure underground', notes: 'Lighter duty than Sched 40. Check local AHJ acceptance.' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600, color: '#daa520' }}>{r.type}</td>
                  <td style={s.td}>{r.use}</td>
                  <td style={s.td}>{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GFCI for outdoor */}
      <div style={s.card}>
        <div style={s.cardTitle}>GFCI Protection for Outdoor Installations</div>
        <div style={s.text}>
          CEC requires Ground Fault Circuit Interrupter (GFCI) protection for outdoor receptacles and certain outdoor circuits.
        </div>
        {[
          'All 125V 15A and 20A receptacles outdoors require GFCI (CEC 26-700)',
          'All receptacles within 1.5 m of a sink (indoor or outdoor) require GFCI',
          'Construction site temporary wiring requires GFCI on all 15A and 20A circuits',
          'Swimming pool and hot tub equipment: GFCI required per CEC Section 68',
          'Outdoor holiday/decorative lighting on temporary circuits: GFCI required',
          'Sump pump circuits: GFCI recommended but check if AHJ allows exception',
          'Mining: ground fault protection on all portable equipment circuits per O. Reg. 854',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Weatherproof boxes */}
      <div style={s.card}>
        <div style={s.cardTitle}>Weatherproof Boxes and Fittings</div>
        {[
          'Outdoor boxes must be listed as weatherproof (WP or NEMA 3R minimum)',
          'In-use covers (bubble covers) required where receptacle will be used with cord plugged in while raining',
          'Flat weatherproof covers acceptable only where receptacle is not attended while in use',
          'All unused openings must be closed with listed plugs',
          'Conduit connections must be raintight (compression fittings or listed raintight fittings)',
          'Mount boxes so that water drains away from the entry point',
          'Outdoor disconnect enclosures: NEMA 3R minimum for weather protection',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Drip loops */}
      <div style={s.card}>
        <div style={s.cardTitle}>Drip Loops and Moisture Prevention</div>
        <div style={s.text}>
          Drip loops prevent water from following conductors into enclosures and service heads.
        </div>
        {[
          'Service entrance: conductors must loop below the service head so water drips off',
          'Outdoor conduit runs: slope conduit slightly toward drain points or pull boxes',
          'Seal conduit ends entering buildings to prevent moisture migration (duct seal)',
          'In cold climates: moisture in conduit can freeze and damage conductors or prevent pulling',
          'Use listed weep-hole fittings at low points of conduit runs',
          'Service mast: weather head must be above the point of attachment',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Expansion joints */}
      <div style={s.card}>
        <div style={s.cardTitle}>PVC Expansion and Contraction</div>
        <div style={s.danger}>
          PVC conduit expands and contracts significantly with temperature changes. Failure to account for this will cause cracked conduit, pulled-out fittings, and water infiltration.
        </div>
        <div style={s.text}>
          PVC expansion rate: approximately 40 mm per 30 m run per 25 deg C temperature change. In Ontario, seasonal temperature swings of 50+ deg C are common.
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Run Length</th>
                <th style={s.th}>Temp Change 30 deg C</th>
                <th style={s.th}>Temp Change 50 deg C</th>
                <th style={s.th}>Expansion Joint?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { len: '10 m', exp30: '~13 mm', exp50: '~22 mm', joint: 'Not required if properly supported' },
                { len: '20 m', exp30: '~27 mm', exp50: '~44 mm', joint: 'Recommended' },
                { len: '30 m', exp30: '~40 mm', exp50: '~67 mm', joint: 'Required' },
                { len: '50 m+', exp30: '~67 mm+', exp50: '~111 mm+', joint: 'Multiple joints required' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.len}</td>
                  <td style={s.td}>{r.exp30}</td>
                  <td style={s.td}>{r.exp50}</td>
                  <td style={{ ...s.td, color: '#daa520' }}>{r.joint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.tip}>
          Install PVC at mid-range temperature when possible. In cold weather, leave gaps at couplings. Use expansion fittings for runs over 20 m exposed to temperature swings.
        </div>
        {[
          'Expansion joints/fittings allow conduit to slide without stress on connections',
          'Support conduit on one side of expansion joint with fixed clamp, other side with sliding support',
          'Do not cement (glue) both sides of an expansion fitting -- one side must slide',
          'Underground PVC is temperature-stable and typically does not need expansion joints',
          'Expansion couplings available from 1/2" through 6" trade sizes',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Heating cables */}
      <div style={s.card}>
        <div style={s.cardTitle}>Heating Cables (Heat Trace)</div>
        <div style={s.text}>
          Heating cables are used to prevent freezing of water pipes, maintain process temperatures, and for snow/ice melting. CEC Section 62 governs these installations.
        </div>
        {[
          'Self-regulating cables adjust output based on temperature -- most common type',
          'Constant wattage cables maintain fixed output regardless of temperature',
          'MI heating cables for high temperature applications (process heat)',
          'All heating cables require a dedicated branch circuit with GFCI protection',
          'Maximum circuit length depends on cable type, voltage, and ambient temperature',
          'Insulation over heating cable reduces wattage needed but increases cable temperature',
          'Thermostat or ambient sensing controller recommended for energy efficiency',
          'Fire-rated installations require listed cables and follow manufacturer spacing',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Heat trace installation */}
      <div style={s.card}>
        <div style={s.cardTitle}>Heat Trace Installation Steps</div>
        {[
          { step: 1, text: 'Calculate heat loss of the pipe or surface to determine watts per metre required.' },
          { step: 2, text: 'Select cable type and wattage. Self-regulating is preferred for pipe freeze protection.' },
          { step: 3, text: 'Install cable along the bottom of the pipe (for freeze protection) or spiral-wrap for higher heat output.' },
          { step: 4, text: 'Secure cable with cable ties or adhesive tape rated for the temperature. Do not use metal straps that could damage the cable.' },
          { step: 5, text: 'Install the power connection kit at one end and the end termination seal at the other.' },
          { step: 6, text: 'Apply pipe insulation over the cable. Seal all joints to prevent moisture ingress.' },
          { step: 7, text: 'Connect to a dedicated GFCI-protected circuit. Install thermostat or controller.' },
          { step: 8, text: 'Label the circuit and the pipe/surface: "CAUTION: ELECTRIC HEATING CABLE" per CEC 62-200.' },
        ].map((st, i) => (
          <div key={i} style={s.stepRow}>
            <span style={s.stepNumber}>{st.step}</span>
            <span style={s.text}>{st.text}</span>
          </div>
        ))}
      </div>

      {/* Outdoor conduit best practices */}
      <div style={s.card}>
        <div style={s.cardTitle}>Outdoor Conduit Best Practices</div>
        {[
          'Use outdoor-rated (UV-resistant) PVC conduit -- grey color indicates UV rated',
          'White PVC is for plumbing and will degrade in sunlight -- NEVER use for electrical',
          'Support outdoor conduit per CEC Table 21 -- additional supports at bends and direction changes',
          'Slope horizontal runs slightly (1:100) toward drain points',
          'Use pull boxes at intervals for long runs to facilitate wire pulling',
          'Protect conduit from vehicle traffic with bollards or concrete barriers',
          'Use expansion fittings on long exposed runs (see PVC expansion section above)',
          'Paint EMT or rigid conduit in outdoor applications to prevent corrosion where needed',
          'Use stainless steel straps and hardware in coastal or corrosive environments',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>

      {/* Snow melting / ice prevention */}
      <div style={s.card}>
        <div style={s.cardTitle}>Snow Melting and De-Icing Systems</div>
        <div style={s.text}>
          Electric snow melting systems for driveways, ramps, and walkways are governed by CEC Section 62-300.
        </div>
        {[
          'Embedded heating cables or mats in concrete or asphalt',
          'Typical design: 300-500 W/m2 for snow melting',
          'GFCI protection required on all snow melting circuits (CEC 62-300)',
          'Cables must be installed at proper depth (typically 40-75 mm below surface)',
          'Do not cross or overlap heating cables -- hot spots cause premature failure',
          'Moisture/temperature sensor controls for automatic operation',
          'Dedicated panel with contactor for each zone',
          'Mark the heated area to prevent future drilling or cutting into cables',
        ].map((rule, i) => <div key={i} style={{ ...s.value, paddingLeft: 8 }}>-- {rule}</div>)}
      </div>
    </>
  )
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function WiringMethodsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  return (
    <PageWrapper title="Wiring Methods">
      {/* Tab bar */}
      <div style={s.tabBar}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={s.tab(activeTab === t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'selection' && <SelectionTab />}
      {activeTab === 'emt' && <EmtTab />}
      {activeTab === 'teck' && <TeckTab />}
      {activeTab === 'tray' && <CableTrayTab />}
      {activeTab === 'underground' && <UndergroundTab />}
    </PageWrapper>
  )
}
