import { describe, expect, it } from "vitest";
import {
  contactSchema,
  flattenIssues,
  interestSchema,
  newsletterSchema,
  normaliseSaudiPhone,
  visitSchema,
} from "@/modules/leads/validation";

describe("normaliseSaudiPhone", () => {
  it("accepts local, national and international spellings", () => {
    expect(normaliseSaudiPhone("0501234567")).toBe("+966501234567");
    expect(normaliseSaudiPhone("+966 50 123 4567")).toBe("+966501234567");
    expect(normaliseSaudiPhone("00966501234567")).toBe("+966501234567");
    expect(normaliseSaudiPhone("501234567")).toBe("+966501234567");
    expect(normaliseSaudiPhone("٠٥٠١٢٣٤٥٦٧")).toBe("+966501234567");
  });
  it("rejects landlines, short numbers and other countries", () => {
    expect(normaliseSaudiPhone("0112345678")).toBeNull();
    expect(normaliseSaudiPhone("12345")).toBeNull();
    expect(normaliseSaudiPhone("+971501234567")).toBeNull();
  });
});

describe("contact form", () => {
  it("returns Arabic sentences for every failure", () => {
    const r = contactSchema.safeParse({
      fullName: "أ",
      email: "not-an-email",
      phone: "123",
      message: "قصير",
      company: "",
    });
    expect(r.success).toBe(false);
    if (r.success) return;
    const errors = flattenIssues(r.error);
    expect(Object.keys(errors).sort()).toEqual(["email", "fullName", "message", "phone"]);
    for (const msg of Object.values(errors)) {
      expect(msg).toMatch(/[؀-ۿ]/);
      expect(msg.endsWith(".")).toBe(true);
    }
  });
  it("normalises the phone and lowercases the email", () => {
    const r = contactSchema.parse({
      fullName: "محمد العتيبي",
      email: "Malik@Example.com",
      phone: "0501234567",
      message: "أرغب في معرفة تفاصيل المشروع.",
      company: "",
    });
    expect(r.phone).toBe("+966501234567");
    expect(r.email).toBe("malik@example.com");
  });
  it("rejects a filled honeypot", () => {
    expect(
      contactSchema.safeParse({
        fullName: "محمد العتيبي",
        email: "",
        phone: "0501234567",
        message: "أرغب في معرفة تفاصيل المشروع.",
        company: "bot",
      }).success,
    ).toBe(false);
  });
});

describe("interest, visit and newsletter", () => {
  it("requires a valid project id", () => {
    const r = interestSchema.safeParse({
      fullName: "سارة",
      phone: "0501234567",
      projectId: "nope",
      email: "",
    });
    expect(r.success).toBe(false);
  });
  it("refuses a visit in the past", () => {
    const r = visitSchema.safeParse({
      fullName: "سارة الشمري",
      phone: "0501234567",
      email: "",
      projectId: "6f0f7a9e-5f1c-4f1e-9c0a-6a1a2b3c4d5e",
      appointmentType: "site_visit",
      preferredDate: "2020-01-01",
      preferredTime: "10:00",
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(flattenIssues(r.error).preferredDate).toContain("اليوم");
  });
  it("accepts a well-formed newsletter email", () => {
    expect(newsletterSchema.parse({ email: "reader@example.com", company: "" }).email).toBe(
      "reader@example.com",
    );
  });
});
