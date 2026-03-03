/**
 * CEC Table 45 — Full-Load Current for Single-Phase AC Motors
 *
 * Full-load current in amperes for single-phase motors at 115V and 230V.
 *
 * Canadian Electrical Code, Part I
 *
 * Note: These are code values used for sizing conductors and
 * overcurrent protection. Actual motor nameplate current may differ.
 */

import type { MotorFLCRow } from '../types';

export const TABLE_45_SINGLE_PHASE_FLC: MotorFLCRow[] = [
  { hp: 1 / 6, voltages: { 115: 4.4, 230: 2.2 } },
  { hp: 1 / 4, voltages: { 115: 5.8, 230: 2.9 } },
  { hp: 1 / 3, voltages: { 115: 7.2, 230: 3.6 } },
  { hp: 0.5, voltages: { 115: 9.8, 230: 4.9 } },
  { hp: 0.75, voltages: { 115: 13.8, 230: 6.9 } },
  { hp: 1, voltages: { 115: 16.0, 230: 8.0 } },
  { hp: 1.5, voltages: { 115: 20.0, 230: 10.0 } },
  { hp: 2, voltages: { 115: 24.0, 230: 12.0 } },
  { hp: 3, voltages: { 115: 34.0, 230: 17.0 } },
  { hp: 5, voltages: { 115: 56.0, 230: 28.0 } },
  { hp: 7.5, voltages: { 115: 80.0, 230: 40.0 } },
  { hp: 10, voltages: { 115: 100.0, 230: 50.0 } },
];

/**
 * Fractional HP display labels for UI purposes.
 */
export const SINGLE_PHASE_HP_LABELS: Record<number, string> = {
  [1 / 6]: '1/6',
  [1 / 4]: '1/4',
  [1 / 3]: '1/3',
  0.5: '1/2',
  0.75: '3/4',
  1: '1',
  1.5: '1-1/2',
  2: '2',
  3: '3',
  5: '5',
  7.5: '7-1/2',
  10: '10',
};

/**
 * Look up single-phase motor FLC by HP and voltage.
 */
export function getSinglePhaseMotorFLC(
  hp: number,
  voltage: number
): number | undefined {
  const row = TABLE_45_SINGLE_PHASE_FLC.find((r) => Math.abs(r.hp - hp) < 0.001);
  if (!row) return undefined;
  return row.voltages[voltage];
}
