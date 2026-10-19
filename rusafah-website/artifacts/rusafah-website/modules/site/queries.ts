import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cache } from "react";
import { db, schema } from "@/db/client";

const { siteSettings, companyStats, partners, certificates, legalDocuments } = schema;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type CompanyStat = typeof companyStats.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type LegalDocument = typeof legalDocuments.$inferSelect;

/** Cached per request so header, footer and page share one read. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, "default")).limit(1);
  if (!row) {
    throw new Error("site_settings has no 'default' row — run `pnpm db:seed`.");
  }
  return row;
});

export async function listCompanyStats(): Promise<CompanyStat[]> {
  return db.select().from(companyStats).orderBy(asc(companyStats.sort));
}

export async function listPartners(): Promise<Partner[]> {
  return db.select().from(partners).orderBy(asc(partners.sort));
}

export async function listCertificates(): Promise<Certificate[]> {
  return db.select().from(certificates).orderBy(asc(certificates.sort));
}

export async function getLegalDocument(slug: string): Promise<LegalDocument | null> {
  const [row] = await db
    .select()
    .from(legalDocuments)
    .where(and(eq(legalDocuments.slug, slug), eq(legalDocuments.status, "published")))
    .limit(1);
  return row ?? null;
}

/** Slugs of published legal pages — the footer links only to documents that exist. */
export const listPublishedLegalSlugs = cache(
  async (): Promise<{ slug: string; titleAr: string }[]> => {
    return db
      .select({ slug: legalDocuments.slug, titleAr: legalDocuments.titleAr })
      .from(legalDocuments)
      .where(eq(legalDocuments.status, "published"))
      .orderBy(asc(legalDocuments.slug));
  },
);
