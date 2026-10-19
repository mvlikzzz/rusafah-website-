# Runbook — editing website content

All content is data in Postgres. A password-protected admin CMS at `/admin` now
covers the fields that change often — site settings, headline figures, project
pricing/units/status, and project images — without touching code or running a
seed; see `docs/runbooks/admin-cms.md`. What the CMS does not yet cover
(creating a new project or post, blog body content, legal documents) still goes
through `db/seed/content.ts`; `pnpm db:seed` upserts it by natural keys (project
`code`, post `slug`, stat `key`, legal `slug`) and never touches leads,
subscribers, or anything already edited through the CMS.

## Add a new project

1. Export the photos into `public/images/projects/rusafah-NN/` (card.jpg is the
   portrait card image; hero.jpg / gallery-*.jpg are optional) — or add more
   later from `/admin/projects/[slug]` once the project exists.
2. Add an entry to `projects` in `db/seed/content.ts`: code, district,
   `propertyTypes` (`apartments` | `floors` | `villas`), `status`
   (`available` | `coming_soon` | `sold`), images, and — when known — price range,
   land area, models, units, floors, sales percentage, construction date,
   features, warranties and units. Set `isFeatured: true` to include it in the
   home hero, the projects strip and `/projects/latest`.
3. Coordinates default to the district centre and are labelled approximate; set
   `location_precision = 'exact'` with real latitude/longitude when supplied.
4. `pnpm db:seed`.

Changing an **existing** project's price range, unit count, sales progress,
status, per-unit price/status, or images: use `/admin/projects/[slug]` instead
— it writes an audit record and does not need a deploy.

## Publish an article

Add the post with `status: "published"` and a `body` of content blocks
(`heading`, `paragraph`, `list`, `callout`). Drafts are stored but never served.
The five articles from the design without body text are already rows with
`status: "draft"`.

## Contact details, social links, headline figures

Edit these at `/admin/settings` (recommended — no deploy, audited). They also
live in `siteSettings` and `companyStats` in the seed for the initial load.
Only networks with a URL appear in the footer. Figures carry `asOf` and
`sourceAr` for provenance.

## Legal pages

`legalDocuments` (`privacy`, `terms`). Footer links appear only for published
documents.

## Documents that unlock hidden buttons

- Company profile PDF → `siteSettings.profileDocumentPath` shows «الملف التعريفي».
- Project profile PDF → `projects[].profileDocumentPath` shows «برفايل المشروع».
