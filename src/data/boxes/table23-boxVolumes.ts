/**
 * CEC Table 23 — Boxes: Standard Dimensions and Volumes
 *
 * Volumes in cm³ and maximum number of conductors for standard
 * electrical boxes. Used alongside Table 22 for box fill calculations.
 *
 * Canadian Electrical Code, Part I
 *
 * Note: The max conductor counts listed are for a SINGLE size of
 * conductor with no devices, clamps, or grounding conductors.
 * For mixed sizes or with devices/clamps, use the volume-based
 * calculation from Table 22.
 */

import type { BoxDimension } from '../types';

export const TABLE_23_BOX_VOLUMES: BoxDimension[] = [
  // Round/Octagonal boxes
  {
    type: 'Round/Octagonal',
    dimensions: '102 x 38 mm (4" x 1-1/2")',
    volumeCM3: 205,
    maxConductors14: 6,
    maxConductors12: 5,
  },
  {
    type: 'Round/Octagonal',
    dimensions: '102 x 54 mm (4" x 2-1/8")',
    volumeCM3: 295,
    maxConductors14: 9,
    maxConductors12: 8,
  },

  // Square boxes (4" x 4")
  {
    type: 'Square',
    dimensions: '102 x 38 mm (4" x 1-1/2")',
    volumeCM3: 295,
    maxConductors14: 9,
    maxConductors12: 8,
  },
  {
    type: 'Square',
    dimensions: '102 x 54 mm (4" x 2-1/8")',
    volumeCM3: 410,
    maxConductors14: 12,
    maxConductors12: 11,
  },

  // Square boxes (4-11/16" x 4-11/16")
  {
    type: 'Square',
    dimensions: '120 x 38 mm (4-11/16" x 1-1/2")',
    volumeCM3: 344,
    maxConductors14: 10,
    maxConductors12: 9,
  },
  {
    type: 'Square',
    dimensions: '120 x 54 mm (4-11/16" x 2-1/8")',
    volumeCM3: 500,
    maxConductors14: 15,
    maxConductors12: 13,
  },

  // Device boxes (single gang)
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 38 mm (3" x 2" x 1-1/2")',
    volumeCM3: 123,
    maxConductors14: 3,
    maxConductors12: 3,
  },
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 51 mm (3" x 2" x 2")',
    volumeCM3: 164,
    maxConductors14: 5,
    maxConductors12: 4,
  },
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 54 mm (3" x 2" x 2-1/4")',
    volumeCM3: 180,
    maxConductors14: 5,
    maxConductors12: 5,
  },
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 64 mm (3" x 2" x 2-1/2")',
    volumeCM3: 205,
    maxConductors14: 6,
    maxConductors12: 5,
  },
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 70 mm (3" x 2" x 2-3/4")',
    volumeCM3: 230,
    maxConductors14: 7,
    maxConductors12: 6,
  },
  {
    type: 'Device (Single Gang)',
    dimensions: '76 x 51 x 89 mm (3" x 2" x 3-1/2")',
    volumeCM3: 295,
    maxConductors14: 9,
    maxConductors12: 8,
  },

  // Masonry / FS / FD boxes
  {
    type: 'Masonry (FS)',
    dimensions: 'Single gang, shallow',
    volumeCM3: 230,
    maxConductors14: 7,
    maxConductors12: 6,
  },
  {
    type: 'Masonry (FD)',
    dimensions: 'Single gang, deep',
    volumeCM3: 385,
    maxConductors14: 11,
    maxConductors12: 10,
  },
  {
    type: 'Masonry (FS)',
    dimensions: 'Double gang, shallow',
    volumeCM3: 410,
    maxConductors14: 12,
    maxConductors12: 11,
  },
  {
    type: 'Masonry (FD)',
    dimensions: 'Double gang, deep',
    volumeCM3: 688,
    maxConductors14: 20,
    maxConductors12: 19,
  },
];

/**
 * Get boxes with at least the specified volume.
 */
export function getBoxesWithMinVolume(
  minVolumeCM3: number
): BoxDimension[] {
  return TABLE_23_BOX_VOLUMES.filter(
    (box) => box.volumeCM3 >= minVolumeCM3
  );
}
