"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { requireAdmin } from "./queries";
import { writeAudit } from "./audit";
import { companyStatSchema, flattenIssues, siteSettingsSchema } from "./validation";
import type { FormState } from "./form-state";

function field(form: FormData, name: string): string | undefined {
  const v = form.get(name);
  return typeof v === "string" ? v : undefined;
}

const SAVE_FAILED = "حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة مرة أخرى.";

export async function updateSiteSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = siteSettingsSchema.safeParse({
    companyNameAr: field(form, "companyNameAr"),
    companyNameEn: field(form, "companyNameEn"),
    taglineAr: field(form, "taglineAr"),
    taglineEn: field(form, "taglineEn"),
    unifiedNumber: field(form, "unifiedNumber"),
    internationalNumber: field(form, "internationalNumber"),
    whatsappNumber: field(form, "whatsappNumber"),
    email: field(form, "email"),
    googleMapsUrl: field(form, "googleMapsUrl"),
    instagramUrl: field(form, "instagramUrl"),
    xUrl: field(form, "xUrl"),
    linkedinUrl: field(form, "linkedinUrl"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  try {
    await db.transaction(async (tx) => {
      const [before] = await tx
        .select()
        .from(schema.siteSettings)
        .where(eq(schema.siteSettings.id, "default"))
        .limit(1);
      if (!before) throw new Error("site settings row missing");

      const socialLinks: Record<string, string> = { ...before.socialLinks };
      for (const [field2, key] of [
        ["instagramUrl", "instagram"],
        ["xUrl", "x"],
        ["linkedinUrl", "linkedin"],
      ] as const) {
        const value = parsed.data[field2];
        if (value) socialLinks[key] = value;
        else delete socialLinks[key];
      }

      const values = {
        companyNameAr: parsed.data.companyNameAr,
        companyNameEn: parsed.data.companyNameEn,
        taglineAr: parsed.data.taglineAr,
        taglineEn: parsed.data.taglineEn,
        unifiedNumber: parsed.data.unifiedNumber,
        internationalNumber: parsed.data.internationalNumber,
        whatsappNumber: parsed.data.whatsappNumber,
        email: parsed.data.email,
        googleMapsUrl: parsed.data.googleMapsUrl ?? null,
        socialLinks,
        updatedAt: new Date(),
      };
      await tx.update(schema.siteSettings).set(values).where(eq(schema.siteSettings.id, "default"));
      await writeAudit(tx, admin, {
        action: "update",
        entityType: "site_settings",
        entityId: "default",
        before,
        after: values,
      });
    });
  } catch (err) {
    console.error("[admin] site settings update failed", err);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "تم حفظ إعدادات الموقع بنجاح." };
}

export async function updateCompanyStat(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = field(form, "id");
  if (!id) return { status: "error", message: "تعذر تحديد الإحصائية." };
  const parsed = companyStatSchema.safeParse({
    value: field(form, "value"),
    prefixAr: field(form, "prefixAr") || undefined,
    labelAr: field(form, "labelAr"),
    unitAr: field(form, "unitAr") || undefined,
    asOf: field(form, "asOf"),
    sourceAr: field(form, "sourceAr"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  try {
    await db.transaction(async (tx) => {
      const [before] = await tx
        .select()
        .from(schema.companyStats)
        .where(eq(schema.companyStats.id, id))
        .limit(1);
      if (!before) throw new Error("stat not found");
      const values = {
        value: parsed.data.value,
        prefixAr: parsed.data.prefixAr ?? null,
        labelAr: parsed.data.labelAr,
        unitAr: parsed.data.unitAr ?? null,
        asOf: parsed.data.asOf,
        sourceAr: parsed.data.sourceAr,
        updatedAt: new Date(),
      };
      await tx.update(schema.companyStats).set(values).where(eq(schema.companyStats.id, id));
      await writeAudit(tx, admin, {
        action: "update",
        entityType: "company_stat",
        entityId: id,
        before,
        after: values,
      });
    });
  } catch (err) {
    console.error("[admin] company stat update failed", err);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "تم تحديث الإحصائية بنجاح." };
}
