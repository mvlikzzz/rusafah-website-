import type { Metadata } from "next";
import { ArtworkImg } from "@/components/patterns/artwork-img";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { RusafahSeal } from "@/components/patterns/rusafah-seal";
import { Stat } from "@/components/patterns/stat";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import {
  getSiteSettings,
  listCertificates,
  listCompanyStats,
  listPartners,
} from "@/modules/site/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "عن رُصافة",
  description: COPY.about.conceptText,
};

export default async function AboutPage() {
  const [settings, stats, certificates, partners] = await Promise.all([
    getSiteSettings(),
    listCompanyStats(),
    listCertificates(),
    listPartners(),
  ]);
  return (
    <>
      <SiteHeader variant="overlay" current="/about" />
      <FloatingContact />
      <main id="main">
        <section className="bg-navy-900 relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden text-center">
          <Image
            src="/images/brand/hero-building.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="bg-navy-950/45 absolute inset-0" />
          <div className="relative px-6 pt-24">
            <h1 className="font-display text-cream-100 text-[clamp(2.5rem,13vw,3.75rem)] leading-[1.15] break-words md:text-8xl">
              {settings.taglineAr}
            </h1>
            <p className="font-latin text-gold-400 mt-2 text-2xl md:text-4xl">
              {settings.taglineEn}
            </p>
          </div>
        </section>

        <section className="watermark-dark bg-cream-200 py-20" aria-labelledby="about-heading">
          <div className="container-site">
            <h2 id="about-heading" className="text-gold-600 text-4xl font-medium md:text-5xl">
              {COPY.about.title}
            </h2>
            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_1px_2fr]">
              <div className="flex justify-center">
                <RusafahSeal className="text-navy-900 h-52 w-52" />
              </div>
              <div aria-hidden="true" className="bg-gold-700/50 hidden h-full w-px lg:block" />
              <div className="grid gap-10 sm:grid-cols-2">
                {stats.map((s) => (
                  <Stat key={s.key} stat={s} />
                ))}
              </div>
            </div>

            <div className="mt-24 grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-gold-600 text-3xl font-medium md:text-4xl">
                  {COPY.about.conceptTitle}
                </h2>
                <p className="mt-6 text-justify text-xl leading-relaxed md:text-2xl">
                  {COPY.about.conceptText}
                </p>
                {settings.profileDocumentPath ? (
                  <div className="mt-10 flex items-center gap-4">
                    <span aria-hidden="true" className="ornament-line text-gold-600 -scale-x-100" />
                    <Button asChild variant="dark" size="lg">
                      <a href={settings.profileDocumentPath} target="_blank" rel="noopener">
                        {COPY.home.profileButton}
                      </a>
                    </Button>
                  </div>
                ) : null}
              </div>
              <Image
                src="/images/brand/profile-book.jpg"
                alt={COPY.about.profileAlt}
                width={1536}
                height={1024}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="w-full"
              />
            </div>
          </div>
        </section>

        <section
          className="watermark-light bg-navy-900 text-cream-100 py-20"
          aria-labelledby="why-heading"
        >
          <div className="container-site">
            <SectionHeading title={COPY.about.whyTitle} pill tone="light" />
            <p className="text-cream-200/90 mx-auto mt-8 max-w-3xl text-center text-xl leading-relaxed">
              {COPY.about.whyText}
            </p>
            <ul className="lg:divide-cream-100/25 mt-16 grid gap-10 text-center md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse">
              {COPY.features.map((f) => (
                <li key={f.title} className="lg:px-6">
                  <span
                    aria-hidden="true"
                    className="mask-icon text-gold-400 mx-auto block h-12 w-14"
                    style={{ ["--mask" as string]: `url(${f.icon})` }}
                  />
                  <h3 className="text-gold-400 mt-4 text-2xl font-medium">{f.title}</h3>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-cream-200 py-20" aria-labelledby="certificates-heading">
          <div className="container-site">
            <SectionHeading
              title={COPY.about.certificatesTitle}
              pill
              className="[&_h2]:bg-espresso [&_h2]:text-cream-200"
            />
            <ul className="mx-auto mt-12 grid max-w-4xl gap-x-16 gap-y-8 md:grid-cols-2">
              {certificates.map((c) => (
                <li key={c.id}>
                  <h3 className="text-gold-600 mb-2 text-2xl">{c.titleAr}</h3>
                  <div className="flex h-24 items-center justify-center rounded-xs bg-white px-6">
                    <ArtworkImg
                      src={c.logoPath}
                      alt={c.issuerAr}
                      className="max-h-16 w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="partners"
          className="watermark-light bg-navy-900 text-cream-100 py-20"
          aria-labelledby="partners-heading"
        >
          <div className="container-site">
            <SectionHeading title={COPY.about.partnersTitle} pill tone="light" />
            <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {partners.map((p) => (
                <li
                  key={p.nameAr}
                  className="bg-cream-100/5 flex aspect-square items-center justify-center rounded-sm p-6"
                >
                  <ArtworkImg
                    src={p.logoPath}
                    alt={p.nameAr}
                    className="max-h-24 w-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
