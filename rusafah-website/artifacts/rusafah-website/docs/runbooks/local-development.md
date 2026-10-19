# Runbook — local development

1. `pnpm install`
2. `cp .env.example .env.local` (values already point at the compose services;
   ports 5434 / 1026 / 8026 are offset so they do not collide with the platform's
   compose stack on the same machine).
3. `pnpm setup` — starts Postgres and Mailpit, applies migrations, seeds content.
4. `pnpm dev` — the notification worker starts inside the server; watch the
   terminal for `[notifications] worker started`.
5. Submit the contact form; the alert appears in Mailpit at http://localhost:8026.

## Databases

- Dev: `rusafah_web` (DATABASE_URL). Reset with `pnpm db:reset`.
- Tests: `rusafah_web_test` (TEST_DATABASE_URL), created by `pnpm db:test:prepare`.

## Map tiles

`public/map/riyadh.pmtiles` is an extract of the Protomaps daily build
(OpenStreetMap data, ODbL) for the Riyadh bounding box 46.30,24.35 → 47.15,25.15
at zoom ≤ 14. To refresh:

```bash
pmtiles extract https://build.protomaps.com/YYYYMMDD.pmtiles public/map/riyadh.pmtiles --bbox=46.30,24.35,47.15,25.15 --maxzoom=14
```

Glyphs under `public/map/fonts` come from the protomaps/basemaps-assets repository
(Noto Sans, OFL). The MapLibre worker and RTL plugin are copied from
`node_modules` by `scripts/copy-map-assets.mjs` before every `dev` and `build`.

## Fonts

HT Rakik (brand), Alyamama Light (OFL) and Barlow (OFL, stand-in for Bahnschrift)
are self-hosted from `app/fonts`. See DECISIONS.md DW-01 for the licence question.
