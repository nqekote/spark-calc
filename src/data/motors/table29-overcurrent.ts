/**
 * CEC Table 29 — Maximum Rating or Setting of Motor Branch-Circuit
 * Overcurrent Devices
 *
 * Expressed as a percentage of the motor full-load current from
 * Tables 44, 45, or 46.
 *
 * Canadian Electrical Code, Part I, Rule 28-210
 *
 * Note: If the calculated value does not correspond to a standard
 * fuse or breaker size, the next higher standard size is permitted
 * (Rule 28-210(3)).
 */

import type { MotorOCPRow } from '../types';

export const TABLE_29_MOTOR_OCP: MotorOCPRow[] = [
  {
    motorType: 'squirrelCage',
    nonTimeDelayFuse: 300,
    dualElementFuse: 175,
    instantTripBreaker: 800,
    inverseTripBreaker: 250,
  },
  {
    motorType: 'synchronous',
    nonTimeDelayFuse: 300,
    dualElementFuse: 175,
    instantTripBreaker: 800,
    inverseTripBreaker: 250,
  },
  {
    motorType: 'woundRotor',
    nonTimeDelayFuse: 150,
    dualElementFuse: 150,
    instantTripBreaker: 800,
    inverseTripBreaker: 150,
  },
  {
    motorType: 'dcConstantVoltage',
    nonTimeDelayFuse: 150,
    dualElementFuse: 150,
    instantTripBreaker: 250,
    inverseTripBreaker: 150,
  },
];

/**
 * Friendly labels for motor types.
 */
export const MOTOR_TYPE_LABELS: Record<string, string> = {
  squirrelCage: 'Squirrel-Cage Induction',
  synchronous: 'Synchronous',
  woundRotor: 'Wound Rotor',
  dcConstantVoltage: 'DC (Constant Voltage)',
};

/**
 * Friendly labels for OCP device types.
 */
export const OCP_DEVICE_LABELS: Record<string, string> = {
  nonTimeDelayFuse: 'Non-Time Delay Fuse',
  dualElementFuse: 'Dual-Element (Time Delay) Fuse',
  instantTripBreaker: 'Instantaneous Trip Breaker',
  inverseTripBreaker: 'Inverse Time Breaker',
};

/**
 * Get the maximum OCP percentage for a motor type and device type.
 */
export function getMotorOCPPercent(
  motorType: string,
  deviceType: 'nonTimeDelayFuse' | 'dualElementFuse' | 'instantTripBreaker' | 'inverseTripBreaker'
): number | undefined {
  const row = TABLE_29_MOTOR_OCP.find((r) => r.motorType === motorType);
  if (!row) return undefined;
  return row[deviceType];
}
