/**
 * Seam for wherever uploaded images end up (ENGINEERING.md §6 pattern — build the seam,
 * not every possible engine). Today the only implementation is local disk under
 * `public/`; an S3-compatible adapter can be dropped in behind this interface
 * once hosting is decided (platform D-11) without touching a single call site.
 */
export interface StoragePort {
  /** Stores a validated image buffer and returns the public URL path (e.g. "/uploads/…"). */
  save(input: { buffer: Buffer; extension: string; directory: string }): Promise<{ path: string }>;
  /** Removes a previously stored file. Never throws if the file is already gone. */
  remove(path: string): Promise<void>;
}
