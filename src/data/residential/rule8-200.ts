/**
 * CEC Rule 8-200 — Calculation of Demand for a Residential
 * Single Dwelling
 *
 * Demand load calculation for sizing the service entrance and feeder
 * for single residential dwellings (houses, individual units).
 *
 * Canadian Electrical Code, Part I
 *
 * Basic calculation method:
 * 1. Start with a basic load of 5000W for the first 90 m² of floor area
 * 2. Add 1000W for each additional 90 m² (or portion thereof)
 * 3. Apply demand factor to the remainder of general lighting load
 * 4. Add electric range demand (Table 18 or Rule 8-200(3))
 * 5. Add heating/AC load at appropriate demand
 * 6. Add other loads (dryer, hot water, etc.)
 */

/**
 * Basic allowance for first 90 m² of living area.
 */
export const BASIC_LOAD_WATTS = 5000;

/**
 * Additional watts per 90 m² (or portion thereof) beyond the first 90 m².
 */
export const ADDITIONAL_PER_90M2_WATTS = 1000;

/**
 * Floor area increment in square meters.
 */
export const AREA_INCREMENT_M2 = 90;

/**
 * Demand factors for general lighting and receptacle load
 * per CEC Rule 8-200(1)(a).
 */
export const LIGHTING_DEMAND = {
  /** First 5000W of calculated load at 100% */
  firstBlockWatts: 5000,
  firstBlockPercent: 100,

  /** Remainder at 25% */
  remainderPercent: 25,
} as const;

/**
 * Electric range demand per CEC Rule 8-200(3)(a).
 * For a single range rated not more than 12 kW.
 */
export const RANGE_DEMAND = {
  /** Use 6000W for a single range up to 12 kW */
  singleRangeUpTo12kW: 6000,

  /**
   * For ranges over 12 kW, add 40% of the amount exceeding 12 kW
   * to the 6000W base demand.
   */
  baseWatts: 6000,
  excessPercent: 40,
  excessThresholdWatts: 12000,
} as const;

/**
 * Space heating and air conditioning demands.
 * Per CEC Rule 8-200(2) — use the LARGER of heating or AC.
 */
export const HVAC_DEMAND = {
  /** Electric space heating at 100% of first 10 kW */
  heatingFirst10kW: 10000,
  heatingFirstPercent: 100,

  /** Balance of heating at 75% */
  heatingRemainderPercent: 75,

  /** Air conditioning at 100% */
  airConditioningPercent: 100,

  /** Use whichever is larger: heating or AC demand */
  rule: 'Use the larger of calculated heating demand or AC demand',
} as const;

/**
 * Dryer demand per CEC Rule 8-200(3)(b).
 */
export const DRYER_DEMAND = {
  /** Minimum demand for a dryer: 25% of nameplate or 5000W x 25% */
  minimumWatts: 5000,
  demandPercent: 25,
  /** If nameplate exceeds 5000W, use 25% of nameplate */
  notes: 'Use 25% of dryer nameplate rating, minimum 1250W demand',
} as const;

/**
 * Hot water tank demand per CEC Rule 8-200(3)(c).
 */
export const HOT_WATER_DEMAND = {
  /** Hot water tank at 25% demand */
  demandPercent: 25,
  notes: 'Apply 25% demand factor to nameplate rating of hot water tank',
} as const;

/**
 * Standard residential voltages.
 */
export const RESIDENTIAL_VOLTAGES = {
  singlePhase120_240: { line: 240, phase: 120 },
  serviceMinAmps: 100,
} as const;

/**
 * Calculate the basic floor area load.
 *
 * @param floorAreaM2 - Total heated floor area in square meters
 * @returns Load in watts before demand factor
 */
export function calculateFloorAreaLoad(floorAreaM2: number): number {
  if (floorAreaM2 <= AREA_INCREMENT_M2) {
    return BASIC_LOAD_WATTS;
  }
  const additionalIncrements = Math.ceil(
    (floorAreaM2 - AREA_INCREMENT_M2) / AREA_INCREMENT_M2
  );
  return BASIC_LOAD_WATTS + additionalIncrements * ADDITIONAL_PER_90M2_WATTS;
}

/**
 * Apply the lighting demand factor to the total calculated general load.
 *
 * @param totalGeneralLoadWatts - Total general lighting/receptacle load
 * @returns Demand load in watts
 */
export function applyLightingDemand(totalGeneralLoadWatts: number): number {
  if (totalGeneralLoadWatts <= LIGHTING_DEMAND.firstBlockWatts) {
    return totalGeneralLoadWatts;
  }
  const firstBlock = LIGHTING_DEMAND.firstBlockWatts;
  const remainder =
    (totalGeneralLoadWatts - firstBlock) *
    (LIGHTING_DEMAND.remainderPercent / 100);
  return firstBlock + remainder;
}

/**
 * Calculate electric range demand.
 *
 * @param rangeWatts - Nameplate rating of range in watts
 * @returns Demand load in watts
 */
export function calculateRangeDemand(rangeWatts: number): number {
  if (rangeWatts === 0) return 0;
  if (rangeWatts <= RANGE_DEMAND.excessThresholdWatts) {
    return RANGE_DEMAND.singleRangeUpTo12kW;
  }
  const excess = rangeWatts - RANGE_DEMAND.excessThresholdWatts;
  return RANGE_DEMAND.baseWatts + excess * (RANGE_DEMAND.excessPercent / 100);
}

/**
 * Calculate heating demand.
 *
 * @param heatingWatts - Total electric heating nameplate in watts
 * @returns Demand load in watts
 */
export function calculateHeatingDemand(heatingWatts: number): number {
  if (heatingWatts <= HVAC_DEMAND.heatingFirst10kW) {
    return heatingWatts * (HVAC_DEMAND.heatingFirstPercent / 100);
  }
  const firstBlock =
    HVAC_DEMAND.heatingFirst10kW * (HVAC_DEMAND.heatingFirstPercent / 100);
  const remainder =
    (heatingWatts - HVAC_DEMAND.heatingFirst10kW) *
    (HVAC_DEMAND.heatingRemainderPercent / 100);
  return firstBlock + remainder;
}

/**
 * Calculate the total service demand and minimum service size.
 *
 * @param params - All input parameters for the dwelling
 * @returns Total demand in watts and minimum service amps
 */
export function calculateResidentialService(params: {
  floorAreaM2: number;
  additionalGeneralLoadWatts?: number;
  rangeWatts?: number;
  heatingWatts?: number;
  acWatts?: number;
  dryerWatts?: number;
  hotWaterWatts?: number;
  otherFixedLoadsWatts?: number;
}): { demandWatts: number; minimumAmps: number } {
  // 1. Floor area general load
  const floorAreaLoad = calculateFloorAreaLoad(params.floorAreaM2);
  const totalGeneralLoad =
    floorAreaLoad + (params.additionalGeneralLoadWatts ?? 0);
  let totalDemand = applyLightingDemand(totalGeneralLoad);

  // 2. Range demand
  totalDemand += calculateRangeDemand(params.rangeWatts ?? 0);

  // 3. Heating vs AC (use larger)
  const heatingDemand = calculateHeatingDemand(params.heatingWatts ?? 0);
  const acDemand =
    (params.acWatts ?? 0) * (HVAC_DEMAND.airConditioningPercent / 100);
  totalDemand += Math.max(heatingDemand, acDemand);

  // 4. Dryer at 25%
  const dryerRating = Math.max(
    params.dryerWatts ?? 0,
    DRYER_DEMAND.minimumWatts
  );
  if (params.dryerWatts !== undefined && params.dryerWatts > 0) {
    totalDemand += dryerRating * (DRYER_DEMAND.demandPercent / 100);
  }

  // 5. Hot water at 25%
  if (params.hotWaterWatts !== undefined && params.hotWaterWatts > 0) {
    totalDemand +=
      params.hotWaterWatts * (HOT_WATER_DEMAND.demandPercent / 100);
  }

  // 6. Other fixed loads at 25% (same as general appliance demand)
  if (
    params.otherFixedLoadsWatts !== undefined &&
    params.otherFixedLoadsWatts > 0
  ) {
    totalDemand += params.otherFixedLoadsWatts * 0.25;
  }

  // Minimum service size
  const minimumAmps = Math.max(
    totalDemand / RESIDENTIAL_VOLTAGES.singlePhase120_240.line,
    RESIDENTIAL_VOLTAGES.serviceMinAmps
  );

  return {
    demandWatts: Math.round(totalDemand),
    minimumAmps: Math.ceil(minimumAmps),
  };
}
