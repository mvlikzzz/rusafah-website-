import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "block w-full rounded-xs border border-transparent bg-cream-200 px-4 py-4 sm:px-5 text-navy-900 placeholder:text-gold-700/80 focus:border-gold-500 focus:outline-none aria-[invalid=true]:border-status-sold";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea ref={ref} className={cn(fieldBase, "min-h-40 resize-y", className)} {...props} />
  );
});

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(fieldBase, "select-brand", className)} {...props}>
        {children}
      </select>
    );
  },
);

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<"input">, "type">
>(function Checkbox({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "border-gold-600 checked:bg-gold-600 checked:bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M2 6l3 3 5-6' fill='none' stroke='%23f4eee6' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>\")] size-4 shrink-0 cursor-pointer appearance-none rounded-xs border bg-transparent checked:bg-center checked:bg-no-repeat",
        className,
      )}
      {...props}
    />
  );
});
