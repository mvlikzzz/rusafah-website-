import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  /** Visually hide the label (placeholder carries it visually) while keeping it for screen readers. */
  srOnlyLabel?: boolean;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (a11y: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": true | undefined;
    required: boolean | undefined;
  }) => React.ReactNode;
};

/**
 * Accessible form field: every control gets a real <label>, its error text is
 * announced through aria-describedby, and invalid state is exposed with aria-invalid.
 * Error messages are Arabic sentences supplied by the validation layer (ENGINEERING.md §5).
 */
export function Field({
  id,
  label,
  srOnlyLabel,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className={cn("block text-sm font-medium", srOnlyLabel && "sr-only")}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {hint ? (
        <p id={hintId} className="text-gold-700 text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-status-sold text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
