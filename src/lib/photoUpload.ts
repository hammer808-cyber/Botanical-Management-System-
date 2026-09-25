import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import type { User } from 'firebase/auth';

/**
 * Downscale a camera/gallery photo before upload. Phone photos are several
 * MB; 1600px on the long edge at JPEG 0.82 is plenty for a plant timeline
 * and keeps storage + load times sane.
 */
export async function compressImageFile(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );
  if (!blob) throw new Error('Could not compress image');
  return blob;
}

export interface UploadedPhoto {
  url: string;
  storagePath: string;
}

/** Upload a plant photo; returns the download URL + storage path. */
export async function uploadPlantPhoto(
  user: User,
  plantId: string,
  file: File
): Promise<UploadedPhoto> {
  const blob = await compressImageFile(file);
  const storagePath = `plant-photos/${user.uid}/${plantId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(snapshot.ref);
  return { url, storagePath };
}
