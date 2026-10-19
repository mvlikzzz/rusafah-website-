import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentBlocks } from "@/components/patterns/content-blocks";
import { PostCard } from "@/components/patterns/post-card";
import { ShareButtons } from "@/components/patterns/share-buttons";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { firstParagraph, parseContentBlocks } from "@/lib/content-blocks";
import { COPY } from "@/lib/copy";
import { formatCardDate, formatGregorianLong, formatHijriForScreen } from "@/lib/format";
import {
  getPostBySlug,
  listPostSlugs,
  listRelatedPosts,
  POST_CATEGORY_LABELS,
  type PostCategory,
} from "@/modules/posts/queries";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listPostSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return {
    title: post.titleAr,
    description: firstParagraph(parseContentBlocks(post.body)) || post.excerptAr,
    openGraph: {
      type: "article",
      images: [{ url: post.coverPath }],
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const [related] = await Promise.all([listRelatedPosts(post.id, 3)]);
  const blocks = parseContentBlocks(post.body);
  const date = post.publishedAt ? formatCardDate(post.publishedAt) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <>
      <SiteHeader variant="overlay" current="/blog" />
      <FloatingContact />
      <main id="main" className="bg-cream-100">
        <article>
          <header className="bg-navy-900 relative isolate min-h-[80svh] overflow-hidden">
            <Image
              src={post.coverPath}
              alt={post.coverAltAr}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="from-navy-950/70 via-navy-950/10 to-navy-950/60 absolute inset-0 bg-gradient-to-b"
            />
            <div className="container-wide text-cream-100 absolute inset-x-0 bottom-0 pb-12">
              {date ? (
                <p className="flex items-center gap-3 text-2xl">
                  <span aria-hidden="true" className="diamond text-gold-400" />
                  <span className="font-medium">{date.month}</span>
                  <span className="font-latin">{date.yearDay}</span>
                </p>
              ) : null}
              <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-medium md:text-5xl">
                {post.titleAr}
              </h1>
            </div>
          </header>

          <div className="container-wide">
            <div className="border-gold-600/60 flex flex-col gap-4 border-b py-6 md:flex-row md:items-end md:justify-between">
              <div className="text-gold-700">
                <p className="text-lg">
                  {[
                    post.authorNameAr,
                    post.authorOrgAr,
                    POST_CATEGORY_LABELS[post.category as PostCategory] ?? post.category,
                  ]
                    .filter(Boolean)
                    .join(" - ")}
                </p>
                {post.publishedAt ? (
                  <p className="mt-1 text-lg">
                    <time dateTime={post.publishedAt.toISOString()}>
                      {formatGregorianLong(post.publishedAt)}
                    </time>
                    <span className="mx-2 opacity-50" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-base opacity-70">
                      {formatHijriForScreen(post.publishedAt)}
                    </span>
                  </p>
                ) : null}
              </div>
              <ShareButtons title={post.titleAr} url={`${siteUrl}/blog/${post.slug}`} />
            </div>

            <ContentBlocks
              blocks={blocks}
              tone="article"
              className="py-12 lg:columns-2 lg:gap-16 [&>*]:break-inside-avoid"
            />

            {post.relatedProject ? (
              <p className="pb-12">
                <Button asChild variant="dark">
                  <Link href={`/projects/${post.relatedProject.slug}`}>
                    تعرّف على مشروع <span className="font-latin">{post.relatedProject.nameEn}</span>
                  </Link>
                </Button>
              </p>
            ) : null}
          </div>
        </article>

        {related.length ? (
          <section className="container-wide pb-24" aria-labelledby="related-heading">
            <div className="flex items-center justify-between">
              <h2 id="related-heading" className="font-display text-gold-500 text-4xl md:text-5xl">
                {COPY.blog.related}
              </h2>
              <Button asChild variant="gold" size="sm">
                <Link href="/blog">{COPY.blog.viewAll}</Link>
              </Button>
            </div>
            <ul className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
