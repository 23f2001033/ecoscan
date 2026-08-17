/**
 * Downscale and re-encode a photo before it goes to the vision model.
 *
 * Phone photos are 3-6MB, but the model gains nothing from that resolution — leaf
 * shape and margins are legible at 768px. Shrinking here cuts upload time, keeps us
 * inside the free tier's tokens-per-minute budget, and normalises HEIC/WebP/PNG down
 * to one JPEG path.
 */
const MAX_EDGE = 768;
const JPEG_QUALITY = 0.82;

export async function downscaleToDataUrl(file) {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    // White matte so transparent PNGs don't come out with black backgrounds.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    bitmap.close();
  }
}
