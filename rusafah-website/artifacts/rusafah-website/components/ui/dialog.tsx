"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accessible modal (focus trap, Esc to close, labelled by its title) built on Radix. */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  title: string;
  description?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-navy-950/70 data-[state=open]:animate-in data-[state=open]:fade-in fixed inset-0 z-50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        dir="rtl"
        className={cn(
          "border-cream-200/20 bg-cream-100/95 text-navy-900 shadow-glow fixed start-1/2 top-1/2 z-50 w-[min(92vw,34rem)] translate-x-1/2 -translate-y-1/2 rounded-md border p-8 backdrop-blur-xl focus:outline-none",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="bg-gold-600 absolute start-1/2 -top-px h-1.5 w-40 translate-x-1/2 rounded-b-sm"
        />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <DialogPrimitive.Title className="text-navy-900 text-2xl font-medium">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-gold-700 mt-1 text-sm">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            className="text-navy-900/70 hover:bg-navy-900/10 hover:text-navy-900 rounded-full p-1"
            aria-label="إغلاق"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
