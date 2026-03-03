/**
 * EMT Bending Reference Data
 *
 * Multipliers, shrinkage values, stub deducts, and gain constants
 * used for conduit bending calculations.
 *
 * These values are standard for hand benders and are used
 * across the Canadian electrical trade.
 */

import type { BendMultiplier, StubDeduct } from '../types';

/**
 * Offset bend multipliers and shrinkage values.
 *
 * To calculate the distance between bends for an offset:
 *   Distance = Offset Depth x Multiplier
 *
 * Shrinkage is the amount the conduit "loses" in overall length
 * for each inch of offset depth.
 */
export const OFFSET_MULTIPLIERS: BendMultiplier[] = [
  {
    angleDegrees: 10,
    multiplier: 5.76,
    shrinkagePerInch: 1 / 16,
    shrinkageDescription: '1/16" per inch of offset',
  },
  {
    angleDegrees: 15,
    multiplier: 3.86,
    shrinkagePerInch: 1 / 8,
    shrinkageDescription: '1/8" per inch of offset',
  },
  {
    angleDegrees: 22.5,
    multiplier: 2.61,
    shrinkagePerInch: 3 / 16,
    shrinkageDescription: '3/16" per inch of offset',
  },
  {
    angleDegrees: 30,
    multiplier: 2.0,
    shrinkagePerInch: 1 / 4,
    shrinkageDescription: '1/4" per inch of offset',
  },
  {
    angleDegrees: 45,
    multiplier: 1.41,
    shrinkagePerInch: 3 / 8,
    shrinkageDescription: '3/8" per inch of offset',
  },
  {
    angleDegrees: 60,
    multiplier: 1.15,
    shrinkagePerInch: 1 / 2,
    shrinkageDescription: '1/2" per inch of offset',
  },
];

/**
 * Stub-up deduct values by EMT trade size.
 *
 * When making a 90-degree stub-up bend, subtract this value from the
 * desired stub height to determine where to place the bender mark.
 */
export const STUB_DEDUCTS: StubDeduct[] = [
  { tradeSize: '1/2', deductInches: 5 },
  { tradeSize: '3/4', deductInches: 6 },
  { tradeSize: '1', deductInches: 8 },
  { tradeSize: '1-1/4', deductInches: 11 },
];

/**
 * Gain per 90-degree bend by EMT trade size.
 *
 * Gain is the difference between the outside radius arc and the
 * straight conduit lengths. Used for back-to-back and segmented bends.
 */
export const GAIN_PER_90: Record<string, number> = {
  '1/2': 3,
  '3/4': 3.75,
  '1': 4.5,
  '1-1/4': 5.75,
};

/**
 * Developed length of a 90-degree bend (center-line radius arc length).
 */
export const DEVELOPED_LENGTH_90: Record<string, number> = {
  '1/2': 5.0,
  '3/4': 6.0,
  '1': 8.0,
  '1-1/4': 10.0,
};

/**
 * Minimum bending radius per CEC (inside edge of bend).
 * Values in mm for each EMT trade size.
 */
export const MIN_BENDING_RADIUS_MM: Record<string, number> = {
  '1/2': 101.6,
  '3/4': 114.3,
  '1': 139.7,
  '1-1/4': 184.2,
  '1-1/2': 209.6,
  '2': 241.3,
};

/**
 * Degrees of bend per inch of conduit in the bender shoe.
 * Approximate values for common hand benders.
 */
export const DEGREES_PER_INCH: Record<string, number> = {
  '1/2': 15,
  '3/4': 12,
  '1': 9,
  '1-1/4': 7.5,
};

/**
 * Get offset multiplier for a given angle.
 */
export function getOffsetMultiplier(angleDegrees: number): number | undefined {
  const row = OFFSET_MULTIPLIERS.find((r) => r.angleDegrees === angleDegrees);
  return row?.multiplier;
}

/**
 * Get shrinkage per inch of offset depth for a given angle.
 */
export function getShrinkagePerInch(angleDegrees: number): number | undefined {
  const row = OFFSET_MULTIPLIERS.find((r) => r.angleDegrees === angleDegrees);
  return row?.shrinkagePerInch;
}

/**
 * Get stub deduct for a given EMT trade size.
 */
export function getStubDeduct(tradeSize: string): number | undefined {
  const row = STUB_DEDUCTS.find((r) => r.tradeSize === tradeSize);
  return row?.deductInches;
}

/**
 * Calculate the distance between bends for an offset.
 *
 * @param offsetDepthInches - Depth of the offset in inches
 * @param angleDegrees - Bend angle in degrees
 * @returns Distance between marks in inches, or undefined if angle not found
 */
export function calculateOffsetDistance(
  offsetDepthInches: number,
  angleDegrees: number
): number | undefined {
  const multiplier = getOffsetMultiplier(angleDegrees);
  if (multiplier === undefined) return undefined;
  return offsetDepthInches * multiplier;
}

/**
 * Calculate the shrinkage (total shortening) for an offset.
 *
 * @param offsetDepthInches - Depth of the offset in inches
 * @param angleDegrees - Bend angle in degrees
 * @returns Total shrinkage in inches, or undefined if angle not found
 */
export function calculateOffsetShrinkage(
  offsetDepthInches: number,
  angleDegrees: number
): number | undefined {
  const shrink = getShrinkagePerInch(angleDegrees);
  if (shrink === undefined) return undefined;
  return offsetDepthInches * shrink;
}
