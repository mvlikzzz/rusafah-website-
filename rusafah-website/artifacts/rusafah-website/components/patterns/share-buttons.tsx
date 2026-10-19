"use client";

import * as React from "react";
import { Link2, Share2 } from "lucide-react";
import { BrandIcon, SOCIAL_NETWORKS, WhatsAppIcon } from "@/components/patterns/brand-icons";

/** Share row under the article hero: WhatsApp, X, LinkedIn, and the native share sheet / copy link. */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = React.useState(false);
  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const cls =
    "flex size-9 items-center justify-center rounded-full border border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-cream-100";
  return (
    <div className="flex items-center gap-3" aria-label="مشاركة المقال">
      <a
        className={cls}
        href={`https://wa.me/?text=${text}%20${u}`}
        target="_blank"
        rel="noopener"
        aria-label="مشاركة عبر واتساب"
      >
        <WhatsAppIcon className="size-4" />
      </a>
      <a
        className={cls}
        href={`https://x.com/intent/post?text=${text}&url=${u}`}
        target="_blank"
        rel="noopener"
        aria-label="مشاركة عبر إكس"
      >
        <BrandIcon icon={SOCIAL_NETWORKS.x.icon} className="size-4" title="إكس" />
      </a>
      <a
        className={cls}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
        target="_blank"
        rel="noopener"
        aria-label="مشاركة عبر لينكدإن"
      >
        <BrandIcon icon={SOCIAL_NETWORKS.linkedin.icon} className="size-4" title="لينكدإن" />
      </a>
      <button
        type="button"
        onClick={share}
        className={cls}
        aria-label={copied ? "تم نسخ الرابط" : "مشاركة أو نسخ الرابط"}
      >
        {copied ? (
          <Link2 className="size-4" aria-hidden="true" />
        ) : (
          <Share2 className="size-4" aria-hidden="true" />
        )}
      </button>
      <span role="status" className="sr-only">
        {copied ? "تم نسخ الرابط" : ""}
      </span>
    </div>
  );
}
