"use client";

import { useEffect } from "react";

/**
 * One managed timer, stopped for background tabs and reduced-motion users.
 * Keep `advance` stable with useCallback so rendering does not reset the timer.
 */
export function useAutoplay(advance: () => void, delay: number, enabled: boolean) {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const synchronize = () => {
      clearInterval(timer);
      timer = undefined;
      if (enabled && !document.hidden && !motion.matches) {
        timer = setInterval(advance, delay);
      }
    };
    synchronize();
    document.addEventListener("visibilitychange", synchronize);
    motion.addEventListener("change", synchronize);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", synchronize);
      motion.removeEventListener("change", synchronize);
    };
  }, [advance, delay, enabled]);
}
