# Runbook — connecting a CRM

Every lead the public site captures (contact form, project interest, visit
booking) can be pushed to an external CRM as soon as one is enqueued, using the
same transactional-outbox mechanism that already delivers the lead-alert email
(`notification_outbox`, `modules/notifications/worker.ts`). The write to the
lead table, the email-alert row and the CRM-sync row all commit in one
transaction, so a lead is never captured without also being queued to notify —
and a slow or failing CRM endpoint never blocks or loses the lead itself; the
worker retries with backoff independently, same as email.

## Why this is a "port", not a specific vendor's SDK

Which CRM RUSAFAH uses, and the exact column/field names its schema expects,
were not settled when this was built, and this project should not guess a
business system's schema. So the integration follows ENGINEERING.md §6's pattern:
build the seam, not the engine.

- `modules/integrations/crm/port.ts` — the `CrmPort` interface
  (`syncLead(payload)`) and `NotConfiguredError`, the only thrown error while
  no provider is configured.
- `modules/integrations/crm/webhook-adapter.ts` — the one real implementation
  today: `RestWebhookCrmAdapter`, a generic REST sink. It `POST`s the lead as
  JSON to `CRM_WEBHOOK_URL`, with `apikey` and `Authorization: Bearer <key>`
  headers when `CRM_API_KEY` is set.
- `modules/integrations/crm/registry.ts` — picks the adapter from
  `CRM_PROVIDER` (`none` | `webhook`).
- `modules/integrations/crm/outbox.ts` — enqueues a sync row **only** when a
  provider is actually configured, so nothing sits in the outbox retrying
  forever with nowhere to go.

## Pointing it at a CRM

### A Supabase (or other PostgREST) backend

A Supabase project's REST API accepts inserts the same way regardless of the
table: `POST {SUPABASE_URL}/rest/v1/<table>` with the headers above and
`Prefer: return=minimal`. Set:

```bash
CRM_PROVIDER=webhook
CRM_WEBHOOK_URL=https://<project-ref>.supabase.co/rest/v1/leads
CRM_API_KEY=<service_role or anon key, per the CRM project's RLS policy>
```

For a self-hosted Supabase stack (for example one running locally via
`docker compose`, fronted by its Kong gateway), point `CRM_WEBHOOK_URL` at that
gateway's own `/rest/v1/<table>` instead.

**The JSON sent uses this project's own field names** (`leadId`, `leadKind`,
`fullName`, `phone`, `email`, `message`, `projectName`, `appointment`,
`sourcePath`, `createdAt` — see `CrmLeadPayload` in `port.ts`). If the target
table's columns are named differently, either:

- rename/add columns on the CRM side to match (simplest for a table this
  project owns), or
- put a small transform in front of it — a Supabase Edge Function, a Zapier
  step, or any middleware that accepts the webhook and re-shapes it before
  writing to the CRM's own schema.

This project intentionally does not hardcode a mapping to another system's
column names, because it does not own or know that schema.

### Any other CRM or automation platform

Anything that can receive a `POST` of JSON works: a Zapier/Make catch hook, a
HubSpot/Zoho custom webhook action, or a small receiver you write yourself.
Same two variables (`CRM_WEBHOOK_URL`, optionally `CRM_API_KEY`).

### Turning it off

`CRM_PROVIDER=none` (the default) — no row is ever queued, and `syncLead`
throws `NotConfiguredError` if something calls it directly (it should not be
called directly outside the outbox path).

## Adding a second CRM later, or switching

Write one more class implementing `CrmPort`, add a branch in
`registry.ts#getCrmAdapter`, and extend `CRM_PROVIDER`'s allowed values in
`lib/env.ts`. Every call site (`modules/leads/actions.ts`,
`modules/notifications/dispatch.ts`) is unchanged, because they only ever call
the interface.
