# رُصافة العقارية — الموقع الإلكتروني العام

The public website of RUSAFAH Real Estate, built from the approved Illustrator
artboards (September 2026). Arabic, right-to-left, Next.js App Router, Postgres.

This application lives in a pnpm workspace. Start with the
[workspace README](../../README.md) and [contribution guide](../../CONTRIBUTING.md).
No separate platform repository or API server is required to develop the website.
Historical design decisions remain in `DECISIONS.md` and `ASSUMPTIONS.md`.

## Run it locally

Requirements: Node 24 LTS, pnpm 10.26.1 and a development PostgreSQL database.
Run these commands from the **workspace root**:

```bash
pnpm install --frozen-lockfile
cp artifacts/rusafah-website/.env.example artifacts/rusafah-website/.env.local
# Configure DATABASE_URL and a private 32+ character SESSION_SECRET.
pnpm site:setup                   # migrate and seed a DEVELOPMENT database
pnpm site:dev                     # http://localhost:3000
```

Email alerts are disabled by default; forms still save leads. The optional
`pnpm --filter @rusafah/website setup:local` command starts the supplied
Docker development services on a developer's own computer. Alternatively,
configure any supported PostgreSQL service directly; Docker is optional.

## Developer handover

- [Architecture and code ownership](docs/architecture.md)
- [Company handover and production limitations](docs/handover.md)
- [Performance implementation and release checks](docs/performance.md)
- Root shortcut: `pnpm site:check` runs lint, types, unit tests and RTL checks.
- GitHub Actions: `.github/workflows/website-ci.yml` in the workspace root.

## Scripts

The table below uses commands from this application's directory. From the root,
prefix application commands with `pnpm --filter @rusafah/website`.

| Script                                                                   | What it does                                                                                        |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm start`                                 | Next.js. `predev`/`prebuild` copy the MapLibre worker into `public/map`.                            |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm check:logical` | Static gates (the last one forbids physical direction utilities — ENGINEERING.md §5).                    |
| `pnpm db:generate`                                                       | Generate a migration from `db/schema`. Write its `.down.sql` by hand (E-09).                        |
| `pnpm db:migrate`, `pnpm db:rollback`, `pnpm db:reset`                   | Apply, revert one, or wipe and rebuild the dev database.                                            |
| `pnpm db:seed`                                                           | Idempotent content seed (`db/seed/content.ts`).                                                     |
| `pnpm test`                                                              | Unit tests (Vitest).                                                                                |
| `pnpm test:integration`                                                  | Prepares `TEST_DATABASE_URL` and runs DB-backed tests.                                              |
| `pnpm check:migrations`                                                  | up → down → up on the test database.                                                                |
| `pnpm test:e2e`                                                          | Playwright e2e + axe accessibility (builds and starts the app unless `PLAYWRIGHT_BASE_URL` is set). |
| `pnpm admin:create -- --email … --password … --name … [--role owner]`    | Create or reset a password for an `/admin` CMS user.                                                |

## Where things live

```
app/            routes: /, /projects, /projects/latest, /projects/[slug], /about,
                /blog, /blog/[slug], /contact, /privacy, /terms, /search, /admin
components/     UI kit (ui/), shell (header, footer, drawer), patterns, map, admin
modules/        projects, posts, site, leads, notifications, search, admin,
                media, integrations/crm — service functions only
db/             Drizzle schema, migrations (+ hand-written down files), seed
lib/            env, fonts, formatters, page copy, password hashing, sessions
public/images   photos exported from the design package; masks/ are colourable marks
public/map      self-hosted Riyadh vector tiles (PMTiles), glyphs, RTL plugin
public/uploads  images uploaded through the admin CMS (local disk — see EW-09)
tests/          unit, integration, e2e, a11y
docs/           ADRs and runbooks
```

## Editing content

Content is data, not code. Most of it — site settings, headline figures,
project pricing/units/status, and project images — is editable at `/admin`
without a deploy (`docs/runbooks/admin-cms.md`). What isn't yet (new projects,
blog bodies, legal documents) goes through `db/seed/content.ts` — see
`docs/runbooks/content-editing.md`.

## CMS and CRM integration

- **Admin CMS** (`/admin`): session-cookie auth, every mutation server-authorized
  and audited. `docs/runbooks/admin-cms.md`.
- **CRM**: leads can sync to any CRM reachable by a REST/PostgREST webhook
  (`CRM_PROVIDER=webhook`), through the same transactional outbox used for
  email alerts. Off by default (`CRM_PROVIDER=none`). `docs/runbooks/crm-integration.md`.

## Leads

Every public form (contact, register interest, book a visit, newsletter) writes to
Postgres inside one transaction together with a row in `notification_outbox`.
A pg-boss worker, when enabled inside the Next.js server, delivers the alert by SMTP
(`SMTP_URL`, `LEADS_NOTIFY_EMAIL`). A failed email never loses the lead.
