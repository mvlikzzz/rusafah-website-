/* eslint-disable @next/next/no-img-element -- SVG artwork extracted from the design; next/image adds nothing for vectors */
import type * as React from "react";

/** Plain <img> for vector artwork (partner and certificate marks). */
export function ArtworkImg({
  alt,
  ...props
}: React.ComponentPropsWithoutRef<"img"> & { alt: string }) {
  return <img alt={alt} loading="lazy" decoding="async" {...props} />;
}
