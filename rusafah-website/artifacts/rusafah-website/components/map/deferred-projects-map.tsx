"use client";

import dynamic from "next/dynamic";
import { useInViewport } from "@/lib/hooks/use-in-viewport";
import { cn } from "@/lib/utils";
import type { ProjectsMapProps } from "./types";

// Keep the map engine behind this client boundary. A static import here would
// put MapLibre and PMTiles back into every consuming page's initial JavaScript.
const MapCanvas = dynamic(() => import("./projects-map").then((m) => m.ProjectsMap), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return (
    <div className="text-gold-700 flex h-full items-center justify-center" role="status">
      جارٍ تحميل الخريطة…
    </div>
  );
}

/** Reserve map space at SSR, then load the engine shortly before it is visible. */
export function DeferredProjectsMap({ className, ...props }: ProjectsMapProps) {
  const { ref, isInViewport } = useInViewport<HTMLDivElement>({
    rootMargin: "400px",
    once: true,
  });
  return (
    <div
      ref={ref}
      className={cn("bg-cream-300 relative overflow-hidden rounded-2xl", className)}
    >
      {isInViewport ? <MapCanvas {...props} className="h-full w-full" /> : <MapPlaceholder />}
      {/* The map is an enhancement; project links are also present before JS loads. */}
      <ul className="sr-only">
        {props.pins.map((pin) => (
          <li key={pin.slug}>
            <a href={`/projects/${pin.slug}`}>
              {pin.nameAr} — {pin.city} - {pin.district}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
