/**
 * CEC Table 46 — Full-Load Current for DC Motors
 *
 * Full-load current in amperes for DC motors at 120V and 240V.
 *
 * Canadian Electrical Code, Part I
 *
 * Note: These are code values used for sizing conductors and
 * overcurrent protection. Actual motor nameplate current may differ.
 */

import type { MotorFLCRow } from '../types';

export const TABLE_46_DC_FLC: MotorFLCRow[] = [
  { hp: 0.25, voltages: { 120: 3.1, 240: 1.6 } },
  { hp: 1 / 3, voltages: { 120: 4.1, 240: 2.0 } },
  { hp: 0.5, voltages: { 120: 5.4, 240: 2.7 } },
  { hp: 0.75, voltages: { 120: 7.6, 240: 3.8 } },
  { hp: 1, voltages: { 120: 9.5, 240: 4.7 } },
  { hp: 1.5, voltages: { 120: 13.2, 240: 6.6 } },
  { hp: 2, voltages: { 120: 17.0, 240: 8.5 } },
  { hp: 3, voltages: { 120: 25.0, 240: 12.2 } },
  { hp: 5, voltages: { 120: 40.0, 240: 20.0 } },
  { hp: 7.5, voltages: { 120: 58.0, 240: 29.0 } },
  { hp: 10, voltages: { 120: 76.0, 240: 38.0 } },
  { hp: 15, voltages: { 240: 55.0 } },
  { hp: 20, voltages: { 240: 72.0 } },
  { hp: 25, voltages: { 240: 89.0 } },
  { hp: 30, voltages: { 240: 106.0 } },
  { hp: 40, voltages: { 240: 140.0 } },
  { hp: 50, voltages: { 240: 173.0 } },
  { hp: 60, voltages: { 240: 206.0 } },
  { hp: 75, voltages: { 240: 255.0 } },
  { hp: 100, voltages: { 240: 341.0 } },
  { hp: 125, voltages: { 240: 425.0 } },
  { hp: 150, voltages: { 240: 506.0 } },
  { hp: 200, voltages: { 240: 675.0 } },
];

/**
 * DC HP display labels for UI purposes.
 */
export const DC_HP_LABELS: Record<number, string> = {
  0.25: '1/4',
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
  15: '15',
  20: '20',
  25: '25',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  75: '75',
  100: '100',
  125: '125',
  150: '150',
  200: '200',
};

/**
 * Look up DC motor FLC by HP and voltage.
 */
export function getDCMotorFLC(
  hp: number,
  voltage: number
): number | undefined {
  const row = TABLE_46_DC_FLC.find((r) => Math.abs(r.hp - hp) < 0.001);
  if (!row) return undefined;
  return row.voltages[voltage];
}
