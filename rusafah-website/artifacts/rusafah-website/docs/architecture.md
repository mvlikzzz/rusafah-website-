# Website architecture

## Runtime

This is a Next.js App Router application, not a static export or a client SPA
with a separate API service. React Server Components compose public pages and
read PostgreSQL through Drizzle. Small client components provide interactive
controls. Server actions/route handlers validate and authorize changes.

```text
Browser
  -> app/ pages and layouts
       -> modules/*/queries.ts -> db/client.ts -> PostgreSQL
       -> components/* (server-rendered where possible)
       -> client interactions -> authorized actions/routes -> modules/*
                                                        -> transaction + outbox
                                                           -> notification worker
```

The workspace's `api-server` and `mockup-sandbox` artifacts are not required to
serve this website. The website does not import their source.

## Source map

| Area | Responsibility |
| --- | --- |
| `app/` | URLs, metadata, loading/error handling and page composition |
| `app/admin/` | CMS routes and authorized admin workflows |
| `components/ui/` | Small shared controls |
| `components/shell/` | Header, footer, navigation, newsletter |
| `components/home/`, `components/projects/` | Domain-specific presentation |
| `components/map/` | Shared map contracts, deferred boundary, map engine |
| `modules/projects/`, `modules/posts/`, `modules/site/` | Content reads and domain rules |
| `modules/leads/` | Lead validation, rate limiting and persistence |
| `modules/admin/` | CMS authorization, validation, audit and mutations |
| `modules/media/` | Upload rules and storage abstraction |
| `modules/notifications/`, `modules/integrations/` | Outbox delivery and optional CRM |
| `db/schema/`, `db/migrations/`, `db/seed/` | Database structure, upgrades and starter content |
| `lib/` | Shared utilities, environment parsing, fonts, sessions and browser hooks |
| `tests/` | Unit, DB integration, browser and accessibility suites |

## Boundaries to preserve

- Keep SQL, private configuration and session enforcement on the server.
- Content comes from the database. Shared fixed Arabic UI copy belongs in `lib/copy.ts`.
- Public queries filter publication state. Never reuse admin-only queries publicly.
- `React.cache` on featured projects and project details deduplicates reads **within
  one server render/request**, including metadata. It is not a cross-request TTL
  cache, so fresh requests still see CMS changes. If adding persistent caching,
  design mutation invalidation before enabling it.
- `DeferredProjectsMap` reserves its layout space and uses an intersection
  observer, then dynamically imports `projects-map.tsx` near the viewport. Import
  types from `components/map/types.ts`, not the heavyweight engine.
- Hero playback uses `useAutoplay` and `useInViewport`: it stops off-screen,
  in background tabs, on hover/focus and for reduced-motion users.
- Lead data and notification-outbox entries are committed in one transaction.
  Delivery runs separately and may retry. Do not send email before saving the lead.
- Admin authorization is the existing sealed-session implementation. Do not
  replace the auth provider as part of an unrelated UI change.

## Common maintenance tasks

| Request | Start with |
| --- | --- |
| Change homepage wording | `lib/copy.ts`, site settings and `app/page.tsx` |
| Add a project field | schema + migration, module validation/query, CMS form, public view |
| Change filtering | `modules/projects/filters.ts`, queries and `components/projects/filter-bar.tsx` |
| Change map appearance | `components/map/map-style.ts` and map engine |
| Configure email | `lib/env.ts`, `modules/notifications/`, environment settings |
| Replace upload storage | `modules/media/storage-port.ts` and its adapter |

Historical design registers (`DECISIONS.md`, `ASSUMPTIONS.md`) and existing
runbooks remain useful context. The code and documentation in this repository
are sufficient to begin development; no separate platform repository is required.
