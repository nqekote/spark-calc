/**
 * CEC Table 8 — Conductor Cross-Sectional Areas Including Insulation
 *
 * Areas in mm² for various insulation types. Used for conduit fill
 * calculations per CEC Section 12.
 *
 * Canadian Electrical Code, Part I
 *
 * Insulation types:
 * - T90/THHN: Thermoplastic, nylon jacket, 90°C
 * - RW90/XHHW: Cross-linked polyethylene, 90°C, wet/dry
 * - TWN/TW: Thermoplastic, 60°C (larger insulation thickness)
 */

import type { AWGSize } from '../types';

export interface WireAreaRow {
  size: AWGSize;
  /** Bare conductor area in mm² */
  bareConductorMM2: number;
  /** T90 / THHN insulated area in mm² */
  t90AreaMM2: number;
  /** RW90 / XHHW insulated area in mm² */
  rw90AreaMM2: number;
  /** TWN / TW insulated area in mm² (where applicable) */
  twnAreaMM2: number;
}

export const TABLE_8_WIRE_AREAS: WireAreaRow[] = [
  { size: '14', bareConductorMM2: 2.08, t90AreaMM2: 8.97, rw90AreaMM2: 10.68, twnAreaMM2: 11.68 },
  { size: '12', bareConductorMM2: 3.31, t90AreaMM2: 11.20, rw90AreaMM2: 13.00, twnAreaMM2: 14.21 },
  { size: '10', bareConductorMM2: 5.26, t90AreaMM2: 14.52, rw90AreaMM2: 16.67, twnAreaMM2: 18.10 },
  { size: '8', bareConductorMM2: 8.37, t90AreaMM2: 23.61, rw90AreaMM2: 26.42, twnAreaMM2: 30.19 },
  { size: '6', bareConductorMM2: 13.30, t90AreaMM2: 32.71, rw90AreaMM2: 37.94, twnAreaMM2: 42.41 },
  { size: '4', bareConductorMM2: 21.15, t90AreaMM2: 44.71, rw90AreaMM2: 51.87, twnAreaMM2: 58.06 },
  { size: '3', bareConductorMM2: 26.67, t90AreaMM2: 51.87, rw90AreaMM2: 59.46, twnAreaMM2: 66.39 },
  { size: '2', bareConductorMM2: 33.62, t90AreaMM2: 60.06, rw90AreaMM2: 68.26, twnAreaMM2: 75.65 },
  { size: '1', bareConductorMM2: 42.41, t90AreaMM2: 78.26, rw90AreaMM2: 87.42, twnAreaMM2: 97.45 },
  { size: '1/0', bareConductorMM2: 53.49, t90AreaMM2: 93.58, rw90AreaMM2: 103.87, twnAreaMM2: 114.42 },
  { size: '2/0', bareConductorMM2: 67.43, t90AreaMM2: 110.97, rw90AreaMM2: 122.58, twnAreaMM2: 134.06 },
  { size: '3/0', bareConductorMM2: 85.01, t90AreaMM2: 131.55, rw90AreaMM2: 144.52, twnAreaMM2: 157.16 },
  { size: '4/0', bareConductorMM2: 107.2, t90AreaMM2: 157.16, rw90AreaMM2: 171.55, twnAreaMM2: 185.42 },
  { size: '250', bareConductorMM2: 126.7, t90AreaMM2: 182.90, rw90AreaMM2: 198.71, twnAreaMM2: 214.45 },
  { size: '300', bareConductorMM2: 152.0, t90AreaMM2: 212.58, rw90AreaMM2: 229.87, twnAreaMM2: 247.10 },
  { size: '350', bareConductorMM2: 177.3, t90AreaMM2: 240.84, rw90AreaMM2: 259.55, twnAreaMM2: 278.06 },
  { size: '400', bareConductorMM2: 202.7, t90AreaMM2: 268.00, rw90AreaMM2: 288.26, twnAreaMM2: 307.87 },
  { size: '500', bareConductorMM2: 253.4, t90AreaMM2: 324.29, rw90AreaMM2: 346.39, twnAreaMM2: 368.39 },
  { size: '600', bareConductorMM2: 304.0, t90AreaMM2: 382.58, rw90AreaMM2: 407.16, twnAreaMM2: 432.26 },
  { size: '750', bareConductorMM2: 380.0, t90AreaMM2: 463.61, rw90AreaMM2: 490.97, twnAreaMM2: 518.06 },
  { size: '1000', bareConductorMM2: 506.7, t90AreaMM2: 598.65, rw90AreaMM2: 630.19, twnAreaMM2: 661.06 },
];

/**
 * Look up wire area by size and insulation type.
 */
export function getWireArea(
  size: string,
  insulationType: 'T90' | 'RW90' | 'TWN'
): number | undefined {
  const row = TABLE_8_WIRE_AREAS.find((r) => r.size === size);
  if (!row) return undefined;
  switch (insulationType) {
    case 'T90':
      return row.t90AreaMM2;
    case 'RW90':
      return row.rw90AreaMM2;
    case 'TWN':
      return row.twnAreaMM2;
  }
}
