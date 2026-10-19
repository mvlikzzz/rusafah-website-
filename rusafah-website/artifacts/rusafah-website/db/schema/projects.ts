import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_common";

/**
 * Public project catalogue. Vocabulary follows the platform's projects module
 * (name_ar/name_en, city, district, publication_status) so a future projection
 * from the platform is a column mapping, not a redesign.
 *
 * Money columns are NUMERIC(19,4) (E-01). Sales progress is a percentage the
 * business publishes, stored as given — never derived here.
 */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    code: text("code").notNull().unique(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    brandNameAr: text("brand_name_ar"),
    brandLogoPath: text("brand_logo_path"),
    city: text("city").notNull(),
    district: text("district").notNull(),
    /** Fixed vocabulary: apartments | floors | villas (see modules/projects/vocabulary.ts). */
    propertyTypes: text("property_types").array().notNull(),
    /** available | coming_soon | sold | under_construction */
    status: text("status").notNull(),
    /** sale | rent */
    listingType: text("listing_type").notNull().default("sale"),
    visitAvailable: boolean("visit_available").notNull().default(false),
    descriptionAr: text("description_ar"),
    priceMin: numeric("price_min", { precision: 19, scale: 4 }),
    priceMax: numeric("price_max", { precision: 19, scale: 4 }),
    landAreaSqm: numeric("land_area_sqm", { precision: 14, scale: 2 }),
    modelsCount: integer("models_count"),
    unitsCount: integer("units_count"),
    unitsRemaining: integer("units_remaining"),
    floorsCount: integer("floors_count"),
    salesProgressPercent: numeric("sales_progress_percent", { precision: 5, scale: 2 }),
    constructionDate: date("construction_date"),
    latitude: numeric("latitude", { precision: 9, scale: 6 }),
    longitude: numeric("longitude", { precision: 9, scale: 6 }),
    /** district | exact — district means the pin marks the neighbourhood centre, not the plot. */
    locationPrecision: text("location_precision").notNull().default("district"),
    profileDocumentPath: text("profile_document_path"),
    isFeatured: boolean("is_featured").notNull().default(false),
    sort: integer("sort").notNull().default(0),
    /** unpublished | published — only published rows are ever read by the site. */
    publicationStatus: text("publication_status").notNull().default("unpublished"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("projects_publication_idx").on(t.publicationStatus, t.sort),
    index("projects_city_district_idx").on(t.city, t.district),
  ],
);

export const projectImages = pgTable("project_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  altAr: text("alt_ar").notNull(),
  /** card | hero | gallery */
  kind: text("kind").notNull(),
  sort: integer("sort").notNull().default(0),
  ...timestamps,
});

export const projectFeatures = pgTable("project_features", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  labelAr: text("label_ar").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const projectWarranties = pgTable("project_warranties", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  years: integer("years").notNull(),
  itemsAr: text("items_ar").array().notNull(),
  sort: integer("sort").notNull().default(0),
});

export const projectUnits = pgTable("project_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  modelCode: text("model_code").notNull(),
  floorLabelAr: text("floor_label_ar").notNull(),
  areaSqm: numeric("area_sqm", { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  price: numeric("price", { precision: 19, scale: 4 }),
  /** available | reserved | sold */
  status: text("status").notNull().default("available"),
  floorPlanPath: text("floor_plan_path"),
  specsAr: text("specs_ar"),
  sort: integer("sort").notNull().default(0),
  ...timestamps,
});
