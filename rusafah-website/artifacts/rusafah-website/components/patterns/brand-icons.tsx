import { siInstagram, siSnapchat, siTiktok, siWhatsapp, siX, siYoutube } from "simple-icons";
import { cn } from "@/lib/utils";

type IconDef = { title: string; path: string };

/** LinkedIn is not distributed by simple-icons; the standard "in" mark is drawn here. */
const linkedin: IconDef = {
  title: "LinkedIn",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

export const SOCIAL_NETWORKS = {
  instagram: { label: "انستقرام", icon: siInstagram },
  x: { label: "إكس", icon: siX },
  linkedin: { label: "لينكدإن", icon: linkedin },
  snapchat: { label: "سناب شات", icon: siSnapchat },
  tiktok: { label: "تيك توك", icon: siTiktok },
  youtube: { label: "يوتيوب", icon: siYoutube },
} as const;

export type SocialNetwork = keyof typeof SOCIAL_NETWORKS;

export function isSocialNetwork(key: string): key is SocialNetwork {
  return key in SOCIAL_NETWORKS;
}

export function BrandIcon({
  icon,
  className,
  title,
}: {
  icon: IconDef;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 fill-current", className)}
      role="img"
      aria-label={title ?? icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}

export const WhatsAppIcon = ({ className }: { className?: string }) => (
  <BrandIcon icon={siWhatsapp} className={className} title="واتساب" />
);

/** The 3×3 diamond grid used as the menu button in the header. */
export function MenuGridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6 fill-current", className)} aria-hidden="true">
      {[3, 12, 21].flatMap((cx) =>
        [3, 12, 21].map((cy) => (
          <rect
            key={`${cx}-${cy}`}
            x={cx - 2.4}
            y={cy - 2.4}
            width="4.8"
            height="4.8"
            transform={`rotate(45 ${cx} ${cy})`}
          />
        )),
      )}
    </svg>
  );
}

/** Headset mark drawn beside the customer-service number. */
export function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 13h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M20 13h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1z" />
      <path d="M18 18v1a2 2 0 0 1-2 2h-3" />
      <circle cx="12" cy="21" r="0.8" />
    </svg>
  );
}
