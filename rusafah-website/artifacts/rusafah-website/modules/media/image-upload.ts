import "server-only";
import sharp, { type Sharp } from "sharp";
import { getStorage } from "./local-storage";

const MAX_DIMENSION = 2400;
const MAX_BYTES = 15 * 1024 * 1024;
export const UPLOAD_ERROR_TOO_LARGE = "حجم الصورة يتجاوز 15 ميجابايت.";
export const UPLOAD_ERROR_INVALID = "الملف المرفوع ليس صورة صالحة.";

/**
 * Re-encodes every upload through sharp before it touches disk: this both
 * verifies the file is really an image (not just named *.jpg) and strips
 * embedded metadata. Output keeps the source format where practical, capped
 * at MAX_DIMENSION on the long edge.
 */
export async function processAndStoreImage(
  file: File,
  directory: string,
): Promise<{ path: string } | { error: string }> {
  if (file.size > MAX_BYTES) return { error: UPLOAD_ERROR_TOO_LARGE };
  const input = Buffer.from(await file.arrayBuffer());

  let pipeline: Sharp;
  let extension: string;
  try {
    const probe = sharp(input);
    const meta = await probe.metadata();
    if (!meta.width || !meta.height) return { error: UPLOAD_ERROR_INVALID };
    const format = meta.format === "png" ? "png" : "jpeg";
    extension = format === "png" ? "png" : "jpg";
    pipeline = probe.rotate().resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
    pipeline = format === "png" ? pipeline.png({ quality: 90 }) : pipeline.jpeg({ quality: 85 });
  } catch {
    return { error: UPLOAD_ERROR_INVALID };
  }

  const buffer = await pipeline.toBuffer();
  const { path } = await getStorage().save({ buffer, extension, directory });
  return { path };
}
