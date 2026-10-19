export class NotConfiguredError extends Error {
  constructor(message = "No CRM provider is configured (CRM_PROVIDER=none).") {
    super(message);
    this.name = "NotConfiguredError";
  }
}

export type CrmLeadPayload = {
  leadId: string;
  leadKind: "contact" | "interest" | "visit";
  fullName: string;
  phone: string;
  email?: string | undefined;
  message?: string | undefined;
  projectName?: string | undefined;
  appointment?: { type: string; date: string; time: string } | undefined;
  sourcePath: string;
  createdAt: string;
};

/**
 * Deferred-system seam (ENGINEERING.md §6 pattern): the rest of the codebase calls
 * this interface and never a specific vendor's SDK. The only implementations
 * today are NotConfiguredCrmAdapter (default) and RestWebhookCrmAdapter — a
 * generic REST/PostgREST sink. Which CRM RUSAFAH actually uses, and the exact
 * field mapping its schema expects, is a business decision (see EW-10 in
 * DECISIONS.md) — not something to guess here.
 */
export interface CrmPort {
  syncLead(payload: CrmLeadPayload): Promise<void>;
}
