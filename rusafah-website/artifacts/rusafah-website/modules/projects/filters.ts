import { z } from "zod";
import { LISTING_TYPES, PROPERTY_TYPES } from "./vocabulary";

/**
 * Filter model for /projects. Parsed from URL search params on the server, so
 * the filtered list is real server-side data, never a client-side subset.
 */
export const projectFilterSchema = z.object({
  city: z.string().trim().min(1).max(60).optional(),
  district: z.string().trim().min(1).max(60).optional(),
  types: z.array(z.enum(PROPERTY_TYPES)).default([]),
  bedrooms: z.coerce.number().int().min(1).max(6).optional(),
  priceMin: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  priceMax: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  listing: z.enum(LISTING_TYPES).default("sale"),
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(80).optional(),
});

export type ProjectFilter = z.infer<typeof projectFilterSchema>;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseProjectFilter(params: RawSearchParams): ProjectFilter {
  const typesRaw = params.types ?? params["types[]"];
  const types = (Array.isArray(typesRaw) ? typesRaw : typesRaw ? typesRaw.split(",") : []).filter(
    Boolean,
  );
  const pick = (k: string) => {
    const v = params[k];
    const s = Array.isArray(v) ? v[0] : v;
    return s === "" ? undefined : s;
  };
  const parsed = projectFilterSchema.safeParse({
    city: pick("city"),
    district: pick("district"),
    types,
    bedrooms: pick("bedrooms"),
    priceMin: pick("priceMin"),
    priceMax: pick("priceMax"),
    listing: pick("listing") ?? "sale",
    page: pick("page") ?? 1,
    q: pick("q"),
  });
  if (parsed.success) return parsed.data;
  // Invalid params fall back to defaults rather than erroring the page.
  return projectFilterSchema.parse({ types: [] });
}

/** Serialises a filter back to a query string, dropping defaults. */
export function filterToSearchParams(filter: Partial<ProjectFilter>): string {
  const sp = new URLSearchParams();
  if (filter.city) sp.set("city", filter.city);
  if (filter.district) sp.set("district", filter.district);
  if (filter.types?.length) sp.set("types", filter.types.join(","));
  if (filter.bedrooms) sp.set("bedrooms", String(filter.bedrooms));
  if (filter.priceMin) sp.set("priceMin", String(filter.priceMin));
  if (filter.priceMax) sp.set("priceMax", String(filter.priceMax));
  if (filter.listing && filter.listing !== "sale") sp.set("listing", filter.listing);
  if (filter.page && filter.page > 1) sp.set("page", String(filter.page));
  if (filter.q) sp.set("q", filter.q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}
