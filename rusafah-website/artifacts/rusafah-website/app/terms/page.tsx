import type { Metadata } from "next";
import { LegalPage } from "@/components/patterns/legal-page";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الشروط والأحكام" };

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
