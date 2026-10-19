import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiamondTitle } from "@/components/ui/section-heading";
import { Riyal } from "@/components/ui/riyal";
import { DeferredProjectsMap } from "@/components/map/deferred-projects-map";
import { InterestDialog, VisitDialog } from "@/components/projects/lead-dialogs";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectHeroTitle, toHeroProject } from "@/components/projects/project-hero";
import { SalesRing } from "@/components/projects/sales-ring";
import { UnitsBrowser } from "@/components/projects/units-browser";
import { WarrantyTimeline } from "@/components/projects/warranty-timeline";
import { ShareButtons } from "@/components/patterns/share-buttons";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import {
  formatDecimal,
  formatInteger,
  formatSarRange,
  formatShortNumericDate,
  isoDateToDate,
} from "@/lib/format";
import { getProjectBySlug, listProjectSlugs } from "@/modules/projects/queries";
import { projectStatusLabel, propertyTypesLabel } from "@/modules/projects/vocabulary";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listProjectSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();
  const img = p.images.find((i) => i.kind === "hero") ?? p.images[0];
  return {
    title: `${p.nameEn} — ${p.nameAr}`,
    description:
      p.descriptionAr ??
      `${propertyTypesLabel(p.propertyTypes)} في ${p.city} - ${p.district} من رُصافة العقارية.`,
    openGraph: img ? { images: [{ url: img.path }] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();
  const heroImages = p.images.filter((i) => i.kind !== "card");
  const gallery = heroImages.length ? heroImages : p.images;
  const sideImage = p.images.find((i) => i.kind === "card") ?? p.images[0];
  const hero = toHeroProject({ ...p, cardImage: sideImage ?? null });
  const price = formatSarRange(p.priceMin, p.priceMax);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const hasDetails = price || p.landAreaSqm || p.modelsCount || p.unitsCount || p.floorsCount;
  const tiles: [string, React.ReactNode][] = [];
  if (p.landAreaSqm)
    tiles.push([
      COPY.project.area,
      <span key="a" className="font-latin">
        {formatDecimal(p.landAreaSqm, 0)} م<sup>2</sup>
      </span>,
    ]);
  if (p.modelsCount)
    tiles.push([
      COPY.project.models,
      <span key="m" className="font-latin">
        {formatInteger(p.modelsCount)}
      </span>,
    ]);
  if (p.unitsCount)
    tiles.push([
      COPY.project.units,
      <span key="u" className="font-latin">
        {formatInteger(p.unitsCount)}
      </span>,
    ]);
  if (p.floorsCount)
    tiles.push([
      COPY.project.floors,
      <span key="f" className="font-latin">
        {formatInteger(p.floorsCount)}
      </span>,
    ]);
  const projectName = `${p.nameEn} — ${p.nameAr}`;
  const pin =
    p.latitude && p.longitude
      ? [
          {
            slug: p.slug,
            nameEn: p.nameEn,
            nameAr: p.nameAr,
            lat: Number(p.latitude),
            lng: Number(p.longitude),
            precision: (p.locationPrecision === "exact" ? "exact" : "district") as
              "exact" | "district",
            district: p.district,
            city: p.city,
            typeLabel: propertyTypesLabel(p.propertyTypes),
            statusLabel: projectStatusLabel(p.status),
            image: sideImage?.path ?? null,
          },
        ]
      : [];

  return (
    <>
      <SiteHeader variant="overlay" current="/projects" />
      <FloatingContact />
      <main id="main">
        <ProjectGallery images={gallery}>
          <div className="container-site flex min-h-[70svh] flex-col justify-end gap-10 pt-32 pb-20 lg:flex-row lg:items-end lg:justify-between">
            {p.descriptionAr ? (
              <p className="text-cream-100 max-w-2xl text-justify text-xl leading-relaxed md:text-2xl lg:order-first">
                {p.descriptionAr}
              </p>
            ) : null}
            <ProjectHeroTitle project={hero} as="h1" className="shrink-0" />
          </div>
        </ProjectGallery>

        {/* Details */}
        <section
          className="bg-cream-200 grid lg:grid-cols-[1.5fr_1fr]"
          aria-labelledby="details-heading"
        >
          <div className="watermark-dark px-6 py-12 md:px-12 lg:px-20">
            <div className="flex items-center justify-between">
              <h2 id="details-heading" className="sr-only">
                تفاصيل المشروع
              </h2>
              <p className="flex items-center gap-4 text-2xl">
                <span
                  className={`inline-flex items-center gap-2 ${p.status === "sold" ? "text-status-sold" : "text-gold-700"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 ${p.status === "available" ? "bg-status-available rounded-full" : "diamond"}`}
                  />
                  {projectStatusLabel(p.status)}
                </span>
              </p>
              <div className="text-gold-600 flex items-center gap-3">
                <ShareButtons title={projectName} url={`${siteUrl}/projects/${p.slug}`} />
              </div>
            </div>

            {price ? (
              <div className="mt-8">
                <DiamondTitle className="text-gold-600">{COPY.project.price}</DiamondTitle>
                <p className="font-latin text-gold-600 mt-3 flex items-center gap-3 text-3xl font-bold tabular-nums md:text-4xl">
                  <span dir="ltr">{price}</span>
                  <Riyal className="h-[0.75em]" />
                </p>
              </div>
            ) : null}

            {pin.length ? (
              <a
                href="#location"
                className="border-gold-700 text-gold-700 hover:text-brown-800 mt-4 inline-flex items-center gap-2 border-b pb-1 text-lg"
              >
                {COPY.project.viewLocation}
                <ArrowUpLeft className="size-4" aria-hidden="true" />
              </a>
            ) : null}

            {tiles.length ? (
              <dl className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                {tiles.map(([k, v]) => (
                  <div
                    key={k}
                    className="border-gold-600/70 flex items-center justify-between rounded-md border px-6 py-5"
                  >
                    <dt className="text-gold-700 text-xl">{k}</dt>
                    <dd className="text-gold-600 text-3xl font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {p.unitsRemaining !== null ? (
              <p className="text-gold-700 mt-4 flex items-center gap-3 text-xl">
                <span>{COPY.project.unitsRemaining}</span>
                <span className="font-latin text-2xl font-medium">
                  {formatInteger(p.unitsRemaining)}
                </span>
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {p.units.length ? (
                <Button asChild variant="outline">
                  <a href="#units">
                    {COPY.project.viewUnits}
                    <ArrowUpLeft className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
              {p.visitAvailable && p.status !== "sold" ? (
                <VisitDialog projectId={p.id} projectName={projectName} />
              ) : null}
            </div>

            {p.status !== "sold" ? (
              <div className="mt-12 max-w-xl">
                <p className="text-gold-700 text-xl leading-relaxed">{COPY.project.profileIntro}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span aria-hidden="true" className="ornament-line text-gold-600 -scale-x-100" />
                  {p.profileDocumentPath ? (
                    <Button asChild variant="dark" size="lg">
                      <a href={p.profileDocumentPath} target="_blank" rel="noopener">
                        {COPY.project.projectProfile}
                      </a>
                    </Button>
                  ) : null}
                  <InterestDialog projectId={p.id} projectName={projectName} />
                </div>
              </div>
            ) : null}
            {!hasDetails && p.status !== "sold" ? (
              <p className="text-gold-700 mt-10 max-w-xl text-lg">
                تفاصيل الأسعار والمساحات لهذا المشروع تُنشر قريباً. سجّل اهتمامك ليتواصل معك أحد
                مستشارينا.
              </p>
            ) : null}
          </div>
          <div className="relative min-h-[28rem]">
            {sideImage ? (
              <Image
                src={sideImage.path}
                alt={sideImage.altAr}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="from-navy-950/80 absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent"
            />
            <div className="text-cream-100 absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
              {p.salesProgressPercent !== null ? (
                <div className="flex items-center gap-3">
                  <SalesRing percent={Number(p.salesProgressPercent)} />
                  <span className="flex items-center gap-2 text-xl">
                    <span aria-hidden="true" className="diamond text-gold-400" />
                    {COPY.project.salesRatio}
                  </span>
                </div>
              ) : (
                <span />
              )}
              {p.status === "available" ? (
                <span className="flex items-center gap-2 text-xl">
                  <span aria-hidden="true" className="diamond text-gold-400" />
                  {COPY.project.availableNow}
                </span>
              ) : null}
            </div>
            {p.brandLogoPath ? (
              <span
                aria-hidden="true"
                className="mask-icon text-cream-100 absolute start-8 top-8 block h-14 w-40"
                style={{ ["--mask" as string]: `url(${p.brandLogoPath})` }}
              />
            ) : null}
          </div>
        </section>

        {/* Features & warranties */}
        {p.features.length || p.warranties.length || p.constructionDate ? (
          <section className="bg-cream-200 py-16" aria-labelledby="features-heading">
            <div className="container-site">
              {p.features.length ? (
                <>
                  <DiamondTitle className="text-navy-900" as="h2">
                    <span id="features-heading">{COPY.project.features}</span>
                  </DiamondTitle>
                  <ul className="border-gold-600/70 mt-6 grid max-w-3xl gap-x-12 gap-y-4 rounded-xl border px-10 py-8 sm:grid-cols-2 lg:grid-cols-3">
                    {p.features.map((f) => (
                      <li key={f.id} className="text-navy-900 flex items-center gap-3 text-xl">
                        <Check className="text-gold-600 size-5" aria-hidden="true" />
                        {f.labelAr}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {p.constructionDate ? (
                <p className="text-navy-900 mt-8 flex items-center gap-3 text-2xl">
                  <span aria-hidden="true" className="diamond text-gold-500" />
                  {COPY.project.constructionDate}{" "}
                  <span className="font-latin tabular-nums">
                    {formatShortNumericDate(isoDateToDate(p.constructionDate))}
                  </span>
                </p>
              ) : null}
              {p.warranties.length ? (
                <div className="mt-16">
                  <h2 className="bg-gold-600 text-cream-100 inline-block rounded-md px-8 py-2 text-2xl">
                    {COPY.project.warranties}
                  </h2>
                  <div className="mt-12">
                    <WarrantyTimeline warranties={p.warranties} />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Units */}
        {p.units.length ? (
          <section
            id="units"
            className="watermark-light bg-navy-900 text-cream-100 py-16"
            aria-labelledby="units-heading"
          >
            <div className="container-site">
              <DiamondTitle as="h2" className="text-cream-100">
                <span id="units-heading">{COPY.project.unitsSection}</span>
              </DiamondTitle>
              <div className="mt-10">
                <UnitsBrowser units={p.units} />
              </div>
            </div>
          </section>
        ) : null}

        {/* Location */}
        {pin.length ? (
          <section
            id="location"
            className="watermark-light bg-navy-900 text-cream-100 pt-4 pb-20"
            aria-labelledby="location-heading"
          >
            <div className="container-wide">
              <DiamondTitle as="h2" className="text-cream-100">
                <span id="location-heading">{COPY.project.location}</span>
              </DiamondTitle>
              {pin[0]!.precision === "district" ? (
                <p className="text-cream-200/70 mt-2 text-sm">{COPY.project.approximateLocation}</p>
              ) : null}
              <DeferredProjectsMap pins={pin} activeSlug={p.slug} focus className="mt-8 h-[32rem]" />
            </div>
          </section>
        ) : null}
        <p className="sr-only">
          <Link href="/projects">العودة إلى كل المشاريع</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
