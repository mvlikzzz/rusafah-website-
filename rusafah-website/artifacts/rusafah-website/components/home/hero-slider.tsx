"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ProjectHeroSpecs,
  ProjectHeroTitle,
  ProjectTabs,
  type HeroProject,
} from "@/components/projects/project-hero";
import { Pill } from "@/components/ui/badge";
import { COPY } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { nextSlide } from "@/lib/carousel";
import { heroSlideReducer, initialHeroSlideState } from "@/lib/hero-slides";
import { useAutoplay } from "@/lib/hooks/use-autoplay";
import { useInViewport } from "@/lib/hooks/use-in-viewport";

type Props = {
  taglineAr: string;
  taglineEn: string;
  brandImage: string;
  projects: HeroProject[];
};

const AUTO_MS = 7000;

/**
 * Home hero: slide 0 is the brand statement, then one slide per featured
 * project; the strip of project tabs switches slides. Auto-advance pauses on
 * hover, focus and when motion is reduced.
 */
export function HeroSlider({ taglineAr, taglineEn, brandImage, projects }: Props) {
  const [slides, dispatch] = React.useReducer(heroSlideReducer, initialHeroSlideState);
  const { active, requested, ready, failed } = slides;
  const loading = requested !== active;
  const failedImages = React.useRef(new Set<string>());
  const [attempts, retry] = React.useReducer(
    (counts: Record<string, number>, slug: string) => ({
      ...counts,
      [slug]: (counts[slug] ?? 0) + 1,
    }),
    {},
  );
  const [paused, setPaused] = React.useState(false);
  const { ref, isInViewport } = useInViewport<HTMLElement>();
  const slugs = React.useMemo(() => projects.map((project) => project.slug), [projects]);
  const select = React.useCallback((slug: string | null) => {
    // Remount only a failed picture when retrying, including failed preloads.
    if (slug && failedImages.current.delete(slug)) retry(slug);
    dispatch({ type: "select", slug });
    if (slug && !projects.find((project) => project.slug === slug)?.image) {
      dispatch({ type: "failed", slug });
    }
  }, [projects]);
  const advance = React.useCallback(
    () => select(nextSlide(slugs, active)),
    [slugs, active, select],
  );
  useAutoplay(advance, AUTO_MS, !paused && !loading && !failed && isInViewport && projects.length > 0);

  const current = projects.find((p) => p.slug === active) ?? null;
  const upcoming = nextSlide(slugs, active);

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="أحدث مشاريع رُصافة"
      aria-busy={loading}
      className="bg-navy-900 relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Load only the requested/next picture; retain decoded images for crossfades. */}
      <Image
        src={brandImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {projects.filter((p) => p.slug === requested || p.slug === upcoming || ready.includes(p.slug)).map((p) =>
        p.image ? (
          <Image
            key={`${p.slug}-${attempts[p.slug] ?? 0}`}
            src={p.image}
            alt={p.imageAlt}
            fill
            loading="eager"
            sizes="100vw"
            onLoad={() => {
              failedImages.current.delete(p.slug);
              dispatch({ type: "ready", slug: p.slug });
            }}
            onError={() => {
              failedImages.current.add(p.slug);
              dispatch({ type: "failed", slug: p.slug });
            }}
            aria-hidden={active !== p.slug}
            data-project-image={p.slug}
            className={cn(
              "object-cover transition-opacity duration-700 motion-reduce:transition-none",
              current?.slug === p.slug ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null,
      )}
      <div aria-hidden="true" className="bg-navy-950/45 absolute inset-0" />
      <div
        aria-hidden="true"
        className="from-navy-950/85 via-navy-950/30 absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t to-transparent"
      />

      <div
        className="container-site relative flex flex-1 flex-col justify-center pt-28 pb-8 md:pt-32"
        aria-live="polite"
      >
        {current ? (
          <div
            id={`hero-slide-${current.slug}`}
            role="tabpanel"
            aria-labelledby={`hero-tab-${current.slug}`}
            className="animate-rise max-w-xl min-w-0"
          >
            <ProjectHeroTitle project={current} />
            <ProjectHeroSpecs project={current} className="mt-12" />
            <Link
              href={`/projects/${current.slug}`}
              className="text-gold-400 mt-10 inline-block text-lg underline-offset-4 hover:underline"
            >
              تفاصيل المشروع ←
            </Link>
          </div>
        ) : (
          <div className="animate-rise mx-auto max-w-3xl text-center">
            <h1 className="font-display text-cream-100 text-[clamp(2.5rem,13vw,3.75rem)] leading-[1.15] break-words md:text-8xl">
              {taglineAr}
            </h1>
            <p className="font-latin text-gold-400 mt-2 text-xl sm:text-2xl md:text-4xl">{taglineEn}</p>
            <Link
              href="/projects/latest"
              className="mt-10 inline-flex md:mt-14 flex-col items-center gap-3 focus-visible:outline-offset-8"
            >
              <Pill className="text-xl">{COPY.home.latestProjects}</Pill>
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="bg-cream-100/80 size-1.5 rounded-full" />
                <span className="bg-cream-100/80 size-1.5 rounded-full" />
                <span className="bg-cream-100/80 size-1.5 rounded-full" />
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="container-wide relative pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10">
        {loading ? (
          <p role="status" className="text-cream-100 mb-3 text-sm">
            جارٍ تحميل صورة المشروع…
          </p>
        ) : null}
        {failed ? (
          <p role="status" className="text-cream-100 mb-3 text-sm">
            تعذر تحميل صورة المشروع. يرجى الضغط على اسمه للمحاولة مجددًا.
          </p>
        ) : null}
        <ProjectTabs
          projects={projects}
          activeSlug={active}
          onSelect={select}
        />
      </div>
    </section>
  );
}
