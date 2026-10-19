import { ArrowUpLeft, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/patterns/brand-icons";
import { COPY } from "@/lib/copy";
import type { SiteSettings } from "@/modules/site/queries";

/** The three contact channels: unified number, WhatsApp, and the map link. */
export function ContactCards({
  settings,
  showIntro = true,
}: {
  settings: SiteSettings;
  showIntro?: boolean;
}) {
  const c = COPY.contact;
  const wa = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`;
  const intl = settings.internationalNumber.replace(/^\+966/, "+(966)");
  return (
    <div className="text-cream-100">
      {showIntro ? (
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-gold-400 inline-flex items-center gap-4 text-4xl font-medium md:text-5xl">
            <span aria-hidden="true" className="bg-gold-400 h-px w-8" />
            {c.sectionTitle}
            <span aria-hidden="true" className="bg-gold-400 h-px w-8" />
          </h2>
          <p className="text-cream-200/90 mt-5 text-lg leading-relaxed">{c.sectionText}</p>
        </div>
      ) : null}
      <ul className="border-cream-100/15 mt-12 grid gap-10 border-y py-10 md:grid-cols-3">
        <li className="text-center">
          <span className="border-cream-100/70 mx-auto flex size-14 items-center justify-center rounded-full border">
            <Phone className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-gold-400 mt-4 text-3xl">{c.unifiedTitle}</h3>
          <p className="text-cream-200/90 mx-auto mt-2 max-w-xs">{c.unifiedText}</p>
          <a
            href={`tel:${settings.unifiedNumber}`}
            className="font-latin border-gold-400 text-gold-400 hover:text-gold-300 mt-3 inline-block border-b text-xl tracking-wider"
          >
            {settings.unifiedNumber}
          </a>
        </li>
        <li className="text-center">
          <span className="border-cream-100/70 mx-auto flex size-14 items-center justify-center rounded-full border">
            <WhatsAppIcon className="size-6" />
          </span>
          <h3 className="text-gold-400 mt-4 text-3xl">{c.whatsappTitle}</h3>
          <p className="text-cream-200/90 mx-auto mt-2 max-w-xs">{c.whatsappText}</p>
          <a
            href={wa}
            target="_blank"
            rel="noopener"
            className="font-latin border-gold-400 text-gold-400 hover:text-gold-300 mt-3 inline-block border-b text-xl tracking-wider"
            dir="ltr"
          >
            {intl}
          </a>
        </li>
        <li className="text-center">
          <span className="border-cream-100/70 mx-auto flex size-14 items-center justify-center rounded-full border">
            <MapPin className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-gold-400 mt-4 text-3xl">{c.locationTitle}</h3>
          <p className="text-cream-200/90 mx-auto mt-2 max-w-xs">{c.locationText}</p>
          {settings.googleMapsUrl ? (
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener"
              className="border-gold-400 text-gold-400 hover:text-gold-300 mt-3 inline-flex items-center gap-2 border-b text-xl"
            >
              {c.openMaps}
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </li>
      </ul>
      <p className="text-cream-200/90 mt-6 text-center text-lg md:text-start">
        {c.internationalNote}{" "}
        <span className="font-latin text-cream-100 font-semibold tracking-wider" dir="ltr">
          {intl}
        </span>
      </p>
    </div>
  );
}
