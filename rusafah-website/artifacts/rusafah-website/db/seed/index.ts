import { config as loadEnv } from "dotenv";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { contentBlocksSchema } from "@/lib/content-blocks";
import * as content from "./content";

loadEnv({ path: ".env.local" });
loadEnv();

/**
 * Idempotent seed: rows are upserted by their natural keys (slug, code, key), so
 * re-running refreshes content without duplicating it. Lead, subscriber and
 * outbox tables are never touched.
 */
export async function seed(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const db = drizzle(pool, { schema });
  try {
    await db.transaction(async (tx) => {
      // Site settings
      await tx
        .insert(schema.siteSettings)
        .values(content.siteSettings)
        .onConflictDoUpdate({
          target: schema.siteSettings.id,
          set: { ...content.siteSettings, updatedAt: new Date() },
        });

      // Stats
      for (const s of content.companyStats) {
        await tx
          .insert(schema.companyStats)
          .values(s)
          .onConflictDoUpdate({
            target: schema.companyStats.key,
            set: { ...s, updatedAt: new Date() },
          });
      }

      // Partners & certificates are small, fully content-managed lists: replace.
      await tx.delete(schema.partners);
      await tx.insert(schema.partners).values(content.partners);
      await tx.delete(schema.certificates);
      await tx.insert(schema.certificates).values(content.certificates);

      // Projects
      const codeToId = new Map<string, string>();
      for (const p of content.projects) {
        const loc = content.projectLocation(p.district);
        const row = {
          slug: `rusafah-${p.code}`,
          code: p.code,
          nameEn: `RUSAFAH ${p.code}`,
          nameAr: `رصافة ${p.code}`,
          brandNameAr: p.brandNameAr ?? null,
          brandLogoPath: p.brandLogoPath ?? null,
          city: "الرياض",
          district: p.district,
          propertyTypes: p.propertyTypes,
          status: p.status,
          listingType: "sale",
          visitAvailable: p.visitAvailable ?? false,
          descriptionAr: p.descriptionAr ?? null,
          priceMin: p.priceMin ?? null,
          priceMax: p.priceMax ?? null,
          landAreaSqm: p.landAreaSqm ?? null,
          modelsCount: p.modelsCount ?? null,
          unitsCount: p.unitsCount ?? null,
          unitsRemaining: p.unitsRemaining ?? null,
          floorsCount: p.floorsCount ?? null,
          salesProgressPercent: p.salesProgressPercent ?? null,
          constructionDate: p.constructionDate ?? null,
          latitude: loc?.lat ?? null,
          longitude: loc?.lng ?? null,
          locationPrecision: "district",
          isFeatured: p.isFeatured ?? false,
          sort: 0,
          publicationStatus: "published",
          publishedAt: new Date("2026-09-09T00:00:00+03:00"),
        };
        const [saved] = await tx
          .insert(schema.projects)
          .values(row)
          .onConflictDoUpdate({
            target: schema.projects.code,
            set: { ...row, updatedAt: new Date() },
          })
          .returning({ id: schema.projects.id });
        const id = saved!.id;
        codeToId.set(p.code, id);
        await tx.delete(schema.projectImages).where(eq(schema.projectImages.projectId, id));
        await tx
          .insert(schema.projectImages)
          .values(p.images.map((im, i) => ({ ...im, projectId: id, sort: i })));
        await tx.delete(schema.projectFeatures).where(eq(schema.projectFeatures.projectId, id));
        if (p.features?.length) {
          await tx
            .insert(schema.projectFeatures)
            .values(p.features.map((labelAr, i) => ({ projectId: id, labelAr, sort: i })));
        }
        await tx.delete(schema.projectWarranties).where(eq(schema.projectWarranties.projectId, id));
        if (p.warranties?.length) {
          await tx.insert(schema.projectWarranties).values(
            p.warranties.map((w, i) => ({
              projectId: id,
              years: w.years,
              itemsAr: w.itemsAr,
              sort: i,
            })),
          );
        }
        await tx.delete(schema.projectUnits).where(eq(schema.projectUnits.projectId, id));
        if (p.units?.length) {
          await tx
            .insert(schema.projectUnits)
            .values(p.units.map((u, i) => ({ ...u, projectId: id, status: "available", sort: i })));
        }
      }

      // Posts
      for (const post of content.posts) {
        const body = contentBlocksSchema.parse(post.body);
        const row = {
          slug: post.slug,
          category: post.category,
          titleAr: post.titleAr,
          excerptAr: post.excerptAr,
          coverPath: post.coverPath,
          coverAltAr: post.coverAltAr,
          body,
          authorNameAr: post.authorNameAr ?? null,
          authorOrgAr: post.authorOrgAr ?? null,
          relatedProjectId: post.relatedProjectCode
            ? (codeToId.get(post.relatedProjectCode) ?? null)
            : null,
          status: post.status,
          publishedAt: new Date(post.publishedAt),
        };
        await tx
          .insert(schema.posts)
          .values(row)
          .onConflictDoUpdate({
            target: schema.posts.slug,
            set: { ...row, updatedAt: new Date() },
          });
      }

      // Legal documents — published as designed; legal review is flagged in DECISIONS.md D-21.
      for (const doc of content.legalDocuments) {
        const body = contentBlocksSchema.parse(doc.body);
        const row = {
          slug: doc.slug,
          titleAr: doc.titleAr,
          body,
          effectiveDate: "2026-09-09",
          status: "published",
          publishedAt: new Date("2026-09-09T00:00:00+03:00"),
        };
        await tx
          .insert(schema.legalDocuments)
          .values(row)
          .onConflictDoUpdate({
            target: schema.legalDocuments.slug,
            set: { ...row, updatedAt: new Date() },
          });
      }
    });

    const counts = await db.execute<{ t: string; n: number }>(sql`
      select 'projects' t, count(*)::int n from projects
      union all select 'posts', count(*)::int from posts
      union all select 'partners', count(*)::int from partners
      union all select 'certificates', count(*)::int from certificates
      union all select 'company_stats', count(*)::int from company_stats
      union all select 'legal_documents', count(*)::int from legal_documents
    `);
    return counts.rows;
  } finally {
    await pool.end();
  }
}

if (process.argv[1]?.endsWith("index.ts")) {
  seed()
    .then((rows) => {
      for (const r of rows) console.log(`${r.t}: ${r.n}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
