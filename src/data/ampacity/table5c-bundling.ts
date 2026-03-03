/**
 * CEC Table 5C — Correction Factors for Cables with More Than
 * 3 Current-Carrying Conductors in a Raceway or Cable
 *
 * When there are more than 3 current-carrying conductors bundled
 * together, the ampacity must be reduced by these factors.
 *
 * Canadian Electrical Code, Part I
 */

export interface BundlingDeratingRow {
  conductorRange: string;
  minConductors: number;
  maxConductors: number;
  deratingFactor: number;
  deratingPercent: number;
}

export const TABLE_5C_BUNDLING_FACTORS: BundlingDeratingRow[] = [
  {
    conductorRange: '1-3',
    minConductors: 1,
    maxConductors: 3,
    deratingFactor: 1.0,
    deratingPercent: 100,
  },
  {
    conductorRange: '4-6',
    minConductors: 4,
    maxConductors: 6,
    deratingFactor: 0.80,
    deratingPercent: 80,
  },
  {
    conductorRange: '7-9',
    minConductors: 7,
    maxConductors: 9,
    deratingFactor: 0.70,
    deratingPercent: 70,
  },
  {
    conductorRange: '10-24',
    minConductors: 10,
    maxConductors: 24,
    deratingFactor: 0.70,
    deratingPercent: 70,
  },
  {
    conductorRange: '25-42',
    minConductors: 25,
    maxConductors: 42,
    deratingFactor: 0.60,
    deratingPercent: 60,
  },
  {
    conductorRange: '43+',
    minConductors: 43,
    maxConductors: Infinity,
    deratingFactor: 0.50,
    deratingPercent: 50,
  },
];

/**
 * Get the bundling derating factor for a given number of
 * current-carrying conductors.
 */
export function getBundlingDeratingFactor(
  numberOfConductors: number
): number {
  const row = TABLE_5C_BUNDLING_FACTORS.find(
    (r) =>
      numberOfConductors >= r.minConductors &&
      numberOfConductors <= r.maxConductors
  );
  return row?.deratingFactor ?? 1.0;
}
