import type { NextConfig } from "next";

/**
 * E-11: developer-only routes use the `*.dev.tsx` extension and are only part of
 * the build when NEXT_PUBLIC_ENABLE_DEV_ROUTES=true, so they cannot ship.
 */
const devRoutes = process.env.NEXT_PUBLIC_ENABLE_DEV_ROUTES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...(process.env.DEV_PREVIEW_HOST ? [process.env.DEV_PREVIEW_HOST] : []),
  ],
  pageExtensions: devRoutes ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: "/map/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
