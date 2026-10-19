import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import {
  BrandIcon,
  HeadsetIcon,
  isSocialNetwork,
  SOCIAL_NETWORKS,
} from "@/components/patterns/brand-icons";
import { RusafahSeal } from "@/components/patterns/rusafah-seal";
import { getSiteSettings, listPublishedLegalSlugs } from "@/modules/site/queries";
import { formatInteger } from "@/lib/format";
import { FOOTER_QUICK_LINKS } from "./nav-links";
import { NewsletterForm } from "./newsletter-form";

/** Site footer. `withBrandBand` adds the tagline/seal band that only the home page carries. */
export async function SiteFooter({ withBrandBand = false }: { withBrandBand?: boolean }) {
  const [s, legal] = await Promise.all([getSiteSettings(), listPublishedLegalSlugs()]);
  const socials = Object.entries(s.socialLinks).filter(([k, v]) => isSocialNetwork(k) && v);
  const year = formatInteger(new Date().getFullYear(), "arabic-indic");

  return (
    <footer className="watermark-light bg-navy-900 text-cream-100">
      <div className="container-site pt-12 pb-[max(3rem,env(safe-area-inset-bottom))] md:py-16">
        {withBrandBand ? (
          <div className="border-cream-100/10 mb-12 grid items-center gap-8 border-b pb-12 text-center md:mb-16 md:grid-cols-3 md:gap-10 md:pb-16 md:text-start">
            <p className="text-cream-200 text-2xl">مفهوم عصري للسكن تقوده رُصافة</p>
            <div className="flex justify-center">
              <RusafahSeal className="text-cream-200/85 h-36 w-36 md:h-48 md:w-48" />
            </div>
            <div className="text-center md:text-start">
              <p className="font-display text-cream-100 text-4xl leading-tight md:text-5xl">{s.taglineAr}</p>
              <p className="font-latin text-gold-400 mt-1 text-2xl">{s.taglineEn}</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h2 className="mb-4 flex items-center gap-3 text-xl md:text-2xl">
              <span aria-hidden="true" className="diamond text-gold-400 shrink-0" />
              <span className="min-w-0">اشترك في نشرة البريـــد الإلكتروني</span>
            </h2>
            <NewsletterForm />

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xl md:text-2xl">خدمة العملاء المجانية</h3>
                <a
                  href={`tel:${s.unifiedNumber}`}
                  className="text-gold-400 hover:text-gold-300 mt-2 inline-flex items-center gap-3"
                >
                  <HeadsetIcon className="size-7" />
                  <span className="font-latin text-2xl tracking-wider tabular-nums">
                    {s.unifiedNumber}
                  </span>
                </a>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl">هل تحتاج إلى دعم فوري؟</h3>
                <a
                  href={`mailto:${s.email}`}
                  className="font-latin text-gold-400 hover:text-gold-300 mt-2 inline-block text-xl"
                >
                  {s.email}
                </a>
              </div>
            </div>

            {socials.length ? (
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <h3 className="text-xl md:text-2xl">مواقع التواصل الإجتماعــي</h3>
                <ul className="flex items-center gap-4">
                  {socials.map(([key, url]) => {
                    const net = SOCIAL_NETWORKS[key as keyof typeof SOCIAL_NETWORKS];
                    return (
                      <li key={key}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener"
                          aria-label={net.label}
                          className="bg-gold-500 text-navy-900 hover:bg-gold-400 flex size-11 items-center justify-center rounded-full transition md:size-9"
                        >
                          <BrandIcon icon={net.icon} className="size-4" title={net.label} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-6 sm:gap-10 lg:justify-self-end">
            <nav aria-label="روابط سريعة">
              <h3 className="border-cream-100 mb-3 inline-block border-b pb-1 text-xl">
                روابــط سريعة
              </h3>
              <ul className="space-y-1">
                {FOOTER_QUICK_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="border-gold-500/70 hover:text-gold-400 flex items-center justify-between border-b py-2 text-lg"
                    >
                      <span>{l.label}</span>
                      <ArrowUpLeft className="text-gold-500 size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {socials.length ? (
              <nav aria-label="تابعنا">
                <h3 className="border-cream-100 mb-3 inline-block border-b pb-1 text-xl">
                  تابعـــنا
                </h3>
                <ul className="space-y-1">
                  {socials.map(([key, url]) => {
                    const net = SOCIAL_NETWORKS[key as keyof typeof SOCIAL_NETWORKS];
                    return (
                      <li key={key}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener"
                          className="border-gold-500/70 hover:text-gold-400 flex items-center justify-between border-b py-2 text-lg"
                        >
                          <span>{net.label}</span>
                          <ArrowUpLeft className="text-gold-500 size-3.5" aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        <div className="border-cream-100/10 text-cream-200/85 mt-14 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            جميع الحقوق محفوظة © {year} {s.companyNameAr}
          </p>
          {legal.length ? (
            <ul className="flex flex-wrap items-center gap-x-2">
              {legal.map((d, i) => (
                <li key={d.slug} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">.</span> : null}
                  <Link
                    href={`/${d.slug}`}
                    className="hover:text-gold-400 inline-flex min-h-11 items-center md:min-h-6"
                  >
                    {d.titleAr}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
