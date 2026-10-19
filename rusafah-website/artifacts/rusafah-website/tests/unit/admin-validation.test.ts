import { describe, expect, it } from "vitest";
import {
  loginSchema,
  projectPricingSchema,
  siteSettingsSchema,
  unitSchema,
} from "@/modules/admin/validation";

describe("admin validation", () => {
  it("accepts a well-formed login", () => {
    const result = loginSchema.safeParse({ email: "Admin@Rusafahre.com", password: "x" });
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("admin@rusafahre.com");
  });

  it("rejects an invalid login email with an Arabic message", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/بريد إلكتروني/);
  });

  it("requires the site settings' core fields", () => {
    const result = siteSettingsSchema.safeParse({
      companyNameAr: "",
      companyNameEn: "RUSAFAH",
      taglineAr: "شعار",
      taglineEn: "tag",
      unifiedNumber: "920032809",
      internationalNumber: "+966115551234",
      whatsappNumber: "+966501234567",
      email: "info@rusafahre.com",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path[0] === "companyNameAr")).toBe(true);
  });

  it("rejects a non-numeric project price", () => {
    const result = projectPricingSchema.safeParse({
      priceMin: "not-a-number",
      status: "available",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty price as null (not required)", () => {
    const result = projectPricingSchema.safeParse({ priceMin: "", status: "available" });
    expect(result.success).toBe(true);
    expect(result.data?.priceMin).toBeNull();
  });

  it("only allows the three known unit statuses", () => {
    expect(unitSchema.safeParse({ price: "100000", status: "available" }).success).toBe(true);
    expect(unitSchema.safeParse({ price: "100000", status: "unknown" }).success).toBe(false);
  });
});
