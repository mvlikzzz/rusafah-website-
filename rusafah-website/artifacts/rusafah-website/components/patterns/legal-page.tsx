import { notFound } from "next/navigation";
import { ContentBlocks } from "@/components/patterns/content-blocks";
import { ContactCards } from "@/components/contact/contact-cards";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { parseContentBlocks } from "@/lib/content-blocks";
import { formatGregorianLong, formatHijriForScreen, isoDateToDate } from "@/lib/format";
import { getLegalDocument, getSiteSettings } from "@/modules/site/queries";

/** Privacy policy and terms share this navy layout from the artboards. */
export async function LegalPage({ slug }: { slug: string }) {
  const [doc, settings] = await Promise.all([getLegalDocument(slug), getSiteSettings()]);
  if (!doc) notFound();
  const blocks = parseContentBlocks(doc.body);
  const effective = doc.effectiveDate ? isoDateToDate(doc.effectiveDate) : null;
  return (
    <>
      <SiteHeader variant="dark" current={`/${slug}`} />
      <FloatingContact />
      <main id="main" className="watermark-light bg-navy-900 text-cream-100">
        <article className="container-site py-16">
          <h1 className="text-gold-400 flex items-center gap-4 text-4xl font-medium md:text-5xl">
            <span aria-hidden="true" className="diamond text-cream-100" />
            {doc.titleAr}
          </h1>
          {effective ? (
            <p className="text-cream-200/70 mt-3 text-sm">
              آخر تحديث: {formatGregorianLong(effective)}{" "}
              <span className="opacity-70">({formatHijriForScreen(effective)})</span>
            </p>
          ) : null}
          <ContentBlocks blocks={blocks} tone="legal" className="mt-10 max-w-5xl" />
        </article>
        <section className="container-site pb-20" aria-label="قنوات التواصل">
          <ContactCards settings={settings} showIntro={false} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
