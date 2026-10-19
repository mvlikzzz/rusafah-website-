# Rusafah website engineering standards

## 1. Product scope and correctness

This is the public marketing website and internal staff CMS. There are no
investor accounts, payments or participation records. Keep operational
limitations explicit; do not ship nonfunctional controls or fabricated data.

## 2. Content and data

Published content belongs in PostgreSQL, accessed through domain modules.
Fixed interface copy belongs in lib/copy.ts. Keep business rules out of UI
components and avoid hardcoded marketing figures.

## 3. Architecture

Use app routes for page composition, components for presentation, modules for
domain operations and db/schema for persistence. See docs/architecture.md.
Do not expose server modules, database access or credentials to browser code.

## 4. Security

Authorize every CMS mutation on the server. Use established session and password
libraries; never invent cryptographic primitives. Keep secrets outside source
control, validate uploads, and preserve audit records.

## 5. Arabic, accessibility and assets

Use RTL-aware logical CSS properties, Arabic validation messages, locale-aware
number formatting, keyboard-accessible controls and self-hosted fonts.
Respect reduced-motion preferences and reserve image dimensions.

## 6. Integrations

Keep storage and CRM adapters behind explicit interfaces. Unconfigured services
must fail clearly rather than appear to work. Avoid unnecessary dependencies.

## 7. Transactions and notifications

Persist a lead and its notification-outbox record in one database transaction.
Deliver notifications separately, with retries. Record authorized CMS changes
in the audit log within the corresponding transaction.

## Verification and releases

Run pnpm site:check and pnpm site:build. Run applicable integration and browser
tests against isolated development/staging services. Review migration plans and
verify backups before production changes. Never test against production data.

See CONTRIBUTING.md, docs/handover.md and the operational runbooks for details.
