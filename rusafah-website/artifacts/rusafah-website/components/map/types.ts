export type MapPin = {
  slug: string;
  nameEn: string;
  nameAr: string;
  lat: number;
  lng: number;
  precision: "district" | "exact";
  district: string;
  city: string;
  typeLabel: string;
  statusLabel: string;
  image: string | null;
};

export type ProjectsMapProps = {
  pins: MapPin[];
  activeSlug?: string | null;
  onActiveChange?: (slug: string) => void;
  /** Single-project view: tighter zoom. */
  focus?: boolean;
  className?: string;
  interactive?: boolean;
};
