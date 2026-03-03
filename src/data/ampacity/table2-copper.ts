/**
 * CEC Table 2 — Allowable Ampacities for Not More Than 3 Copper
 * Conductors in Raceway or Cable (Based on Ambient Temperature of 30°C)
 *
 * Canadian Electrical Code, Part I
 * Columns: 60°C (TW, NMW), 75°C (RW75, T90 derated), 90°C (T90, RW90)
 */

import type { AmpacityRow } from '../types';

export const TABLE_2_COPPER_AMPACITY: AmpacityRow[] = [
  { size: '14', temp60: 15, temp75: 15, temp90: 15 },
  { size: '12', temp60: 20, temp75: 20, temp90: 25 },
  { size: '10', temp60: 30, temp75: 30, temp90: 35 },
  { size: '8', temp60: 40, temp75: 45, temp90: 50 },
  { size: '6', temp60: 55, temp75: 65, temp90: 70 },
  { size: '4', temp60: 70, temp75: 85, temp90: 90 },
  { size: '3', temp60: 80, temp75: 100, temp90: 105 },
  { size: '2', temp60: 95, temp75: 115, temp90: 120 },
  { size: '1', temp60: 110, temp75: 130, temp90: 140 },
  { size: '1/0', temp60: 125, temp75: 150, temp90: 155 },
  { size: '2/0', temp60: 145, temp75: 175, temp90: 185 },
  { size: '3/0', temp60: 165, temp75: 200, temp90: 210 },
  { size: '4/0', temp60: 195, temp75: 230, temp90: 245 },
  { size: '250', temp60: 215, temp75: 255, temp90: 270 },
  { size: '300', temp60: 240, temp75: 285, temp90: 300 },
  { size: '350', temp60: 260, temp75: 310, temp90: 330 },
  { size: '400', temp60: 280, temp75: 335, temp90: 355 },
  { size: '500', temp60: 320, temp75: 380, temp90: 405 },
  { size: '600', temp60: 355, temp75: 420, temp90: 455 },
  { size: '750', temp60: 400, temp75: 475, temp90: 515 },
  { size: '1000', temp60: 455, temp75: 545, temp90: 590 },
  { size: '1250', temp60: 495, temp75: 590, temp90: 645 },
  { size: '1500', temp60: 525, temp75: 625, temp90: 700 },
  { size: '1750', temp60: 545, temp75: 650, temp90: 735 },
  { size: '2000', temp60: 555, temp75: 665, temp90: 775 },
];

/**
 * Lookup ampacity by wire size and temperature rating.
 */
export function getCopperAmpacity(
  size: string,
  tempRating: '60' | '75' | '90'
): number | undefined {
  const row = TABLE_2_COPPER_AMPACITY.find((r) => r.size === size);
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
