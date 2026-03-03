/**
 * CEC Rule 26-252 — Transformer Overcurrent Protection
 *
 * Maximum overcurrent protection for transformer primary and
 * secondary windings based on impedance and configuration.
 *
 * Canadian Electrical Code, Part I
 *
 * General rules:
 * - Primary protection is always required
 * - Secondary protection may be omitted if primary device is
 *   sized within the specified percentages
 * - If calculated OCP does not match a standard size, the next
 *   lower standard size must be used (not next higher)
 */

import type { TransformerOCPRule } from '../types';

export const TRANSFORMER_OCP_RULES: TransformerOCPRule[] = [
  {
    impedanceRange: 'Up to 6%',
    primaryMaxPercent: 300,
    secondaryMaxPercent: 250,
    notes:
      'Standard transformers. Primary: max 300% of primary FLC. Secondary: max 250% of secondary FLC if primary is protected at 300% or less.',
  },
  {
    impedanceRange: 'Up to 6% (primary only protection)',
    primaryMaxPercent: 125,
    secondaryMaxPercent: null,
    notes:
      'When primary protection is sized at 125% or less of rated primary current, secondary protection is not required.',
  },
  {
    impedanceRange: 'Over 6% to 10%',
    primaryMaxPercent: 250,
    secondaryMaxPercent: 225,
    notes:
      'Higher impedance transformers. Primary: max 250%. Secondary: max 225% of secondary FLC.',
  },
  {
    impedanceRange: 'Over 6% to 10% (primary only protection)',
    primaryMaxPercent: 125,
    secondaryMaxPercent: null,
    notes:
      'When primary protection is sized at 125% or less, secondary protection is not required.',
  },
];

/**
 * Transformer sizing constants used alongside Rule 26-252.
 */
export const TRANSFORMER_CONSTANTS = {
  /** Minimum conductor ampacity as percent of transformer FLC */
  minConductorAmpacityPercent: 125,

  /** Single-phase transformer FLC formula: I = VA / V */
  /** Three-phase transformer FLC formula: I = VA / (V * sqrt(3)) */
  sqrt3: 1.732,

  /** When calculated OCP exceeds standard size, use next LOWER size */
  ocpRoundingDirection: 'down' as const,
} as const;

/**
 * Calculate transformer full-load current.
 */
export function getTransformerFLC(
  kva: number,
  voltage: number,
  phase: 'single' | 'three'
): number {
  const va = kva * 1000;
  if (phase === 'single') {
    return va / voltage;
  }
  return va / (voltage * TRANSFORMER_CONSTANTS.sqrt3);
}

/**
 * Calculate maximum primary overcurrent protection.
 */
export function getMaxPrimaryOCP(
  primaryFLC: number,
  impedancePercent: number
): number {
  const maxPercent = impedancePercent <= 6 ? 300 : 250;
  return primaryFLC * (maxPercent / 100);
}

/**
 * Calculate maximum secondary overcurrent protection.
 */
export function getMaxSecondaryOCP(
  secondaryFLC: number,
  impedancePercent: number
): number {
  const maxPercent = impedancePercent <= 6 ? 250 : 225;
  return secondaryFLC * (maxPercent / 100);
}
