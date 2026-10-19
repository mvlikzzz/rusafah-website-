import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { env } from "@/lib/env";
import type { StoragePort } from "./storage-port";

/**
 * The public URL path is everything after the nearest ancestor directory
 * literally named "public" — so this works whether MEDIA_UPLOAD_DIR is the
 * usual "public/uploads" (relative to the app's cwd) or an absolute path in
 * a test fixture, without hardcoding a project-root assumption.
 */
function publicDirOf(root: string): string {
  const segments = resolve(root).split(sep);
  const index = segments.lastIndexOf("public");
  return index === -1 ? resolve(root) : segments.slice(0, index + 1).join(sep);
}

function toUrlPath(publicDir: string, absoluteFilePath: string): string {
  return `/${relative(publicDir, absoluteFilePath).split(sep).join("/")}`;
}

/** Local-disk StoragePort. Files land under MEDIA_UPLOAD_DIR (default public/uploads). */
export class LocalDiskStorage implements StoragePort {
  async save(input: { buffer: Buffer; extension: string; directory: string }) {
    const root = env().MEDIA_UPLOAD_DIR;
    const dir = join(root, input.directory);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.${input.extension}`;
    const absoluteFilePath = resolve(dir, filename);
    await writeFile(absoluteFilePath, input.buffer);
    return { path: toUrlPath(publicDirOf(root), absoluteFilePath) };
  }

  async remove(path: string): Promise<void> {
    const root = env().MEDIA_UPLOAD_DIR;
    const absoluteFilePath = join(publicDirOf(root), path);
    await rm(absoluteFilePath, { force: true });
  }
}

let storage: StoragePort | undefined;

export function getStorage(): StoragePort {
  storage ??= new LocalDiskStorage();
  return storage;
}
