import "server-only";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db, schema } from "@/db/client";

const { posts, projects } = schema;

export type PostRow = typeof posts.$inferSelect;
export const POSTS_PAGE_SIZE = 6;

export const POST_CATEGORIES = ["article", "blog", "news"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  article: "المقالات",
  blog: "المدونات",
  news: "الأخبار",
};

const published = eq(posts.status, "published");

export async function listPosts(
  opts: { category?: PostCategory | "editorial"; page?: number } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const conds = [published];
  if (opts.category === "editorial") conds.push(ne(posts.category, "news"));
  else if (opts.category) conds.push(eq(posts.category, opts.category));
  const where = and(...conds);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(posts)
    .where(where);
  const pageCount = Math.max(1, Math.ceil(count / POSTS_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const items = await db
    .select()
    .from(posts)
    .where(where)
    .orderBy(desc(posts.publishedAt))
    .limit(POSTS_PAGE_SIZE)
    .offset((safePage - 1) * POSTS_PAGE_SIZE);
  return { items, total: count, page: safePage, pageCount };
}

export type PostDetail = PostRow & {
  relatedProject: { slug: string; nameAr: string; nameEn: string } | null;
};

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const [row] = await db
    .select()
    .from(posts)
    .where(and(published, eq(posts.slug, slug)))
    .limit(1);
  if (!row) return null;
  let relatedProject: PostDetail["relatedProject"] = null;
  if (row.relatedProjectId) {
    const [p] = await db
      .select({ slug: projects.slug, nameAr: projects.nameAr, nameEn: projects.nameEn })
      .from(projects)
      .where(
        and(eq(projects.id, row.relatedProjectId), eq(projects.publicationStatus, "published")),
      )
      .limit(1);
    relatedProject = p ?? null;
  }
  return { ...row, relatedProject };
}

export async function listRelatedPosts(excludeId: string, limit = 3): Promise<PostRow[]> {
  return db
    .select()
    .from(posts)
    .where(and(published, ne(posts.id, excludeId)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function listPostSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: posts.slug }).from(posts).where(published);
  return rows.map((r) => r.slug);
}
