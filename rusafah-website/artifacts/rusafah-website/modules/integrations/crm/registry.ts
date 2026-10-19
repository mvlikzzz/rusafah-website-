import "server-only";
import { env } from "@/lib/env";
import { NotConfiguredError, type CrmPort } from "./port";
import { RestWebhookCrmAdapter } from "./webhook-adapter";

export function isCrmConfigured(): boolean {
  return env().CRM_PROVIDER !== "none";
}

class NotConfiguredCrmAdapter implements CrmPort {
  async syncLead(): Promise<void> {
    throw new NotConfiguredError();
  }
}

let adapter: CrmPort | undefined;

/** Picks the adapter once per process from CRM_PROVIDER. */
export function getCrmAdapter(): CrmPort {
  adapter ??=
    env().CRM_PROVIDER === "webhook" ? new RestWebhookCrmAdapter() : new NotConfiguredCrmAdapter();
  return adapter;
}
