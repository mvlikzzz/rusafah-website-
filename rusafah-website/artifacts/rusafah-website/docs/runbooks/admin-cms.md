# Runbook — the admin CMS (`/admin`)

A password-protected admin area lives at `/admin`, backed by the same Postgres
database as the public site. It is a normal part of this Next.js app (no
separate service), gated by session middleware (`middleware.ts` /
`proxy.ts` route interceptor) and server-side checks in every mutation
(`modules/admin/queries.ts#requireAdmin`) — never a client-side-only gate.

## What is editable today

| Area                                                     | Where                    | Module                              |
| -------------------------------------------------------- | ------------------------ | ----------------------------------- |
| Company info, contact numbers, email, social links       | `/admin/settings`        | `modules/admin/settings-actions.ts` |
| Headline figures (`company_stats`)                       | `/admin/settings`        | `modules/admin/settings-actions.ts` |
| Project price range, unit counts, sales progress, status | `/admin/projects/[slug]` | `modules/admin/projects-actions.ts` |
| Per-unit price and status                                | `/admin/projects/[slug]` | `modules/admin/projects-actions.ts` |
| Project images (upload, delete)                          | `/admin/projects/[slug]` | `modules/admin/media-actions.ts`    |

Not yet built (deliberately — see "no fake anything", ENGINEERING.md §1; there is no
nav link to a screen that doesn't work): creating a new project or blog post,
editing blog body content, editing legal documents, reordering images, managing
admin users from the UI (use `pnpm admin:create` below). Until then those go
through `db/seed/content.ts` — see `docs/runbooks/content-editing.md`.

## Creating or resetting an admin user

There is no public sign-up. Create the first admin (or reset a password) from
the command line:

```bash
pnpm admin:create -- --email you@rusafahre.com --password "a-strong-passphrase" --name "الاسم" --role owner
```

`--role` is `owner` (can be given to any editor for now — there is no separate
admin-user management screen yet) or `editor`. Running it again for the same
email updates the password instead of erroring.

## How a mutation is wired

Every admin form is a real server action (`"use server"`), not a client-only
form: `modules/admin/*-actions.ts`. Each one:

1. Calls `requireAdmin()` first — reads the signed session cookie, redirects to
   `/admin/login` if absent. This is the actual authorization boundary; the
   sidebar links and page layout are not.
2. Validates the submission with a Zod schema in `modules/admin/validation.ts`
   (Arabic sentence error messages, same convention as the public lead forms).
3. Writes the change and one `audit_log` row (actor, before, after) in the same
   database transaction, so an audit entry never exists without the change it
   describes.
4. Calls `revalidatePath` so the public pages reflect the change immediately.

## Images

Uploads go through `modules/media/image-upload.ts`, which re-encodes every
file with `sharp` before it touches disk — this verifies the upload is really
an image (not just named `*.jpg`), strips embedded metadata, and caps the long
edge at 2400px. Storage itself is behind `modules/media/storage-port.ts`
(`StoragePort`); the only implementation today is local disk under
`MEDIA_UPLOAD_DIR` (default `public/uploads`, see `.env.example`). Swapping to
an S3-compatible bucket once hosting is decided (platform D-11) means writing
one new class behind that interface — no call site changes.

## Session and password storage

Sessions are a signed, encrypted cookie (`iron-session`, sealed with
`SESSION_SECRET`) — no session table, nothing to prune. Passwords are salted
scrypt hashes (`lib/password.ts`, Node's own `node:crypto`, no third-party
crypto dependency). Neither is a hand-rolled cryptographic primitive; both are
standard building blocks used the standard way.
