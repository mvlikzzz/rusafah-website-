"use client";

import * as React from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

type Img = { path: string; altAr: string };

/** Hero image slider of the project page with dots and a full-screen view. */
export function ProjectGallery({
  images,
  children,
}: {
  images: Img[];
  children?: React.ReactNode;
}) {
  const [i, setI] = React.useState(0);
  const cur = images[i];
  if (!cur) return null;
  return (
    <div className="bg-navy-900 relative isolate min-h-[70svh] overflow-hidden">
      {images.map((im, k) => (
        <Image
          key={im.path}
          src={im.path}
          alt={k === i ? im.altAr : ""}
          fill
          priority={k === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-700",
            k === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        aria-hidden="true"
        className="from-navy-950/60 to-navy-950/70 absolute inset-0 bg-gradient-to-b via-transparent"
      />
      <div className="relative">{children}</div>
      {images.length > 1 ? (
        <div
          className="absolute start-1/2 bottom-6 flex translate-x-1/2 gap-2"
          role="group"
          aria-label="صور المشروع"
        >
          {images.map((im, k) => (
            <button
              key={im.path}
              type="button"
              aria-label={`الصورة ${k + 1}`}
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className="flex size-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block size-2.5 rounded-full",
                  k === i ? "bg-cream-100" : "bg-cream-100/40",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
      <Dialog.Root>
        <Dialog.Trigger
          className="border-cream-100/50 bg-navy-950/30 text-cream-100 hover:bg-navy-950/50 absolute start-6 bottom-16 rounded-full border p-3 backdrop-blur lg:start-8 lg:top-1/3 lg:bottom-auto"
          aria-label="عرض الصورة بالحجم الكامل"
        >
          <Maximize2 className="size-5" aria-hidden="true" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-navy-950/90 fixed inset-0 z-50" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">{cur.altAr}</Dialog.Title>
            <Image
              src={cur.path}
              alt={cur.altAr}
              width={1600}
              height={1000}
              className="max-h-[92vh] w-auto object-contain"
            />
            <Dialog.Close
              className="bg-cream-100/15 text-cream-100 hover:bg-cream-100/30 absolute end-4 top-4 rounded-full p-2"
              aria-label="إغلاق"
            >
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
