"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { propertyTypesLabel, projectStatusLabel } from "@/modules/projects/vocabulary";

export type CarouselProject = {
  slug: string;
  code: string;
  nameEn: string;
  district: string;
  propertyTypes: string[];
  status: string;
  image: string | null;
  imageAlt: string;
};

/** Three-up carousel with the centre card raised, as on the home artboard. */
export function ProjectsCarousel({ projects }: { projects: CarouselProject[] }) {
  const [index, setIndex] = React.useState(Math.min(1, Math.max(0, projects.length - 1)));
  const n = projects.length;
  if (n === 0) return null;
  return (
    <div>
      <MobileTrack projects={projects} />
      <div className="hidden md:block">
        <DesktopCarousel projects={projects} index={index} setIndex={setIndex} />
      </div>
      <div className="mt-8 flex justify-center md:hidden">
        <Button asChild variant="light">
          <Link href="/projects">{COPY.home.exploreMore}</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Phones: one card per view on a native scroll-snap track, with previous/next
 * buttons and a position counter. Swipe and buttons stay in sync.
 */
function MobileTrack({ projects }: { projects: CarouselProject[] }) {
  const trackRef = React.useRef<HTMLUListElement>(null);
  const [current, setCurrent] = React.useState(0);
  const n = projects.length;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    setCurrent(Math.max(0, Math.min(n - 1, i)));
  };

  const go = (i: number) => {
    const el = trackRef.current;
    const target = (i + n) % n;
    const child = el?.children[target] as HTMLElement | undefined;
    if (!el || !child) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    child.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "start" });
    setCurrent(target);
  };

  return (
    <div className="md:hidden" aria-roledescription="carousel" aria-label="مشاريعنا">
      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="snap-x-track scrollbar-none flex"
        tabIndex={0}
        aria-label="قائمة المشاريع، اسحب للتنقل"
      >
        {projects.map((p, i) => (
          <li
            key={p.slug}
            className="w-full shrink-0 snap-start"
            aria-roledescription="slide"
            aria-label={`${i + 1} من ${n}`}
          >
            <Link href={`/projects/${p.slug}`} className="group block">
              <div className="bg-navy-800 relative aspect-[4/3] overflow-hidden rounded-xs">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="text-cream-100 flex items-start justify-between gap-4 pt-4">
                <div className="min-w-0">
                  <h3 className="font-latin text-xl font-semibold tracking-wide">{p.nameEn}</h3>
                  <span aria-hidden="true" className="bg-cream-100/70 mt-1 block h-px w-20" />
                  <p className="mt-2 text-lg">{propertyTypesLabel(p.propertyTypes)}</p>
                  <p className="text-lg">{p.district}</p>
                </div>
                {p.status === "available" ? (
                  <span className="border-cream-100/60 mt-1 shrink-0 rounded-sm border px-3 py-1 text-sm">
                    متاح الآن
                  </span>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {n > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label="المشروع السابق"
            className="text-gold-400 border-gold-500/50 inline-flex size-12 items-center justify-center rounded-full border"
          >
            <ArrowRight className="size-6" aria-hidden="true" />
          </button>
          <p dir="ltr" className="font-latin text-cream-200 tabular-nums" aria-live="polite">
            {current + 1} / {n}
          </p>
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label="المشروع التالي"
            className="text-gold-400 border-gold-500/50 inline-flex size-12 items-center justify-center rounded-full border"
          >
            <ArrowLeft className="size-6" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DesktopCarousel({
  projects,
  index,
  setIndex,
}: {
  projects: CarouselProject[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const n = projects.length;
  const at = (offset: number) => projects[(index + offset + n) % n]!;
  const visible = n >= 3 ? [at(-1), at(0), at(1)] : projects;
  const pages = Math.max(1, Math.ceil(n / 3));

  return (
    <div>
      <div className="relative">
        <div className="grid items-end gap-6 md:grid-cols-3" aria-live="polite">
          {visible.map((p, i) => {
            const center = n >= 3 && i === 1;
            return (
              <article
                key={p.slug}
                className={cn(
                  "group transition-transform duration-500",
                  center ? "md:scale-105" : "md:opacity-90",
                )}
              >
                <Link href={`/projects/${p.slug}`} className="block">
                  <div
                    className={cn(
                      "bg-navy-800 relative overflow-hidden",
                      center ? "aspect-[16/15]" : "aspect-[3/4]",
                    )}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        sizes="(min-width: 768px) 33vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>
                  <div className="text-cream-100 flex items-start justify-between gap-4 pt-4">
                    <div>
                      <h3 className="font-latin text-2xl font-semibold tracking-wide">
                        {p.nameEn}
                      </h3>
                      <span aria-hidden="true" className="bg-cream-100/70 mt-1 block h-px w-24" />
                      <p className="mt-2 text-xl">{propertyTypesLabel(p.propertyTypes)}</p>
                      <p className="text-xl">{p.district}</p>
                    </div>
                    {center && p.status === "available" ? (
                      <span className="border-cream-100/60 mt-1 rounded-sm border px-3 py-1 text-sm">
                        {projectStatusLabel(p.status) === "متاح للبيع"
                          ? "متاح الآن"
                          : projectStatusLabel(p.status)}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        {n > 3 ? (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + n) % n)}
              aria-label="المشروع السابق"
              className="text-gold-500 hover:text-gold-400 absolute -start-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 lg:block"
            >
              <ArrowRight className="size-8" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % n)}
              aria-label="المشروع التالي"
              className="text-gold-500 hover:text-gold-400 absolute -end-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 lg:block"
            >
              <ArrowLeft className="size-8" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <Button asChild variant="light">
          <Link href="/projects">{COPY.home.exploreMore}</Link>
        </Button>
        {n > 3 ? (
          <div className="flex gap-2" role="group" aria-label="صفحات المشاريع">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`الصفحة ${i + 1}`}
                aria-pressed={Math.floor(index / 3) === i}
                onClick={() => setIndex(Math.min(n - 1, i * 3 + 1))}
                className="flex size-6 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block size-2.5 rounded-full",
                    Math.floor(index / 3) === i ? "bg-gold-500" : "bg-cream-100/40",
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
