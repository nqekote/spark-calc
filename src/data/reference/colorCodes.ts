/**
 * Canadian Wire Color Codes
 *
 * Standard conductor color identification per CEC Rule 4-028
 * and CSA standards. Used across Ontario and all Canadian provinces.
 *
 * Canadian Electrical Code, Part I
 */

import type { WireColorCode } from '../types';

/**
 * Single-phase 120/240V (split phase) wire colors.
 */
export const SINGLE_PHASE_120_240V: WireColorCode[] = [
  { conductor: 'Line 1 (Hot)', color: 'Black' },
  { conductor: 'Line 2 (Hot)', color: 'Red' },
  { conductor: 'Neutral', color: 'White' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * Three-phase 120/208V (Wye) wire colors — Canadian standard.
 */
export const THREE_PHASE_120_208V_WYE: WireColorCode[] = [
  { conductor: 'Phase A', color: 'Red' },
  { conductor: 'Phase B', color: 'Black' },
  { conductor: 'Phase C', color: 'Blue' },
  { conductor: 'Neutral', color: 'White' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * Three-phase 347/600V (Wye) wire colors — Canadian standard.
 */
export const THREE_PHASE_347_600V_WYE: WireColorCode[] = [
  { conductor: 'Phase A', color: 'Red' },
  { conductor: 'Phase B', color: 'Black' },
  { conductor: 'Phase C', color: 'Blue' },
  { conductor: 'Neutral', color: 'White' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * Three-phase 240V Delta wire colors — Canadian standard.
 */
export const THREE_PHASE_240V_DELTA: WireColorCode[] = [
  { conductor: 'Phase A', color: 'Red' },
  { conductor: 'Phase B', color: 'Black' },
  { conductor: 'Phase C', color: 'Blue' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * High-leg delta (120/240V 4-wire delta) wire colors.
 * The high leg (wild leg, stinger) is Phase B.
 */
export const HIGH_LEG_DELTA: WireColorCode[] = [
  { conductor: 'Phase A', color: 'Red' },
  { conductor: 'Phase B (High Leg)', color: 'Orange' },
  { conductor: 'Phase C', color: 'Blue' },
  { conductor: 'Neutral', color: 'White' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * DC circuit wire colors.
 */
export const DC_CIRCUITS: WireColorCode[] = [
  { conductor: 'Positive (+)', color: 'Red' },
  { conductor: 'Negative (-)', color: 'Black' },
  { conductor: 'Ground', color: 'Green or Bare' },
];

/**
 * Isolated ground wire color.
 */
export const ISOLATED_GROUND: WireColorCode = {
  conductor: 'Isolated Ground',
  color: 'Green with Yellow Stripe',
};

/**
 * Traveller wires (3-way and 4-way switching).
 */
export const TRAVELLERS: WireColorCode[] = [
  { conductor: 'Traveller 1', color: 'Red' },
  { conductor: 'Traveller 2', color: 'Blue (or other color)' },
];

/**
 * CEC Rule 4-028 key requirements summary.
 */
export const COLOR_CODE_RULES = {
  rule: '4-028',
  requirements: [
    'White or grey conductors shall be used only for identified (neutral/grounded) conductors',
    'Green conductors (with or without yellow stripe) shall be used only for bonding/grounding',
    'Orange shall identify the high leg of a 4-wire delta system',
    'Bare conductors may be used for bonding/grounding',
    'Where conductors of different systems are in the same raceway, each system must be distinguishable',
  ],
} as const;

/**
 * All color code configurations for easy access.
 */
export const ALL_COLOR_CODES = {
  singlePhase120_240V: SINGLE_PHASE_120_240V,
  threePhase120_208V: THREE_PHASE_120_208V_WYE,
  threePhase347_600V: THREE_PHASE_347_600V_WYE,
  threePhase240VDelta: THREE_PHASE_240V_DELTA,
  highLegDelta: HIGH_LEG_DELTA,
  dc: DC_CIRCUITS,
} as const;
