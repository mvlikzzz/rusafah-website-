import "server-only";
import type { OutboxPayload } from "./outbox";
import { sendNotification } from "./mailer";
import { getCrmAdapter } from "@/modules/integrations/crm/registry";

/** Routes one outbox row to the channel its kind belongs to. */
export async function dispatchNotification(payload: OutboxPayload): Promise<void> {
  if (payload.kind === "crm.lead_sync") {
    await getCrmAdapter().syncLead(payload);
    return;
  }
  await sendNotification(payload);
}
