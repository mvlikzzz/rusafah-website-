import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * Button variants transcribed from the artboards:
 * - gold:    solid #a4744b with cream text (forms, filters, "سجّل اهتمامك")
 * - dark:    espresso #261509 with cream text ("الملف التعريفي", "برفايل المشروع")
 * - outline: 1px gold border, gold text, transparent ("تعرف أكثر", "عرض الوحدات")
 * - light:   translucent cream pill on dark imagery ("أحدث المشاريع", "أستكشف المزيد")
 * - ghost:   text only
 */
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-6 py-3 text-base font-medium transition-[background-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants = {
  gold: "bg-gold-700 text-cream-100 hover:bg-brown-800 shadow-[0_10px_30px_-14px_rgb(138_95_58/0.9)]",
  dark: "bg-espresso text-cream-200 hover:bg-brown-800 shadow-[0_12px_30px_-14px_rgb(38_21_9)]",
  outline: "border border-gold-700 text-gold-700 hover:bg-gold-700/10",
  outlineLight: "border border-cream-200/70 text-cream-100 hover:bg-cream-100/10",
  light:
    "bg-cream-200/20 text-cream-100 backdrop-blur-md border border-cream-200/25 hover:bg-cream-200/30 rounded-md",
  ghost: "text-gold-700 hover:text-brown-800 underline-offset-4 hover:underline px-2",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "",
  lg: "px-8 py-3.5 text-lg",
} as const;

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "gold", size = "md", asChild = false, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

export function buttonClasses(
  variant: keyof typeof variants = "gold",
  size: keyof typeof sizes = "md",
) {
  return cn(base, variants[variant], sizes[size]);
}
