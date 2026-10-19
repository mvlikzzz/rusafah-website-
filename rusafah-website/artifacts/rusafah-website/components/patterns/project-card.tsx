import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import type { ProjectCard as ProjectCardData } from "@/modules/projects/queries";
import {
  propertyTypesLabel,
  propertyTypesLabelEn,
  type ProjectStatus,
} from "@/modules/projects/vocabulary";
import { cn } from "@/lib/utils";

/**
 * Card from the projects grid: portrait image with a status marker and a Latin
 * caption over the bottom, then the Latin name on a two-tone rule, type and location.
 * Sold projects are shown in monochrome, as on the artboard.
 */
export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: ProjectCardData;
  priority?: boolean;
  className?: string;
}) {
  const sold = project.status === "sold";
  return (
    <article className={cn("group", className)}>
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-offset-4">
        <div className="bg-navy-800 relative aspect-[3/4] overflow-hidden">
          {project.cardImage ? (
            <Image
              src={project.cardImage.path}
              alt={project.cardImage.altAr}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className={cn(
                "object-cover transition-transform duration-700 group-hover:scale-[1.04]",
                sold && "grayscale",
              )}
            />
          ) : null}
          <div
            aria-hidden="true"
            className="from-navy-950/85 absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent"
          />
          <div className="text-cream-100 absolute inset-x-0 bottom-0 p-5">
            <StatusBadge
              status={project.status as ProjectStatus}
              className="text-2xl font-medium"
            />
            <p className="font-latin text-cream-200/85 mt-1 text-sm tracking-[0.18em] uppercase">
              {propertyTypesLabelEn(project.propertyTypes)}{" "}
              <span className="ms-2">{project.nameEn.replace(/\s+/g, "")}</span>
            </p>
          </div>
        </div>
        <div className="pt-4">
          <h3 className="font-latin text-navy-900 text-2xl font-semibold">{project.nameEn}</h3>
          <div aria-hidden="true" className="mt-2 flex h-px">
            <span className="bg-gold-600/70 flex-1" />
            <span className="bg-navy-900 w-16" />
          </div>
          <p className="text-gold-600 mt-3 text-2xl leading-tight">
            {propertyTypesLabel(project.propertyTypes)}
          </p>
          <p className="text-gold-600 text-2xl leading-tight">
            {project.city} - {project.district}
          </p>
        </div>
      </Link>
    </article>
  );
}
