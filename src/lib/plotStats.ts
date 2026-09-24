import type { Inhabitant } from '../types';

/**
 * Single source of truth for "is this plant actually in the ground?"
 *
 * A plant counts as planted when its status was flipped to 'Planted' by a
 * drop onto the bed, OR when it sits at a non-origin grid position (covers
 * plants placed before the status flip existed, and inventory plants with
 * other health statuses). Everything else is waiting in the rail.
 */
export function isPlanted(p: Inhabitant): boolean {
  if (p.status === 'Planted') return true;
  const x = p.gridPosition?.x ?? 0;
  const y = p.gridPosition?.y ?? 0;
  return x !== 0 || y !== 0;
}

export function countPlanted(list: Inhabitant[]): number {
  return list.filter(isPlanted).length;
}

export function countWaiting(list: Inhabitant[]): number {
  return list.filter(p => !isPlanted(p)).length;
}
