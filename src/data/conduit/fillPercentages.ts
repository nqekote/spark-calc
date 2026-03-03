/**
 * CEC Section 12 — Conduit Fill Percentages
 *
 * Maximum percentage of the conduit internal cross-sectional area
 * that may be occupied by conductors (including insulation).
 *
 * Canadian Electrical Code, Part I, Rule 12-910
 */

/** Fill percentage for 1 conductor in conduit */
export const FILL_1_WIRE = 53;

/** Fill percentage for 2 conductors in conduit */
export const FILL_2_WIRES = 31;

/** Fill percentage for 3 or more conductors in conduit */
export const FILL_3_PLUS_WIRES = 40;

/**
 * Get the maximum fill percentage based on the number of conductors.
 */
export function getConduitFillPercent(numberOfConductors: number): number {
  if (numberOfConductors <= 0) return 0;
  if (numberOfConductors === 1) return FILL_1_WIRE;
  if (numberOfConductors === 2) return FILL_2_WIRES;
  return FILL_3_PLUS_WIRES;
}

/**
 * Calculate the maximum usable area inside a conduit given the
 * conduit internal area and number of conductors.
 */
export function getUsableConduitArea(
  conduitInternalAreaMM2: number,
  numberOfConductors: number
): number {
  const fillPercent = getConduitFillPercent(numberOfConductors);
  return conduitInternalAreaMM2 * (fillPercent / 100);
}
