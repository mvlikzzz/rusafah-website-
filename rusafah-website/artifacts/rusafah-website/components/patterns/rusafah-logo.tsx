import { cn } from "@/lib/utils";

/**
 * The wordmark, drawn as a CSS mask so it takes the current text colour.
 * Aspect ratio of the source artwork is 1213 × 779.
 */
export function RusafahLogo({
  className,
  label = "رُصافة العقارية",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("mask-icon aspect-[1213/779]", className)}
      style={{ ["--mask" as string]: "url(/images/brand/logo-white.png)" }}
    />
  );
}
