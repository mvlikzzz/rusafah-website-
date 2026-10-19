import type { Metadata } from "next";
import { ProjectHero, toHeroProject } from "@/components/projects/project-hero";
import { SiteHeader } from "@/components/shell/site-header";
import { FloatingContact } from "@/components/shell/floating-contact";
import { listFeaturedProjects } from "@/modules/projects/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "أحدث المشاريع",
  description: "أحدث مشاريع رُصافة العقارية في الرياض، مشروعاً بعد مشروع.",
};

/** One full-screen slide per featured project, snapping as you scroll — the "أحدث المشاريع" artboard. */
export default async function LatestProjectsPage() {
  const featured = await listFeaturedProjects();
  const tabs = featured
    .slice()
    .sort((a, b) => b.code.localeCompare(a.code))
    .map((p) => toHeroProject(p));
  const slides = tabs;
  return (
    <>
      <SiteHeader variant="overlay" current="/projects" />
      <FloatingContact />
      <main id="main" className="snap-page bg-navy-900">
        <h1 className="sr-only">أحدث المشاريع</h1>
        {slides.map((p, i) => (
          <ProjectHero
            key={p.slug}
            id={p.slug}
            project={p}
            tabs={tabs}
            priority={i === 0}
            className="snap-start"
          />
        ))}
      </main>
    </>
  );
}
