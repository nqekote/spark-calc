/**
 * Common CEC Rules — Quick Reference
 *
 * Frequently used Canadian Electrical Code rules with rule numbers
 * and brief descriptions. Useful as a quick lookup for Ontario
 * electrical apprentices.
 *
 * Canadian Electrical Code, Part I
 */

import type { CECRule } from '../types';

export const COMMON_CEC_RULES: CECRule[] = [
  // Section 2 — General Rules
  {
    ruleNumber: '2-024',
    title: 'Approval of Electrical Equipment',
    description:
      'All electrical equipment used must be approved (CSA or equivalent) and used in accordance with its approval.',
  },
  {
    ruleNumber: '2-100',
    title: 'Wiring Methods',
    description:
      'Wiring shall be installed in a workmanlike manner. All equipment shall be installed as intended by the manufacturer.',
  },

  // Section 4 — Conductors
  {
    ruleNumber: '4-004',
    title: 'Minimum Size of Conductors',
    description:
      'Minimum conductor size is 14 AWG copper or 12 AWG aluminum for branch circuits. 12 AWG minimum for circuits over 15A.',
  },
  {
    ruleNumber: '4-006',
    title: 'Conductor Ampacity',
    description:
      'Conductor ampacity shall be determined from Tables 1-4, adjusted for temperature (Table 5A) and bundling (Table 5C).',
  },
  {
    ruleNumber: '4-028',
    title: 'Conductor Color Identification',
    description:
      'White/grey for neutral, green for ground, orange for high leg delta. Other colours for ungrounded conductors.',
  },

  // Section 6 — Services and Service Equipment
  {
    ruleNumber: '6-104',
    title: 'Minimum Service Size',
    description:
      'Minimum 100A service for single dwellings. Service conductors sized per demand calculation.',
  },
  {
    ruleNumber: '6-206',
    title: 'Clearance of Service Mast',
    description:
      'Service mast requirements and minimum clearances above grade and from building surfaces.',
  },
  {
    ruleNumber: '6-302',
    title: 'Grounding of Service Equipment',
    description:
      'Service equipment shall be grounded. Grounding electrode conductor sized per Table 17.',
  },

  // Section 8 — Circuit Loading and Demand
  {
    ruleNumber: '8-104',
    title: 'Maximum Circuit Loading',
    description:
      'Continuous loads shall not exceed 80% of the rating of the overcurrent device. Non-continuous loads may use 100%.',
  },
  {
    ruleNumber: '8-200',
    title: 'Residential Demand Calculation',
    description:
      'Method for calculating demand load for single dwellings: 5000W base + 1000W per 90m2 beyond first 90m2, with demand factors applied.',
  },
  {
    ruleNumber: '8-202',
    title: 'Multi-Dwelling Demand',
    description:
      'Demand factors for multi-unit residential buildings. Apply diversity factors based on number of units.',
  },
  {
    ruleNumber: '8-210',
    title: 'Commercial/Industrial Demand',
    description:
      'Demand calculation for commercial and industrial installations using connected load with applicable demand factors.',
  },

  // Section 10 — Grounding and Bonding
  {
    ruleNumber: '10-106',
    title: 'Grounding Electrode',
    description:
      'A grounding electrode is required at each service. Water pipe, ground rod, or building steel may be used.',
  },
  {
    ruleNumber: '10-114',
    title: 'Bonding Conductor Size',
    description:
      'System bonding jumper and equipment bonding conductor sizes per Table 16.',
  },
  {
    ruleNumber: '10-204',
    title: 'Grounding Electrode Conductor',
    description:
      'Grounding electrode conductor shall be sized from Table 17 based on the size of the largest service conductor.',
  },
  {
    ruleNumber: '10-814',
    title: 'Equipment Bonding Conductor in Raceway',
    description:
      'Equipment bonding conductor shall be sized per Table 16 and installed with circuit conductors.',
  },

  // Section 12 — Wiring Methods
  {
    ruleNumber: '12-100',
    title: 'Cable Installation',
    description:
      'Cables shall be supported, protected, and installed per code requirements. NMD90 not in exposed locations subject to damage.',
  },
  {
    ruleNumber: '12-506',
    title: 'NMD90 Cable',
    description:
      'Non-metallic sheathed cable (Loomex): not permitted in commercial buildings above 3 stories. Must be protected from physical damage.',
  },
  {
    ruleNumber: '12-910',
    title: 'Conduit Fill',
    description:
      '1 wire: 53%, 2 wires: 31%, 3+ wires: 40% maximum fill. Refer to Tables 8 and 9 for conductor and conduit areas.',
  },
  {
    ruleNumber: '12-1014',
    title: 'Number of Bends',
    description:
      'Maximum 360 degrees of bends (total) between pull points in a conduit run. Includes all offsets and kicks.',
  },
  {
    ruleNumber: '12-3034',
    title: 'Box Fill',
    description:
      'Box volume must accommodate all conductors, devices, clamps, and fittings. Refer to Tables 22 and 23.',
  },

  // Section 14 — Protection and Control
  {
    ruleNumber: '14-100',
    title: 'Overcurrent Protection',
    description:
      'Conductors shall be protected at their ampacity. Standard overcurrent device sizes in Table 13.',
  },
  {
    ruleNumber: '14-104',
    title: 'Standard OCP Sizes',
    description:
      'Next higher standard OCP size is permitted when ampacity of conductor does not match a standard rating (with conditions).',
  },

  // Section 26 — Installation of Electrical Equipment
  {
    ruleNumber: '26-244',
    title: 'Receptacle Circuits in Dwellings',
    description:
      'Receptacle outlets in kitchens, dining rooms, and similar areas shall be supplied by at least 2 branch circuits (split or dedicated).',
  },
  {
    ruleNumber: '26-252',
    title: 'Transformer Overcurrent Protection',
    description:
      'Primary OCP: max 300% (up to 6% impedance) or 250% (over 6%). Secondary OCP may be required. Use next LOWER standard size.',
  },
  {
    ruleNumber: '26-700',
    title: 'Receptacle Outlets Required',
    description:
      'Receptacles required every 1.8m along wall space in dwelling units. Kitchen counters require receptacles per Rule 26-712.',
  },
  {
    ruleNumber: '26-710',
    title: 'GFCI Protection',
    description:
      'GFCI required for: bathrooms, outdoors, garages, unfinished basements, within 1.5m of sinks, kitchen counters, and hot tubs.',
  },
  {
    ruleNumber: '26-712',
    title: 'Kitchen Counter Receptacles',
    description:
      'Wall counter space wider than 300mm shall have a receptacle. No point along counter to be more than 900mm from a receptacle.',
  },
  {
    ruleNumber: '26-724',
    title: 'Bathroom Receptacles',
    description:
      'At least one receptacle within 1m of each basin. Must be GFCI protected. Dedicated circuit recommended.',
  },

  // Section 28 — Motors
  {
    ruleNumber: '28-106',
    title: 'Motor Branch Circuit Conductors',
    description:
      'Motor branch circuit conductors shall have ampacity of at least 125% of the motor FLC from Tables 44, 45, or 46.',
  },
  {
    ruleNumber: '28-200',
    title: 'Motor Overcurrent Protection',
    description:
      'Running overload protection: max 125% of motor FLC for motors with service factor 1.15 or greater.',
  },
  {
    ruleNumber: '28-210',
    title: 'Motor Branch Circuit OCP',
    description:
      'Branch circuit short-circuit and ground-fault protection sized per Table 29. Next higher standard size permitted.',
  },

  // Section 30 — Special Installations
  {
    ruleNumber: '30-004',
    title: 'Swimming Pool Wiring',
    description:
      'Special requirements for pools: GFCI protection, bonding grid, minimum clearances, and equipment distance requirements.',
  },
  {
    ruleNumber: '30-100',
    title: 'Hot Tub/Spa Requirements',
    description:
      'GFCI protection required. Dedicated branch circuit. Specific bonding and clearance requirements.',
  },

  // Section 32 — Fire Alarm Systems
  {
    ruleNumber: '32-100',
    title: 'Fire Alarm Systems',
    description:
      'Fire alarm circuits shall be installed in accordance with CAN/ULC-S524. Dedicated circuits required.',
  },

  // Section 46 — Emergency Systems
  {
    ruleNumber: '46-100',
    title: 'Emergency Power',
    description:
      'Emergency systems shall provide automatic connection to alternate power source within 10 seconds of normal power failure.',
  },

  // Section 64 — Renewable Energy
  {
    ruleNumber: '64-060',
    title: 'Solar PV Disconnecting Means',
    description:
      'Disconnecting means required for PV systems. Must be lockable, accessible, and clearly labelled.',
  },
  {
    ruleNumber: '64-112',
    title: 'PV System Conductor Sizing',
    description:
      'PV source and output circuit conductors sized at 125% of rated short-circuit current (Isc) of PV modules.',
  },

  // Section 86 — Electric Vehicle
  {
    ruleNumber: '86-300',
    title: 'EV Charging Equipment',
    description:
      'EVSE shall be supplied by a dedicated branch circuit. Continuous load: size conductors and OCP at 125% of rated load.',
  },
];

/**
 * Look up a CEC rule by rule number.
 */
export function findRule(ruleNumber: string): CECRule | undefined {
  return COMMON_CEC_RULES.find(
    (r) => r.ruleNumber === ruleNumber
  );
}

/**
 * Search rules by keyword in title or description.
 */
export function searchRules(keyword: string): CECRule[] {
  const lowerKeyword = keyword.toLowerCase();
  return COMMON_CEC_RULES.filter(
    (r) =>
      r.title.toLowerCase().includes(lowerKeyword) ||
      r.description.toLowerCase().includes(lowerKeyword) ||
      r.ruleNumber.includes(keyword)
  );
}
