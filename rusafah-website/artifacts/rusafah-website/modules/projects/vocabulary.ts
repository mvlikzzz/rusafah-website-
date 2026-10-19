/**
 * Fixed vocabularies for the public catalogue. Labels are the exact Arabic used on
 * the approved artboards. Adding a value here is a content decision, not a code one.
 */
export const PROJECT_STATUSES = ["available", "coming_soon", "sold", "under_construction"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROPERTY_TYPES = ["apartments", "floors", "villas"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_TYPES = ["sale", "rent"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  available: "متاح للبيع",
  coming_soon: "قريباً",
  sold: "مباع",
  under_construction: "تحت الإنشاء",
};

const PROPERTY_LABELS: Record<PropertyType, string> = {
  apartments: "شقق",
  floors: "أدوار",
  villas: "فلل",
};

const PROPERTY_LABELS_EN: Record<PropertyType, string> = {
  apartments: "APARTMENTS",
  floors: "FLOORS",
  villas: "VILLA",
};

const LISTING_LABELS: Record<ListingType, string> = { sale: "بيع", rent: "إيجار" };

export function projectStatusLabel(status: string): string {
  return STATUS_LABELS[status as ProjectStatus] ?? status;
}

export function propertyTypeLabel(type: string): string {
  return PROPERTY_LABELS[type as PropertyType] ?? type;
}

/** "فلل/أدوار" — the slash-joined label used on cards and hero specs. */
export function propertyTypesLabel(types: readonly string[]): string {
  return types.map(propertyTypeLabel).join("/");
}

/** "FLOORS RUSAFAH14" — the Latin caption printed over card images. */
export function propertyTypesLabelEn(types: readonly string[]): string {
  return types.map((t) => PROPERTY_LABELS_EN[t as PropertyType] ?? t.toUpperCase()).join("/");
}

export function listingTypeLabel(type: string): string {
  return LISTING_LABELS[type as ListingType] ?? type;
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

export function isPropertyType(value: string): value is PropertyType {
  return (PROPERTY_TYPES as readonly string[]).includes(value);
}
