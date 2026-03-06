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
  // ══════════════════════════════
  // Section 2: General Rules
  // ══════════════════════════════
  { rule: '2-004', title: 'Permit', section: 'General', description: 'A permit must be obtained from the inspection department before commencing any electrical work.', keywords: ['permit', 'inspection', 'work', 'start'] },
  { rule: '2-024', title: 'Approved Equipment', section: 'General', description: 'All electrical equipment must be approved and bear a certification mark from an accredited testing organization.', keywords: ['approval', 'certification', 'csa', 'ul', 'listed', 'approved', 'equipment'], tips: ['Look for CSA, cUL, or cETL marks on equipment'] },
  { rule: '2-030', title: 'Deviation or Postponement', section: 'General', description: 'The inspection department may grant a deviation from code requirements or postpone compliance when equivalent safety is achieved.', keywords: ['deviation', 'exemption', 'exception', 'postponement'] },
  { rule: '2-100', title: 'Marking of Equipment', section: 'General', description: 'Electrical equipment must be marked with ratings, manufacturer info, and certifications. Markings must remain visible after installation.', keywords: ['marking', 'nameplate', 'label', 'rating', 'manufacturer'] },
  { rule: '2-104', title: 'Equipment Ratings', section: 'General', description: 'Electrical equipment must be installed and used within its rated capacity for voltage, current, and power.', keywords: ['rating', 'capacity', 'voltage', 'current', 'power', 'equipment'] },
  { rule: '2-110', title: 'Voltage-to-Ground — Dwellings', section: 'General', description: 'Circuit voltage-to-ground in dwelling units must not exceed 150V for lighting and receptacle circuits.', keywords: ['voltage', 'ground', 'dwelling', '150v', 'lighting', 'receptacle'] },
  { rule: '2-112', title: 'Quality of Work', section: 'General', description: 'Electrical work must be done in a neat and workmanlike manner. Conductors must be properly routed and supported.', keywords: ['quality', 'workmanlike', 'neat', 'professional', 'installation'] },
  { rule: '2-126', title: 'Thermal Insulation', section: 'General', description: 'Where conductors or equipment are covered or surrounded by thermal insulation, ampacity must be derated to prevent overheating.', keywords: ['thermal', 'insulation', 'derating', 'heat', 'covered', 'attic'] },
  { rule: '2-128', title: 'Fire Spread', section: 'General', description: 'Electrical installations must not contribute to the spread of fire. Penetrations through fire-rated assemblies must be properly sealed.', keywords: ['fire', 'spread', 'firestop', 'seal', 'penetration', 'fire rated'] },
  { rule: '2-130', title: 'Flame Spread — Wiring & Cables', section: 'General', description: 'Cables and wiring installed in plenums, risers, and other designated areas must meet flame spread requirements.', keywords: ['flame', 'spread', 'cable', 'plenum', 'riser', 'fire', 'rating'] },
  { rule: '2-136', title: 'Sunlight Resistance', section: 'General', description: 'Equipment and cables exposed to direct sunlight must be sunlight-resistant or protected from UV degradation.', keywords: ['sunlight', 'uv', 'outdoor', 'sun', 'resistant', 'ultraviolet'] },
  { rule: '2-138', title: 'Insulation Integrity', section: 'General', description: 'Insulation on conductors must be maintained throughout the installation. Damage to insulation must be repaired or the conductor replaced.', keywords: ['insulation', 'integrity', 'damage', 'repair', 'conductor'] },
  { rule: '2-140', title: 'Class A GFCI', section: 'General', description: 'Where GFCI protection is required, it must be Class A type (trips at 5mA ground fault current for personnel protection).', keywords: ['gfci', 'class a', '5ma', 'ground fault', 'protection', 'personnel'] },
  { rule: '2-200', title: 'Guarding of Bare Live Parts', section: 'General', description: 'Bare live parts operating at 50V or more must be guarded against accidental contact by enclosures or elevation.', keywords: ['guarding', 'bare', 'live', 'parts', 'enclosure', 'elevation', '50v'] },
  { rule: '2-306', title: 'Shock and Arc Flash Protection', section: 'General', description: 'Appropriate safety procedures and PPE must be used when working on or near energized equipment. Arc flash hazard assessment required.', keywords: ['shock', 'arc flash', 'ppe', 'safety', 'energized', 'hazard', 'assessment'] },
  { rule: '2-308', title: 'Working Space', section: 'General', description: 'Adequate working space must be provided around electrical equipment for safe operation and maintenance. Minimum clearances specified.', keywords: ['working', 'space', 'clearance', 'access', 'maintenance', 'panel', 'equipment'], tips: ['Min 1m (3.3ft) depth in front of panels', 'Min 750mm (30in) width', 'Working space height min 2m (6.5ft)'] },
  { rule: '2-310', title: 'Entrance to Working Space', section: 'General', description: 'At least one entrance of sufficient width must be provided to give access to the working space around equipment.', keywords: ['entrance', 'exit', 'access', 'working space', 'door', 'egress'] },
  { rule: '2-312', title: 'Transformer Working Space', section: 'General', description: 'Additional working space requirements for transformer installations, including ventilation and access for maintenance.', keywords: ['transformer', 'working space', 'ventilation', 'access', 'maintenance'] },
  { rule: '2-316', title: 'Receptacles for Maintenance', section: 'General', description: 'A 15A or 20A receptacle must be installed within 7.5m of electrical equipment requiring maintenance.', keywords: ['receptacle', 'maintenance', 'outlet', 'equipment', '7.5m'] },
  { rule: '2-320', title: 'Illumination of Equipment', section: 'General', description: 'Adequate illumination must be provided around electrical equipment for safe maintenance and operation.', keywords: ['illumination', 'lighting', 'equipment', 'maintenance', 'light'] },
  { rule: '2-322', title: 'Flammable Material Near Equipment', section: 'General', description: 'Readily combustible material must not be stored near electrical equipment. Minimum clearances required.', keywords: ['flammable', 'combustible', 'storage', 'clearance', 'fire', 'material'] },
  { rule: '2-400', title: 'Enclosures & Type Designations', section: 'General', description: 'Enclosures must be suitable for the environment. Type designations (Type 1, 3R, 4, 4X, 12, etc.) indicate protection levels.', keywords: ['enclosure', 'type', 'nema', 'ip', 'rating', 'indoor', 'outdoor', 'weather', '3r', '4x'] },

  // ══════════════════════════════
  // Section 4: Conductors
  // ══════════════════════════════
  { rule: '4-002', title: 'Size of Conductors', section: 'Conductors', description: 'Minimum conductor size for building wiring is #14 AWG copper. Some circuits require larger minimums.', keywords: ['conductor', 'size', 'minimum', 'awg', '#14', 'wire'] },
  { rule: '4-004', title: 'Ampacity of Wires & Cables', section: 'Conductors', description: 'Conductors must have insulation suitable for the voltage, temperature, and environmental conditions. Ampacity determined by Tables 1–4.', keywords: ['ampacity', 'wire', 'cable', 'insulation', 'table 1', 'table 2', 'table 3', 'table 4'], relatedRules: ['4-006'] },
  { rule: '4-006', title: 'Temperature Limitations', section: 'Conductors', description: 'Conductor ampacity must be based on the lowest temperature rating in the circuit (conductor, termination, or device).', keywords: ['temperature', 'limitation', 'termination', 'rating', '60c', '75c', '90c', 'ampacity'], tips: ['Most terminations are rated 75°C — use Table 2 even for 90°C wire', 'Exception: 100A+ circuits may use 75°C column for sizing'], relatedRules: ['4-004'] },
  { rule: '4-008', title: 'Induced Voltages in Cables', section: 'Conductors', description: 'Single-conductor cables with metal armour or sheaths must have all phase conductors in the same raceway or cable to prevent induced voltages.', keywords: ['induced', 'voltage', 'single conductor', 'armour', 'sheath', 'eddy current', 'heating'] },
  { rule: '4-010', title: 'Flexible Cord Sizes', section: 'Conductors', description: 'Minimum sizes for flexible cords based on application. Extension cords, appliance cords, and portable equipment cords.', keywords: ['flexible', 'cord', 'extension', 'portable', 'size', 'minimum'] },
  { rule: '4-012', title: 'Ampacity of Flexible Cords', section: 'Conductors', description: 'Ampacity ratings for flexible cords and cables. Different from fixed wiring ampacity tables.', keywords: ['flexible', 'cord', 'ampacity', 'portable', 'rating'] },
  { rule: '4-016', title: 'Insulation of Neutral Conductors', section: 'Conductors', description: 'Neutral conductors must be insulated except where permitted to be bare (e.g., service entrance).', keywords: ['neutral', 'insulation', 'bare', 'conductor', 'identified'] },
  { rule: '4-018', title: 'Neutral Conductor Size', section: 'Conductors', description: 'Neutral conductor must be sized to carry the maximum unbalanced load. May be reduced for certain 3-phase loads.', keywords: ['neutral', 'size', 'unbalanced', 'load', 'reduction', 'conductor'] },
  { rule: '4-020', title: 'Common Neutral Conductor', section: 'Conductors', description: 'A common neutral may be shared by multiple circuits under specific conditions. Multi-wire branch circuit requirements.', keywords: ['common', 'neutral', 'shared', 'multi-wire', 'branch', 'circuit'] },
  { rule: '4-022', title: 'Identified Conductor Installation', section: 'Conductors', description: 'The identified (neutral/grounded) conductor must be connected only to identified terminals. White or grey insulation required.', keywords: ['identified', 'neutral', 'white', 'grey', 'terminal', 'connection', 'color'] },
  { rule: '4-024', title: 'Neutral Identification — #14 to #2', section: 'Conductors', description: 'Neutral conductors #14 to #2 AWG must have continuous white or grey insulation for the entire length.', keywords: ['neutral', 'identification', 'white', 'grey', 'color', 'marking', '#14', '#2'] },
  { rule: '4-026', title: 'Neutral Identification — Larger than #2', section: 'Conductors', description: 'Neutral conductors larger than #2 AWG may be identified by white or grey markings at terminations.', keywords: ['neutral', 'identification', 'large', 'marking', 'tape', 'termination'] },
  { rule: '4-032', title: 'Identification of Insulated Conductors', section: 'Conductors', description: 'Phase conductors must be identified by colour coding. In Canada: Red=A, Black=B, Blue=C for 3-phase systems.', keywords: ['identification', 'color', 'colour', 'phase', 'red', 'black', 'blue', 'conductor', 'marking'], tips: ['3-phase: Red=A, Black=B, Blue=C', 'Single-phase: Black=Hot, Red=Hot(L2)', 'Neutral always White or Grey', 'Ground always Green or bare'] },
  { rule: '4-034', title: 'Portable Power Cable Ampacity', section: 'Conductors', description: 'Ampacity ratings for portable power cables used in industrial and mining applications (e.g., SHD-GC, type W).', keywords: ['portable', 'power', 'cable', 'ampacity', 'shd', 'mining', 'industrial', 'type w'] },
  { rule: '4-036', title: 'Busbar', section: 'Conductors', description: 'Requirements for busbar installations including material, support, spacing, and current ratings.', keywords: ['busbar', 'bus', 'bar', 'copper', 'aluminum', 'support'] },

  // ══════════════════════════════
  // Section 6: Services
  // ══════════════════════════════
  { rule: '6-102', title: 'Number of Supply Services', section: 'Services', description: 'Only one supply service is permitted per building, with specific exceptions for large buildings or separate occupancies.', keywords: ['service', 'supply', 'number', 'building', 'entrance'], relatedRules: ['6-104'] },
  { rule: '6-104', title: 'Consumer Services per Building', section: 'Services', description: 'Number of consumer services permitted in or on a building. Multiple services may require approval from inspection authority.', keywords: ['consumer', 'service', 'building', 'multiple', 'meter'] },
  { rule: '6-112', title: 'Service Conductor Support', section: 'Services', description: 'Requirements for supporting overhead service conductors at the point of attachment to the building.', keywords: ['service', 'overhead', 'support', 'attachment', 'mast', 'conductor'] },
  { rule: '6-200', title: 'Service Equipment', section: 'Services', description: 'Service equipment requirements including main disconnect, metering, and overcurrent protection at point of entry.', keywords: ['service', 'equipment', 'main', 'disconnect', 'panel', 'entry'] },
  { rule: '6-206', title: 'Service Equipment Location', section: 'Services', description: 'Service equipment must be located at the point of entry of supply conductors and be readily accessible.', keywords: ['service', 'equipment', 'location', 'accessible', 'entry', 'point'] },
  { rule: '6-208', title: 'Service Conductor Location', section: 'Services', description: 'Consumer service conductors must be kept as short as practicable inside the building before reaching the service equipment.', keywords: ['service', 'conductor', 'location', 'inside', 'building', 'length'] },
  { rule: '6-302', title: 'Overhead Service Installation', section: 'Services', description: 'Installation requirements for overhead service conductors including clearances, support, and weatherheads.', keywords: ['overhead', 'service', 'clearance', 'weatherhead', 'mast', 'height'] },
  { rule: '6-306', title: 'Service Raceways', section: 'Services', description: 'Requirements for raceways used for consumer service conductors. Must be rainproof and properly sealed.', keywords: ['service', 'raceway', 'conduit', 'rainproof', 'seal'] },
  { rule: '6-400', title: 'Metering Equipment', section: 'Services', description: 'Requirements for meter base installation, location, and accessibility for utility personnel.', keywords: ['meter', 'metering', 'base', 'utility', 'location', 'installation'] },

  // ══════════════════════════════
  // Section 8: Circuit Loading
  // ══════════════════════════════
  { rule: '8-100', title: 'Current Calculations', section: 'Circuit Loading', description: 'Branch circuit and feeder loads must be calculated based on connected load and applicable demand factors.', keywords: ['current', 'calculation', 'load', 'branch', 'feeder', 'demand'] },
  { rule: '8-102', title: 'Voltage Drop', section: 'Circuit Loading', description: 'Voltage drop should not exceed 3% for branch circuits or 5% total from service to furthest outlet. Not mandatory but recommended.', keywords: ['voltage', 'drop', '3%', '5%', 'branch', 'feeder', 'total', 'loss'], tips: ['3% max for branch circuit', '5% max total (feeder + branch)', 'This is a recommendation, not a hard limit'] },
  { rule: '8-104', title: 'Maximum Circuit Loading', section: 'Circuit Loading', description: 'Conductors and overcurrent devices for continuous loads must be rated at 125% of the continuous load (or load limited to 80% of device rating).', keywords: ['continuous', 'load', '80%', '125%', 'derating', 'breaker', 'rating', 'overcurrent', 'maximum'], tips: ['Continuous = 3+ hours at maximum current', 'Lighting and heating are typically continuous loads', '80% rule: 15A breaker = max 12A continuous'], relatedRules: ['14-104'] },
  { rule: '8-106', title: 'Demand Factors', section: 'Circuit Loading', description: 'Specific demand factors for different load types. Allows reduction in calculated load for feeders and services.', keywords: ['demand', 'factor', 'reduction', 'feeder', 'service', 'load'] },
  { rule: '8-108', title: 'Spaces for Branch Circuit OC Devices', section: 'Circuit Loading', description: 'Panelboards must have spare spaces for future circuits. Residential panels require specific minimums.', keywords: ['panel', 'space', 'spare', 'future', 'circuit', 'overcurrent', 'branch'] },
  { rule: '8-200', title: 'Single Dwelling Demand', section: 'Circuit Loading', description: 'Demand load calculation for single dwelling units. Basic load + electric range + dryer + A/C + heating = minimum service size.', keywords: ['residential', 'demand', 'load', 'dwelling', 'house', 'home', 'service', 'calculation', 'single'], tips: ['First 5000W at 100%', 'Next 15000W at 40%', 'Remainder at 25%', 'Range: 6000W for first, + 40% each additional'], relatedRules: ['6-102', '8-202'] },
  { rule: '8-202', title: 'Apartment & Similar Buildings', section: 'Circuit Loading', description: 'Demand load calculation for multi-unit residential buildings. Demand factors decrease as number of units increases.', keywords: ['apartment', 'multi-unit', 'demand', 'load', 'building', 'residential'] },
  { rule: '8-204', title: 'School Demand', section: 'Circuit Loading', description: 'Demand load calculation method for school buildings.', keywords: ['school', 'demand', 'load', 'education'] },
  { rule: '8-210', title: 'Other Occupancy Types', section: 'Circuit Loading', description: 'Demand load calculation for commercial, industrial, and other occupancy types not specifically covered.', keywords: ['commercial', 'industrial', 'demand', 'load', 'calculation', 'business', 'store', 'occupancy'] },
  { rule: '8-300', title: 'Electric Range Circuits', section: 'Circuit Loading', description: 'Branch circuit requirements for electric ranges. Minimum conductor sizes and demand factors for ranges.', keywords: ['range', 'stove', 'oven', 'cooking', 'branch', 'circuit', 'kitchen'] },
  { rule: '8-304', title: 'Maximum Outlets per Circuit', section: 'Circuit Loading', description: 'Maximum 12 outlets per 15A circuit in non-dwelling units. Dwelling units have different rules.', keywords: ['outlet', 'maximum', 'per circuit', '12', 'receptacle', 'branch'], tips: ['Non-dwelling: max 12 outlets per 15A circuit', 'Dwelling units: no specific limit but load must not exceed 80%'] },
  { rule: '8-400', title: 'EV Charging Circuits', section: 'Circuit Loading', description: 'Branch circuits and feeders supplying electric vehicle charging equipment. Demand factors and energy management systems.', keywords: ['ev', 'electric vehicle', 'charging', 'evse', 'charger', 'demand', 'circuit'] },
  { rule: '8-500', title: 'EV Energy Management', section: 'Circuit Loading', description: 'Electric vehicle energy management systems (EVEMS) that allow load sharing among multiple EV charging stations.', keywords: ['evems', 'ev', 'energy', 'management', 'load', 'sharing', 'charging'] },

  // ══════════════════════════════
  // Section 10: Grounding & Bonding
  // ══════════════════════════════
  { rule: '10-002', title: 'Grounding — Object', section: 'Grounding & Bonding', description: 'Purpose of grounding: limit voltages due to lightning or line surges, stabilize voltage during normal operation, and facilitate overcurrent device operation.', keywords: ['grounding', 'purpose', 'object', 'lightning', 'surge', 'voltage'] },
  { rule: '10-100', title: 'Current Over Grounding Conductors', section: 'Grounding & Bonding', description: 'Grounding conductors must not normally carry current. They serve only as a fault path.', keywords: ['grounding', 'conductor', 'current', 'fault', 'path'] },
  { rule: '10-102', title: 'Grounding Electrodes', section: 'Grounding & Bonding', description: 'Types of acceptable grounding electrodes: metal water pipe, ground rods, concrete-encased electrode, ground ring, etc.', keywords: ['grounding', 'electrode', 'ground rod', 'water pipe', 'concrete', 'ufer'], tips: ['Metal water pipe must be supplemented by another electrode', 'Ground rod min 3m (10ft) driven', 'Concrete-encased (Ufer): 6m of #4 bare Cu in footing'] },
  { rule: '10-104', title: 'Electrode Spacing & Interconnection', section: 'Grounding & Bonding', description: 'Where multiple grounding electrodes are used, they must be bonded together. Minimum spacing requirements.', keywords: ['electrode', 'spacing', 'interconnection', 'bonding', 'multiple', 'ground'] },
  { rule: '10-110', title: 'Continuity of Grounding Conductors', section: 'Grounding & Bonding', description: 'No switch or overcurrent device may be placed in the grounding conductor path. Continuity must be maintained.', keywords: ['continuity', 'grounding', 'conductor', 'switch', 'break', 'uninterrupted'] },
  { rule: '10-112', title: 'Grounding Conductor Material', section: 'Grounding & Bonding', description: 'Grounding conductors must be copper, aluminum, or other approved material. Bare or insulated.', keywords: ['grounding', 'conductor', 'material', 'copper', 'aluminum', 'bare'] },
  { rule: '10-114', title: 'Grounding Conductor Size', section: 'Grounding & Bonding', description: 'System grounding conductor sizing based on service or feeder ampere rating per Table 17.', keywords: ['grounding', 'conductor', 'size', 'table 17', 'ground wire', 'sizing'], tips: ['100A = #8 Cu', '200A = #6 Cu', '400A = #3 Cu', '600A = #1 Cu', '800A = 1/0 Cu'] },
  { rule: '10-116', title: 'Grounding Conductor Installation', section: 'Grounding & Bonding', description: 'Grounding conductors must be installed as a continuous run without splices (except approved connections). Protection from damage required.', keywords: ['grounding', 'conductor', 'installation', 'continuous', 'splice', 'protection'] },
  { rule: '10-118', title: 'Grounding Electrode Connection', section: 'Grounding & Bonding', description: 'Connection of grounding conductor to grounding electrode must be accessible, and made with approved clamps or fittings.', keywords: ['grounding', 'electrode', 'connection', 'clamp', 'fitting', 'accessible'] },
  { rule: '10-204', title: 'DC System Grounding', section: 'Grounding & Bonding', description: 'Grounding connections for DC systems, including polarity to be grounded.', keywords: ['dc', 'grounding', 'direct current', 'polarity'] },
  { rule: '10-208', title: 'AC System Conductor to be Grounded', section: 'Grounding & Bonding', description: 'Identifies which conductor of an AC system must be grounded (typically the neutral).', keywords: ['ac', 'grounded', 'conductor', 'neutral', 'system'] },
  { rule: '10-210', title: 'Grounding for Solidly Grounded AC', section: 'Grounding & Bonding', description: 'Grounding connections for solidly grounded AC systems supplied by the utility. Bonding jumper and electrode requirements.', keywords: ['solidly', 'grounded', 'ac', 'bonding', 'jumper', 'utility', 'supply'] },
  { rule: '10-212', title: 'Separately Derived Systems', section: 'Grounding & Bonding', description: 'Grounding connections for separately derived AC systems (e.g., transformers). Requires own grounding electrode and bonding jumper.', keywords: ['separately', 'derived', 'system', 'transformer', 'grounding', 'electrode', 'bonding'], tips: ['Each separately derived system needs its own bonding jumper to ground'] },
  { rule: '10-302', title: 'Impedance Grounding — Use', section: 'Grounding & Bonding', description: 'Impedance grounding systems (HRG/NGR) may be used for systems over 150V to ground. Common in industrial and mining.', keywords: ['impedance', 'grounding', 'hrg', 'ngr', 'high resistance', 'neutral', 'resistor', 'industrial'] },
  { rule: '10-304', title: 'Impedance Grounding Devices', section: 'Grounding & Bonding', description: 'Requirements for neutral grounding resistors (NGR) and impedance grounding devices. Rating, installation, and monitoring.', keywords: ['ngr', 'impedance', 'resistor', 'neutral', 'grounding', 'device', 'monitoring'] },
  { rule: '10-400', title: 'Ungrounded Systems', section: 'Grounding & Bonding', description: 'Requirements for ungrounded electrical systems. Ground detection required. Limited to specific applications.', keywords: ['ungrounded', 'system', 'detection', 'ground', 'fault', 'indicator'] },
  { rule: '10-500', title: 'Bonding — Current', section: 'Grounding & Bonding', description: 'Bonding conductors must not normally carry current but provide a low-impedance fault path.', keywords: ['bonding', 'current', 'fault', 'path', 'impedance'] },
  { rule: '10-502', title: 'Clean Surfaces for Bonding', section: 'Grounding & Bonding', description: 'Surfaces to be bonded must be cleaned to ensure good electrical contact. Paint, lacquer, and coatings removed at connection points.', keywords: ['clean', 'surface', 'bonding', 'contact', 'paint', 'connection'] },
  { rule: '10-600', title: 'Bonding for Fixed Equipment', section: 'Grounding & Bonding', description: 'All fixed electrical equipment must be bonded to the grounding system. Includes panels, transformers, motors, etc.', keywords: ['bonding', 'fixed', 'equipment', 'panel', 'transformer', 'motor'] },
  { rule: '10-604', title: 'Bonding at Service Equipment', section: 'Grounding & Bonding', description: 'Service equipment requires a main bonding jumper connecting the neutral bus to the equipment ground bus and enclosure.', keywords: ['bonding', 'service', 'jumper', 'main', 'neutral', 'ground', 'bus'] },
  { rule: '10-610', title: 'Bonding Means — Fixed Equipment', section: 'Grounding & Bonding', description: 'Acceptable bonding methods include bonding conductor, metal raceway, cable armour, and bonding jumpers.', keywords: ['bonding', 'means', 'method', 'conductor', 'raceway', 'armour', 'jumper'] },
  { rule: '10-616', title: 'System Bonding Jumper Size', section: 'Grounding & Bonding', description: 'Sizing of system bonding jumpers and bonding conductors based on overcurrent device rating. References Table 16.', keywords: ['bonding', 'jumper', 'size', 'table 16', 'conductor', 'sizing'], tips: ['15-60A OCP = #10 Cu', '100A = #8 Cu', '200A = #6 Cu', '400A = #3 Cu'] },
  { rule: '10-700', title: 'Equipotential Bonding', section: 'Grounding & Bonding', description: 'Non-electrical metal parts that may become energized must be bonded to the grounding system (water pipes, structural steel, etc.).', keywords: ['equipotential', 'bonding', 'non-electrical', 'metal', 'water', 'pipe', 'structural', 'steel'] },

  // ══════════════════════════════
  // Section 12: Wiring Methods
  // ══════════════════════════════
  { rule: '12-010', title: 'Wiring in Ducts & Plenums', section: 'Wiring Methods', description: 'Special wiring requirements for ducts and plenum chambers used for environmental air. Only approved cable types permitted.', keywords: ['duct', 'plenum', 'air', 'handling', 'hvac', 'cable', 'wiring'] },
  { rule: '12-012', title: 'Underground Installations', section: 'Wiring Methods', description: 'General requirements for underground wiring including burial depths, protection, and approved wiring methods.', keywords: ['underground', 'burial', 'direct', 'buried', 'trench', 'depth'] },
  { rule: '12-018', title: 'Entry of Raceways into Buildings', section: 'Wiring Methods', description: 'Where raceways enter a building from underground, they must be sealed to prevent moisture, gas, or water entry.', keywords: ['entry', 'building', 'raceway', 'seal', 'underground', 'moisture'] },
  { rule: '12-100', title: 'Types of Conductors & Cables', section: 'Wiring Methods', description: 'Lists all approved conductor and cable types for building wiring. Includes NMD90, TECK90, AC90, MI, etc.', keywords: ['cable', 'type', 'nmd90', 'teck90', 'ac90', 'mi', 'conductor', 'approved', 'wiring method'] },
  { rule: '12-102', title: 'Cable Installation', section: 'Wiring Methods', description: 'General installation requirements for cables including support, protection, and routing.', keywords: ['cable', 'installation', 'support', 'protection', 'routing'] },
  { rule: '12-108', title: 'Conductors in Parallel', section: 'Wiring Methods', description: 'Conductors run in parallel must be the same length, same material, same size, same insulation, and terminated the same way.', keywords: ['parallel', 'conductor', 'same', 'length', 'size', 'material', 'balanced'] },
  { rule: '12-110', title: 'Bending Radii', section: 'Wiring Methods', description: 'Minimum bending radius for conductors and cables. Typically 6× cable diameter for non-shielded, 12× for shielded.', keywords: ['bending', 'radius', 'minimum', 'cable', 'conductor'] },
  { rule: '12-112', title: 'Conductor Joints & Splices', section: 'Wiring Methods', description: 'Joints and splices must be made with approved devices (wire nuts, split bolts, compression connectors). Must be accessible.', keywords: ['joint', 'splice', 'connection', 'wire nut', 'connector', 'accessible', 'marrette'] },
  { rule: '12-116', title: 'Conductor Termination', section: 'Wiring Methods', description: 'Conductors must be terminated with approved connectors. Aluminum conductors require anti-oxidant compound.', keywords: ['termination', 'connector', 'lug', 'aluminum', 'anti-oxidant', 'crimp'] },
  { rule: '12-118', title: 'Aluminum Conductor Termination', section: 'Wiring Methods', description: 'Special requirements for terminating aluminum conductors. Anti-oxidant compound, AL-rated connectors, torque specs.', keywords: ['aluminum', 'termination', 'anti-oxidant', 'al-rated', 'connector', 'torque'] },
  { rule: '12-120', title: 'Supporting of Conductors', section: 'Wiring Methods', description: 'Conductors must be supported and secured at intervals and within specified distances of boxes and fittings.', keywords: ['support', 'conductor', 'cable', 'secure', 'strap', 'staple'] },
  { rule: '12-402', title: 'Uses of Flexible Cord', section: 'Wiring Methods', description: 'Flexible cord may only be used for specific applications: portable equipment, temporary wiring, fixture whips. NOT for permanent wiring.', keywords: ['flexible', 'cord', 'use', 'portable', 'temporary', 'extension', 'not permanent'], tips: ['Never use extension cords as permanent wiring'] },
  { rule: '12-506', title: 'NMD Cable Installation', section: 'Wiring Methods', description: 'Installation method for NMD90 cable. Support intervals, protection in exposed locations, and stapling requirements.', keywords: ['nmd90', 'nmd', 'cable', 'installation', 'support', 'staple', 'residential'] },
  { rule: '12-554', title: 'NMD90 & NMWU Use', section: 'Wiring Methods', description: 'NMD90 cable use is limited to residential and specific light commercial applications. NMWU is the underground version.', keywords: ['nmd90', 'nmwu', 'residential', 'use', 'limitation', 'dwelling', 'underground'] },
  { rule: '12-602', title: 'Armoured Cable Use (AC90)', section: 'Wiring Methods', description: 'AC90 armoured cable may be used in most locations. Provides mechanical protection and serves as bonding path.', keywords: ['ac90', 'armoured', 'cable', 'bx', 'use', 'mechanical', 'protection', 'bonding'] },
  { rule: '12-610', title: 'Terminating Armoured Cable', section: 'Wiring Methods', description: 'Armoured cable must be terminated with approved connectors. Anti-short bushings required to protect conductors.', keywords: ['armoured', 'cable', 'termination', 'connector', 'anti-short', 'bushing', 'ac90'] },
  { rule: '12-614', title: 'Bends in Armoured Cable', section: 'Wiring Methods', description: 'Minimum bending radius for armoured cable. Must not damage the armour or internal conductors.', keywords: ['armoured', 'cable', 'bend', 'radius', 'minimum'] },
  { rule: '12-700', title: 'Mineral-Insulated Cable (MI)', section: 'Wiring Methods', description: 'Requirements for MI cable installation. Fire-resistant, used in critical circuits. Requires special termination.', keywords: ['mi', 'mineral', 'insulated', 'cable', 'fire', 'resistant', 'critical'] },
  { rule: '12-904', title: 'Conductors in Raceways', section: 'Wiring Methods', description: 'Fill limitations for conductors in raceways. 1 conductor = 53%, 2 = 31%, 3+ = 40% of raceway cross-section.', keywords: ['conduit', 'fill', 'raceway', 'percent', 'wire', '53%', '31%', '40%', 'conductor'], tips: ['1 wire = 53%', '2 wires = 31%', '3+ wires = 40%'] },
  { rule: '12-910', title: 'Conductors in Conduit & Tubing', section: 'Wiring Methods', description: 'Specific requirements for pulling conductors into conduit. No damage to insulation, pulling tension limits.', keywords: ['conductor', 'conduit', 'tubing', 'pulling', 'tension', 'insulation'] },
  { rule: '12-912', title: 'Splices in Raceways', section: 'Wiring Methods', description: 'Joints and splices are generally not permitted within raceways. Must be made in accessible junction boxes.', keywords: ['splice', 'raceway', 'junction', 'box', 'joint', 'conduit'] },
  { rule: '12-920', title: 'Raceway Support', section: 'Wiring Methods', description: 'Raceways must be supported at specified intervals. Different requirements for EMT, rigid, PVC.', keywords: ['raceway', 'support', 'interval', 'strap', 'emt', 'rigid', 'pvc'] },
  { rule: '12-924', title: 'Radii of Bends in Raceways', section: 'Wiring Methods', description: 'Minimum bending radius for raceways. Field bends must maintain minimum radius to prevent conductor damage.', keywords: ['bend', 'radius', 'raceway', 'conduit', 'minimum', 'field'] },
  { rule: '12-930', title: 'Underground Raceways — Moisture', section: 'Wiring Methods', description: 'Raceways installed underground or where moisture may accumulate must be sealed and drained.', keywords: ['underground', 'raceway', 'moisture', 'seal', 'drain', 'conduit'] },
  { rule: '12-942', title: 'Maximum Bends in Raceways', section: 'Wiring Methods', description: 'Total bends between pull points must not exceed 360° (four 90° bends). Pull boxes required for longer runs.', keywords: ['maximum', 'bend', '360', 'degrees', 'pull', 'box', 'conduit', 'raceway'], tips: ['Max 360° total bends between pull points', 'Add a pull box if you need more than 4 quarter bends'] },
  { rule: '12-1004', title: 'Minimum Conduit Size', section: 'Wiring Methods', description: 'Minimum trade size for conduit is 16mm (½ inch) for most applications.', keywords: ['conduit', 'minimum', 'size', 'trade', 'half inch', '16mm'] },
  { rule: '12-1010', title: 'Conduit Support Spacing', section: 'Wiring Methods', description: 'Maximum support spacing for conduit. EMT and rigid conduit have different support interval requirements.', keywords: ['conduit', 'support', 'spacing', 'strap', 'interval', 'emt', 'rigid'], tips: ['EMT: every 1.5m (5ft) + within 0.9m (3ft) of fittings', 'Rigid: every 3m (10ft) + within 0.9m of fittings'] },
  { rule: '12-1014', title: 'Conductors in Conduit', section: 'Wiring Methods', description: 'Requirements for conductors installed in conduit including fill limitations and conductor types.', keywords: ['conductor', 'conduit', 'fill', 'limitation', 'type'] },
  { rule: '12-1102', title: 'Flexible Conduit Restrictions', section: 'Wiring Methods', description: 'Restrictions on use of flexible metal conduit. Length limitations and where it may be used.', keywords: ['flexible', 'conduit', 'restriction', 'length', 'greenfield'] },
  { rule: '12-1150', title: 'EMT Use', section: 'Wiring Methods', description: 'Where electrical metallic tubing (EMT) is permitted. Most common raceway for commercial installations.', keywords: ['emt', 'electrical', 'metallic', 'tubing', 'commercial', 'use'] },
  { rule: '12-1200', title: 'Rigid PVC Conduit', section: 'Wiring Methods', description: 'Requirements for rigid PVC conduit. Expansion joints needed for temperature changes. Supports and restrictions.', keywords: ['pvc', 'rigid', 'conduit', 'plastic', 'expansion', 'joint', 'temperature'] },
  { rule: '12-1406', title: 'EMT Supports', section: 'Wiring Methods', description: 'Support requirements specifically for EMT. Maximum spacing between supports and distance from fittings.', keywords: ['emt', 'support', 'strap', 'spacing', 'fitting', 'distance'] },
  { rule: '12-2200', title: 'Cable Tray Installation', section: 'Wiring Methods', description: 'Installation requirements for cable tray systems. Fill, support, bonding, and approved cable types.', keywords: ['cable', 'tray', 'installation', 'fill', 'support', 'bonding'] },
  { rule: '12-2202', title: 'Cables in Cable Trays', section: 'Wiring Methods', description: 'Types of cables permitted in cable trays and maximum fill percentages. TECK90 is common in tray.', keywords: ['cable', 'tray', 'teck90', 'fill', 'type', 'permitted'] },

  // ══════════════════════════════
  // Section 14: Protection & Control
  // ══════════════════════════════
  { rule: '14-010', title: 'Protective Devices Required', section: 'Protection & Control', description: 'Every circuit must have overcurrent protection and a disconnecting means. Lists required protective devices.', keywords: ['protective', 'device', 'required', 'overcurrent', 'disconnect'] },
  { rule: '14-012', title: 'Ratings of Protective Equipment', section: 'Protection & Control', description: 'Protective and control equipment ratings must be suitable for the voltage, current, and fault current available.', keywords: ['rating', 'protective', 'equipment', 'voltage', 'current', 'fault'] },
  { rule: '14-100', title: 'Overcurrent Protection of Conductors', section: 'Protection & Control', description: 'Every ungrounded conductor must be protected by an overcurrent device at the point where it receives its supply.', keywords: ['overcurrent', 'protection', 'conductor', 'breaker', 'fuse', 'supply'] },
  { rule: '14-102', title: 'Ground Fault Protection', section: 'Protection & Control', description: 'Ground fault protection requirements for services and feeders. Required for certain ratings and system configurations.', keywords: ['ground fault', 'protection', 'service', 'feeder', 'gfp'] },
  { rule: '14-104', title: 'Rating of Overcurrent Devices', section: 'Protection & Control', description: 'Standard ampere ratings for overcurrent devices. Next standard size up permitted when calculated load falls between standard sizes.', keywords: ['standard', 'breaker', 'size', 'rating', 'ampere', 'overcurrent', 'fuse'], tips: ['Standard sizes: 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400A', 'Next standard size up allowed when 125% lands between sizes'] },
  { rule: '14-106', title: 'OC Device Location & Grouping', section: 'Protection & Control', description: 'Overcurrent devices must be located at the point where conductors receive their supply, with some exceptions for tap rules.', keywords: ['overcurrent', 'location', 'grouping', 'tap', 'rule', 'supply', 'point'] },
  { rule: '14-200', title: 'Time-Delay & Low-Melting Fuses', section: 'Protection & Control', description: 'Requirements for different fuse types. Time-delay fuses allow motor inrush. Low-melting-point fuses for different applications.', keywords: ['fuse', 'time delay', 'type', 'low melting', 'motor', 'inrush'] },
  { rule: '14-300', title: 'Circuit Breakers — General', section: 'Protection & Control', description: 'General requirements for circuit breakers including construction, ratings, and application.', keywords: ['circuit', 'breaker', 'general', 'construction', 'rating'] },
  { rule: '14-302', title: 'Circuit Breaker Construction', section: 'Protection & Control', description: 'Circuit breakers must be designed so they cannot be held in the closed position during a fault.', keywords: ['circuit', 'breaker', 'construction', 'trip', 'free', 'fault'] },
  { rule: '14-402', title: 'Disconnect for Fused Circuits', section: 'Protection & Control', description: 'A disconnecting means must be provided on the supply side of fuses so they can be safely de-energized for replacement.', keywords: ['disconnect', 'fuse', 'supply', 'side', 'replacement', 'safety'] },
  { rule: '14-406', title: 'Location of Control Devices', section: 'Protection & Control', description: 'Control devices must be readily accessible and located where they can be safely operated.', keywords: ['control', 'device', 'location', 'accessible', 'switch'] },
  { rule: '14-606', title: 'Panelboard OC Protection', section: 'Protection & Control', description: 'Panelboards must be protected by an overcurrent device on the supply side rated not more than the panelboard rating.', keywords: ['panelboard', 'panel', 'overcurrent', 'protection', 'main', 'breaker', 'rating'] },
  { rule: '14-610', title: 'Cycling Load Protection', section: 'Protection & Control', description: 'Special overcurrent protection requirements for circuits supplying cycling loads (e.g., welders, intermittent duty).', keywords: ['cycling', 'load', 'intermittent', 'welder', 'duty', 'protection'] },
  { rule: '14-612', title: 'Transfer Equipment — Standby', section: 'Protection & Control', description: 'Requirements for transfer switches used with standby power systems. Must prevent paralleling of sources.', keywords: ['transfer', 'switch', 'standby', 'generator', 'parallel', 'interlock', 'ats'] },

  // ══════════════════════════════
  // Section 16: Class 1 & 2 Circuits
  // ══════════════════════════════
  { rule: '16-000', title: 'Class 1 & 2 Circuits — Scope', section: 'Low Voltage Circuits', description: 'Requirements for Class 1 (extra-low-voltage power) and Class 2 (low-energy power) circuits. Controls, signaling, fire alarm.', keywords: ['class 1', 'class 2', 'low voltage', 'extra low', 'control', 'signaling'] },
  { rule: '16-200', title: 'Class 2 Circuit Limitations', section: 'Low Voltage Circuits', description: 'Power and voltage limitations for Class 2 circuits. Maximum voltage and current values that define Class 2.', keywords: ['class 2', 'limitation', 'power', 'voltage', 'current', 'maximum'] },
  { rule: '16-210', title: 'Class 2 Wiring', section: 'Low Voltage Circuits', description: 'Conductor types and installation methods for Class 2 circuit wiring. Separation from power wiring required.', keywords: ['class 2', 'wiring', 'conductor', 'separation', 'power', 'low voltage'] },
  { rule: '16-212', title: 'Separation of Class 2 Circuits', section: 'Low Voltage Circuits', description: 'Class 2 circuits must be kept separate from power circuits. Barrier or separate raceway required.', keywords: ['separation', 'class 2', 'power', 'barrier', 'raceway', 'mixed'] },

  // ══════════════════════════════
  // Section 18: Hazardous Locations
  // ══════════════════════════════
  { rule: '18-004', title: 'Classification of Hazardous Locations', section: 'Hazardous Locations', description: 'How to classify hazardous locations using either the Division system (Class/Division) or Zone system (Zone 0/1/2 for gas, Zone 20/21/22 for dust).', keywords: ['classification', 'hazardous', 'location', 'class', 'division', 'zone', 'gas', 'dust'] },
  { rule: '18-006', title: 'Explosive Gas Atmospheres', section: 'Hazardous Locations', description: 'Classification and requirements for locations with explosive gas atmospheres. Zone 0, 1, and 2 definitions.', keywords: ['explosive', 'gas', 'atmosphere', 'zone 0', 'zone 1', 'zone 2', 'flammable'] },
  { rule: '18-008', title: 'Explosive Dust Atmospheres', section: 'Hazardous Locations', description: 'Classification for locations with explosive dust atmospheres. Zone 20, 21, and 22.', keywords: ['explosive', 'dust', 'atmosphere', 'zone 20', 'zone 21', 'zone 22', 'combustible'] },
  { rule: '18-050', title: 'Equipment in Hazardous Locations', section: 'Hazardous Locations', description: 'Electrical equipment in hazardous locations must be approved for the specific class, division/zone, and group.', keywords: ['equipment', 'hazardous', 'approved', 'certified', 'explosion proof', 'intrinsic'] },
  { rule: '18-052', title: 'Marking in Hazardous Locations', section: 'Hazardous Locations', description: 'Equipment in hazardous locations must be marked with class, division/zone, group, and temperature code.', keywords: ['marking', 'hazardous', 'class', 'group', 'temperature', 'code', 't-code'] },
  { rule: '18-054', title: 'Temperature in Hazardous Locations', section: 'Hazardous Locations', description: 'Equipment surface temperature must not exceed the ignition temperature of the surrounding atmosphere.', keywords: ['temperature', 'hazardous', 'ignition', 'surface', 't-code', 'auto-ignition'] },
  { rule: '18-072', title: 'Seals in Hazardous Locations', section: 'Hazardous Locations', description: 'Conduit seals (sealing fittings) required at boundaries between hazardous and non-hazardous areas and at equipment.', keywords: ['seal', 'sealing', 'fitting', 'conduit', 'boundary', 'hazardous', 'eys', 'eyf'] },
  { rule: '18-074', title: 'Bonding in Hazardous Locations', section: 'Hazardous Locations', description: 'Enhanced bonding requirements in hazardous locations. All metal parts must be bonded for static discharge prevention.', keywords: ['bonding', 'hazardous', 'static', 'discharge', 'metal', 'grounding'] },
  { rule: '18-100', title: 'Equipment — Zone 1', section: 'Hazardous Locations', description: 'Equipment permitted in Zone 1 hazardous locations. Must be certified for the specific gas group.', keywords: ['zone 1', 'equipment', 'certified', 'gas', 'group', 'hazardous'] },
  { rule: '18-102', title: 'Wiring Methods — Zone 1', section: 'Hazardous Locations', description: 'Approved wiring methods for Zone 1: MI cable, TECK90 with approved connectors, or rigid conduit with seals.', keywords: ['zone 1', 'wiring', 'method', 'mi', 'teck90', 'rigid', 'conduit', 'hazardous'] },
  { rule: '18-150', title: 'Equipment — Zone 2', section: 'Hazardous Locations', description: 'Equipment requirements for Zone 2 locations. Less restrictive than Zone 1 but still requires approved equipment.', keywords: ['zone 2', 'equipment', 'hazardous', 'approved'] },
  { rule: '18-152', title: 'Wiring Methods — Zone 2', section: 'Hazardous Locations', description: 'Wiring methods for Zone 2 locations. More wiring methods permitted than Zone 1.', keywords: ['zone 2', 'wiring', 'method', 'hazardous'] },
  { rule: '18-200', title: 'Equipment — Zone 21 (Dust)', section: 'Hazardous Locations', description: 'Equipment requirements for Zone 21 dust hazardous locations. Dust-tight enclosures required.', keywords: ['zone 21', 'dust', 'equipment', 'dust-tight', 'hazardous'] },

  // ══════════════════════════════
  // Section 20: Gasoline & Gas Stations
  // ══════════════════════════════
  { rule: '20-002', title: 'Gas Station — General', section: 'Gas Stations', description: 'General requirements for electrical installations in gasoline dispensing, service stations, and garages.', keywords: ['gas', 'station', 'gasoline', 'dispensing', 'service', 'garage', 'fuel'] },
  { rule: '20-004', title: 'Gas Station Hazardous Areas', section: 'Gas Stations', description: 'Classification of hazardous areas around fuel dispensers, storage tanks, and vent pipes.', keywords: ['gas', 'station', 'hazardous', 'area', 'dispenser', 'tank', 'vent', 'fuel'] },

  // ══════════════════════════════
  // Section 26: Equipment Installation
  // ══════════════════════════════
  { rule: '26-002', title: 'Identified Terminal Connections', section: 'Equipment Installation', description: 'Grounded (neutral) conductors must be connected to identified (silver/white) terminals only.', keywords: ['identified', 'terminal', 'neutral', 'silver', 'white', 'connection'] },
  { rule: '26-100', title: 'Isolating Switch Location & Marking', section: 'Equipment Installation', description: 'Isolating switches must be marked to show open/closed position and located for safe operation.', keywords: ['isolating', 'switch', 'marking', 'location', 'open', 'closed'] },
  { rule: '26-200', title: 'Capacitors', section: 'Equipment Installation', description: 'Requirements for capacitor installations including discharge resistors, overcurrent protection, and disconnect means.', keywords: ['capacitor', 'power factor', 'correction', 'discharge', 'disconnect'] },
  { rule: '26-240', title: 'Transformers — General', section: 'Transformers', description: 'General installation requirements for transformers including ventilation, accessibility, and nameplate marking.', keywords: ['transformer', 'general', 'installation', 'ventilation', 'nameplate'] },
  { rule: '26-248', title: 'Transformer Disconnect', section: 'Transformers', description: 'A disconnecting means must be provided on the primary side of each transformer. Must be lockable.', keywords: ['transformer', 'disconnect', 'primary', 'lockable', 'switch'] },
  { rule: '26-250', title: 'Transformer OCP — Over 750V', section: 'Transformers', description: 'Overcurrent protection requirements for power transformer circuits rated over 750V (medium/high voltage).', keywords: ['transformer', 'overcurrent', 'protection', 'high voltage', 'medium voltage', '750v'] },
  { rule: '26-252', title: 'Transformer OCP — 750V or Less', section: 'Transformers', description: 'Overcurrent protection for transformer circuits rated 750V or less. Primary OCP at max 125% of primary FLA.', keywords: ['transformer', 'overcurrent', 'protection', 'primary', '125%', 'secondary'], tips: ['Primary OCP: max 125% of primary FLA', 'Next standard size up OK if 125% is not standard', 'Secondary OCP: max 125% of secondary FLA'] },
  { rule: '26-256', title: 'Transformer Conductor Size', section: 'Transformers', description: 'Minimum conductor sizing for transformer circuits. Primary and secondary conductors based on transformer FLA.', keywords: ['transformer', 'conductor', 'size', 'primary', 'secondary', 'wire'] },
  { rule: '26-258', title: 'Transformer Continuous Load', section: 'Transformers', description: 'Transformer continuous loading must not exceed nameplate rating unless specifically designed for it.', keywords: ['transformer', 'continuous', 'load', 'rating', 'nameplate', 'overload'] },
  { rule: '26-300', title: 'Outdoor Substations — General', section: 'Equipment Installation', description: 'Requirements for outdoor substation enclosures including fencing, clearances, and warning signs.', keywords: ['substation', 'outdoor', 'fence', 'clearance', 'warning', 'sign'] },
  { rule: '26-350', title: 'Vaults — General', section: 'Equipment Installation', description: 'Construction and ventilation requirements for electrical equipment vaults.', keywords: ['vault', 'construction', 'ventilation', 'fire', 'rating'] },
  { rule: '26-400', title: 'Lightning Arresters', section: 'Equipment Installation', description: 'Installation requirements for surge arresters (lightning arresters). Location, grounding, and conductor routing.', keywords: ['lightning', 'arrester', 'surge', 'protector', 'spd', 'grounding'] },
  { rule: '26-700', title: 'Motor Circuits — General', section: 'Motors', description: 'General requirements for motor installations including conductors, disconnecting means, controllers, and protection.', keywords: ['motor', 'general', 'circuit', 'disconnect', 'controller', 'protection'] },
  { rule: '26-740', title: 'Motor Controller', section: 'Motors', description: 'Every motor must have a controller capable of starting and stopping the motor. Rating requirements.', keywords: ['motor', 'controller', 'starter', 'contactor', 'start', 'stop', 'rating'] },
  { rule: '26-744', title: 'Motor Disconnect', section: 'Motors', description: 'Every motor must have a disconnecting means within sight and lockable. Must be HP-rated or ampere-rated.', keywords: ['motor', 'disconnect', 'switch', 'lockable', 'sight', 'hp', 'lockout'], tips: ['Must be within sight of motor (visible and ≤9m)', 'Must be lockable in open position', 'Must be HP-rated or equivalent ampere-rated'] },
  { rule: '26-746', title: 'Motor Disconnect Rating', section: 'Motors', description: 'Motor disconnect must be rated at least 115% of motor nameplate FLA and rated for the motor HP.', keywords: ['motor', 'disconnect', 'rating', '115%', 'hp', 'horsepower', 'ampere'] },
  { rule: '26-806', title: 'Luminaire Installation', section: 'Equipment Installation', description: 'General installation requirements for luminaires (lighting fixtures). Support, wiring, and clearances.', keywords: ['luminaire', 'fixture', 'lighting', 'installation', 'support', 'clearance'] },
  { rule: '26-710', title: 'AFCI Protection', section: 'GFCI & AFCI', description: 'Arc fault circuit interrupter requirements for dwelling unit branch circuits. Required in bedrooms and expanding to more areas.', keywords: ['afci', 'arc fault', 'bedroom', 'dwelling', 'protection', 'circuit', 'branch'] },
  { rule: '26-722', title: 'Receptacle Ratings', section: 'Equipment Installation', description: 'Receptacle ratings must match or exceed the branch circuit rating. Configuration must match the circuit ampacity.', keywords: ['receptacle', 'rating', 'outlet', 'ampere', 'configuration', 'branch'] },
  { rule: '26-724', title: 'Receptacle Location — Dwellings', section: 'Equipment Installation', description: 'Receptacle spacing in dwelling units. No point along a wall should be more than 1.8m from a receptacle.', keywords: ['receptacle', 'spacing', 'dwelling', 'wall', '1.8m', 'outlet', 'residential'], tips: ['Max 1.8m (6ft) from any point along wall to nearest receptacle', 'Kitchen countertops: max 900mm (3ft) spacing', 'Bathroom: at least one within 1m of basin'] },
  { rule: '26-726', title: 'Receptacles — Kitchen & Bath', section: 'Equipment Installation', description: 'Special receptacle requirements for kitchens and bathrooms in dwelling units. Dedicated circuits and spacing.', keywords: ['kitchen', 'bathroom', 'receptacle', 'outlet', 'dedicated', 'circuit', 'countertop'] },

  // ══════════════════════════════
  // Section 28: Motors & Generators
  // ══════════════════════════════
  { rule: '28-106', title: 'Motor Branch Conductor Sizing', section: 'Motors', description: 'Motor branch circuit conductors must be rated at least 125% of the motor full-load current from CEC tables (not nameplate).', keywords: ['motor', 'branch', 'conductor', 'wire', 'sizing', '125%', 'flc', 'full load current'], tips: ['Use CEC table FLC, NOT nameplate', 'Always 125% of table value', 'Table D16 for 3-phase motors'], relatedRules: ['28-200', '28-400'] },
  { rule: '28-108', title: 'Multi-Motor Feeder Sizing', section: 'Motors', description: 'Feeder conductors for multiple motors: 125% of largest motor FLC + 100% of all other motor FLCs.', keywords: ['motor', 'feeder', 'multiple', 'sizing', '125%', 'largest', 'conductor'] },
  { rule: '28-200', title: 'Motor Branch Circuit OCP', section: 'Motors', description: 'Branch circuit overcurrent protection for motors. Maximum OCP depends on motor type and starting method.', keywords: ['motor', 'branch', 'overcurrent', 'protection', 'breaker', 'fuse', 'ocp'], tips: ['Inverse-time breaker: max 250% of FLC', 'Dual-element fuse: max 175% of FLC', 'Non-time-delay fuse: max 300% of FLC', 'If motor won\'t start, Table 29 allows higher values'] },
  { rule: '28-306', title: 'Motor Overload Protection', section: 'Motors', description: 'Running overload protection setting based on motor service factor and nameplate FLA.', keywords: ['motor', 'overload', 'protection', 'running', 'heater', 'thermal', 'relay', 'service factor'], tips: ['SF ≥ 1.15: set at 125% of nameplate FLA', 'SF < 1.15: set at 115% of nameplate FLA', 'Use NAMEPLATE current (not CEC table FLC)'] },
  { rule: '28-400', title: 'Motor Overload — General', section: 'Motors', description: 'Every motor must have running overload protection. Can be separate device or integral to motor (thermal protector).', keywords: ['motor', 'overload', 'protection', 'general', 'sustained', 'overcurrent', 'thermal'] },

  // ══════════════════════════════
  // Section 30: Lighting
  // ══════════════════════════════
  { rule: '30-002', title: 'Lighting — Terminology', section: 'Lighting', description: 'Definitions for lighting equipment terms including luminaire, ballast, LED driver, and cabinet lighting systems.', keywords: ['lighting', 'luminaire', 'fixture', 'ballast', 'led', 'driver', 'definition'] },
  { rule: '30-004', title: 'GFCI Protection for Lighting', section: 'GFCI & AFCI', description: 'GFCI protection requirements for receptacles and equipment. Required in bathrooms, kitchens, outdoors, garages, etc.', keywords: ['gfci', 'ground fault', 'circuit', 'interrupter', 'bathroom', 'kitchen', 'outdoor', 'garage', 'protection'], tips: ['Bathrooms: all receptacles', 'Kitchens: countertop receptacles within 1.5m of sink', 'Outdoors: all receptacles', 'Garages: all receptacles', 'Unfinished basements: all receptacles', 'Construction sites: all 15A/20A receptacles'] },
  { rule: '30-100', title: 'Luminaire Installation', section: 'Lighting', description: 'General installation requirements for luminaires. Wiring methods, support, and thermal insulation clearance.', keywords: ['luminaire', 'installation', 'fixture', 'support', 'thermal', 'insulation'] },
  { rule: '30-302', title: 'Outdoor Lighting', section: 'Lighting', description: 'Requirements for outdoor lighting installations including wet location ratings and support.', keywords: ['outdoor', 'lighting', 'wet', 'location', 'fixture', 'luminaire'] },
  { rule: '30-310', title: 'Lighting Track', section: 'Lighting', description: 'Installation requirements for lighting track systems. Loads, support, and connection methods.', keywords: ['track', 'lighting', 'installation', 'load', 'support'] },

  // ══════════════════════════════
  // Section 32: Fire Alarm
  // ══════════════════════════════
  { rule: '32-100', title: 'Fire Alarm — Scope', section: 'Fire Alarm', description: 'Requirements for fire alarm systems, smoke alarms, CO alarms, and fire pump installations in buildings.', keywords: ['fire', 'alarm', 'system', 'smoke', 'co', 'carbon monoxide', 'detector', 'pump'] },
  { rule: '32-102', title: 'Fire Alarm Wiring', section: 'Fire Alarm', description: 'Wiring methods for fire alarm circuits. Must maintain circuit integrity during fire conditions where required.', keywords: ['fire', 'alarm', 'wiring', 'circuit', 'integrity', 'survivability'] },
  { rule: '32-104', title: 'Fire Alarm Power Supply', section: 'Fire Alarm', description: 'Power supply requirements for fire alarm systems. Dedicated circuit required with no other loads.', keywords: ['fire', 'alarm', 'power', 'supply', 'dedicated', 'circuit', 'battery'] },
  { rule: '32-110', title: 'Smoke Alarms in Dwellings', section: 'Fire Alarm', description: 'Smoke alarm installation requirements in dwelling units. Interconnection and power source requirements.', keywords: ['smoke', 'alarm', 'dwelling', 'residential', 'interconnect', 'battery'] },

  // ══════════════════════════════
  // Section 36: High Voltage
  // ══════════════════════════════
  { rule: '36-100', title: 'HV Installations — General', section: 'High Voltage', description: 'General requirements for installations over 750V. Includes switchgear, transformers, cables, and clearances.', keywords: ['high voltage', 'hv', '750v', 'medium voltage', 'mv', 'switchgear', 'clearance'] },
  { rule: '36-102', title: 'HV Equipment Access', section: 'High Voltage', description: 'High voltage equipment must be accessible only to qualified persons. Locked rooms, fences, or elevated platforms.', keywords: ['high voltage', 'access', 'qualified', 'locked', 'fence', 'restricted'] },
  { rule: '36-110', title: 'HV Conductor Clearances', section: 'High Voltage', description: 'Minimum clearances for high voltage conductors from buildings, ground, and other objects.', keywords: ['high voltage', 'clearance', 'conductor', 'distance', 'minimum', 'spacing'] },

  // ══════════════════════════════
  // Section 40: Cranes & Hoists
  // ══════════════════════════════
  { rule: '40-002', title: 'Cranes & Hoists — General', section: 'Cranes & Hoists', description: 'Electrical requirements for overhead cranes, hoists, and monorail systems. Disconnects, conductors, and controls.', keywords: ['crane', 'hoist', 'overhead', 'monorail', 'disconnect', 'control', 'pendant'] },

  // ══════════════════════════════
  // Section 42: Welders
  // ══════════════════════════════
  { rule: '42-000', title: 'Electric Welders — Scope', section: 'Welders', description: 'Electrical installation requirements for arc welders and resistance welders. Conductor sizing based on duty cycle.', keywords: ['welder', 'welding', 'arc', 'resistance', 'duty cycle', 'conductor', 'sizing'] },

  // ══════════════════════════════
  // Section 46: Emergency Power
  // ══════════════════════════════
  { rule: '46-002', title: 'Emergency Power — Terminology', section: 'Emergency Power', description: 'Definitions for emergency power systems including unit equipment, exit signs, and life safety systems.', keywords: ['emergency', 'power', 'unit', 'equipment', 'exit', 'sign', 'life safety'] },
  { rule: '46-100', title: 'Emergency Lighting', section: 'Emergency Power', description: 'Emergency lighting must be provided in buildings. Battery-backed or generator-supplied. Minimum illumination levels.', keywords: ['emergency', 'lighting', 'battery', 'generator', 'illumination', 'exit'] },
  { rule: '46-200', title: 'Emergency Power Supply', section: 'Emergency Power', description: 'Requirements for emergency power supply systems including generators, transfer switches, and battery systems.', keywords: ['emergency', 'power', 'supply', 'generator', 'transfer', 'switch', 'battery', 'ats'] },
  { rule: '46-300', title: 'Unit Equipment', section: 'Emergency Power', description: 'Self-contained emergency lighting units with integral batteries. Installation, testing, and maintenance requirements.', keywords: ['unit', 'equipment', 'emergency', 'battery', 'self-contained', 'testing'] },
  { rule: '46-400', title: 'Exit Signs', section: 'Emergency Power', description: 'Installation requirements for exit signs. Must be illuminated and connected to emergency power.', keywords: ['exit', 'sign', 'illuminated', 'emergency', 'power', 'egress'] },

  // ══════════════════════════════
  // Section 62: Fixed Heating
  // ══════════════════════════════
  { rule: '62-100', title: 'Fixed Heating — General', section: 'Heating', description: 'Requirements for fixed electric heating systems. Baseboard heaters, unit heaters, and radiant panels.', keywords: ['heating', 'baseboard', 'heater', 'electric', 'fixed', 'unit', 'radiant'] },
  { rule: '62-108', title: 'In-Floor Heating', section: 'Heating', description: 'Requirements for electric in-floor (radiant floor) heating systems. GFCI protection and installation methods.', keywords: ['floor', 'heating', 'radiant', 'in-floor', 'gfci', 'mat', 'cable'] },
  { rule: '62-200', title: 'Duct Heaters', section: 'Heating', description: 'Electric duct heater installation requirements. Airflow interlocks, limit controls, and conductor ratings.', keywords: ['duct', 'heater', 'airflow', 'interlock', 'limit', 'control', 'hvac'] },
  { rule: '62-300', title: 'Heat Trace & De-Icing', section: 'Heating', description: 'Electric heat tracing cables for pipe freeze protection and de-icing. Self-regulating and constant-wattage types.', keywords: ['heat', 'trace', 'tracing', 'de-icing', 'pipe', 'freeze', 'protection', 'self-regulating'] },

  // ══════════════════════════════
  // Section 64: Renewable Energy
  // ══════════════════════════════
  { rule: '64-000', title: 'Renewable Energy — Scope', section: 'Renewable Energy', description: 'Requirements for renewable energy systems, energy production, and energy storage system installations.', keywords: ['renewable', 'energy', 'solar', 'pv', 'wind', 'storage', 'battery', 'ess'] },
  { rule: '64-060', title: 'PV System Installation', section: 'Renewable Energy', description: 'Installation requirements for photovoltaic (solar) systems. Conductor sizing, disconnects, grounding, and labeling.', keywords: ['solar', 'pv', 'photovoltaic', 'panel', 'inverter', 'disconnect', 'installation'] },
  { rule: '64-062', title: 'PV Disconnect Means', section: 'Renewable Energy', description: 'Disconnecting means required for PV systems. Must isolate all ungrounded conductors from the inverter.', keywords: ['solar', 'pv', 'disconnect', 'inverter', 'isolate', 'switch'] },
  { rule: '64-064', title: 'PV Conductor Sizing', section: 'Renewable Energy', description: 'PV source and output circuit conductors must be sized at 125% of rated short-circuit current (Isc).', keywords: ['solar', 'pv', 'conductor', 'sizing', '125%', 'isc', 'short circuit'] },
  { rule: '64-200', title: 'Energy Storage Systems (ESS)', section: 'Renewable Energy', description: 'Requirements for battery energy storage systems. Ventilation, disconnects, overcurrent protection, and signage.', keywords: ['energy', 'storage', 'battery', 'ess', 'bess', 'lithium', 'ventilation'] },
  { rule: '64-300', title: 'Wind Turbine Systems', section: 'Renewable Energy', description: 'Electrical installation requirements for small and medium wind turbine systems.', keywords: ['wind', 'turbine', 'generator', 'renewable', 'system'] },

  // ══════════════════════════════
  // Section 68: Pools, Tubs, Spas
  // ══════════════════════════════
  { rule: '68-054', title: 'Pool Bonding', section: 'Pools & Spas', description: 'All metal parts of pools, spas, and surrounding area (within 1.5m) must be bonded together and to the grounding system.', keywords: ['pool', 'bonding', 'metal', 'equipotential', 'spa', 'hot tub', 'grid'], tips: ['Bond all metal within 1.5m (5ft) of pool edge', 'Includes reinforcing steel, ladders, fences, drains'] },
  { rule: '68-058', title: 'Pool Wiring Methods', section: 'Pools & Spas', description: 'Approved wiring methods for pools, spas, and hot tubs. GFCI protection mandatory for all pool equipment circuits.', keywords: ['pool', 'spa', 'hot tub', 'wiring', 'gfci', 'method', 'protection'] },
  { rule: '68-060', title: 'Pool Receptacle Distance', section: 'Pools & Spas', description: 'Receptacles must be at least 1.5m from pool edge. GFCI required for all receptacles within 3m.', keywords: ['pool', 'receptacle', 'distance', '1.5m', '3m', 'gfci', 'outlet'] },
  { rule: '68-062', title: 'Pool Luminaire Clearance', section: 'Pools & Spas', description: 'Minimum clearances for luminaires over pools. Height and distance requirements from pool edge.', keywords: ['pool', 'luminaire', 'lighting', 'clearance', 'height', 'distance'] },
  { rule: '68-068', title: 'Hot Tub & Spa Requirements', section: 'Pools & Spas', description: 'Specific requirements for hot tubs and spas. Dedicated circuit, GFCI, disconnect within sight, bonding.', keywords: ['hot tub', 'spa', 'gfci', 'disconnect', 'bonding', 'dedicated', 'circuit'] },

  // ══════════════════════════════
  // Section 76: Temporary Wiring
  // ══════════════════════════════
  { rule: '76-010', title: 'Temporary Wiring — General', section: 'Temporary', description: 'Requirements for temporary electrical installations on construction sites. Must be removed when permanent wiring is complete.', keywords: ['temporary', 'construction', 'site', 'temp', 'power', 'wiring'] },
  { rule: '76-012', title: 'Temporary Wiring — GFCI', section: 'Temporary', description: 'All 15A and 20A receptacles on construction sites require GFCI protection. No exceptions.', keywords: ['temporary', 'construction', 'gfci', 'receptacle', '15a', '20a', 'site'], tips: ['ALL 15A and 20A temp receptacles need GFCI — no exceptions'] },
  { rule: '76-014', title: 'Temporary Panels & Feeders', section: 'Temporary', description: 'Requirements for temporary distribution panels, feeders, and branch circuits on construction sites.', keywords: ['temporary', 'panel', 'feeder', 'distribution', 'construction'] },

  // ══════════════════════════════
  // Section 84: Interconnection
  // ══════════════════════════════
  { rule: '84-002', title: 'Power Source Interconnection', section: 'Interconnection', description: 'Requirements for interconnecting power production sources (generators, PV, wind) with the utility grid.', keywords: ['interconnection', 'grid', 'tie', 'utility', 'generator', 'pv', 'parallel'] },
  { rule: '84-010', title: 'Interconnection Disconnect', section: 'Interconnection', description: 'A visible-break disconnect must be provided at the point of interconnection with the utility.', keywords: ['interconnection', 'disconnect', 'visible', 'break', 'utility', 'grid'] },
  { rule: '84-022', title: 'Anti-Islanding Protection', section: 'Interconnection', description: 'Systems interconnected with the grid must have anti-islanding protection to prevent backfeed during outages.', keywords: ['anti-islanding', 'islanding', 'backfeed', 'protection', 'grid', 'outage'] },

  // ══════════════════════════════
  // Section 86: EV Charging
  // ══════════════════════════════
  { rule: '86-100', title: 'EV Charging — General', section: 'EV Charging', description: 'Requirements for electric vehicle charging system installations. EVSE types, wiring methods, and protection.', keywords: ['ev', 'electric vehicle', 'charging', 'evse', 'station', 'charger', 'level 2'] },
  { rule: '86-102', title: 'EVSE Circuit Requirements', section: 'EV Charging', description: 'EV charging circuits must be dedicated. Continuous load rating applies (125% rule). Conductor sizing requirements.', keywords: ['evse', 'ev', 'circuit', 'dedicated', 'continuous', '125%', 'conductor'], tips: ['EV charging is continuous load — apply 125% rule', '40A EVSE needs 50A breaker and #6 wire (at 125%)'] },
  { rule: '86-104', title: 'EVSE Location', section: 'EV Charging', description: 'EVSE mounting height, accessibility, and location requirements. Ventilation for indoor charging.', keywords: ['evse', 'ev', 'location', 'mounting', 'indoor', 'ventilation', 'garage'] },
  { rule: '86-300', title: 'DC Fast Charging', section: 'EV Charging', description: 'Requirements for DC fast charging (Level 3) installations. Higher power requirements and utility coordination.', keywords: ['dc', 'fast', 'charging', 'level 3', 'ev', 'high power', 'dcfc'] },

  // ══════════════════════════════
  // Mining (Ontario Reg. 854)
  // ══════════════════════════════
  { rule: 'Reg 854 s.153', title: 'Mine Ground Fault Protection', section: 'Mining', description: 'All portable electrical equipment in mines must have ground fault protection. Maximum trip time and current specified.', keywords: ['mining', 'mine', 'ground fault', 'portable', 'equipment', 'protection', 'gfp'] },
  { rule: 'Reg 854 s.160', title: 'Mine Lockout Procedures', section: 'Mining', description: 'Lockout procedures for mining electrical equipment. Each worker must apply their own personal lock.', keywords: ['mining', 'mine', 'lockout', 'loto', 'lock', 'safety', 'personal'], tips: ['Each worker applies their OWN lock — no group locks', 'Lock must be individually keyed'] },
  { rule: 'Reg 854 s.164', title: 'Mine Cable Protection', section: 'Mining', description: 'Protection requirements for cables in mining. Mechanical protection, identification, and routing requirements.', keywords: ['mining', 'mine', 'cable', 'conductor', 'protection', 'mechanical', 'teck'] },
  { rule: 'Reg 854 s.167', title: 'Mine Trailing Cables', section: 'Mining', description: 'Requirements for trailing cables supplying mobile mining equipment. Ground check conductors and protection.', keywords: ['mining', 'trailing', 'cable', 'mobile', 'equipment', 'ground check'] },
  { rule: 'Reg 854 s.195', title: 'Mine Grounding Systems', section: 'Mining', description: 'Grounding requirements for open-pit and underground mines. Continuity testing and grounding grid requirements.', keywords: ['mining', 'mine', 'grounding', 'ground', 'continuity', 'testing', 'open pit', 'grid'] },
  { rule: 'Reg 854 s.196', title: 'Mine High Voltage', section: 'Mining', description: 'Special requirements for high voltage installations in mining. Switching procedures, protective relaying, and clearances.', keywords: ['mining', 'high voltage', 'hv', 'switching', 'relay', 'protection', 'clearance'] },
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
