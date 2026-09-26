import assert from 'node:assert/strict';
import { copyableStatus, findDuplicateSpot, globalEventTimestamp, resolveEventTarget } from './writeGuards';

const bed = {
  id: 'bed-a',
  gridPosition: { x: 0, y: 0 },
  size: { w: 4, h: 4 },
};

const spot = findDuplicateSpot(bed, [], 12, 8);
assert.deepEqual(
  spot,
  { x: 4, y: 0 },
  'a copy of the only bed must not land on the source bed'
);
assert.ok(
  !(spot!.x < 4 && spot!.y < 4),
  'copy footprint overlaps the source'
);

const blocked = findDuplicateSpot(bed, [], 4, 4);
assert.equal(blocked, null, 'a bed that fills the plot has no free cell for a copy');

const originFree = findDuplicateSpot(
  { id: 'bed-b', gridPosition: { x: 6, y: 2 }, size: { w: 2, h: 2 } },
  [],
  10,
  10
);
assert.deepEqual(originFree, { x: 0, y: 0 });

assert.equal(copyableStatus('Healthy'), 'Healthy');
assert.equal(copyableStatus('Planted'), 'Pending');
assert.equal(copyableStatus(undefined), 'Pending');

const wateringTarget = resolveEventTarget({
  dataTargetId: 'plant-1',
  dataTargetType: 'Inhabitant',
  plotId: 'plot-9',
});
assert.deepEqual(wateringTarget, { targetId: 'plant-1', targetType: 'Inhabitant' });

const plotTarget = resolveEventTarget({ plotId: 'plot-9' });
assert.deepEqual(plotTarget, { targetId: 'plot-9', targetType: 'SpatialPlot' });

assert.deepEqual(resolveEventTarget({}), {});

assert.equal(globalEventTimestamp({ timestamp: '2026-09-01T00:00:00.000Z' }), '2026-09-01T00:00:00.000Z');
const generated = globalEventTimestamp({});
assert.equal(typeof generated, 'string');
assert.ok(!Number.isNaN(Date.parse(generated)), 'missing timestamp must become an ISO string');

console.log('criticalFixes.test.ts ok');
