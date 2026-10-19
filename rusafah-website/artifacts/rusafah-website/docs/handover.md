# Development-company handover

## What to give the company

- Access to the complete GitHub workspace, not only an isolated app directory.
- This README set, the environment-variable template and the existing runbooks.
- Client-owned staging/deployment access and a non-production database.
- A secure, separate way to provide necessary credentials; never place them in
  GitHub source, issues, PR descriptions or chat transcripts.
- The approved designs/brand assets and any contractual acceptance requirements.

The company's first milestone should be a clean install, successful checks,
successful production build and a running staging site.

## Commands

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm site:setup
pnpm site:check
pnpm site:build
pnpm site:bundle
pnpm --filter @rusafah/website start
```

`site:setup` migrates and seeds the configured database. Use a new development
database, not a live production one. Seed content may update existing content
and should not be run casually against an editorially managed production site.

## Environment and services

| Setting/service | Purpose |
| --- | --- |
| PostgreSQL / `DATABASE_URL` | Published content, CMS, sessions-related data, leads and outbox |
| `SESSION_SECRET` | Private sealing key, at least 32 random characters |
| `NEXT_PUBLIC_SITE_URL` | Explicit public canonical origin for the deployment |
| `RATE_LIMIT_SALT` | Optional separate private salt; production can derive one from the session secret |
| `RUN_NOTIFICATION_WORKER` | Keep `false` until SMTP and recipient settings are ready |
| `SMTP_URL`, `SMTP_FROM`, `LEADS_NOTIFY_EMAIL` | Transactional lead-alert delivery |
| `MEDIA_UPLOAD_DIR` | Local adapter location, not durable storage on ephemeral hosts |
| `TEST_DATABASE_URL` | Isolated disposable DB for integration tests; never production |

Configure private settings through the hosting provider's secret manager.
Explicitly set the canonical site origin before building the production app.

## Known production limitations

1. **Uploads:** the current CMS adapter stores uploads in `public/uploads`.
   Ephemeral/autoscaled hosts require persistent object storage. Implement and
   verify upload, serving and deletion before relying on new production uploads.
2. **Email:** the supplied environment template disables the in-process worker. Setting only
   SMTP credentials will not enable it: also update the deployment's worker
   setting after verifying the provider. Leads still persist with alerts off.
3. **Editorial coverage:** settings, project pricing/units/status and images have
   CMS workflows. New project creation, blog bodies and legal content still have
   source/seed-based maintenance paths; see the content-editing runbook.
4. **Testing scope:** GitHub CI covers static checks, unit tests and build. It is
   not a replacement for staging acceptance, browser testing or production
   performance measurements on real phones.

## Deployment and acceptance

- Build with Node 24 and the committed lockfile; start the Next.js server with
  `PORT` supplied by the host. This is not a static-only site.
- Use the host's approved production migration process. Review and approve production schema changes before applying them; do not add migrations to startup/build hooks.
- Verify Arabic/RTL navigation, project search/filtering, details, maps and forms.
- Verify admin sign-in and every changed CMS mutation on staging.
- Check real lead persistence, notification delivery when enabled, upload
  persistence, backup restoration and rollback procedures.
- Measure production performance with cold cache and a throttled phone profile.
- Configure GitHub branch protection to require the `Website checks` workflow.

Do not promise zero lag on every device or network. Use measured acceptance
targets from the performance guide and investigate regressions against them.
