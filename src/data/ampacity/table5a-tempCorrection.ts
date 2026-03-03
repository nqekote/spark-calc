/**
 * CEC Table 5A — Ambient Temperature Correction Factors
 *
 * Correction factors for conductor ampacity when ambient temperature
 * differs from the 30°C base. Multiply the ampacity from Table 2 or
 * Table 4 by the appropriate factor.
 *
 * Canadian Electrical Code, Part I
 */

import type { TempCorrectionRow } from '../types';

export const TABLE_5A_TEMP_CORRECTION: TempCorrectionRow[] = [
  {
    ambientRange: '1-10',
    ambientLow: 1,
    ambientHigh: 10,
    factor60: 1.26,
    factor75: 1.20,
    factor90: 1.15,
  },
  {
    ambientRange: '11-20',
    ambientLow: 11,
    ambientHigh: 20,
    factor60: 1.15,
    factor75: 1.11,
    factor90: 1.08,
  },
  {
    ambientRange: '21-25',
    ambientLow: 21,
    ambientHigh: 25,
    factor60: 1.08,
    factor75: 1.05,
    factor90: 1.04,
  },
  {
    ambientRange: '26-30',
    ambientLow: 26,
    ambientHigh: 30,
    factor60: 1.00,
    factor75: 1.00,
    factor90: 1.00,
  },
  {
    ambientRange: '31-35',
    ambientLow: 31,
    ambientHigh: 35,
    factor60: 0.91,
    factor75: 0.94,
    factor90: 0.96,
  },
  {
    ambientRange: '36-40',
    ambientLow: 36,
    ambientHigh: 40,
    factor60: 0.82,
    factor75: 0.88,
    factor90: 0.91,
  },
  {
    ambientRange: '41-45',
    ambientLow: 41,
    ambientHigh: 45,
    factor60: 0.71,
    factor75: 0.82,
    factor90: 0.87,
  },
  {
    ambientRange: '46-50',
    ambientLow: 46,
    ambientHigh: 50,
    factor60: 0.58,
    factor75: 0.75,
    factor90: 0.82,
  },
  {
    ambientRange: '51-55',
    ambientLow: 51,
    ambientHigh: 55,
    factor60: 0.41,
    factor75: 0.67,
    factor90: 0.76,
  },
  {
    ambientRange: '56-60',
    ambientLow: 56,
    ambientHigh: 60,
    factor60: 0.00,
    factor75: 0.58,
    factor90: 0.71,
  },
  {
    ambientRange: '61-70',
    ambientLow: 61,
    ambientHigh: 70,
    factor60: 0.00,
    factor75: 0.33,
    factor90: 0.58,
  },
];

/**
 * Get the temperature correction factor for a given ambient temperature
 * and conductor temperature rating.
 */
export function getTempCorrectionFactor(
  ambientTempC: number,
  tempRating: '60' | '75' | '90'
): number | undefined {
  const row = TABLE_5A_TEMP_CORRECTION.find(
    (r) => ambientTempC >= r.ambientLow && ambientTempC <= r.ambientHigh
  );
  if (!row) return undefined;
  switch (tempRating) {
    case '60':
      return row.factor60;
    case '75':
      return row.factor75;
    case '90':
      return row.factor90;
  }
}
