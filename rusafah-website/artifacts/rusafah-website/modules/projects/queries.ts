import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, exists, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/db/client";
import type { ProjectFilter } from "./filters";

const { projects, projectImages, projectFeatures, projectWarranties, projectUnits } = schema;

export type ProjectRow = typeof projects.$inferSelect;
export type ProjectImage = typeof projectImages.$inferSelect;
export type ProjectUnit = typeof projectUnits.$inferSelect;
export type ProjectWarranty = typeof projectWarranties.$inferSelect;
export type ProjectFeature = typeof projectFeatures.$inferSelect;

export type ProjectCard = ProjectRow & { cardImage: ProjectImage | null };

export const PROJECTS_PAGE_SIZE = 12;

const published = eq(projects.publicationStatus, "published");

async function attachCardImages(rows: ProjectRow[]): Promise<ProjectCard[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const images = await db
    .select()
    .from(projectImages)
    .where(sql`${projectImages.projectId} in ${ids}`)
    .orderBy(asc(projectImages.sort));
  const byProject = new Map<string, ProjectImage[]>();
  for (const img of images) {
    const list = byProject.get(img.projectId) ?? [];
    list.push(img);
    byProject.set(img.projectId, list);
  }
  return rows.map((r) => {
    const imgs = byProject.get(r.id) ?? [];
    const card = imgs.find((i) => i.kind === "card") ?? imgs[0] ?? null;
    return { ...r, cardImage: card };
  });
}

function filterConditions(filter: ProjectFilter): SQL[] {
  const conds: SQL[] = [published, eq(projects.listingType, filter.listing)];
  if (filter.city) conds.push(eq(projects.city, filter.city));
  if (filter.district) conds.push(eq(projects.district, filter.district));
  if (filter.types.length) {
    conds.push(
      sql`${projects.propertyTypes} && ${sql.raw(`ARRAY[${filter.types.map((t) => `'${t}'`).join(",")}]::text[]`)}`,
    );
  }
  if (filter.priceMin !== undefined) conds.push(gte(projects.priceMax, String(filter.priceMin)));
  if (filter.priceMax !== undefined) conds.push(lte(projects.priceMin, String(filter.priceMax)));
  if (filter.bedrooms !== undefined) {
    conds.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(projectUnits)
          .where(
            and(
              eq(projectUnits.projectId, projects.id),
              eq(projectUnits.bedrooms, filter.bedrooms),
            ),
          ),
      ),
    );
  }
  if (filter.q) {
    const term = `%${filter.q}%`;
    conds.push(
      or(
        ilike(projects.nameAr, term),
        ilike(projects.nameEn, term),
        ilike(projects.district, term),
        ilike(projects.city, term),
        ilike(projects.code, term),
      ) as SQL,
    );
  }
  return conds;
}

export async function listProjects(filter: ProjectFilter): Promise<{
  items: ProjectCard[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const where = and(...filterConditions(filter));
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projects)
    .where(where);
  const pageCount = Math.max(1, Math.ceil(count / PROJECTS_PAGE_SIZE));
  const page = Math.min(filter.page, pageCount);
  const rows = await db
    .select()
    .from(projects)
    .where(where)
    .orderBy(asc(projects.sort), desc(projects.code))
    .limit(PROJECTS_PAGE_SIZE)
    .offset((page - 1) * PROJECTS_PAGE_SIZE);
  return { items: await attachCardImages(rows), total: count, page, pageCount };
}

/** Projects flagged for the home hero and the "latest projects" page, newest code first. */
export const listFeaturedProjects = cache(async (): Promise<ProjectCard[]> => {
  const rows = await db
    .select()
    .from(projects)
    .where(and(published, eq(projects.isFeatured, true)))
    .orderBy(desc(projects.code));
  return attachCardImages(rows);
});

/** Available or upcoming projects for the home carousel. */
export async function listActiveProjects(limit = 8): Promise<ProjectCard[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(and(published, or(eq(projects.status, "available"), eq(projects.status, "coming_soon"))))
    .orderBy(desc(projects.code))
    .limit(limit);
  return attachCardImages(rows);
}

/** Published projects with coordinates, for the map. */
export async function listMappedProjects(): Promise<ProjectCard[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(
      and(published, sql`${projects.latitude} is not null`, sql`${projects.longitude} is not null`),
    )
    .orderBy(desc(projects.code));
  return attachCardImages(rows);
}

export type ProjectDetail = ProjectRow & {
  images: ProjectImage[];
  features: ProjectFeature[];
  warranties: ProjectWarranty[];
  units: ProjectUnit[];
};

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDetail | null> => {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(published, eq(projects.slug, slug)))
    .limit(1);
  if (!row) return null;
  const [images, features, warranties, units] = await Promise.all([
    db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, row.id))
      .orderBy(asc(projectImages.sort)),
    db
      .select()
      .from(projectFeatures)
      .where(eq(projectFeatures.projectId, row.id))
      .orderBy(asc(projectFeatures.sort)),
    db
      .select()
      .from(projectWarranties)
      .where(eq(projectWarranties.projectId, row.id))
      .orderBy(asc(projectWarranties.years)),
    db
      .select()
      .from(projectUnits)
      .where(eq(projectUnits.projectId, row.id))
      .orderBy(asc(projectUnits.sort)),
  ]);
  return { ...row, images, features, warranties, units };
});

export async function listProjectSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: projects.slug }).from(projects).where(published);
  return rows.map((r) => r.slug);
}

export type FilterOptions = {
  cities: string[];
  districts: { city: string; district: string }[];
  priceCeiling: number;
};

/** Distinct values that exist in the catalogue, so filters never offer an empty choice. */
export async function getFilterOptions(): Promise<FilterOptions> {
  const rows = await db
    .select({ city: projects.city, district: projects.district, priceMax: projects.priceMax })
    .from(projects)
    .where(published);
  const cities = [...new Set(rows.map((r) => r.city))].sort((a, b) => a.localeCompare(b, "ar"));
  const seen = new Set<string>();
  const districts: { city: string; district: string }[] = [];
  for (const r of rows) {
    const k = `${r.city}|${r.district}`;
    if (!seen.has(k)) {
      seen.add(k);
      districts.push({ city: r.city, district: r.district });
    }
  }
  districts.sort((a, b) => a.district.localeCompare(b.district, "ar"));
  const priceCeiling = rows.reduce((m, r) => Math.max(m, r.priceMax ? Number(r.priceMax) : 0), 0);
  return { cities, districts, priceCeiling };
}
