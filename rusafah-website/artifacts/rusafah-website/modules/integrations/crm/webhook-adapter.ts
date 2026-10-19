import "server-only";
import { env } from "@/lib/env";
import type { CrmLeadPayload, CrmPort } from "./port";

/**
 * Generic REST sink: POSTs the lead as JSON to CRM_WEBHOOK_URL. Works unchanged
 * against a PostgREST endpoint — e.g. a Supabase project's `{url}/rest/v1/<table>`
 * with `apikey` / `Authorization: Bearer <key>` headers — or any other webhook
 * (Zapier, Make, a custom receiver) that a CRM can expose. The JSON sent uses
 * this project's own field names (see CrmLeadPayload); mapping them onto another
 * system's column names is a config concern on the receiving side, because this
 * project does not know that system's schema.
 */
export class RestWebhookCrmAdapter implements CrmPort {
  async syncLead(payload: CrmLeadPayload): Promise<void> {
    const url = env().CRM_WEBHOOK_URL;
    const key = env().CRM_API_KEY;
    if (!url) throw new Error("CRM_WEBHOOK_URL is not configured");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(key ? { apikey: key, authorization: `Bearer ${key}` } : {}),
        prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 300);
      throw new Error(`CRM webhook responded ${res.status}: ${body}`);
    }
  }
}
