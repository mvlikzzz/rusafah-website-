import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { HydrationMarker } from "@/components/shell/hydration-marker";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "رُصافة العقارية | تجربة تِفهمك",
    template: "%s | رُصافة العقارية",
  },
  description:
    "رُصافة العقارية شركة سعودية متخصصة في التطوير العقاري، تقدم مشاريع سكنية وتجارية تجمع بين الجودة العالية والتصميم الحديث والفخامة في مدينة الرياض.",
  applicationName: "رُصافة العقارية",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "رُصافة العقارية",
    images: [{ url: "/images/brand/hero-building.jpg", width: 2560, height: 1440 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#002231",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={fontVariables} data-scroll-behavior="smooth">
      <body>
        <HydrationMarker />
        {children}
      </body>
    </html>
  );
}
