import "server-only";
import { enqueueNotification, type Tx } from "@/modules/notifications/outbox";
import { isCrmConfigured } from "./registry";
import type { CrmLeadPayload } from "./port";

/**
 * Enqueues a CRM sync row in the caller's transaction — same transactional-outbox
 * guarantee as lead-alert email (ENGINEERING.md §7). Only when a provider is actually
 * configured: a queued row with nowhere to go would just retry and fail forever,
 * which is its own kind of fake behaviour.
 */
export async function enqueueCrmLeadSyncIfConfigured(tx: Tx, payload: CrmLeadPayload) {
  if (!isCrmConfigured()) return;
  await enqueueNotification(tx, { kind: "crm.lead_sync", ...payload });
}
