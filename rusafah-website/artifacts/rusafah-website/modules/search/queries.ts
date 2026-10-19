import "server-only";
import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db, schema } from "@/db/client";

const { projects, posts, projectImages } = schema;

export type SearchResult =
  | { kind: "project"; slug: string; title: string; subtitle: string; image: string | null }
  | { kind: "post"; slug: string; title: string; subtitle: string; image: string | null };

/** Simple case-insensitive search over published projects and posts. */
export async function searchSite(query: string, limit = 12): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const term = `%${q}%`;
  const [projectRows, postRows] = await Promise.all([
    db
      .select({
        slug: projects.slug,
        nameAr: projects.nameAr,
        nameEn: projects.nameEn,
        city: projects.city,
        district: projects.district,
        id: projects.id,
      })
      .from(projects)
      .where(
        and(
          eq(projects.publicationStatus, "published"),
          or(
            ilike(projects.nameAr, term),
            ilike(projects.nameEn, term),
            ilike(projects.district, term),
            ilike(projects.city, term),
            ilike(projects.code, term),
            ilike(projects.descriptionAr, term),
          ),
        ),
      )
      .orderBy(desc(projects.code))
      .limit(limit),
    db
      .select({
        slug: posts.slug,
        titleAr: posts.titleAr,
        excerptAr: posts.excerptAr,
        coverPath: posts.coverPath,
      })
      .from(posts)
      .where(
        and(
          eq(posts.status, "published"),
          or(ilike(posts.titleAr, term), ilike(posts.excerptAr, term)),
        ),
      )
      .orderBy(desc(posts.publishedAt))
      .limit(limit),
  ]);
  const imageByProject = new Map<string, string>();
  if (projectRows.length) {
    const images = await db
      .select({
        projectId: projectImages.projectId,
        path: projectImages.path,
        kind: projectImages.kind,
      })
      .from(projectImages)
      .where(
        inArray(
          projectImages.projectId,
          projectRows.map((p) => p.id),
        ),
      )
      .orderBy(asc(projectImages.sort));
    for (const img of images) {
      const existing = imageByProject.get(img.projectId);
      if (!existing || img.kind === "card") imageByProject.set(img.projectId, img.path);
    }
  }
  return [
    ...projectRows.map((p): SearchResult => ({
      kind: "project",
      slug: p.slug,
      title: `${p.nameEn} · ${p.nameAr}`,
      subtitle: `${p.city} - ${p.district}`,
      image: imageByProject.get(p.id) ?? null,
    })),
    ...postRows.map((p): SearchResult => ({
      kind: "post",
      slug: p.slug,
      title: p.titleAr,
      subtitle: p.excerptAr,
      image: p.coverPath,
    })),
  ];
}
