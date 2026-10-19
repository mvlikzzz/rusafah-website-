# Rusafah Real Estate website

Arabic, right-to-left property website with a staff CMS, project search,
interactive maps, contact forms and PostgreSQL-backed content.

## Development setup

Use Node 24 LTS and pnpm 10.26.1. Run commands from this repository's root.

~~~sh
corepack enable
corepack prepare pnpm@10.26.1 --activate
pnpm install --frozen-lockfile
cp artifacts/rusafah-website/.env.example artifacts/rusafah-website/.env.local
~~~

Configure a development PostgreSQL database, a random session secret of at least
32 characters, and the intended public site origin in that local environment
file. Never commit private configuration.

~~~sh
pnpm site:setup
pnpm site:dev
~~~

The optional setup:local command in the website package starts a local database
with Docker. Docker is not required when a PostgreSQL service already exists.

## Commands

| Command | Purpose |
| --- | --- |
| pnpm site:dev | Start the development server |
| pnpm site:check | Lint, types, unit tests and RTL checks |
| pnpm site:test | Run unit tests |
| pnpm site:build | Create a production build |
| pnpm site:bundle | Report production JavaScript bundle sizes |
| pnpm --filter @rusafah/website start | Start the production server |

## Developer guides

- [Website guide](artifacts/rusafah-website/README.md)
- [Engineering standards](artifacts/rusafah-website/ENGINEERING.md)
- [Architecture](artifacts/rusafah-website/docs/architecture.md)
- [Contribution workflow](CONTRIBUTING.md)
- [Company handover](artifacts/rusafah-website/docs/handover.md)
- [Performance](artifacts/rusafah-website/docs/performance.md)

## Deployment

Deploy as a Node.js application with PostgreSQL; this is not a static-only site.
Set NEXT_PUBLIC_SITE_URL explicitly and supply PORT through the hosting provider.
DEV_PREVIEW_HOST optionally allows an additional development-preview hostname.
PUBLIC_HOSTNAMES optionally supplies a fallback origin when the explicit site
URL is omitted; production should always set NEXT_PUBLIC_SITE_URL.

Review and approve migrations before applying them to production, keep database
backups, and store credentials in the host's secret manager.

New CMS uploads currently use local disk. Configure durable storage before
relying on uploads on an ephemeral host. Email alerts are disabled until SMTP,
recipients and the notification worker are configured; forms still save leads.
See the handover guide for the full acceptance checklist and limitations.

## Third-party notices

Third-party packages and bundled fonts retain their respective licenses.
Font license notices are included alongside their assets.
