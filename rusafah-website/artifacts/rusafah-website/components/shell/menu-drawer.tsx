"use client";

import * as React from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Phone, X } from "lucide-react";
import { MenuGridIcon, WhatsAppIcon } from "@/components/patterns/brand-icons";
import { RusafahLogo } from "@/components/patterns/rusafah-logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن رُصافة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/projects/latest", label: "أحدث المشاريع" },
  { href: "/blog", label: "المدونات" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/search", label: "البحث" },
];

type Props = {
  onDark: boolean;
  phone: string;
  whatsapp: string;
  email: string;
  projects: { slug: string; nameEn: string; nameAr: string }[];
};

/** Full navigation drawer behind the grid icon; the only navigation on small screens. */
export function MenuDrawer({ onDark, phone, whatsapp, email, projects }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn("-me-2 inline-flex size-11 items-center justify-center rounded-sm", onDark ? "text-cream-100" : "text-gold-600")}
        aria-label="فتح القائمة"
      >
        <MenuGridIcon className="size-6" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-navy-950/60 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          dir="rtl"
          className="watermark-light bg-navy-900 text-cream-100 shadow-glow fixed inset-y-0 end-0 z-50 flex w-[min(92vw,26rem)] flex-col overscroll-contain px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] focus:outline-none sm:px-8 sm:pt-8"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="sr-only">القائمة الرئيسية</Dialog.Title>
            <RusafahLogo className="text-cream-200 h-12 w-auto" />
            <Dialog.Close
              className="hover:bg-cream-100/10 inline-flex size-11 items-center justify-center rounded-full"
              aria-label="إغلاق القائمة"
            >
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <nav aria-label="قائمة الموقع" className="mt-6 min-h-0 flex-1 overflow-y-auto sm:mt-10">
            <ul className="space-y-1 text-xl sm:text-2xl">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="border-cream-100/10 hover:text-gold-400 block border-b py-3"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {projects.length ? (
              <div className="mt-8">
                <p className="text-gold-400 mb-2 text-sm">مشاريع مختارة</p>
                <ul className="space-y-1 text-lg">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/projects/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="hover:text-gold-400 block py-2.5"
                      >
                        <span className="font-latin">{p.nameEn}</span>{" "}
                        <span className="opacity-70">{p.nameAr}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </nav>
          <div className="border-cream-100/10 mt-6 space-y-1 border-t pt-4 text-base sm:mt-8 sm:pt-6">
            <a href={`tel:${phone}`} className="hover:text-gold-400 flex min-h-11 items-center gap-3">
              <Phone className="size-5" aria-hidden="true" />
              <span className="font-latin tabular-nums">{phone}</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              className="hover:text-gold-400 flex min-h-11 items-center gap-3"
              rel="noopener"
              target="_blank"
            >
              <WhatsAppIcon className="size-5" />
              <span>واتساب</span>
            </a>
            <a href={`mailto:${email}`} className="font-latin hover:text-gold-400 flex min-h-11 items-center">
              {email}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
