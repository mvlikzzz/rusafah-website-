import { layers, namedFlavor, type Flavor } from "@protomaps/basemaps";
import type { StyleSpecification } from "maplibre-gl";

/**
 * Map style tuned to the artboards: cream ground, warm-brown roads, navy labels.
 * Tiles, glyphs and the RTL plugin are all served from this site (no third party).
 */
export const RUSAFAH_FLAVOR: Flavor = {
  ...namedFlavor("light"),
  background: "#e6dac8",
  earth: "#e9dfcf",
  park_a: "#dfd6c2",
  park_b: "#d9cfba",
  hospital: "#e4d8c4",
  industrial: "#e2d6c2",
  school: "#e4d8c4",
  wood_a: "#dcd2bd",
  wood_b: "#d6ccb6",
  pedestrian: "#e0d4c0",
  scrub_a: "#e2d8c5",
  scrub_b: "#ddd3bf",
  glacier: "#e9dfcf",
  sand: "#e6dac8",
  beach: "#e6dac8",
  aerodrome: "#e2d6c2",
  runway: "#cbbba3",
  water: "#c9d3d6",
  zoo: "#e2d6c2",
  military: "#e2d6c2",
  buildings: "#d9cdb8",
  minor_service: "#c7ac8c",
  minor_a: "#b99871",
  minor_b: "#b99871",
  link: "#a57c55",
  major: "#a57c55",
  highway: "#8f6640",
  railway: "#b8a48c",
  boundaries: "#8f6640",
  bridges_other: "#a57c55",
  bridges_minor: "#b99871",
  bridges_link: "#a57c55",
  bridges_major: "#a57c55",
  bridges_highway: "#8f6640",
  roads_label_minor: "#6b4a2f",
  roads_label_minor_halo: "#e9dfcf",
  roads_label_major: "#4a3220",
  roads_label_major_halo: "#e9dfcf",
  ocean_label: "#4a5b63",
  subplace_label: "#3a2a1c",
  subplace_label_halo: "#e9dfcf",
  city_label: "#002231",
  city_label_halo: "#e9dfcf",
  state_label: "#4a3220",
  state_label_halo: "#e9dfcf",
  country_label: "#002231",
  address_label: "#6b4a2f",
  address_label_halo: "#e9dfcf",
  pois: undefined,
  landcover: undefined,
};

export function buildStyle(tilesUrl: string, glyphsUrl: string): StyleSpecification {
  const base = layers("protomaps", RUSAFAH_FLAVOR, { lang: "ar" }).filter(
    (l) => !("layout" in l && l.layout && "icon-image" in (l.layout as Record<string, unknown>)),
  );
  return {
    version: 8,
    glyphs: glyphsUrl,
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${tilesUrl}`,
        attribution:
          '<a href="https://protomaps.com" rel="noopener" target="_blank">Protomaps</a> © <a href="https://openstreetmap.org/copyright" rel="noopener" target="_blank">OpenStreetMap</a>',
      },
    },
    layers: base,
  };
}
