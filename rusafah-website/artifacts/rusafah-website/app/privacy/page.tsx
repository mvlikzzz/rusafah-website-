import type { Metadata } from "next";
import { LegalPage } from "@/components/patterns/legal-page";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
