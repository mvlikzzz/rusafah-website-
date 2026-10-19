import { inflateSync } from "node:zlib";

/** Minimal PNG reader: alpha bounding box of an 8-bit RGBA / RGB PNG (Playwright output). */
export const PNG = {
  alphaBounds(buf: Buffer): { x0: number; y0: number; x1: number; y1: number } | null {
    let pos = 8;
    let width = 0;
    let height = 0;
    let colorType = 6;
    const idat: Buffer[] = [];
    while (pos < buf.length) {
      const len = buf.readUInt32BE(pos);
      const type = buf.toString("ascii", pos + 4, pos + 8);
      const data = buf.subarray(pos + 8, pos + 8 + len);
      if (type === "IHDR") {
        width = data.readUInt32BE(0);
        height = data.readUInt32BE(4);
        colorType = data[9]!;
      } else if (type === "IDAT") idat.push(data);
      else if (type === "IEND") break;
      pos += 12 + len;
    }
    const bpp = colorType === 6 ? 4 : 3;
    const raw = inflateSync(Buffer.concat(idat));
    const stride = width * bpp;
    const out = Buffer.alloc(height * stride);
    let prev = Buffer.alloc(stride);
    let p = 0;
    for (let y = 0; y < height; y++) {
      const filter = raw[p++]!;
      const line = raw.subarray(p, p + stride);
      p += stride;
      const cur = Buffer.alloc(stride);
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? cur[i - bpp]! : 0;
        const b = prev[i]!;
        const c = i >= bpp ? prev[i - bpp]! : 0;
        let v = line[i]!;
        if (filter === 1) v += a;
        else if (filter === 2) v += b;
        else if (filter === 3) v += (a + b) >> 1;
        else if (filter === 4) {
          const pp = a + b - c;
          const pa = Math.abs(pp - a);
          const pb = Math.abs(pp - b);
          const pc = Math.abs(pp - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        }
        cur[i] = v & 255;
      }
      cur.copy(out, y * stride);
      prev = cur;
    }
    let x0 = width,
      y0 = height,
      x1 = -1,
      y1 = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = colorType === 6 ? out[y * stride + x * 4 + 3]! : 255;
        if (alpha > 8) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    return x1 < 0 ? null : { x0, y0, x1, y1 };
  },
};
