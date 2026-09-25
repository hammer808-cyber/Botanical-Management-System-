import type { Inhabitant } from '../types';

/**
 * Single source of truth for "is this plant actually in the ground?"
 *
 * A plant counts as planted when it sits in a bed (planterId set), when
 * its status is 'Planted' (legacy), or when it sits at a non-origin grid
 * position (covers inventory plants with other health statuses).
 * Everything else is waiting in the rail.
 */
export function isPlanted(p: Inhabitant): boolean {
  if (p.status === 'Planted') return true;
  if (p.planterId) return true;
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
