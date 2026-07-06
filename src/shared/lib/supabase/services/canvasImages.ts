import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { generateUUID } from '@/shared/utils/validation';

const BUCKET = 'canvas-images';

/**
 * Upload a pasted/selected image for a canvas and return its public URL.
 *
 * Objects are keyed `<projectId>/<uuid>.<ext>` — the storage RLS policy checks
 * write access against that leading project id (see the canvas-images bucket
 * migration). The bucket is public, so the returned URL renders directly.
 */
export async function uploadCanvasImage(
  projectId: string,
  blob: Blob
): Promise<string> {
  const client = getClientForEnvironment();
  const ext = (blob.type.split('/')[1] || 'png').replace('+xml', '');
  const path = `${projectId}/${generateUUID()}.${ext}`;

  const { error } = await client.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/png',
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
