import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/patterns/brand-icons";
import { getSiteSettings } from "@/modules/site/queries";

/** The two fixed contact buttons at the start edge of the viewport (right in RTL). */
export async function FloatingContact() {
  const s = await getSiteSettings();
  return (
    <div
      className="inset-inline-start-0 fixed start-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="تواصل سريع"
    >
      <a
        href={`tel:${s.unifiedNumber}`}
        className="bg-cream-200/25 text-cream-100 hover:bg-cream-200/40 flex size-16 items-center justify-center rounded-e-md backdrop-blur-md transition"
        aria-label={`اتصل بنا على الرقم ${s.unifiedNumber}`}
      >
        <Phone className="size-6" aria-hidden="true" />
      </a>
      <a
        href={`https://wa.me/${s.whatsappNumber.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener"
        className="bg-cream-200/25 text-cream-100 hover:bg-cream-200/40 flex size-16 items-center justify-center rounded-e-md backdrop-blur-md transition"
        aria-label="تواصل معنا عبر واتساب"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
