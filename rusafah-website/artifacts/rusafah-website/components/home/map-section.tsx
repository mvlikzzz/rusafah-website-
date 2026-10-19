"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DeferredProjectsMap } from "@/components/map/deferred-projects-map";
import type { MapPin } from "@/components/map/types";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { PROPERTY_TYPES, propertyTypeLabel } from "@/modules/projects/vocabulary";

type Props = {
  pins: MapPin[];
  districts: { city: string; district: string }[];
};

/** "خارطة رُصافة": filter bar (a GET form to /projects), the map, and the active-project card. */
export function MapSection({ pins, districts }: Props) {
  const [active, setActive] = React.useState<string | null>(pins[0]?.slug ?? null);
  const [listing, setListing] = React.useState<"sale" | "rent">("sale");
  const current = pins.find((p) => p.slug === active) ?? null;
  const idx = current ? pins.indexOf(current) : -1;
  const step = (d: number) => {
    if (!pins.length) return;
    setActive(pins[(idx + d + pins.length) % pins.length]!.slug);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-gold-600 flex items-center gap-3 text-2xl font-medium sm:text-3xl md:text-4xl">
          <span aria-hidden="true" className="diamond text-navy-900" />
          {COPY.home.mapTitle}
        </h2>
        <Link href="/projects" className="text-gold-700 inline-flex min-h-11 items-center text-lg underline-offset-4 hover:underline md:text-xl">
          {COPY.home.viewAllProjects}
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:relative md:block">
        <DeferredProjectsMap
          pins={pins}
          activeSlug={active}
          onActiveChange={setActive}
          className="order-2 h-[min(28rem,65svh)] md:order-none md:h-[46rem]"
        />

        {/* Filter bar */}
        <form
          action="/projects"
          method="get"
          className="order-1 z-10 flex flex-col gap-3 md:absolute md:inset-x-8 md:top-6 md:order-none md:flex-row md:items-center"
          aria-label="بحث في المشاريع"
        >
          <button
            type="submit"
            className="bg-navy-900 text-cream-100 hidden size-16 items-center justify-center rounded-full md:flex"
            aria-label="عرض النتائج"
          >
            <Search className="size-7" aria-hidden="true" />
          </button>
          <div className="md:border-cream-200/60 md:bg-cream-200/25 bg-navy-900/5 grid flex-1 grid-cols-2 items-center gap-2 rounded-md border border-transparent p-2 md:flex md:flex-wrap md:gap-3 md:p-3 md:backdrop-blur-md">
            <label className="sr-only" htmlFor="map-type">
              نوع العقار
            </label>
            <select
              id="map-type"
              name="types"
              className="select-brand bg-cream-200 text-navy-900 min-h-12 min-w-0 flex-1 rounded-xs py-3 md:min-w-44"
            >
              <option value="">نوع العقــــار</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {propertyTypeLabel(t)}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="map-district">
              المنطقة
            </label>
            <select
              id="map-district"
              name="district"
              className="select-brand bg-cream-200 text-navy-900 min-h-12 min-w-0 flex-1 rounded-xs py-3 md:min-w-44"
            >
              <option value="">المنطقـة</option>
              {districts.map((d) => (
                <option key={`${d.city}-${d.district}`} value={d.district}>
                  {d.city} - {d.district}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="map-q">
              البحث حسب الاسم
            </label>
            <input
              id="map-q"
              name="q"
              placeholder="البحث حسب"
              className="bg-cream-200 text-navy-900 placeholder:text-gold-700/80 col-span-2 min-h-12 min-w-0 flex-1 rounded-xs px-4 py-3 md:min-w-40"
            />
            <Button type="submit" variant="gold" className="col-span-2 min-h-12 rounded-xs py-3">
              عرض
            </Button>
          </div>
          <div
            className="bg-navy-900 text-cream-100 grid grid-cols-2 overflow-hidden rounded-md md:flex"
            role="group"
            aria-label="نوع العرض"
          >
            {(["sale", "rent"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={listing === v}
                onClick={() => setListing(v)}
                className={cn(
                  "min-h-12 px-6 py-3 text-lg",
                  listing === v ? "text-gold-400" : "opacity-75 hover:opacity-100",
                )}
              >
                {v === "sale" ? "بيــع" : "ايجار"}
              </button>
            ))}
            <input type="hidden" name="listing" value={listing} />
          </div>
        </form>

        {/* Active project card */}
        {current ? (
          <aside
            className="bg-navy-900 text-cream-100 shadow-glow order-3 z-10 overflow-hidden rounded-md md:absolute md:start-8 md:bottom-8 md:order-none md:w-80"
            aria-live="polite"
          >
            <div className="relative grid min-h-44 grid-cols-[8.5rem_1fr] md:block md:aspect-[3/4] md:min-h-0">
              {current.image ? (
                <div className="relative md:absolute md:inset-0">
                  <Image
                    src={current.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 20rem, 8.5rem"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-navy-800 md:hidden" aria-hidden="true" />
              )}
              <div
                aria-hidden="true"
                className="from-navy-950/90 via-navy-950/20 absolute inset-0 hidden bg-gradient-to-t to-transparent md:block"
              />
              <div className="absolute start-2 top-2 z-10 flex gap-1 md:start-3 md:top-3">
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="المشروع التالي"
                  className="bg-navy-950/75 hover:bg-navy-950/90 inline-flex size-11 items-center justify-center rounded-full md:size-auto md:bg-cream-100/15 md:p-1.5 md:hover:bg-cream-100/30"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="المشروع السابق"
                  className="bg-navy-950/75 hover:bg-navy-950/90 inline-flex size-11 items-center justify-center rounded-full md:size-auto md:bg-cream-100/15 md:p-1.5 md:hover:bg-cream-100/30"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
              </div>
              <div className="relative min-w-0 p-4 md:absolute md:inset-x-0 md:bottom-0 md:p-5">
                <p className="flex items-center gap-2 text-base md:text-lg">
                  <span aria-hidden="true" className="bg-status-available size-2 rounded-full" />
                  {current.statusLabel}
                </p>
                <h3 className="mt-1 text-xl md:mt-2 md:text-2xl">{current.nameAr}</h3>
                <p className="font-latin text-cream-200/80 text-sm tracking-widest uppercase">
                  {current.nameEn.replace(" ", "")} {current.typeLabel && ""}
                </p>
                <p className="text-gold-400 mt-1 text-base md:mt-2 md:text-xl">{current.typeLabel}</p>
                <p className="text-gold-400 text-base md:text-xl">
                  {current.city} - {current.district}
                </p>
                <Link
                  href={`/projects/${current.slug}`}
                  className="mt-1 inline-flex min-h-11 items-center text-sm underline underline-offset-4 md:mt-3 md:min-h-0"
                >
                  عرض المشروع
                </Link>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
