import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { searchSite } from "@/modules/search/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "البحث", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const results = q ? await searchSite(q) : [];
  return (
    <>
      <SiteHeader variant="light" current="/search" />
      <FloatingContact />
      <main id="main" className="bg-cream-100">
        <div className="container-site pt-16 pb-24">
          <h1 className="text-gold-600 text-4xl font-medium md:text-5xl">البحث في الموقع</h1>
          <form
            action="/search"
            method="get"
            role="search"
            className="bg-cream-200 mt-8 flex max-w-2xl"
          >
            <label htmlFor="q" className="sr-only">
              كلمة البحث
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="ابحث عن مشروع أو مقال…"
              autoFocus
              className="text-navy-900 placeholder:text-gold-700/80 min-w-0 flex-1 bg-transparent px-5 py-4 focus:outline-none"
            />
            <button
              type="submit"
              className="text-gold-700 hover:text-brown-800 px-5"
              aria-label="بحث"
            >
              <Search className="size-6" aria-hidden="true" />
            </button>
          </form>
          {q ? (
            results.length === 0 ? (
              <p className="text-gold-600 mt-12 text-2xl" role="status">
                لا توجد نتائج مطابقة لـ «{q}».
              </p>
            ) : (
              <ul
                className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="نتائج البحث"
              >
                {results.map((r) => (
                  <li key={`${r.kind}-${r.slug}`}>
                    <Link
                      href={r.kind === "project" ? `/projects/${r.slug}` : `/blog/${r.slug}`}
                      className="group bg-cream-200 hover:bg-cream-300 flex gap-4 rounded-md p-3"
                    >
                      <span className="bg-navy-800 relative block size-24 shrink-0 overflow-hidden rounded-sm">
                        {r.image ? (
                          <Image src={r.image} alt="" fill sizes="6rem" className="object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="text-gold-700 block text-xs">
                          {r.kind === "project" ? "مشروع" : "مقال"}
                        </span>
                        <span className="text-navy-900 group-hover:text-gold-700 block text-xl font-medium">
                          {r.title}
                        </span>
                        <span className="text-navy-900/70 mt-1 line-clamp-2 block text-sm">
                          {r.subtitle}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
