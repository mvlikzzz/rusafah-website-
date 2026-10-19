import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/patterns/post-card";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { listPosts } from "@/modules/posts/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المقالات والمدونات",
  description: "مقالات ومدونات وأخبار رُصافة العقارية عن السكن والتملّك في الرياض.",
};

const TABS = [
  { key: "all", label: COPY.blog.all },
  { key: "editorial", label: COPY.blog.editorial },
  { key: "news", label: COPY.blog.news },
] as const;

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const rawCat = typeof sp.category === "string" ? sp.category : "all";
  const category = TABS.some((t) => t.key === rawCat)
    ? (rawCat as (typeof TABS)[number]["key"])
    : "all";
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;
  const result = await listPosts({ category: category === "all" ? undefined : category, page });
  const hrefFor = (cat: string, p = 1) =>
    `/blog${cat !== "all" || p > 1 ? `?${new URLSearchParams({ ...(cat !== "all" ? { category: cat } : {}), ...(p > 1 ? { page: String(p) } : {}) })}` : ""}`;

  return (
    <>
      <SiteHeader variant="light" current="/blog" />
      <FloatingContact />
      <main id="main" className="bg-cream-100">
        <div className="container-site pt-16 pb-24">
          <nav aria-label="مسار التصفح" className="text-gold-700 text-start">
            <h1 className="font-display text-gold-500 text-5xl md:text-6xl">{COPY.blog.title}</h1>
            <p className="mt-2 text-xl">
              <Link href="/" className="hover:underline">
                {COPY.blog.breadcrumbHome}
              </Link>
              /
            </p>
          </nav>

          <ul className="mt-8 flex flex-wrap justify-start gap-3" aria-label="تصنيفات المقالات">
            {TABS.map((t) => {
              const active = t.key === category;
              return (
                <li key={t.key}>
                  <Link
                    href={hrefFor(t.key)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-block rounded-sm border px-6 py-2.5 text-xl transition",
                      active
                        ? "border-gold-700 bg-gold-700 text-cream-100"
                        : "border-gold-700 text-gold-700 hover:bg-gold-700/10",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {result.items.length === 0 ? (
            <p className="text-gold-600 mt-24 text-center text-2xl">
              لا توجد مقالات منشورة في هذا التصنيف حتى الآن.
            </p>
          ) : (
            <ul className="mt-16 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post, i) => (
                <li key={post.id}>
                  <PostCard post={post} priority={i < 3} />
                </li>
              ))}
            </ul>
          )}

          {result.pageCount > 1 ? (
            <nav aria-label="صفحات المقالات" className="mt-16 flex flex-col items-center gap-4">
              {result.page < result.pageCount ? (
                <Button asChild variant="outline">
                  <Link href={hrefFor(category, result.page + 1)}>{COPY.blog.exploreMore}</Link>
                </Button>
              ) : null}
              <ul className="flex gap-2">
                {Array.from({ length: result.pageCount }).map((_, i) => (
                  <li key={i}>
                    <Link
                      href={hrefFor(category, i + 1)}
                      aria-label={`الصفحة ${i + 1}`}
                      aria-current={result.page === i + 1 ? "page" : undefined}
                      className="flex size-6 items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "block size-2.5 rounded-full",
                          result.page === i + 1 ? "bg-gold-700" : "bg-gold-700/30",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
