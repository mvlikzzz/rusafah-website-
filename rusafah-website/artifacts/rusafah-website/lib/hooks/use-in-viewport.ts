"use client";

import { useEffect, useRef, useState } from "react";

/** Observe without scroll listeners; `once` is useful for loading expensive UI. */
export function useInViewport<T extends HTMLElement>({
  rootMargin = "0px",
  once = false,
}: { rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      // Older browsers still receive the complete feature.
      const frame = requestAnimationFrame(() => setIsInViewport(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return { ref, isInViewport };
}
