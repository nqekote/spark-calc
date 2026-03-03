/**
 * CEC Table D3 — AC Resistance and Reactance of Conductors
 *
 * Resistance values in ohms per kilometer for copper and aluminum
 * conductors. Used for voltage drop calculations.
 *
 * Canadian Electrical Code, Part I, Appendix D
 *
 * Values are for 75°C conductor temperature in steel (magnetic) conduit.
 * For non-magnetic conduit (PVC, aluminum), reactance values are lower.
 *
 * Voltage drop formula (single phase):
 *   Vd = 2 x I x L x (R cos(theta) + X sin(theta))
 *
 * Voltage drop formula (three phase):
 *   Vd = sqrt(3) x I x L x (R cos(theta) + X sin(theta))
 *
 * Where:
 *   I = current in amps
 *   L = one-way length in km
 *   R = resistance in ohms/km
 *   X = reactance in ohms/km
 *   theta = power factor angle
 */

import type { AWGSize } from '../types';

export interface WireResistanceRow {
  size: AWGSize;
  /** Copper AC resistance in ohms/km at 75°C */
  copperOhmsPerKm: number;
  /** Aluminum AC resistance in ohms/km at 75°C */
  aluminumOhmsPerKm: number;
  /** Reactance in ohms/km (magnetic conduit) */
  reactanceOhmsPerKm: number;
}

export const TABLE_D3_WIRE_RESISTANCE: WireResistanceRow[] = [
  { size: '14', copperOhmsPerKm: 10.1, aluminumOhmsPerKm: 16.6, reactanceOhmsPerKm: 0.190 },
  { size: '12', copperOhmsPerKm: 6.34, aluminumOhmsPerKm: 10.5, reactanceOhmsPerKm: 0.177 },
  { size: '10', copperOhmsPerKm: 3.98, aluminumOhmsPerKm: 6.57, reactanceOhmsPerKm: 0.164 },
  { size: '8', copperOhmsPerKm: 2.56, aluminumOhmsPerKm: 4.20, reactanceOhmsPerKm: 0.171 },
  { size: '6', copperOhmsPerKm: 1.61, aluminumOhmsPerKm: 2.65, reactanceOhmsPerKm: 0.159 },
  { size: '4', copperOhmsPerKm: 1.02, aluminumOhmsPerKm: 1.67, reactanceOhmsPerKm: 0.148 },
  { size: '3', copperOhmsPerKm: 0.808, aluminumOhmsPerKm: 1.33, reactanceOhmsPerKm: 0.148 },
  { size: '2', copperOhmsPerKm: 0.654, aluminumOhmsPerKm: 1.07, reactanceOhmsPerKm: 0.141 },
  { size: '1', copperOhmsPerKm: 0.515, aluminumOhmsPerKm: 0.847, reactanceOhmsPerKm: 0.138 },
  { size: '1/0', copperOhmsPerKm: 0.410, aluminumOhmsPerKm: 0.674, reactanceOhmsPerKm: 0.135 },
  { size: '2/0', copperOhmsPerKm: 0.328, aluminumOhmsPerKm: 0.539, reactanceOhmsPerKm: 0.131 },
  { size: '3/0', copperOhmsPerKm: 0.262, aluminumOhmsPerKm: 0.431, reactanceOhmsPerKm: 0.128 },
  { size: '4/0', copperOhmsPerKm: 0.210, aluminumOhmsPerKm: 0.345, reactanceOhmsPerKm: 0.125 },
  { size: '250', copperOhmsPerKm: 0.179, aluminumOhmsPerKm: 0.295, reactanceOhmsPerKm: 0.122 },
  { size: '300', copperOhmsPerKm: 0.151, aluminumOhmsPerKm: 0.249, reactanceOhmsPerKm: 0.119 },
  { size: '350', copperOhmsPerKm: 0.131, aluminumOhmsPerKm: 0.215, reactanceOhmsPerKm: 0.119 },
  { size: '400', copperOhmsPerKm: 0.116, aluminumOhmsPerKm: 0.191, reactanceOhmsPerKm: 0.116 },
  { size: '500', copperOhmsPerKm: 0.0951, aluminumOhmsPerKm: 0.157, reactanceOhmsPerKm: 0.113 },
  { size: '600', copperOhmsPerKm: 0.0810, aluminumOhmsPerKm: 0.134, reactanceOhmsPerKm: 0.110 },
  { size: '750', copperOhmsPerKm: 0.0669, aluminumOhmsPerKm: 0.111, reactanceOhmsPerKm: 0.107 },
  { size: '1000', copperOhmsPerKm: 0.0525, aluminumOhmsPerKm: 0.0869, reactanceOhmsPerKm: 0.102 },
];

/**
 * Get wire resistance per km for a given size and material.
 */
export function getWireResistance(
  size: string,
  material: 'copper' | 'aluminum'
): number | undefined {
  const row = TABLE_D3_WIRE_RESISTANCE.find((r) => r.size === size);
  if (!row) return undefined;
  return material === 'copper'
    ? row.copperOhmsPerKm
    : row.aluminumOhmsPerKm;
}

/**
 * Get wire reactance per km for a given size.
 */
export function getWireReactance(size: string): number | undefined {
  const row = TABLE_D3_WIRE_RESISTANCE.find((r) => r.size === size);
  return row?.reactanceOhmsPerKm;
}

/**
 * Calculate voltage drop for a circuit.
 *
 * @param current - Load current in amps
 * @param lengthMeters - One-way cable length in meters
 * @param wireSize - AWG/kcmil wire size
 * @param material - Conductor material
 * @param phase - Phase configuration
 * @param powerFactor - Power factor (0 to 1), default 0.9
 * @returns Voltage drop in volts, or undefined if wire size not found
 */
export function calculateVoltageDrop(
  current: number,
  lengthMeters: number,
  wireSize: string,
  material: 'copper' | 'aluminum',
  phase: 'single' | 'three',
  powerFactor: number = 0.9
): number | undefined {
  const row = TABLE_D3_WIRE_RESISTANCE.find((r) => r.size === wireSize);
  if (!row) return undefined;

  const R =
    material === 'copper'
      ? row.copperOhmsPerKm
      : row.aluminumOhmsPerKm;
  const X = row.reactanceOhmsPerKm;

  const lengthKm = lengthMeters / 1000;
  const theta = Math.acos(powerFactor);
  const impedanceFactor = R * Math.cos(theta) + X * Math.sin(theta);

  if (phase === 'single') {
    return 2 * current * lengthKm * impedanceFactor;
  }
  // three phase
  return Math.sqrt(3) * current * lengthKm * impedanceFactor;
}
