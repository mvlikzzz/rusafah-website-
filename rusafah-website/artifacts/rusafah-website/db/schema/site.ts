import { date, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_common";

/**
 * Company-level content that the public site reads. One row, keyed "default".
 * Contact details and social links are business facts supplied by RUSAFAH, not
 * literals in components (ENGINEERING.md §2.1).
 */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  companyNameAr: text("company_name_ar").notNull(),
  companyNameEn: text("company_name_en").notNull(),
  taglineAr: text("tagline_ar").notNull(),
  taglineEn: text("tagline_en").notNull(),
  unifiedNumber: text("unified_number").notNull(),
  internationalNumber: text("international_number").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email").notNull(),
  googleMapsUrl: text("google_maps_url"),
  /** { instagram?: url, x?: url, linkedin?: url, snapchat?: url, tiktok?: url, youtube?: url } */
  socialLinks: jsonb("social_links").$type<Record<string, string>>().notNull().default({}),
  profileDocumentPath: text("profile_document_path"),
  ...timestamps,
});

/**
 * Headline figures shown on the home and about pages. They are business-supplied
 * figures with provenance (source + as-of date), never computed in a component.
 */
export const companyStats = pgTable("company_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: numeric("value", { precision: 19, scale: 4 }).notNull(),
  prefixAr: text("prefix_ar"),
  labelAr: text("label_ar").notNull(),
  unitAr: text("unit_ar"),
  asOf: date("as_of").notNull(),
  sourceAr: text("source_ar").notNull(),
  sort: integer("sort").notNull().default(0),
  ...timestamps,
});

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  logoPath: text("logo_path").notNull(),
  websiteUrl: text("website_url"),
  sort: integer("sort").notNull().default(0),
  ...timestamps,
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  titleAr: text("title_ar").notNull(),
  issuerAr: text("issuer_ar").notNull(),
  logoPath: text("logo_path").notNull(),
  sort: integer("sort").notNull().default(0),
  ...timestamps,
});

/** Rich text stored as a validated block array — see lib/content-blocks.ts. */
export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };

export const legalDocuments = pgTable("legal_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  body: jsonb("body").$type<ContentBlock[]>().notNull(),
  effectiveDate: date("effective_date"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
});
