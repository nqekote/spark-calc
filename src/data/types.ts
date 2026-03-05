/**
 * Shared TypeScript types for CEC (Canadian Electrical Code) data tables.
 * Used across all JBox calculator modules.
 */

/** AWG/kcmil wire sizes used throughout the CEC */
export type AWGSize =
  | '14'
  | '12'
  | '10'
  | '8'
  | '6'
  | '4'
  | '3'
  | '2'
  | '1'
  | '1/0'
  | '2/0'
  | '3/0'
  | '4/0'
  | '250'
  | '300'
  | '350'
  | '400'
  | '500'
  | '600'
  | '750'
  | '1000'
  | '1250'
  | '1500'
  | '1750'
  | '2000';

/** Conductor insulation temperature ratings */
export type TemperatureRating = '60' | '75' | '90';

/** Conductor material */
export type ConductorMaterial = 'copper' | 'aluminum';

/** Conduit types */
export type ConduitType = 'EMT' | 'Rigid' | 'PVC40' | 'PVC80';

/** Phase configuration */
export type PhaseConfig = 'single' | 'three';

/** Motor type for overcurrent protection */
export type MotorType =
  | 'squirrelCage'
  | 'synchronous'
  | 'woundRotor'
  | 'dcConstantVoltage';

/** Overcurrent protection device type */
export type OCPDeviceType =
  | 'nonTimeDelayFuse'
  | 'dualElementFuse'
  | 'instantTripBreaker'
  | 'inverseTripBreaker';

/** A row in the ampacity table */
export interface AmpacityRow {
  size: AWGSize;
  temp60: number;
  temp75: number;
  temp90: number;
}

/** Internal cross-sectional area of conduit */
export interface ConduitDimension {
  tradeSize: string;
  nominalDiameterMM: number;
  internalAreaMM2: number;
}

/** Wire cross-sectional area including insulation */
export interface WireArea {
  size: AWGSize;
  areaMM2: number;
}

/** Motor full-load current row */
export interface MotorFLCRow {
  hp: number;
  voltages: Record<number, number>;
}

/** Temperature correction factor row */
export interface TempCorrectionRow {
  ambientRange: string;
  ambientLow: number;
  ambientHigh: number;
  factor60: number;
  factor75: number;
  factor90: number;
}

/** Box volume allowance per conductor */
export interface BoxVolumeAllowance {
  size: AWGSize;
  volumeCM3: number;
}

/** EMT bending offset multiplier */
export interface BendMultiplier {
  angleDegrees: number;
  multiplier: number;
  shrinkagePerInch: number;
  shrinkageDescription: string;
}

/** Stub-up deduct values by conduit trade size */
export interface StubDeduct {
  tradeSize: string;
  deductInches: number;
}

/** EMT trade sizes */
export type EMTSize = '1/2' | '3/4' | '1' | '1-1/4' | '1-1/2' | '2' | '2-1/2' | '3' | '3-1/2' | '4';

/** Standard overcurrent protection device rating */
export type StandardBreakerSize = number;

/** Wire resistance data for voltage drop calculations */
export interface WireResistanceRow {
  size: AWGSize;
  copperOhmsPerKm: number;
  aluminumOhmsPerKm: number;
}

/** Transformer overcurrent protection rule */
export interface TransformerOCPRule {
  impedanceRange: string;
  primaryMaxPercent: number;
  secondaryMaxPercent: number | null;
  notes: string;
}

/** Standard box dimensions and volume */
export interface BoxDimension {
  type: string;
  dimensions: string;
  volumeCM3: number;
  maxConductors14: number;
  maxConductors12: number;
}

/** Residential demand factor */
export interface DemandFactor {
  rangeDescription: string;
  factorPercent: number;
}

/** Wire color code entry */
export interface WireColorCode {
  conductor: string;
  color: string;
}

/** Common CEC rule reference */
export interface CECRule {
  ruleNumber: string;
  title: string;
  description: string;
}

/** Motor overcurrent protection percentages */
export interface MotorOCPRow {
  motorType: MotorType;
  nonTimeDelayFuse: number;
  dualElementFuse: number;
  instantTripBreaker: number;
  inverseTripBreaker: number;
}

/** Conduit fill percentage rules */
export interface ConduitFillRule {
  numberOfConductors: number | string;
  fillPercent: number;
}
