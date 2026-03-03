/**
 * CEC Table 9 — Internal Cross-Sectional Areas of Conduit and Tubing
 *
 * Internal area in mm² for each conduit type and trade size.
 * Used with Table 8 wire areas and fill percentages for conduit fill
 * calculations.
 *
 * Canadian Electrical Code, Part I
 */

export interface ConduitAreaRow {
  tradeSize: string;
  tradeSizeMetric: number;
  /** EMT (Electrical Metallic Tubing) internal area mm² */
  emtAreaMM2: number;
  /** Rigid Metal Conduit / IMC internal area mm² */
  rigidAreaMM2: number;
  /** PVC Schedule 40 internal area mm² */
  pvc40AreaMM2: number;
  /** PVC Schedule 80 internal area mm² */
  pvc80AreaMM2: number;
}

export const TABLE_9_CONDUIT_AREAS: ConduitAreaRow[] = [
  {
    tradeSize: '1/2',
    tradeSizeMetric: 16,
    emtAreaMM2: 182,
    rigidAreaMM2: 204,
    pvc40AreaMM2: 195,
    pvc80AreaMM2: 149,
  },
  {
    tradeSize: '3/4',
    tradeSizeMetric: 21,
    emtAreaMM2: 314,
    rigidAreaMM2: 353,
    pvc40AreaMM2: 340,
    pvc80AreaMM2: 274,
  },
  {
    tradeSize: '1',
    tradeSizeMetric: 27,
    emtAreaMM2: 510,
    rigidAreaMM2: 573,
    pvc40AreaMM2: 555,
    pvc80AreaMM2: 464,
  },
  {
    tradeSize: '1-1/4',
    tradeSizeMetric: 35,
    emtAreaMM2: 846,
    rigidAreaMM2: 937,
    pvc40AreaMM2: 919,
    pvc80AreaMM2: 791,
  },
  {
    tradeSize: '1-1/2',
    tradeSizeMetric: 41,
    emtAreaMM2: 1134,
    rigidAreaMM2: 1257,
    pvc40AreaMM2: 1237,
    pvc80AreaMM2: 1082,
  },
  {
    tradeSize: '2',
    tradeSizeMetric: 53,
    emtAreaMM2: 1885,
    rigidAreaMM2: 2047,
    pvc40AreaMM2: 2033,
    pvc80AreaMM2: 1813,
  },
  {
    tradeSize: '2-1/2',
    tradeSizeMetric: 63,
    emtAreaMM2: 2892,
    rigidAreaMM2: 3085,
    pvc40AreaMM2: 3029,
    pvc80AreaMM2: 2733,
  },
  {
    tradeSize: '3',
    tradeSizeMetric: 78,
    emtAreaMM2: 4536,
    rigidAreaMM2: 4660,
    pvc40AreaMM2: 4657,
    pvc80AreaMM2: 4259,
  },
  {
    tradeSize: '3-1/2',
    tradeSizeMetric: 91,
    emtAreaMM2: 5765,
    rigidAreaMM2: 6082,
    pvc40AreaMM2: 6088,
    pvc80AreaMM2: 5612,
  },
  {
    tradeSize: '4',
    tradeSizeMetric: 103,
    emtAreaMM2: 7388,
    rigidAreaMM2: 7737,
    pvc40AreaMM2: 7754,
    pvc80AreaMM2: 7199,
  },
];

/**
 * Lookup conduit internal area by trade size and conduit type.
 */
export function getConduitArea(
  tradeSize: string,
  conduitType: 'EMT' | 'Rigid' | 'PVC40' | 'PVC80'
): number | undefined {
  const row = TABLE_9_CONDUIT_AREAS.find((r) => r.tradeSize === tradeSize);
  if (!row) return undefined;
  switch (conduitType) {
    case 'EMT':
      return row.emtAreaMM2;
    case 'Rigid':
      return row.rigidAreaMM2;
    case 'PVC40':
      return row.pvc40AreaMM2;
    case 'PVC80':
      return row.pvc80AreaMM2;
  }
}
