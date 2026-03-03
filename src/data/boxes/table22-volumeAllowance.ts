/**
 * CEC Table 22 — Volume of Free Space Required Per Conductor
 *
 * Volume allowance in cm³ per conductor based on conductor size.
 * Used for box fill calculations per CEC Rule 12-3034.
 *
 * Canadian Electrical Code, Part I
 *
 * Additional allowances required for:
 * - Each clamp assembly: 1 conductor volume (based on largest conductor)
 * - Each support fitting (stud/hickey): 1 conductor volume
 * - Each device (switch/receptacle): 2 conductor volumes
 * - Equipment grounding conductors: 1 conductor volume (largest EGC)
 */

import type { BoxVolumeAllowance } from '../types';

export const TABLE_22_VOLUME_ALLOWANCE: BoxVolumeAllowance[] = [
  { size: '14', volumeCM3: 32.8 },
  { size: '12', volumeCM3: 36.1 },
  { size: '10', volumeCM3: 40.7 },
  { size: '8', volumeCM3: 49.2 },
  { size: '6', volumeCM3: 81.9 },
  { size: '4', volumeCM3: 114.8 },
  { size: '3', volumeCM3: 131.1 },
  { size: '2', volumeCM3: 147.5 },
  { size: '1', volumeCM3: 163.9 },
  { size: '1/0', volumeCM3: 213.5 },
  { size: '2/0', volumeCM3: 245.9 },
  { size: '3/0', volumeCM3: 278.4 },
  { size: '4/0', volumeCM3: 327.8 },
];

/**
 * Get the volume allowance per conductor for a given wire size.
 */
export function getVolumeAllowance(size: string): number | undefined {
  const row = TABLE_22_VOLUME_ALLOWANCE.find((r) => r.size === size);
  return row?.volumeCM3;
}

/**
 * Calculate total box fill required.
 *
 * @param conductors - Array of { size, count } for each conductor size
 * @param clamps - Number of cable clamps in box (counts as 1 of largest size)
 * @param devices - Number of devices (switch/receptacle), each counts as 2 of largest size
 * @param equipGroundingSizes - Array of grounding conductor sizes (counts as 1 of largest)
 */
export function calculateBoxFill(
  conductors: Array<{ size: string; count: number }>,
  clamps: number = 0,
  devices: number = 0,
  equipGroundingSizes: string[] = []
): number {
  let totalVolume = 0;

  // Volume for each conductor
  for (const { size, count } of conductors) {
    const vol = getVolumeAllowance(size);
    if (vol) {
      totalVolume += vol * count;
    }
  }

  // Find the largest conductor volume for clamp/device/grounding allowances
  const allSizes = conductors.map((c) => c.size);
  const largestVolume = Math.max(
    ...allSizes.map((s) => getVolumeAllowance(s) ?? 0)
  );

  // Clamp allowance: 1 x largest conductor volume (regardless of clamp count)
  if (clamps > 0) {
    totalVolume += largestVolume;
  }

  // Device allowance: 2 x largest conductor volume per device
  totalVolume += devices * 2 * largestVolume;

  // Equipment grounding conductor allowance: 1 x largest EGC volume
  if (equipGroundingSizes.length > 0) {
    const largestEGC = Math.max(
      ...equipGroundingSizes.map((s) => getVolumeAllowance(s) ?? 0)
    );
    totalVolume += largestEGC;
  }

  return totalVolume;
}
