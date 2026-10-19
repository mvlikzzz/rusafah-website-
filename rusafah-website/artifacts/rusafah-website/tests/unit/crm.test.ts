import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NotConfiguredError } from "@/modules/integrations/crm/port";

process.env.DATABASE_URL ??= "postgres://unit-test:unused@localhost:5432/unit_test";
process.env.CRM_PROVIDER = "webhook";
process.env.CRM_WEBHOOK_URL = "https://crm.example.com/rest/v1/leads";
process.env.CRM_API_KEY = "test-api-key";

let adapter: import("@/modules/integrations/crm/port").CrmPort;

beforeAll(async () => {
  const { getCrmAdapter } = await import("@/modules/integrations/crm/registry");
  adapter = getCrmAdapter();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const SAMPLE_LEAD = {
  leadId: "11111111-1111-1111-1111-111111111111",
  leadKind: "contact" as const,
  fullName: "محمد العتيبي",
  phone: "+966501234567",
  message: "استفسار عن مشروع رصافة 14.",
  sourcePath: "/contact",
  createdAt: "2026-09-15T10:00:00.000Z",
};

describe("NotConfiguredError", () => {
  it("names itself for logging/inspection", () => {
    const err = new NotConfiguredError();
    expect(err.name).toBe("NotConfiguredError");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("RestWebhookCrmAdapter", () => {
  it("POSTs the lead as JSON with apikey/bearer headers to CRM_WEBHOOK_URL", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await adapter.syncLead(SAMPLE_LEAD);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://crm.example.com/rest/v1/leads");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      "content-type": "application/json",
      apikey: "test-api-key",
      authorization: "Bearer test-api-key",
    });
    expect(JSON.parse(init?.body as string)).toEqual(SAMPLE_LEAD);
  });

  it("throws when the endpoint responds with a non-2xx status, so the outbox retries", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async () => new Response("bad request", { status: 400 })),
    );
    await expect(adapter.syncLead(SAMPLE_LEAD)).rejects.toThrow(/responded 400/);
  });
});
