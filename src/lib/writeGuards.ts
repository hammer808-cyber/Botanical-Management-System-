/**
 * Pure guards for writes that Firestore rules would otherwise reject.
 * Kept out of the Firebase modules so tests can run without opening a connection.
 */

const INHABITANT_STATUSES = new Set([
  'Healthy', 'Struggling', 'Excellent', 'Dormant', 'Flowering', 'Vegetative', 'Pending', 'Thirsty',
]);

/** Firestore rejects any other status (including legacy 'Planted') on create. */
export function copyableStatus(status?: string): string {
  return status && INHABITANT_STATUSES.has(status) ? status : 'Pending';
}

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function findDuplicateSpot(
  bed: { id: string; gridPosition: { x: number; y: number }; size: { w: number; h: number } },
  siblingBeds: { id: string; gridPosition: { x: number; y: number }; size: { w: number; h: number } }[],
  plotCols: number,
  plotRows: number
): { x: number; y: number } | null {
  const w = bed.size.w;
  const h = bed.size.h;
  // The source bed occupies its own cells. Callers pass only the *other*
  // beds, and skipping bed.id here used to drop the copy on top of the original.
  const obstacles = [bed, ...siblingBeds.filter((b) => b.id !== bed.id)];
  for (let y = 0; y <= plotRows - h; y++) {
    for (let x = 0; x <= plotCols - w; x++) {
      const hit = obstacles.some((b) =>
        rectsOverlap(x, y, w, h, b.gridPosition.x, b.gridPosition.y, b.size.w, b.size.h)
      );
      if (!hit) return { x, y };
    }
  }
  return null;
}

/**
 * Pick the record target. An id passed on the payload (`data.targetId`) has to
 * beat `plotId`: watering sends both, and preferring the plot made vigor skip
 * the event because the log no longer pointed at the plant.
 * Nulls are omitted — event_logs rejects a null targetId.
 */
export function resolveEventTarget(input: {
  targetId?: string | null;
  targetType?: string | null;
  dataTargetId?: string | null;
  dataTargetType?: string | null;
  plantId?: string | null;
  plotId?: string | null;
}): { targetId?: string; targetType?: string } {
  const targetId = input.targetId || input.dataTargetId || input.plantId || input.plotId || null;
  const targetType =
    input.targetType ||
    input.dataTargetType ||
    (input.plantId ? 'Inhabitant' : input.plotId ? 'SpatialPlot' : null);
  return {
    ...(targetId ? { targetId } : {}),
    ...(targetType ? { targetType } : {}),
  };
}

/**
 * global_events rules require a string `timestamp`. Callers rarely set one,
 * so the master write was rejected after the category doc and calendar entry
 * had already been created — retries then duplicated those records.
 */
export function globalEventTimestamp(data: { timestamp?: unknown }): string {
  return typeof data.timestamp === 'string' && data.timestamp.length > 0
    ? data.timestamp
    : new Date().toISOString();
}
