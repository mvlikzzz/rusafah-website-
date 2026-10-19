import localFont from "next/font/local";

/**
 * Brand typography, self-hosted (ENGINEERING.md §5 — no CDN).
 *
 * - HT Rakik: the brand Arabic family used throughout the approved design. Full
 *   tashkeel (U+064B–U+0652) and both digit systems are present in the file.
 *   Licence for web embedding is pending confirmation — see DECISIONS.md D-20.
 * - Alyamama Light (SIL OFL 1.1): the calligraphic display face for the tagline.
 * - Barlow (SIL OFL 1.1): stands in for Bahnschrift, which Microsoft does not
 *   licence for web embedding. Used for Latin labels and large numerals.
 */
export const rakik = localFont({
  src: [
    { path: "../app/fonts/HTRakik-Light.woff2", weight: "300", style: "normal" },
    { path: "../app/fonts/HTRakik-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/HTRakik-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/HTRakik-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-rakik",
  display: "swap",
  fallback: ["Noto Sans Arabic", "Segoe UI", "system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export const alyamama = localFont({
  src: [{ path: "../app/fonts/Alyamama-Light.woff2", weight: "300", style: "normal" }],
  variable: "--font-alyamama",
  display: "swap",
  fallback: ["Noto Naskh Arabic", "serif"],
  adjustFontFallback: false,
  preload: false,
});

export const barlow = localFont({
  src: [
    { path: "../app/fonts/Barlow-Light.woff2", weight: "300", style: "normal" },
    { path: "../app/fonts/Barlow-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/Barlow-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/Barlow-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/Barlow-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: false,
});

export const fontVariables = `${rakik.variable} ${alyamama.variable} ${barlow.variable}`;
