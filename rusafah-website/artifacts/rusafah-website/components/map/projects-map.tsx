"use client";

import * as React from "react";
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  addProtocol,
  setRTLTextPlugin,
  setWorkerUrl,
} from "maplibre-gl";
import { Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildStyle } from "./map-style";
import { cn } from "@/lib/utils";
import type { ProjectsMapProps } from "./types";

const RIYADH_CENTER: [number, number] = [46.6753, 24.7136];
let protocolRegistered = false;
let rtlPluginRequested = false;

/**
 * Self-hosted MapLibre map. Vector tiles come from /map/riyadh.pmtiles (a
 * Protomaps/OpenStreetMap extract), glyphs from /map/fonts, and Arabic shaping
 * from the bundled RTL plugin — the page makes no request to any third party.
 */
export function ProjectsMap({
  pins,
  activeSlug,
  onActiveChange,
  focus = false,
  className,
  interactive = true,
}: ProjectsMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<MapLibreMap | null>(null);
  const markersRef = React.useRef<Map<string, Marker>>(new Map());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!protocolRegistered) {
      // The worker bundle is served from this origin (scripts/copy-map-assets.mjs).
      setWorkerUrl(`${window.location.origin}/map/maplibre-gl-worker.mjs`);
      addProtocol("pmtiles", new Protocol().tile);
      protocolRegistered = true;
    }
    if (!rtlPluginRequested) {
      rtlPluginRequested = true;
      setRTLTextPlugin("/map/mapbox-gl-rtl-text.js", true).catch(() => undefined);
    }
    const map = new MapLibreMap({
      container: containerRef.current,
      style: buildStyle(
        `${window.location.origin}/map/riyadh.pmtiles`,
        `${window.location.origin}/map/fonts/{fontstack}/{range}.pbf`,
      ),
      center: RIYADH_CENTER,
      zoom: focus ? 12.5 : 10.4,
      minZoom: 9,
      maxZoom: 14.9,
      attributionControl: { compact: true },
      interactive,
      cooperativeGestures: interactive,
      locale: {
        "ScrollZoomBlocker.CtrlMessage": "استخدم Ctrl + التمرير لتكبير الخريطة",
        "ScrollZoomBlocker.CmdMessage": "استخدم ⌘ + التمرير لتكبير الخريطة",
        "TouchPanBlocker.Message": "استخدم إصبعين لتحريك الخريطة",
      },
    });
    if (interactive) map.addControl(new NavigationControl({ showCompass: false }), "top-left");
    map.on("load", () => setReady(true));
    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, [focus, interactive]);

  // Markers
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of markersRef.current.values()) m.remove();
    markersRef.current.clear();
    const bounds = new LngLatBounds();
    for (const pin of pins) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "rusafah-pin";
      el.setAttribute("aria-label", `${pin.nameEn} — ${pin.district}`);
      el.innerHTML = `<span class="rusafah-pin__label">${pin.nameEn}</span><span class="rusafah-pin__dot"></span>`;
      el.addEventListener("click", () => onActiveChange?.(pin.slug));
      const marker = new Marker({ element: el, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
      markersRef.current.set(pin.slug, marker);
      bounds.extend([pin.lng, pin.lat]);
    }
    if (pins.length > 1 && !focus) {
      const fitPins = () => {
        const container = map.getContainer();
        if (!container.clientWidth || !container.clientHeight) return;
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const wide = container.clientWidth >= 900;
        // Mobile controls and project cards now sit outside the map.
        // Retaining their desktop padding leaves no room for the camera.
        map.fitBounds(bounds, {
          padding: mobile
            ? { top: 48, bottom: 24, left: 24, right: 24 }
            : {
                top: 120,
                bottom: wide ? 80 : 260,
                left: wide ? 80 : 24,
                right: wide ? 380 : 24,
              },
          maxZoom: 12.2,
          duration: 0,
        });
      };
      fitPins();
      map.on("resize", fitPins);
      return () => {
        map.off("resize", fitPins);
      };
    } else if (pins.length === 1) {
      map.setCenter([pins[0]!.lng, pins[0]!.lat]);
    }
  }, [pins, focus, onActiveChange]);

  // Active pin styling
  React.useEffect(() => {
    for (const [slug, marker] of markersRef.current) {
      marker.getElement().classList.toggle("is-active", slug === activeSlug);
    }
  }, [activeSlug, pins]);

  return (
    <div className={cn("bg-cream-300 relative overflow-hidden rounded-2xl", className)}>
      <div
        ref={containerRef}
        className="absolute inset-0"
        role="region"
        aria-label="خريطة المشاريع"
      />
      {!ready ? (
        <div
          className="bg-cream-300 text-gold-700 absolute inset-0 flex items-center justify-center"
          role="status"
        >
          جارٍ تحميل الخريطة…
        </div>
      ) : null}
      {/* Accessible equivalent of the pins for keyboard and screen-reader users. */}
      <ul className="sr-only">
        {pins.map((p) => (
          <li key={p.slug}>
            <a href={`/projects/${p.slug}`}>
              {p.nameEn} — {p.city} - {p.district} — {p.typeLabel} — {p.statusLabel}
              {p.precision === "district" ? " (موقع تقريبي على مستوى الحي)" : ""}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
