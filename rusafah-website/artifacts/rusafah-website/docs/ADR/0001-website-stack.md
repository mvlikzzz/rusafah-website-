# ADR 0001 — Public website: stack and shape

- **Status:** Accepted
- **Date:** 2026-09-13
- **Deciders:** Engineering owner
- **Supersedes:** —
- **Superseded by:** —

## Context

RUSAFAH commissioned a public marketing website (home, projects, project detail,
about, blog, article, contact, privacy, terms) delivered as Illustrator artboards
with photos and brand fonts. The operational platform exists in a separate
repository and its `ENGINEERING.md` is the governing engineering specification for
every RUSAFAH codebase. The website has no authenticated users, no money, and no
participation records; it does have public forms that create leads.

## Decision

1. **Same stack as the platform, separate deployable.** Next.js App Router,
   TypeScript strict, Tailwind, Drizzle on PostgreSQL 16, pnpm, Vitest,
   Playwright + axe, GitHub Actions. The website is its own repository and its
   own database: public content and leads must never share a database with
   investor data, and the website's release cadence is marketing-driven.
2. **Content lives in Postgres, not in components.** Projects, images, features,
   warranties, units, articles, partners, certificates, headline figures, contact
   facts and the legal texts are rows. `db/seed/content.ts` is the transcription of
   the artboards and the way content is edited until an editor exists. Only
   fixed page copy (`lib/copy.ts`) is in code.
3. **Leads are captured through a transactional outbox.** Server actions validate
   with Arabic sentences, rate-limit with a salted hash of the client address
   (no raw IP is stored), and write the lead and its notification in one
   transaction. A pg-boss worker delivers by SMTP; Mailpit locally (E-O-05).
4. **Everything is served from the site's own origin.** Fonts (`next/font/local`),
   the Riyadh map (a Protomaps/OpenStreetMap PMTiles extract, glyphs and the RTL
   text plugin under `public/map`), and images. The page makes no request to a
   third party, which keeps the PDPL review (D-11) about hosting only.
5. **Developer routes cannot ship** (`*.dev.tsx` + `NEXT_PUBLIC_ENABLE_DEV_ROUTES`,
   platform decision E-11), and every migration ships a hand-written down file
   verified by `pnpm check:migrations` (E-09).

## Consequences

- Adding a project or article today means editing the seed and running
  `pnpm db:seed` (or inserting rows). A content editor is a later decision.
- The projects table mirrors the platform's vocabulary (`name_ar`, `city`,
  `district`, `publication_status`) so a future projection from the platform's
  published projects is a column mapping.
- The self-hosted tile archive (about 10 MB) is committed; refreshing it is a
  documented command in the runbook.
