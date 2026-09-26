import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Inhabitant } from '../types';
import type { BedLike } from '../components/BedEditModal';
import { copyableStatus, findDuplicateSpot } from './writeGuards';

export interface DuplicatableBed extends BedLike {
  plotId: string;
  type?: string;
  ownerUid: string;
}

export interface DuplicateResult {
  id: string;
  name: string;
  plantsCopied: number;
}

function uniqueCopyName(base: string, taken: Set<string>): string {
  let candidate = `${base} copy`;
  let n = 2;
  while (taken.has(candidate)) {
    candidate = `${base} copy ${n}`;
    n++;
  }
  return candidate;
}

/**
 * Duplicates a bed into the first free non-overlapping spot in the plot
 * (top-left scan, same as the bed quiz), along with the plants actually
 * assigned to it — shifted by the same offset so the layout is preserved.
 * Returns null when the plot has no room for the copy.
 */
export async function duplicateBed(opts: {
  bed: DuplicatableBed;
  plants: Inhabitant[];
  siblingBeds: BedLike[];
  plotCols: number;
  plotRows: number;
}): Promise<DuplicateResult | null> {
  const { bed, plants, siblingBeds, plotCols, plotRows } = opts;
  const w = bed.size.w;
  const h = bed.size.h;

  const spot = findDuplicateSpot(bed, siblingBeds, plotCols, plotRows);
  if (!spot) return null;

  const taken = new Set(siblingBeds.map((b) => b.name));
  const name = uniqueCopyName(bed.name || 'Bed', taken);

  const bedRef = await addDoc(collection(db, 'planters'), {
    ownerUid: bed.ownerUid,
    plotId: bed.plotId,
    name,
    type: bed.type || 'Raised Bed',
    gridPosition: spot,
    size: { w, h },
    color: bed.color || '#4CAF50',
    createdAt: serverTimestamp(),
  });

  // Copy the bed's own plants, preserving their relative layout.
  const dx = spot.x - bed.gridPosition.x;
  const dy = spot.y - bed.gridPosition.y;
  const bedPlants = plants.filter((p) => p.planterId === bed.id && p.gridPosition);
  let copied = 0;
  for (const p of bedPlants) {
    const gx = (p.gridPosition?.x ?? 0) + dx;
    const gy = (p.gridPosition?.y ?? 0) + dy;
    // Skip anything that wouldn't land inside the copy (stale coordinates).
    if (gx < spot.x || gy < spot.y || gx >= spot.x + w || gy >= spot.y + h) continue;
    const validTypes = ['Herb', 'Vegetable', 'Flower', 'Annual', 'Perennial'];
    const docData: Record<string, unknown> = {
      ownerUid: bed.ownerUid,
      plotId: bed.plotId,
      planterId: bedRef.id,
      name: p.name || 'Plant',
      type: validTypes.includes(p.type || '') ? p.type : 'Vegetable',
      status: copyableStatus(p.status),
      gridPosition: { x: gx, y: gy },
      createdAt: serverTimestamp(),
    };
    // Optional fields only when defined — Firestore rejects undefined values.
    if (p.latinName) docData.latinName = p.latinName;
    if (p.image) docData.image = p.image;
    if (p.waterFreq) docData.waterFreq = p.waterFreq;
    if (p.sunExposure) docData.sunExposure = p.sunExposure;
    await addDoc(collection(db, 'inhabitants'), docData);
    copied++;
  }

  return { id: bedRef.id, name, plantsCopied: copied };
}
