# Development workflow

## Setup and scope

Read the root README, then the website's architecture guide. Run package commands
from the workspace root with Node 24 and the pinned pnpm version. Commit
`pnpm-lock.yaml` alongside dependency changes; never mix npm/yarn lockfiles.
Keep platform-native optional dependencies available so Linux, macOS and Windows
developers can install the project. Only Linux is exercised by the default CI.

## Where to change things

- Routing, metadata and page composition: `artifacts/rusafah-website/app/`
- Reusable UI and interactions: `components/`
- Business rules, authorization, mutations and queries: `modules/`
- Schema, SQL migrations and seed content: `db/`
- Reusable browser hooks and pure utilities: `lib/`

Keep server-only database code out of client components. Put `"use client"` only
on interactive boundaries. Do not import the map engine directly into pages;
use `DeferredProjectsMap` to retain lazy loading.

## Changes and pull requests

1. Create a focused branch; avoid unrelated reformatting or renaming.
2. Read nearby code and tests. Retain Arabic copy, RTL layout, URLs and form contracts.
3. Add tests for changed business rules and edge cases.
4. Run `pnpm site:check` and `pnpm site:build`.
5. Check small phones and desktop, keyboard use and reduced-motion behavior.
6. Explain verification, environment changes and operational impact in the PR.

The checked-in GitHub workflow runs static checks, unit tests and a production
build with a temporary seeded database. Integration and browser suites are
available separately; run them when changing database behavior, authentication,
lead submission or admin mutations. Never point test helpers at production.

## Database and private configuration

Generate migrations from `db/schema/`, inspect the SQL and write a reverse
`.down.sql` migration following existing conventions. Do not edit already-applied
migrations. Back up data before a production change. Never run database reset,
rollback or test preparation against production. The content seed is not a
substitute for a production migration.

Production database changes require a reviewed migration plan. Do not add
automatic migrations to build or server startup. Agree on a separate controlled
migration step with the hosting operator.

Document new settings in `.env.example`, using placeholders only. Never add
credentials, personal lead information or database dumps to commits or test output.

## Review expectations

Maintain existing admin authorization and input validation. Public pages may
show only published content. Forms must retain accessible error/success feedback
and real persistence. Preserve the transactional notification outbox; an email
failure must not lose the underlying lead.
