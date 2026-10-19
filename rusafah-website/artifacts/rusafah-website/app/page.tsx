import Image from "next/image";
import { ArtworkImg } from "@/components/patterns/artwork-img";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { MapSection } from "@/components/home/map-section";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stat } from "@/components/patterns/stat";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import {
  getFilterOptions,
  listActiveProjects,
  listFeaturedProjects,
  listMappedProjects,
} from "@/modules/projects/queries";
import { propertyTypesLabel, projectStatusLabel } from "@/modules/projects/vocabulary";
import { getSiteSettings, listCompanyStats, listPartners } from "@/modules/site/queries";
import type { HeroProject } from "@/components/projects/project-hero";
import type { MapPin } from "@/components/map/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featured, active, mapped, stats, partners, options] = await Promise.all([
    getSiteSettings(),
    listFeaturedProjects(),
    listActiveProjects(9),
    listMappedProjects(),
    listCompanyStats(),
    listPartners(),
    getFilterOptions(),
  ]);

  const heroProjects: HeroProject[] = featured
    .slice()
    .sort((a, b) => b.code.localeCompare(a.code))
    .map((p) => ({
      slug: p.slug,
      code: p.code,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      brandLogoPath: p.brandLogoPath,
      city: p.city,
      district: p.district,
      propertyTypes: p.propertyTypes,
      visitAvailable: p.visitAvailable,
      image: p.cardImage?.path ?? null,
      imageAlt: p.cardImage?.altAr ?? p.nameAr,
    }));

  const pins: MapPin[] = mapped
    .filter((p) => p.status === "available" || p.status === "coming_soon")
    .map((p) => ({
      slug: p.slug,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      lat: Number(p.latitude),
      lng: Number(p.longitude),
      precision: p.locationPrecision === "exact" ? "exact" : "district",
      district: p.district,
      city: p.city,
      typeLabel: propertyTypesLabel(p.propertyTypes),
      statusLabel: projectStatusLabel(p.status),
      image: p.cardImage?.path ?? null,
    }));

  const headline = stats.filter((s) => s.key !== "portfolio_value_million_sar");

  return (
    <>
      <SiteHeader variant="overlay" current="/" />
      <FloatingContact />
      <main id="main">
        <HeroSlider
          taglineAr={settings.taglineAr}
          taglineEn={settings.taglineEn}
          brandImage="/images/brand/hero-building.jpg"
          projects={heroProjects}
        />

        {/* About */}
        <section className="watermark-dark bg-cream-200 py-16 md:py-24" aria-labelledby="about-title">
          <div className="container-site grid items-start gap-14 lg:grid-cols-2">
            <div>
              <h2
                id="about-title"
                className="border-gold-600 border-s-2 ps-4 text-3xl font-medium sm:text-4xl md:text-5xl"
              >
                {COPY.home.aboutTitle}
              </h2>
              <p className="mt-6 text-lg leading-relaxed sm:text-justify sm:text-xl md:mt-8 md:text-2xl">
                {COPY.home.aboutText}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {settings.profileDocumentPath ? (
                  <span className="flex items-center gap-4">
                    <span aria-hidden="true" className="ornament-line text-gold-600 -scale-x-100" />
                    <Button asChild variant="dark" size="lg">
                      <a href={settings.profileDocumentPath} target="_blank" rel="noopener">
                        {COPY.home.profileButton}
                      </a>
                    </Button>
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="border-gold-700/70 w-full rounded-[4rem] border px-5 py-10 sm:rounded-[10rem] sm:px-10 md:px-16">
                <div className="grid gap-8">
                  {headline.map((s) => (
                    <Stat key={s.key} stat={s} />
                  ))}
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/about">
                  {COPY.home.learnMore}
                  <ArrowUpLeft className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          className="bg-brown-900 text-cream-100 relative isolate overflow-hidden py-16 md:py-24"
          aria-labelledby="features-title"
        >
          <Image
            src="/images/brand/gradient-brown.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-80"
          />
          <div className="container-site">
            <SectionHeading title={COPY.home.featuresTitle} ornament tone="light" />
            <ul className="lg:divide-cream-100/30 mt-10 grid gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse">
              {COPY.features.map((f) => (
                <li key={f.title} className="lg:px-8">
                  <span
                    aria-hidden="true"
                    className="mask-icon text-gold-400 block h-12 w-14"
                    style={{ ["--mask" as string]: `url(${f.icon})` }}
                  />
                  <h3 className="text-gold-400 mt-4 text-2xl font-medium">{f.title}</h3>
                  <p className="text-cream-200/90 mt-3 leading-relaxed sm:text-justify">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Projects carousel */}
        <section className="watermark-light bg-navy-900 py-16 md:py-24" aria-labelledby="projects-title">
          <div className="container-site">
            <SectionHeading
              title={COPY.home.projectsTitle}
              description={COPY.home.projectsText}
              tone="light"
            />
            <div className="mt-10 md:mt-14">
              <ProjectsCarousel
                projects={active.map((p) => ({
                  slug: p.slug,
                  code: p.code,
                  nameEn: p.nameEn,
                  district: p.district,
                  propertyTypes: p.propertyTypes,
                  status: p.status,
                  image: p.cardImage?.path ?? null,
                  imageAlt: p.cardImage?.altAr ?? p.nameAr,
                }))}
              />
            </div>
          </div>
        </section>

        {/* Partners + map */}
        <section className="bg-cream-200 py-16 md:py-20" aria-labelledby="partners-title">
          <div className="container-site">
            <SectionHeading
              title={COPY.home.partnersTitle}
              pill
              className="[&_h2]:bg-navy-900/5 [&_h2]:text-navy-900"
            />
            <ul className="bg-cream-100/60 mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-6 rounded-md px-5 py-8 sm:gap-x-14 sm:gap-y-8 sm:px-10 sm:py-10">
              {partners.map((p) => (
                <li key={p.nameAr} className="flex h-20 items-center">
                  {p.websiteUrl ? (
                    <a href={p.websiteUrl} target="_blank" rel="noopener" aria-label={p.nameAr}>
                      <ArtworkImg
                        src={p.logoPath}
                        alt={p.nameAr}
                        className="h-12 w-auto max-w-32 object-contain sm:h-16 sm:max-w-40"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <ArtworkImg
                      src={p.logoPath}
                      alt={p.nameAr}
                      className="h-12 w-auto max-w-32 object-contain sm:h-16 sm:max-w-40"
                      loading="lazy"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="container-wide mt-14 md:mt-20">
            <MapSection pins={pins} districts={options.districts} />
          </div>
        </section>
      </main>
      <SiteFooter withBrandBand />
    </>
  );
}
