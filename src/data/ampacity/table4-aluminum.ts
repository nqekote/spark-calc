/**
 * CEC Table 4 — Allowable Ampacities for Not More Than 3 Aluminum
 * Conductors in Raceway or Cable (Based on Ambient Temperature of 30°C)
 *
 * Canadian Electrical Code, Part I
 * Columns: 60°C, 75°C, 90°C
 *
 * Note: Aluminum is not available in 14 AWG for branch circuits.
 */

import type { AmpacityRow } from '../types';

export const TABLE_4_ALUMINUM_AMPACITY: AmpacityRow[] = [
  { size: '12', temp60: 15, temp75: 15, temp90: 20 },
  { size: '10', temp60: 25, temp75: 25, temp90: 30 },
  { size: '8', temp60: 30, temp75: 35, temp90: 40 },
  { size: '6', temp60: 40, temp75: 50, temp90: 55 },
  { size: '4', temp60: 55, temp75: 65, temp90: 70 },
  { size: '3', temp60: 65, temp75: 75, temp90: 80 },
  { size: '2', temp60: 75, temp75: 90, temp90: 95 },
  { size: '1', temp60: 85, temp75: 100, temp90: 110 },
  { size: '1/0', temp60: 100, temp75: 120, temp90: 125 },
  { size: '2/0', temp60: 115, temp75: 135, temp90: 145 },
  { size: '3/0', temp60: 130, temp75: 155, temp90: 165 },
  { size: '4/0', temp60: 155, temp75: 180, temp90: 195 },
  { size: '250', temp60: 170, temp75: 205, temp90: 215 },
  { size: '300', temp60: 190, temp75: 230, temp90: 240 },
  { size: '350', temp60: 210, temp75: 250, temp90: 265 },
  { size: '400', temp60: 225, temp75: 270, temp90: 285 },
  { size: '500', temp60: 260, temp75: 310, temp90: 330 },
  { size: '600', temp60: 285, temp75: 340, temp90: 370 },
  { size: '750', temp60: 320, temp75: 385, temp90: 410 },
  { size: '1000', temp60: 375, temp75: 445, temp90: 480 },
  { size: '1250', temp60: 405, temp75: 485, temp90: 530 },
  { size: '1500', temp60: 435, temp75: 520, temp90: 580 },
  { size: '1750', temp60: 455, temp75: 545, temp90: 615 },
  { size: '2000', temp60: 470, temp75: 560, temp90: 650 },
];

/**
 * Lookup ampacity by wire size and temperature rating.
 */
export function getAluminumAmpacity(
  size: string,
  tempRating: '60' | '75' | '90'
): number | undefined {
  const row = TABLE_4_ALUMINUM_AMPACITY.find((r) => r.size === size);
  if (!row) return undefined;
  switch (tempRating) {
    case '60':
      return row.temp60;
    case '75':
      return row.temp75;
    case '90':
      return row.temp90;
  }
}
