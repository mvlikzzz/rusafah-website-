import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { COPY } from "@/lib/copy";
import { propertyTypesLabel } from "@/modules/projects/vocabulary";

export type HeroProject = {
  slug: string;
  code: string;
  nameEn: string;
  nameAr: string;
  brandLogoPath: string | null;
  city: string;
  district: string;
  propertyTypes: string[];
  visitAvailable: boolean;
  image: string | null;
  imageAlt: string;
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-cream-100/80 relative flex items-end justify-between gap-4 border-b pb-2 text-lg sm:text-xl md:text-2xl">
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 text-end">{value}</span>
      <span
        aria-hidden="true"
        className="bg-cream-100 absolute end-0 -bottom-[3.5px] size-1.5 rotate-45"
      />
      <span
        aria-hidden="true"
        className="bg-cream-100 absolute start-0 -bottom-[3.5px] size-1.5 rotate-45"
      />
    </div>
  );
}

/** The spec lines drawn over the hero: "الموقع ——◆ الرياض - الريان" etc. */
export function ProjectHeroSpecs({
  project,
  className,
}: {
  project: HeroProject;
  className?: string;
}) {
  return (
    <div className={cn("text-cream-100 space-y-7", className)}>
      <SpecRow label={COPY.project.locationLabel} value={`${project.city} - ${project.district}`} />
      <SpecRow label={COPY.project.typeLabel} value={propertyTypesLabel(project.propertyTypes)} />
      {project.visitAvailable ? (
        <div className="flex items-center justify-end gap-3 text-lg sm:text-xl md:text-2xl">
          <span>{COPY.project.visitAvailable}</span>
          <span aria-hidden="true" className="bg-cream-100/80 relative inline-block h-px w-14">
            <span className="bg-status-available absolute start-0 -top-[3px] size-1.5 rotate-45" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** Title block: "14 RUSAFAH" with the two-tone rule and the project's own wordmark. */
export function ProjectHeroTitle({
  project,
  className,
  as: Tag = "h2",
}: {
  project: HeroProject;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("text-cream-100", className)}>
      <Tag className="font-latin text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl">
        <span className="tabular-nums">{project.code}</span> RUSAFAH
      </Tag>
      <div aria-hidden="true" className="mt-2 flex h-0.5 w-44 max-w-full sm:w-52">
        <span className="bg-cream-100/90 flex-1" />
        <span className="bg-navy-600 w-16" />
      </div>
      {project.brandLogoPath ? (
        <span
          role="img"
          aria-label={project.nameAr}
          className="mask-icon text-cream-100 mt-5 block h-12 w-40 max-w-full sm:h-16 sm:w-48"
          style={{ ["--mask" as string]: `url(${project.brandLogoPath})` }}
        />
      ) : (
        <p className="mt-4 text-2xl">{project.nameAr}</p>
      )}
    </div>
  );
}

/** The strip of featured projects along the bottom of the hero. */
export function ProjectTabs({
  projects,
  activeSlug,
  onSelect,
  className,
}: {
  projects: HeroProject[];
  activeSlug?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
}) {
  return (
    <div
      role={onSelect ? "tablist" : undefined}
      aria-label="المشاريع المميزة"
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-6 lg:grid-cols-4",
        className,
      )}
    >
      {projects.map((p) => {
        const active = p.slug === activeSlug;
        const inner = (
          <>
            <span
              className={cn(
                "font-latin block text-base font-medium tracking-wide transition-all sm:text-lg md:text-xl",
                active && "text-xl sm:text-2xl md:text-3xl",
              )}
            >
              <span className="tabular-nums">{p.code}</span> RUSAFAH
            </span>
            <span aria-hidden="true" className="mt-1 flex h-0.5">
              <span className="bg-cream-100/80 flex-1" />
              <span className={cn("bg-navy-600 w-10", active && "bg-gold-500")} />
            </span>
            <span
              className={cn("mt-2 block text-sm leading-snug sm:text-lg md:text-xl", active && "text-base sm:text-2xl")}
            >
              {propertyTypesLabel(p.propertyTypes)}
            </span>
            <span className={cn("block text-sm leading-snug sm:text-lg md:text-xl", active && "text-base sm:text-2xl")}>
              {p.district}
            </span>
          </>
        );
        const classes = cn(
          "block min-h-11 min-w-0 py-1 text-start text-cream-100 transition-opacity",
          !active && "opacity-85 hover:opacity-100",
        );
        return onSelect ? (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`hero-slide-${p.slug}`}
            id={`hero-tab-${p.slug}`}
            onClick={() => onSelect(p.slug)}
            className={classes}
          >
            {inner}
          </button>
        ) : (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            aria-current={active ? "true" : undefined}
            className={classes}
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

/** Full-viewport project hero used on /projects and /projects/latest. */
export function ProjectHero({
  project,
  tabs,
  priority = false,
  className,
  id,
  titleAs = "h2",
}: {
  project: HeroProject;
  tabs: HeroProject[];
  priority?: boolean;
  className?: string;
  id?: string;
  titleAs?: "h1" | "h2";
}) {
  return (
    <section
      id={id}
      aria-label={project.nameEn}
      className={cn(
        "bg-navy-900 relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden",
        className,
      )}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div aria-hidden="true" className="bg-navy-950/55 absolute inset-0" />
      <div
        aria-hidden="true"
        className="from-navy-950/80 absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t to-transparent"
      />
      <div className="container-site relative flex flex-1 flex-col justify-center pt-28 pb-10 md:pt-32">
        <div className="max-w-xl min-w-0">
          <ProjectHeroTitle project={project} as={titleAs} />
          <ProjectHeroSpecs project={project} className="mt-12" />
          <Link
            href={`/projects/${project.slug}`}
            className="text-gold-400 mt-10 inline-block text-lg underline-offset-4 hover:underline"
          >
            تفاصيل المشروع ←
          </Link>
        </div>
      </div>
      <div className="container-wide relative pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10">
        <ProjectTabs projects={tabs} activeSlug={project.slug} />
      </div>
    </section>
  );
}

/** Maps a catalogue row to the hero shape. */
export function toHeroProject(p: {
  slug: string;
  code: string;
  nameEn: string;
  nameAr: string;
  brandLogoPath: string | null;
  city: string;
  district: string;
  propertyTypes: string[];
  visitAvailable: boolean;
  cardImage: { path: string; altAr: string } | null;
  heroImage?: { path: string; altAr: string } | null;
}): HeroProject {
  const img = p.heroImage ?? p.cardImage;
  return {
    slug: p.slug,
    code: p.code,
    nameEn: p.nameEn,
    nameAr: p.nameAr,
    brandLogoPath: p.brandLogoPath,
    city: p.city,
    district: p.district,
    propertyTypes: p.propertyTypes,
    visitAvailable: p.visitAvailable,
    image: img?.path ?? null,
    imageAlt: img?.altAr ?? p.nameAr,
  };
}
