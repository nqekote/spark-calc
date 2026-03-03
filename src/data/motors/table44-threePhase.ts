/**
 * CEC Table 44 — Full-Load Current for Three-Phase AC Motors
 *
 * Full-load current in amperes for squirrel-cage and wound-rotor
 * induction motors at various voltages.
 *
 * Canadian Electrical Code, Part I
 *
 * Note: These are code values used for sizing conductors and
 * overcurrent protection. Actual motor nameplate current may differ.
 */

import type { MotorFLCRow } from '../types';

export const TABLE_44_THREE_PHASE_FLC: MotorFLCRow[] = [
  { hp: 0.5, voltages: { 200: 2.5, 208: 2.4, 230: 2.2, 460: 1.1, 575: 0.9 } },
  { hp: 0.75, voltages: { 200: 3.7, 208: 3.5, 230: 3.2, 460: 1.6, 575: 1.3 } },
  { hp: 1, voltages: { 200: 4.8, 208: 4.6, 230: 4.2, 460: 2.1, 575: 1.7 } },
  { hp: 1.5, voltages: { 200: 6.9, 208: 6.6, 230: 6.0, 460: 3.0, 575: 2.4 } },
  { hp: 2, voltages: { 200: 7.8, 208: 7.5, 230: 6.8, 460: 3.4, 575: 2.7 } },
  { hp: 3, voltages: { 200: 11.0, 208: 10.6, 230: 9.6, 460: 4.8, 575: 3.9 } },
  { hp: 5, voltages: { 200: 17.5, 208: 16.7, 230: 15.2, 460: 7.6, 575: 6.1 } },
  { hp: 7.5, voltages: { 200: 25.3, 208: 24.2, 230: 22.0, 460: 11.0, 575: 9.0 } },
  { hp: 10, voltages: { 200: 32.2, 208: 30.8, 230: 28.0, 460: 14.0, 575: 11.0 } },
  { hp: 15, voltages: { 200: 48.3, 208: 46.2, 230: 42.0, 460: 21.0, 575: 17.0 } },
  { hp: 20, voltages: { 200: 62.1, 208: 59.4, 230: 54.0, 460: 27.0, 575: 22.0 } },
  { hp: 25, voltages: { 200: 78.2, 208: 74.8, 230: 68.0, 460: 34.0, 575: 27.0 } },
  { hp: 30, voltages: { 200: 92.0, 208: 88.0, 230: 80.0, 460: 40.0, 575: 32.0 } },
  { hp: 40, voltages: { 200: 120.0, 208: 114.0, 230: 104.0, 460: 52.0, 575: 41.0 } },
  { hp: 50, voltages: { 200: 150.0, 208: 143.0, 230: 130.0, 460: 65.0, 575: 52.0 } },
  { hp: 60, voltages: { 200: 177.0, 208: 169.0, 230: 154.0, 460: 77.0, 575: 62.0 } },
  { hp: 75, voltages: { 200: 221.0, 208: 211.0, 230: 192.0, 460: 96.0, 575: 77.0 } },
  { hp: 100, voltages: { 200: 285.0, 208: 273.0, 230: 248.0, 460: 124.0, 575: 99.0 } },
  { hp: 125, voltages: { 200: 359.0, 208: 343.0, 230: 312.0, 460: 156.0, 575: 125.0 } },
  { hp: 150, voltages: { 200: 414.0, 208: 396.0, 230: 360.0, 460: 180.0, 575: 144.0 } },
  { hp: 200, voltages: { 200: 552.0, 208: 528.0, 230: 480.0, 460: 240.0, 575: 192.0 } },
];

/**
 * Look up three-phase motor FLC by HP and voltage.
 */
export function getThreePhaseMotorFLC(
  hp: number,
  voltage: number
): number | undefined {
  const row = TABLE_44_THREE_PHASE_FLC.find((r) => r.hp === hp);
  if (!row) return undefined;
  return row.voltages[voltage];
}
