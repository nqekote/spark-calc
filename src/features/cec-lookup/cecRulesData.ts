/* ══════════════════════════════════════════════
   CEC Smart Code Lookup — Rules Database
   Curated CEC rule references with keywords,
   categories, and brief original descriptions.
   ══════════════════════════════════════════════ */

export interface CECRuleEntry {
  rule: string
  title: string
  section: string
  description: string
  keywords: string[]
  tips?: string[]
  relatedRules?: string[]
}

export const cecRules: CECRuleEntry[] = [
  // ── Section 2: General Rules ──
  {
    rule: '2-024',
    title: 'Approval of Electrical Equipment',
    section: 'General',
    description: 'All electrical equipment used in an installation must be approved and bear a certification mark from an accredited testing organization.',
    keywords: ['approval', 'certification', 'csa', 'ul', 'listed', 'approved', 'equipment'],
    tips: ['Look for CSA, cUL, or cETL marks on equipment'],
  },
  {
    rule: '2-100',
    title: 'Wiring — General',
    section: 'General',
    description: 'Electrical equipment must be installed in a neat and workmanlike manner. Covers general requirements for all wiring installations.',
    keywords: ['wiring', 'general', 'installation', 'workmanlike', 'neat'],
  },
  {
    rule: '2-308',
    title: 'Damage to Electrical Equipment',
    section: 'General',
    description: 'Equipment must not be installed if it has been damaged in a way that affects safe operation or mechanical strength.',
    keywords: ['damage', 'damaged', 'equipment', 'safety'],
  },

  // ── Section 4: Conductors ──
  {
    rule: '4-004',
    title: 'Conductor Types & Insulation',
    section: 'Conductors',
    description: 'Conductors must have insulation suitable for the voltage, temperature, and environmental conditions of the installation.',
    keywords: ['conductor', 'insulation', 'type', 'wire', 'rating', 'temperature'],
    relatedRules: ['4-006'],
  },
  {
    rule: '4-006',
    title: 'Conductor Ampacity',
    section: 'Conductors',
    description: 'Establishes allowable ampacities for conductors based on insulation type, temperature rating, and installation conditions. References Tables 1–4.',
    keywords: ['ampacity', 'wire', 'conductor', 'current', 'capacity', 'table 1', 'table 2', 'table 3', 'table 4', 'rating'],
    tips: ['Table 1 = 60°C, Table 2 = 75°C, Table 3 = 90°C, Table 4 = aluminum'],
    relatedRules: ['4-004', '8-104'],
  },
  {
    rule: '4-032',
    title: 'Derating — Conductor Bundling',
    section: 'Conductors',
    description: 'When more than 3 current-carrying conductors are in a raceway or cable, ampacity must be derated per Table 5C.',
    keywords: ['derating', 'derate', 'bundling', 'raceway', 'table 5c', 'correction', 'adjustment', 'group'],
    tips: ['4–6 conductors = 80%, 7–24 = 70%, 25–42 = 60%, 43+ = 50%'],
    relatedRules: ['4-006'],
  },
  {
    rule: '4-034',
    title: 'Derating — Ambient Temperature',
    section: 'Conductors',
    description: 'Conductor ampacity must be corrected for ambient temperatures other than 30°C using Table 5A or 5B.',
    keywords: ['derating', 'derate', 'ambient', 'temperature', 'correction', 'table 5a', 'table 5b', 'hot', 'heat'],
    relatedRules: ['4-006', '4-032'],
  },

  // ── Section 6: Services & Service Equipment ──
  {
    rule: '6-102',
    title: 'Service Size — Minimum',
    section: 'Services',
    description: 'Minimum service entrance size must be capable of carrying the calculated demand load plus any required spare capacity.',
    keywords: ['service', 'entrance', 'size', 'minimum', 'demand', 'load', 'panel'],
    relatedRules: ['8-200'],
  },
  {
    rule: '6-206',
    title: 'Service Disconnecting Means',
    section: 'Services',
    description: 'A service disconnecting means must be provided at the point of entry of supply conductors. Must be readily accessible.',
    keywords: ['service', 'disconnect', 'main', 'breaker', 'accessible', 'entry'],
  },

  // ── Section 8: Circuit Loading ──
  {
    rule: '8-104',
    title: 'Continuous Load — 80% Rule',
    section: 'Circuit Loading',
    description: 'Conductors and overcurrent devices for continuous loads must be rated at least 125% of the continuous load current (or load limited to 80% of device rating).',
    keywords: ['continuous', 'load', '80%', '125%', 'derating', 'breaker', 'rating', 'overcurrent'],
    tips: ['If load runs 3+ hours continuously, apply 125% rule'],
    relatedRules: ['14-104'],
  },
  {
    rule: '8-200',
    title: 'Residential Demand Load',
    section: 'Circuit Loading',
    description: 'Calculation method for determining minimum service size for residential dwelling units. Includes basic load, range, dryer, A/C, heating, etc.',
    keywords: ['residential', 'demand', 'load', 'dwelling', 'house', 'home', 'service', 'calculation'],
    relatedRules: ['6-102'],
  },
  {
    rule: '8-210',
    title: 'Commercial Demand Load',
    section: 'Circuit Loading',
    description: 'Demand load calculation methods for commercial and industrial occupancies. Different demand factors than residential.',
    keywords: ['commercial', 'industrial', 'demand', 'load', 'calculation', 'business', 'store'],
  },

  // ── Section 10: Grounding & Bonding ──
  {
    rule: '10-100',
    title: 'System Grounding — General',
    section: 'Grounding & Bonding',
    description: 'General requirements for grounding of electrical systems. AC systems supplying premises wiring must be grounded.',
    keywords: ['grounding', 'ground', 'system', 'bonding', 'earth'],
  },
  {
    rule: '10-114',
    title: 'Grounding Conductor Size',
    section: 'Grounding & Bonding',
    description: 'System grounding conductor sizing based on service or feeder ampere rating. References Table 17.',
    keywords: ['grounding', 'conductor', 'size', 'table 17', 'ground wire', 'bonding'],
    tips: ['100A service = #8 Cu, 200A = #6 Cu, 400A = #3 Cu'],
    relatedRules: ['10-814'],
  },
  {
    rule: '10-204',
    title: 'Equipment Bonding',
    section: 'Grounding & Bonding',
    description: 'All non-current-carrying metal parts of electrical equipment must be bonded to ground. Includes enclosures, raceways, and cable armour.',
    keywords: ['bonding', 'equipment', 'ground', 'metal', 'enclosure', 'raceway', 'armour'],
  },
  {
    rule: '10-406',
    title: 'Ground Fault Protection',
    section: 'Grounding & Bonding',
    description: 'Ground fault protection of equipment requirements for services and feeders. Required for certain ratings and configurations.',
    keywords: ['ground fault', 'protection', 'gfp', 'service', 'feeder'],
    relatedRules: ['30-004'],
  },
  {
    rule: '10-814',
    title: 'Bonding Conductor Size — Table 16',
    section: 'Grounding & Bonding',
    description: 'Sizing of bonding conductors for raceways, cable armour, and equipment based on overcurrent device rating. References Table 16.',
    keywords: ['bonding', 'conductor', 'size', 'table 16', 'raceway', 'equipment'],
    relatedRules: ['10-114'],
  },

  // ── Section 12: Wiring Methods ──
  {
    rule: '12-100',
    title: 'Wiring Methods — Approved Types',
    section: 'Wiring Methods',
    description: 'Only approved wiring methods shall be used. Lists accepted methods including NMD, AC90, TECK, EMT, rigid, etc.',
    keywords: ['wiring', 'method', 'nmd', 'ac90', 'teck', 'emt', 'rigid', 'pvc', 'raceway', 'cable'],
  },
  {
    rule: '12-012',
    title: 'Wire Fill in Raceways',
    section: 'Wiring Methods',
    description: 'Maximum fill percentages for conductors in raceways: 53% for 1, 31% for 2, 40% for 3 or more conductors.',
    keywords: ['conduit', 'fill', 'raceway', 'percent', 'wire', '53%', '31%', '40%'],
    tips: ['1 wire = 53%, 2 wires = 31%, 3+ wires = 40%'],
    relatedRules: ['12-100'],
  },
  {
    rule: '12-022',
    title: 'Free Conductor Length at Boxes',
    section: 'Wiring Methods',
    description: 'At least 150mm (6 in) of free conductor must be left at each outlet, junction, and switch point.',
    keywords: ['free', 'conductor', 'length', 'box', 'outlet', 'junction', '150mm', '6 inch'],
  },
  {
    rule: '12-506',
    title: 'Box Fill Requirements',
    section: 'Wiring Methods',
    description: 'Minimum volume requirements for outlet and junction boxes based on the number and size of conductors, clamps, devices, and grounds.',
    keywords: ['box', 'fill', 'junction', 'outlet', 'volume', 'conductor', 'clamp', 'device'],
    relatedRules: ['12-3034'],
  },
  {
    rule: '12-3034',
    title: 'Box Volume Calculations',
    section: 'Wiring Methods',
    description: 'Detailed counting rules for required box volume. Each conductor counts as a specific volume based on wire gauge.',
    keywords: ['box', 'volume', 'calculation', 'counting', 'conductor', 'fill'],
    relatedRules: ['12-506'],
  },
  {
    rule: '12-618',
    title: 'Raceway Support & Spacing',
    section: 'Wiring Methods',
    description: 'Support requirements and maximum spacing for various raceway types. EMT, rigid, PVC each have different requirements.',
    keywords: ['raceway', 'support', 'spacing', 'strap', 'clamp', 'emt', 'rigid', 'pvc', 'distance'],
  },
  {
    rule: '12-904',
    title: 'EMT Bending',
    section: 'Wiring Methods',
    description: 'Maximum number of bends between pull points shall not exceed 360°. Bending requirements for EMT.',
    keywords: ['emt', 'bending', 'bend', 'conduit', '360', 'pull', 'offset', 'saddle'],
  },
  {
    rule: '12-1014',
    title: 'Underground Wiring — Burial Depths',
    section: 'Wiring Methods',
    description: 'Minimum cover requirements for direct-buried cables and underground raceways. Depends on voltage and location.',
    keywords: ['burial', 'depth', 'underground', 'cover', 'direct', 'buried', 'trench'],
  },

  // ── Section 14: Overcurrent Protection ──
  {
    rule: '14-100',
    title: 'Overcurrent Protection — General',
    section: 'Overcurrent Protection',
    description: 'Every ungrounded conductor must be protected by an overcurrent device at the point where it receives its supply.',
    keywords: ['overcurrent', 'protection', 'breaker', 'fuse', 'general'],
  },
  {
    rule: '14-104',
    title: 'Standard Overcurrent Device Ratings',
    section: 'Overcurrent Protection',
    description: 'Standard ampere ratings for overcurrent devices: 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100 A, etc.',
    keywords: ['standard', 'breaker', 'size', 'rating', 'ampere', 'overcurrent', 'device'],
    tips: ['Standard sizes: 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200A...'],
  },

  // ── Section 26: Installation of Electrical Equipment ──
  {
    rule: '26-244',
    title: 'Transformer Overcurrent Protection',
    section: 'Transformers',
    description: 'Primary overcurrent protection for transformers. Generally limited to 125% of primary FLA; may use next standard size up.',
    keywords: ['transformer', 'overcurrent', 'protection', 'primary', 'secondary', 'fuse', 'breaker'],
    tips: ['Primary OCP ≤ 125% of primary FLA, next standard size up allowed if 125% is not standard'],
    relatedRules: ['26-252', '26-256'],
  },
  {
    rule: '26-252',
    title: 'Transformer Protection — Primary Only',
    section: 'Transformers',
    description: 'When secondary protection is not provided, primary overcurrent protection limits apply. Based on transformer impedance and configuration.',
    keywords: ['transformer', 'protection', 'primary', 'impedance'],
    relatedRules: ['26-244'],
  },
  {
    rule: '26-256',
    title: 'Transformer Protection — Secondary',
    section: 'Transformers',
    description: 'Secondary overcurrent protection requirements. Secondary OCP set at no more than 125% of secondary FLA.',
    keywords: ['transformer', 'secondary', 'protection', 'overcurrent'],
    relatedRules: ['26-244'],
  },
  {
    rule: '26-700',
    title: 'Motors — General Requirements',
    section: 'Motors',
    description: 'General requirements for motor circuit conductors, disconnecting means, controllers, and protection.',
    keywords: ['motor', 'general', 'circuit', 'disconnect', 'controller'],
  },
  {
    rule: '26-744',
    title: 'Motor Disconnect Requirements',
    section: 'Motors',
    description: 'Every motor must have a disconnecting means within sight of the motor and its driven machinery. Must be lockable.',
    keywords: ['motor', 'disconnect', 'switch', 'lockable', 'sight', 'lockout'],
    tips: ['Disconnect must be within sight AND lockable for LOTO'],
    relatedRules: ['26-700'],
  },

  // ── Section 28: Motor Circuits ──
  {
    rule: '28-106',
    title: 'Motor Branch Conductor Sizing',
    section: 'Motors',
    description: 'Motor branch circuit conductors must be rated at least 125% of the motor full-load current (FLC) from CEC tables.',
    keywords: ['motor', 'branch', 'conductor', 'wire', 'sizing', '125%', 'flc', 'full load current'],
    tips: ['Use CEC table FLC, NOT nameplate — always 125% of table value'],
    relatedRules: ['28-200', '28-400'],
  },
  {
    rule: '28-200',
    title: 'Motor Branch Circuit OCP',
    section: 'Motors',
    description: 'Branch circuit overcurrent protection for motors. Maximum OCP depends on motor type and starting characteristics.',
    keywords: ['motor', 'branch', 'overcurrent', 'protection', 'breaker', 'fuse', 'ocp'],
    tips: ['Breaker: up to 250% of FLC (standard motor), Fuse: up to 300% of FLC'],
    relatedRules: ['28-106', '28-400'],
  },
  {
    rule: '28-306',
    title: 'Motor Overload Protection',
    section: 'Motors',
    description: 'Running overload protection for motors. Typically set at 115–125% of motor nameplate FLA depending on service factor.',
    keywords: ['motor', 'overload', 'protection', 'running', 'heater', 'thermal', 'relay'],
    tips: ['SF ≥ 1.15: set overloads at 125% of nameplate FLA', 'SF < 1.15: set at 115% of nameplate FLA'],
    relatedRules: ['28-200'],
  },
  {
    rule: '28-400',
    title: 'Motor Overload — General',
    section: 'Motors',
    description: 'Every motor must have overload protection to protect from sustained overcurrent. Can be separate or integral.',
    keywords: ['motor', 'overload', 'protection', 'general', 'sustained', 'overcurrent'],
    relatedRules: ['28-306'],
  },

  // ── Section 30: GFCI / AFCI ──
  {
    rule: '30-004',
    title: 'GFCI Protection Requirements',
    section: 'GFCI & AFCI',
    description: 'Locations and circuits requiring ground fault circuit interrupter protection. Includes bathrooms, kitchens, outdoors, garages, etc.',
    keywords: ['gfci', 'ground fault', 'circuit', 'interrupter', 'bathroom', 'kitchen', 'outdoor', 'garage', 'protection'],
    tips: ['Required: bathrooms, kitchens (within 1.5m of sink), outdoors, garages, unfinished basements'],
    relatedRules: ['26-710'],
  },
  {
    rule: '26-710',
    title: 'AFCI Protection Requirements',
    section: 'GFCI & AFCI',
    description: 'Arc fault circuit interrupter requirements for dwelling unit circuits. Bedrooms and other living areas.',
    keywords: ['afci', 'arc fault', 'bedroom', 'dwelling', 'protection', 'circuit'],
    relatedRules: ['30-004'],
  },

  // ── Section 32: Fire Alarm ──
  {
    rule: '32-100',
    title: 'Fire Alarm — General',
    section: 'Fire Alarm',
    description: 'General requirements for fire alarm system installations. Wiring methods, circuit integrity, and supervision.',
    keywords: ['fire', 'alarm', 'system', 'wiring', 'general', 'smoke', 'detector'],
    relatedRules: ['32-110'],
  },
  {
    rule: '32-110',
    title: 'Fire Alarm Wiring Methods',
    section: 'Fire Alarm',
    description: 'Approved wiring methods for fire alarm circuits. Power-limited and non-power-limited circuit requirements.',
    keywords: ['fire', 'alarm', 'wiring', 'method', 'circuit', 'power limited'],
  },

  // ── Section 36: High Voltage ──
  {
    rule: '36-100',
    title: 'High Voltage Installations',
    section: 'High Voltage',
    description: 'Requirements for installations operating at voltages exceeding 750V. Additional safety, clearance, and marking requirements.',
    keywords: ['high voltage', 'hv', '750v', 'medium voltage', 'mv', '4160', '13800', 'clearance'],
  },

  // ── Section 46: Emergency Power ──
  {
    rule: '46-100',
    title: 'Emergency Power — General',
    section: 'Emergency Power',
    description: 'Requirements for emergency power systems including standby generators, transfer switches, and emergency lighting.',
    keywords: ['emergency', 'power', 'standby', 'generator', 'transfer', 'switch', 'ats', 'lighting'],
  },

  // ── Section 62: Fixed Heating ──
  {
    rule: '62-100',
    title: 'Fixed Electric Heating',
    section: 'Heating',
    description: 'Requirements for fixed electric space heating, including floor heating, baseboard, and unit heaters.',
    keywords: ['heating', 'baseboard', 'heater', 'floor', 'electric', 'heat', 'fixed'],
  },

  // ── Section 64: Renewable Energy ──
  {
    rule: '64-060',
    title: 'Solar PV Systems',
    section: 'Renewable Energy',
    description: 'Installation requirements for photovoltaic systems including inverters, disconnect means, and conductor sizing.',
    keywords: ['solar', 'pv', 'photovoltaic', 'inverter', 'panel', 'renewable', 'energy'],
  },

  // ── Section 68: Pools / Tubs ──
  {
    rule: '68-058',
    title: 'Pool & Hot Tub Wiring',
    section: 'Pools & Spas',
    description: 'Wiring requirements for swimming pools, hot tubs, and spas. Bonding, GFCI, clearance distances.',
    keywords: ['pool', 'spa', 'hot tub', 'swimming', 'bonding', 'gfci', 'clearance'],
  },

  // ── Section 70: Electrical Maintenance ──
  {
    rule: '70-100',
    title: 'Electrical Maintenance',
    section: 'Maintenance',
    description: 'Requirements for maintenance of electrical equipment. Periodic testing, inspection, and record keeping.',
    keywords: ['maintenance', 'inspection', 'testing', 'periodic', 'record'],
  },

  // ── Section 76: Temporary Installations ──
  {
    rule: '76-010',
    title: 'Temporary Wiring',
    section: 'Temporary',
    description: 'Requirements for temporary electrical installations on construction sites. GFCI protection, cord usage, support.',
    keywords: ['temporary', 'construction', 'site', 'temp', 'power', 'wiring', 'cord'],
    tips: ['All 15A and 20A receptacles on construction sites require GFCI protection'],
  },

  // ── Section 18: Hazardous Locations ──
  {
    rule: '18-000',
    title: 'Hazardous Locations — General',
    section: 'Hazardous Locations',
    description: 'Classification of hazardous locations into Classes (I, II, III), Divisions (1, 2), or Zones (0, 1, 2). Determines wiring methods and equipment.',
    keywords: ['hazardous', 'location', 'class', 'division', 'zone', 'explosive', 'flammable', 'dust', 'gas'],
  },
  {
    rule: '18-100',
    title: 'Class I Hazardous Locations',
    section: 'Hazardous Locations',
    description: 'Locations where flammable gases or vapours may be present. Division 1 = normal conditions, Division 2 = abnormal conditions.',
    keywords: ['class i', 'class 1', 'gas', 'vapor', 'flammable', 'hazardous', 'division'],
    relatedRules: ['18-000'],
  },
  {
    rule: '18-200',
    title: 'Class II Hazardous Locations',
    section: 'Hazardous Locations',
    description: 'Locations where combustible dust may be present. Includes grain elevators, coal handling, metalworking.',
    keywords: ['class ii', 'class 2', 'dust', 'combustible', 'grain', 'coal', 'hazardous'],
    relatedRules: ['18-000'],
  },

  // ── Mining-Specific (Ontario Reg. 854) ──
  {
    rule: 'Reg 854 s.153',
    title: 'Mine Ground Fault Protection',
    section: 'Mining',
    description: 'All portable electrical equipment in mines must have ground fault protection. Maximum trip time and current requirements.',
    keywords: ['mining', 'mine', 'ground fault', 'portable', 'equipment', 'protection', 'gfp'],
  },
  {
    rule: 'Reg 854 s.160',
    title: 'Mine Electrical Safety — Lockout',
    section: 'Mining',
    description: 'Lockout procedures for electrical equipment in mining operations. Every person working on equipment must apply their own lock.',
    keywords: ['mining', 'mine', 'lockout', 'loto', 'lock', 'safety', 'personal'],
    tips: ['Each worker must apply their OWN personal lock — no group locks'],
  },
  {
    rule: 'Reg 854 s.164',
    title: 'Mine Cable & Conductor Protection',
    section: 'Mining',
    description: 'Protection requirements for cables in mining environments. Mechanical protection, identification, and routing requirements.',
    keywords: ['mining', 'mine', 'cable', 'conductor', 'protection', 'mechanical', 'teck'],
  },
  {
    rule: 'Reg 854 s.195',
    title: 'Mine Grounding Systems',
    section: 'Mining',
    description: 'Grounding requirements specific to open-pit and underground mines. Grounding conductor continuity and testing.',
    keywords: ['mining', 'mine', 'grounding', 'ground', 'continuity', 'testing', 'open pit'],
  },
]

/* ── Decision Tree Structures ── */

export interface TreeNode {
  id: string
  question: string
  options: TreeOption[]
}

export interface TreeOption {
  label: string
  /** Next node ID, or null if this is a result */
  next: string | null
  /** Result to show if next is null */
  result?: TreeResult
}

export interface TreeResult {
  rules: string[]
  summary: string
  tips?: string[]
}

export interface DecisionTree {
  id: string
  title: string
  icon: string
  description: string
  rootNodeId: string
  nodes: Record<string, TreeNode>
}

export const decisionTrees: DecisionTree[] = [
  // ── Motor Protection Decision Tree ──
  {
    id: 'motor-protection',
    title: 'Motor Protection',
    icon: '⚙',
    description: 'Find the right motor circuit protection rules',
    rootNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        question: 'What type of motor?',
        options: [
          { label: 'Single phase', next: 'single-phase' },
          { label: 'Three phase', next: 'three-phase' },
        ],
      },
      'single-phase': {
        id: 'single-phase',
        question: 'Motor horsepower?',
        options: [
          { label: '½ HP or less', next: 'small-single' },
          { label: '¾ HP – 3 HP', next: 'medium-single' },
          { label: '5 HP+', next: 'large-single' },
        ],
      },
      'three-phase': {
        id: 'three-phase',
        question: 'Motor voltage?',
        options: [
          { label: '208V / 240V', next: 'lv-3ph' },
          { label: '480V / 600V', next: 'hv-3ph' },
          { label: '4160V+ (MV)', next: 'mv-motor' },
        ],
      },
      'small-single': {
        id: 'small-single',
        question: 'Protection needed?',
        options: [
          {
            label: 'Branch circuit OCP',
            next: null,
            result: {
              rules: ['28-200', '28-106'],
              summary: 'For small single-phase motors (≤½ HP), branch circuit breaker can serve as both OCP and disconnect if within sight.',
              tips: ['Breaker: max 250% of FLC', 'Conductor: 125% of FLC from CEC tables'],
            },
          },
          {
            label: 'Overload protection',
            next: null,
            result: {
              rules: ['28-306', '28-400'],
              summary: 'Running overload protection based on motor service factor. Integral thermal protector may satisfy this requirement.',
              tips: ['SF ≥ 1.15: set at 125% of nameplate', 'SF < 1.15: set at 115% of nameplate'],
            },
          },
        ],
      },
      'medium-single': {
        id: 'medium-single',
        question: 'Protection needed?',
        options: [
          {
            label: 'Full branch circuit design',
            next: null,
            result: {
              rules: ['28-106', '28-200', '28-306', '26-744'],
              summary: 'Size conductor at 125% FLC, OCP per Table 29 (breaker max 250%, fuse max 300%), overload at 115–125% nameplate, and provide a lockable disconnect within sight.',
              tips: ['Always use CEC table FLC, not nameplate'],
            },
          },
          {
            label: 'Disconnect requirements',
            next: null,
            result: {
              rules: ['26-744', '26-700'],
              summary: 'Disconnect must be within sight of the motor, rated for voltage and HP, and be lockable in the open position.',
              tips: ['Within sight = visible and ≤ 9m (30 ft)'],
            },
          },
        ],
      },
      'large-single': {
        id: 'large-single',
        question: 'Protection needed?',
        options: [
          {
            label: 'Full branch circuit design',
            next: null,
            result: {
              rules: ['28-106', '28-200', '28-306', '26-744'],
              summary: 'Large single-phase motors: size conductor at 125% FLC, OCP per Table 29, overloads per service factor, lockable disconnect within sight.',
              tips: ['Check if VFD or soft starter changes OCP requirements'],
            },
          },
        ],
      },
      'lv-3ph': {
        id: 'lv-3ph',
        question: 'What do you need to determine?',
        options: [
          {
            label: 'Wire sizing',
            next: null,
            result: {
              rules: ['28-106', '4-006'],
              summary: 'Motor branch circuit conductors must be rated at 125% of CEC table FLC. Use Table 2 (75°C) for conductor ampacity.',
              tips: ['FLC from CEC Table D16 (3-phase)', 'Apply derating factors if needed (Table 5C for bundling, 5A for temperature)'],
            },
          },
          {
            label: 'Breaker/fuse sizing',
            next: null,
            result: {
              rules: ['28-200'],
              summary: 'Branch circuit OCP per CEC Table 29: inverse-time breaker max 250% of FLC, dual-element fuse max 175% of FLC, non-time-delay fuse max 300%.',
              tips: ['If motor won\'t start at these values, Table 29 allows higher in some cases'],
            },
          },
          {
            label: 'Overload protection',
            next: null,
            result: {
              rules: ['28-306', '28-400'],
              summary: 'Running overload protection: SF ≥ 1.15 → 125% of nameplate FLA; SF < 1.15 → 115% of nameplate FLA.',
              tips: ['Use NAMEPLATE current for overloads (not CEC table FLC)'],
            },
          },
          {
            label: 'Complete motor circuit',
            next: null,
            result: {
              rules: ['28-106', '28-200', '28-306', '26-744', '26-700'],
              summary: 'Complete 3-phase LV motor circuit: conductor at 125% FLC, OCP per Table 29, overload per service factor, HP-rated lockable disconnect within sight.',
            },
          },
        ],
      },
      'hv-3ph': {
        id: 'hv-3ph',
        question: 'What do you need to determine?',
        options: [
          {
            label: 'Full circuit design',
            next: null,
            result: {
              rules: ['28-106', '28-200', '28-306', '26-744'],
              summary: 'Same rules apply for 480/600V motors. Conductor at 125% FLC, OCP per Table 29, overloads per nameplate.',
              tips: ['600V motors common in Canadian industrial/mining — use CEC Table D16 for 550V FLC values'],
            },
          },
        ],
      },
      'mv-motor': {
        id: 'mv-motor',
        question: 'What do you need to determine?',
        options: [
          {
            label: 'MV motor protection',
            next: null,
            result: {
              rules: ['36-100', '28-200', '28-306'],
              summary: 'Medium voltage motors (4160V+) require Section 36 high voltage requirements in addition to standard motor protection rules. Typically protected by MV breakers or fuses with protective relays.',
              tips: ['Relay types: 50 (instantaneous OC), 51 (time OC), 49 (thermal), 46 (negative sequence)'],
            },
          },
        ],
      },
    },
  },

  // ── Wire Sizing Decision Tree ──
  {
    id: 'wire-sizing',
    title: 'Wire Sizing',
    icon: '⌸',
    description: 'Determine conductor sizing requirements',
    rootNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        question: 'What type of circuit?',
        options: [
          { label: 'General branch circuit', next: 'branch' },
          { label: 'Motor circuit', next: 'motor-wire' },
          { label: 'Feeder / service', next: 'feeder' },
          { label: 'Transformer secondary', next: 'xfmr' },
        ],
      },
      branch: {
        id: 'branch',
        question: 'Is the load continuous (3+ hours)?',
        options: [
          {
            label: 'Yes — continuous',
            next: null,
            result: {
              rules: ['8-104', '4-006'],
              summary: 'Continuous load: conductor must be rated at 125% of continuous load current. Use Table 2 (75°C) or Table 3 (90°C) as appropriate for termination temperature.',
              tips: ['125% rule applies to both conductor AND overcurrent device', 'Check termination temperature rating — most are 75°C'],
            },
          },
          {
            label: 'No — non-continuous',
            next: null,
            result: {
              rules: ['4-006'],
              summary: 'Non-continuous load: conductor rated at 100% of load current. Select from ampacity tables based on insulation temperature rating.',
              tips: ['Table 1 = 60°C, Table 2 = 75°C, Table 3 = 90°C', 'Most terminations rated 75°C — use Table 2 in practice'],
            },
          },
        ],
      },
      'motor-wire': {
        id: 'motor-wire',
        question: 'Single motor or multiple motors?',
        options: [
          {
            label: 'Single motor',
            next: null,
            result: {
              rules: ['28-106', '4-006'],
              summary: 'Single motor branch circuit conductor: 125% of FLC from CEC motor tables (not nameplate).',
              tips: ['Use CEC Table D16 for 3-phase FLC values', 'Apply derating for ambient temp and bundling'],
            },
          },
          {
            label: 'Multiple motors on one feeder',
            next: null,
            result: {
              rules: ['28-106', '28-108'],
              summary: 'Multi-motor feeder: 125% of largest motor FLC + 100% of all other motor FLCs + any non-motor continuous loads at 125%.',
              tips: ['Feeder OCP: largest motor OCP + sum of all other motor FLCs'],
            },
          },
        ],
      },
      feeder: {
        id: 'feeder',
        question: 'Residential or commercial/industrial?',
        options: [
          {
            label: 'Residential',
            next: null,
            result: {
              rules: ['8-200', '6-102', '4-006'],
              summary: 'Calculate demand load per Rule 8-200, then size conductors from ampacity tables. Service entrance must handle full calculated demand.',
              tips: ['First 5000W at 100%, next 15000W at 40%, remainder at 25% (basic dwelling demand)'],
            },
          },
          {
            label: 'Commercial / Industrial',
            next: null,
            result: {
              rules: ['8-210', '6-102', '4-006'],
              summary: 'Calculate demand load per Rule 8-210 using applicable demand factors for the occupancy type. Size conductors from ampacity tables.',
            },
          },
        ],
      },
      xfmr: {
        id: 'xfmr',
        question: 'Transformer configuration?',
        options: [
          {
            label: 'Single phase',
            next: null,
            result: {
              rules: ['26-244', '26-256', '4-006'],
              summary: 'Secondary conductor sized for secondary FLA. Secondary OCP at no more than 125% of secondary FLA.',
              tips: ['FLA = kVA × 1000 / Vsecondary'],
            },
          },
          {
            label: 'Three phase',
            next: null,
            result: {
              rules: ['26-244', '26-256', '4-006'],
              summary: 'Secondary conductor sized for secondary FLA. Secondary OCP at no more than 125% of secondary FLA.',
              tips: ['FLA = kVA × 1000 / (Vsecondary × √3)'],
            },
          },
        ],
      },
    },
  },

  // ── Grounding Decision Tree ──
  {
    id: 'grounding',
    title: 'Grounding & Bonding',
    icon: '⏚',
    description: 'Grounding conductor sizing and requirements',
    rootNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        question: 'What do you need?',
        options: [
          { label: 'System grounding conductor size', next: 'system' },
          { label: 'Equipment bonding conductor size', next: 'equipment' },
          { label: 'Ground fault protection', next: 'gfp' },
        ],
      },
      system: {
        id: 'system',
        question: 'Service / feeder ampere rating?',
        options: [
          {
            label: '100A or less',
            next: null,
            result: {
              rules: ['10-114'],
              summary: 'System grounding conductor: #8 AWG copper minimum for ≤100A service (Table 17).',
            },
          },
          {
            label: '101–200A',
            next: null,
            result: {
              rules: ['10-114'],
              summary: 'System grounding conductor: #6 AWG copper for 101–200A service (Table 17).',
            },
          },
          {
            label: '201–400A',
            next: null,
            result: {
              rules: ['10-114'],
              summary: 'System grounding conductor: #3 AWG copper for 201–400A service (Table 17).',
            },
          },
          {
            label: '401A+',
            next: null,
            result: {
              rules: ['10-114'],
              summary: 'System grounding conductor for 401A+: consult Table 17 directly. Sizes increase with ampere rating.',
            },
          },
        ],
      },
      equipment: {
        id: 'equipment',
        question: 'Overcurrent device rating protecting the circuit?',
        options: [
          {
            label: '15–60A',
            next: null,
            result: {
              rules: ['10-814'],
              summary: 'Equipment bonding conductor: #10 AWG copper minimum for 15–60A OCP (Table 16).',
            },
          },
          {
            label: '100A',
            next: null,
            result: {
              rules: ['10-814'],
              summary: 'Equipment bonding conductor: #8 AWG copper for 100A OCP (Table 16).',
            },
          },
          {
            label: '200A',
            next: null,
            result: {
              rules: ['10-814'],
              summary: 'Equipment bonding conductor: #6 AWG copper for 200A OCP (Table 16).',
            },
          },
          {
            label: '400A+',
            next: null,
            result: {
              rules: ['10-814'],
              summary: 'Equipment bonding conductor for 400A+: consult Table 16 directly. Typically #3 AWG Cu or larger.',
            },
          },
        ],
      },
      gfp: {
        id: 'gfp',
        question: 'What type of ground fault protection?',
        options: [
          {
            label: 'GFCI (personnel protection)',
            next: null,
            result: {
              rules: ['30-004'],
              summary: 'GFCI protection (5mA trip) required for: bathrooms, kitchens (within 1.5m of sink), outdoors, garages, construction sites, pools/spas.',
              tips: ['GFCI trips at 5mA — protects people', 'Can be GFCI breaker or GFCI receptacle'],
            },
          },
          {
            label: 'GFP (equipment protection)',
            next: null,
            result: {
              rules: ['10-406'],
              summary: 'Ground fault protection of equipment: required on solidly-grounded services >150V to ground and >1000A. Prevents arcing ground faults from causing fires.',
              tips: ['GFP typically trips at 1200A with 1-second delay', 'Different from GFCI — protects equipment, not people'],
            },
          },
        ],
      },
    },
  },

  // ── GFCI / AFCI Decision Tree ──
  {
    id: 'gfci-afci',
    title: 'GFCI & AFCI',
    icon: '🛡',
    description: 'Where is GFCI or AFCI protection required?',
    rootNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        question: 'What type of protection?',
        options: [
          { label: 'GFCI (ground fault)', next: 'gfci' },
          { label: 'AFCI (arc fault)', next: 'afci' },
        ],
      },
      gfci: {
        id: 'gfci',
        question: 'What type of occupancy?',
        options: [
          {
            label: 'Residential dwelling',
            next: null,
            result: {
              rules: ['30-004'],
              summary: 'GFCI required in dwellings: bathrooms, kitchens (countertop receptacles within 1.5m of sink), garages, unfinished basements, outdoors, laundry areas, pool/spa equipment.',
            },
          },
          {
            label: 'Commercial / Industrial',
            next: null,
            result: {
              rules: ['30-004'],
              summary: 'GFCI required in commercial/industrial: bathrooms, rooftops, outdoors, kitchens, within 1.5m of sinks, vending machine outlets.',
              tips: ['Industrial exemptions may apply for specific process equipment'],
            },
          },
          {
            label: 'Construction site',
            next: null,
            result: {
              rules: ['76-010', '30-004'],
              summary: 'ALL 15A and 20A receptacles on construction sites must have GFCI protection. No exceptions.',
              tips: ['Use GFCI-protected temp panels or portable GFCIs'],
            },
          },
        ],
      },
      afci: {
        id: 'afci',
        question: 'Where in the dwelling?',
        options: [
          {
            label: 'Bedrooms',
            next: null,
            result: {
              rules: ['26-710'],
              summary: 'AFCI protection required for all 125V, 15A and 20A circuits supplying bedrooms in dwelling units.',
            },
          },
          {
            label: 'Other living areas',
            next: null,
            result: {
              rules: ['26-710'],
              summary: 'AFCI requirements have expanded — check your jurisdiction\'s adopted CEC edition. Recent editions require AFCI in living rooms, hallways, closets, and more.',
              tips: ['2024 CEC significantly expanded AFCI requirements'],
            },
          },
        ],
      },
    },
  },

  // ── Conduit Selection Decision Tree ──
  {
    id: 'conduit-selection',
    title: 'Conduit & Raceway',
    icon: '◎',
    description: 'Select the right conduit type and size',
    rootNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        question: 'Installation environment?',
        options: [
          { label: 'Indoor — dry', next: 'indoor-dry' },
          { label: 'Indoor — wet/damp', next: 'indoor-wet' },
          { label: 'Outdoor / exposed', next: 'outdoor' },
          { label: 'Underground', next: 'underground' },
        ],
      },
      'indoor-dry': {
        id: 'indoor-dry',
        question: 'Mechanical protection needed?',
        options: [
          {
            label: 'Minimal — concealed in walls',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'For concealed dry locations: NMD90 (residential), AC90, or EMT are common choices.',
              tips: ['NMD90: residential only, not for commercial', 'AC90: versatile, good mechanical protection', 'EMT: most common commercial method'],
            },
          },
          {
            label: 'Moderate — exposed in commercial',
            next: null,
            result: {
              rules: ['12-100', '12-618'],
              summary: 'Exposed commercial: EMT is standard. Support per Table 21 — typically every 1.5m (5ft) and within 0.9m (3ft) of boxes.',
              tips: ['EMT straps: every 1.5m + within 0.9m of each fitting'],
            },
          },
          {
            label: 'High — industrial / mining',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'Industrial/mining: TECK90 cable or rigid conduit recommended. TECK90 is popular in Canadian mining — armoured, UV-resistant.',
              tips: ['TECK90: no separate raceway needed', 'Rigid steel: highest mechanical protection'],
            },
          },
        ],
      },
      'indoor-wet': {
        id: 'indoor-wet',
        question: 'Wet or damp?',
        options: [
          {
            label: 'Damp location',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'Damp locations: EMT with raintight fittings, rigid conduit, or TECK90 cable. NMD90 NOT permitted in damp locations.',
              tips: ['Use weatherproof boxes and covers', 'NMD90 is strictly for dry locations only'],
            },
          },
          {
            label: 'Wet location',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'Wet locations: rigid PVC, rigid metal with suitable fittings, or TECK90. Conductors must be rated for wet locations (e.g., RW90, T90 Nylon).',
              tips: ['Conductor insulation must be wet-rated', 'PVC: corrosion-resistant, good for wet areas'],
            },
          },
        ],
      },
      outdoor: {
        id: 'outdoor',
        question: 'Exposed to sunlight?',
        options: [
          {
            label: 'Yes — direct sunlight',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'Outdoor sun-exposed: rigid PVC (UV-rated), rigid metal conduit, or TECK90 (UV-resistant jacket). EMT acceptable with proper fittings.',
              tips: ['TECK90 outer jacket is UV-resistant', 'Apply ambient temperature derating for sun exposure'],
            },
          },
          {
            label: 'No — shaded/covered',
            next: null,
            result: {
              rules: ['12-100'],
              summary: 'Outdoor shaded: EMT with raintight fittings, rigid conduit, PVC, or TECK90. Use wet-rated conductors.',
            },
          },
        ],
      },
      underground: {
        id: 'underground',
        question: 'Direct burial or in conduit?',
        options: [
          {
            label: 'Direct burial cable',
            next: null,
            result: {
              rules: ['12-1014', '12-100'],
              summary: 'Direct burial: use NMWU or TECK90. Minimum burial depth depends on voltage and location (typically 600mm residential, 750mm commercial/roadway).',
              tips: ['Mark cable route with warning tape above', 'Use sand bedding under and above cable'],
            },
          },
          {
            label: 'In underground conduit',
            next: null,
            result: {
              rules: ['12-1014', '12-100'],
              summary: 'Underground in conduit: PVC DB conduit is standard. Burial depth can be reduced vs. direct burial. Use wet-rated conductors.',
              tips: ['PVC DB (direct burial) has thicker walls than standard PVC', 'Pull rope and spare conduit for future expansion'],
            },
          },
        ],
      },
    },
  },
]
