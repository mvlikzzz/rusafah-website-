# Performance maintenance

## Current implementation choices

- The MapLibre/PMTiles engine is dynamically imported only when the map approaches
  the viewport (400px margin). Its worker and tile requests start with the map,
  not with the initial hero. The map retains its space to avoid layout shift.
- The former startup splash's artificial 1.5-second visual delay is removed.
- The home slideshow renders the brand plus only the active/upcoming project
  backgrounds instead of loading every project background at startup.
- Hero timers stop off-screen, when the document is hidden and for reduced motion.
- Repeated featured-project and project-detail queries are deduplicated per
  server render, without introducing stale cross-request content caches.
- Photos use Next Image responsive sizing/modern formats. Map assets already have
  cache headers; local fonts and tiles do not require third-party CDN calls.

## Verify in production mode

`next dev` includes compilation and diagnostics, so it is not a speed benchmark.
Build and run the production server, then use browser DevTools/Lighthouse:

```sh
pnpm site:build
pnpm site:bundle
pnpm --filter @rusafah/website start
```

Use a reachable development/staging database. Test a cold cache at phone and
desktop widths. In Network, confirm the large map-engine chunk is absent before
scrolling near the map and appears when needed. Check map rendering and marker
selection after loading, not just the placeholder. Scroll away from the hero and
switch tabs to confirm the slideshow is not continually advancing.

The bundle command prints raw/gzip sizes of the largest production JS chunks.
Those totals cover **all routes and deferred features**, not initial transfer.
Do not report total build size as a page-speed score.

## Acceptance targets

Aim for these Core Web Vitals at the 75th percentile of real visits:

| Metric | Good target |
| --- | --- |
| Largest Contentful Paint (LCP) | ≤ 2.5 seconds |
| Interaction to Next Paint (INP) | ≤ 200 milliseconds |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |

These are targets, not measurements or guarantees for this deployment.
Before releases, inspect slow-network loading, long tasks, image transfer sizes,
database latency and interactions on a lower-powered phone. Keep measurements
with the release/PR so later companies can compare equivalent conditions.

## Avoid regressions

- Do not statically import the map engine or other heavyweight libraries in pages.
- Give images appropriate `sizes`; do not preload all gallery or carousel images.
- Avoid global scroll listeners and timers that keep running in hidden views.
- Keep server components server-side unless browser interactivity is necessary.
- Add persistent caches only with a CMS invalidation strategy.
- Resize/compress new source images before adding them; keep user uploads in
  durable storage rather than source control.
