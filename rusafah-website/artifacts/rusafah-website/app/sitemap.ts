import type { MetadataRoute } from "next";
import { listPostSlugs } from "@/modules/posts/queries";
import { listProjectSlugs } from "@/modules/projects/queries";
import { listPublishedLegalSlugs } from "@/modules/site/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, posts, legal] = await Promise.all([
    listProjectSlugs(),
    listPostSlugs(),
    listPublishedLegalSlugs(),
  ]);
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/projects`, lastModified: now, priority: 0.9 },
    { url: `${base}/projects/latest`, lastModified: now, priority: 0.7 },
    { url: `${base}/about`, lastModified: now, priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, priority: 0.6 },
    ...projects.map((slug) => ({
      url: `${base}/projects/${slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...posts.map((slug) => ({ url: `${base}/blog/${slug}`, lastModified: now, priority: 0.6 })),
    ...legal.map((d) => ({ url: `${base}/${d.slug}`, lastModified: now, priority: 0.3 })),
  ];
}
