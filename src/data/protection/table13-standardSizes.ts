/**
 * CEC Table 13 — Standard Overcurrent Device Ratings
 *
 * Standard ampere ratings for fuses and circuit breakers.
 * Per CEC Rule 14-104.
 *
 * Canadian Electrical Code, Part I
 *
 * When a calculated overcurrent protection value does not correspond
 * to a standard size, use:
 * - Next HIGHER standard size for motor branch circuits (Rule 28-210)
 * - Next LOWER standard size for transformers (Rule 26-252)
 * - Next HIGHER standard size for general conductor protection,
 *   only if the calculated value does not exceed the next higher
 *   standard rating (Rule 14-104)
 */

export const STANDARD_OVERCURRENT_DEVICE_SIZES: number[] = [
  15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150,
  175, 200, 225, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000,
  1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000,
];

/**
 * Get the next higher standard overcurrent device size.
 * Used for motor branch circuit protection sizing.
 *
 * @param calculatedAmps - Calculated OCP rating
 * @returns Next higher standard size, or undefined if above max
 */
export function getNextHigherStandardSize(
  calculatedAmps: number
): number | undefined {
  return STANDARD_OVERCURRENT_DEVICE_SIZES.find(
    (size) => size >= calculatedAmps
  );
}

/**
 * Get the next lower standard overcurrent device size.
 * Used for transformer overcurrent protection sizing.
 *
 * @param calculatedAmps - Calculated OCP rating
 * @returns Next lower standard size, or undefined if below min
 */
export function getNextLowerStandardSize(
  calculatedAmps: number
): number | undefined {
  const candidates = STANDARD_OVERCURRENT_DEVICE_SIZES.filter(
    (size) => size <= calculatedAmps
  );
  return candidates.length > 0
    ? candidates[candidates.length - 1]
    : undefined;
}

/**
 * Check if a given size is a standard overcurrent device rating.
 */
export function isStandardSize(size: number): boolean {
  return STANDARD_OVERCURRENT_DEVICE_SIZES.includes(size);
}

/**
 * Get all standard sizes within a range (inclusive).
 */
export function getStandardSizesInRange(
  min: number,
  max: number
): number[] {
  return STANDARD_OVERCURRENT_DEVICE_SIZES.filter(
    (size) => size >= min && size <= max
  );
}
