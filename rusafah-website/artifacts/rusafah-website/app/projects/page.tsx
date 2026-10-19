import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/patterns/project-card";
import { FilterBar } from "@/components/projects/filter-bar";
import { ProjectHero, toHeroProject } from "@/components/projects/project-hero";
import { FloatingContact } from "@/components/shell/floating-contact";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { COPY } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { filterToSearchParams, parseProjectFilter } from "@/modules/projects/filters";
import { getFilterOptions, listFeaturedProjects, listProjects } from "@/modules/projects/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المشاريع",
  description:
    "تصفح مشاريع رُصافة العقارية السكنية في الرياض: فلل وأدوار وشقق، مع إمكانية التصفية حسب المدينة ونوع الوحدة وعدد الغرف والسعر.",
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const sp = await searchParams;
  const filter = parseProjectFilter(sp);
  const [featured, options, result] = await Promise.all([
    listFeaturedProjects(),
    getFilterOptions(),
    listProjects(filter),
  ]);
  const tabs = featured
    .slice()
    .sort((a, b) => b.code.localeCompare(a.code))
    .map((p) => toHeroProject(p));
  const heroProject = tabs[0] ?? null;

  return (
    <>
      <SiteHeader variant="overlay" current="/projects" />
      <FloatingContact />
      <main id="main">
        {heroProject ? (
          <ProjectHero project={heroProject} tabs={tabs} priority titleAs="h1" />
        ) : null}
        <section className="bg-cream-200 py-12" aria-labelledby="catalogue-heading">
          <div className="container-site">
            <h2 id="catalogue-heading" className="sr-only">
              كل المشاريع
            </h2>
            <FilterBar
              key={filterToSearchParams(filter)}
              filter={filter}
              options={options}
              resultCount={result.total}
            />
            {result.items.length ? (
              <ul className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {result.items.map((p, i) => (
                  <li key={p.id}>
                    <ProjectCard project={p} priority={i < 3} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border-gold-600/40 mt-16 rounded-md border p-10 text-center">
                <p className="text-gold-700 text-2xl">
                  لا توجد مشاريع مطابقة لخيارات التصفية الحالية.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/projects">عرض كل المشاريع</Link>
                </Button>
              </div>
            )}
            {result.pageCount > 1 ? (
              <nav aria-label="صفحات المشاريع" className="mt-16 flex flex-col items-center gap-4">
                {result.page < result.pageCount ? (
                  <Button
                    asChild
                    variant="light"
                    className="bg-navy-900/10 text-navy-900 hover:bg-navy-900/15"
                  >
                    <Link
                      href={`/projects${filterToSearchParams({ ...filter, page: result.page + 1 })}`}
                    >
                      {COPY.home.exploreMore}
                    </Link>
                  </Button>
                ) : null}
                <ul className="flex gap-2">
                  {Array.from({ length: result.pageCount }).map((_, i) => (
                    <li key={i}>
                      <Link
                        href={`/projects${filterToSearchParams({ ...filter, page: i + 1 })}`}
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
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
