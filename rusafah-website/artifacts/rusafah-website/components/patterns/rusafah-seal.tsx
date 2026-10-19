import { cn } from "@/lib/utils";

/** The circular "رُصافة العقارية — RUSAFAH COMPANY" seal, colourable through a CSS mask. */
export function RusafahSeal({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="ختم رُصافة العقارية"
      className={cn("mask-icon aspect-square", className)}
      style={{ ["--mask" as string]: "url(/images/masks/seal.png)" }}
    />
  );
}
