import type { Metadata } from "next";
import Image from "next/image";
import { ContactCards } from "@/components/contact/contact-cards";
import { ContactForm } from "@/components/contact/contact-form";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import { getSiteSettings } from "@/modules/site/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: COPY.contact.sectionText,
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader variant="overlay" current="/contact" />
      <FloatingContact />
      <main id="main">
        <section className="bg-navy-900 relative isolate overflow-hidden">
          <Image
            src="/images/brand/hero-building.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="bg-navy-950/50 absolute inset-0" />
          <div className="container-site relative grid items-start gap-12 pt-40 pb-24 lg:grid-cols-2">
            <div className="text-center lg:pt-16 lg:text-start">
              <h1 className="text-gold-400 text-5xl font-bold md:text-6xl">
                {COPY.contact.heroTitle}
              </h1>
              <p className="text-cream-200/90 mt-3 text-xl md:text-2xl">
                {COPY.contact.heroSubtitle}
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
        <section
          className="watermark-light bg-navy-900 py-20"
          aria-label={COPY.contact.sectionTitle}
        >
          <div className="container-site">
            <ContactCards settings={settings} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
