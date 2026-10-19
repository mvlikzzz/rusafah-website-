import { cn } from "@/lib/utils";
import { projectStatusLabel, type ProjectStatus } from "@/modules/projects/vocabulary";

/**
 * Status marker as drawn on the project cards: a coloured dot/diamond beside
 * the Arabic label — green dot for available, gold diamond for coming soon,
 * red diamond for sold.
 */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const marker =
    status === "available"
      ? "bg-status-available rounded-full"
      : status === "sold"
        ? "bg-status-sold diamond"
        : "bg-status-soon diamond";
  return (
    <span className={cn("text-cream-100 inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className={cn("inline-block size-2", marker)} />
      <span>{projectStatusLabel(status)}</span>
    </span>
  );
}

export function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "bg-cream-200/15 text-cream-100 inline-flex items-center rounded-md px-6 py-2 text-lg backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
