import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_common";
import { projects } from "./projects";
import type { ContentBlock } from "./site";

/** Articles, blog posts and news. Only status = published rows are served. */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    /** article | blog | news */
    category: text("category").notNull(),
    titleAr: text("title_ar").notNull(),
    excerptAr: text("excerpt_ar").notNull(),
    coverPath: text("cover_path").notNull(),
    coverAltAr: text("cover_alt_ar").notNull(),
    body: jsonb("body").$type<ContentBlock[]>().notNull(),
    authorNameAr: text("author_name_ar"),
    authorOrgAr: text("author_org_ar"),
    relatedProjectId: uuid("related_project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    /** draft | published */
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("posts_status_published_idx").on(t.status, t.publishedAt)],
);
