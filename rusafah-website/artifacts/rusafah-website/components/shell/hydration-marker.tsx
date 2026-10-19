"use client";

import { useEffect } from "react";

/**
 * Flags the document once React has hydrated. Forms and menus work without it
 * (progressive enhancement), but the end-to-end suite waits for this signal so a
 * click is never sent to a page whose JavaScript has not attached yet.
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
