"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { requireAdmin } from "./queries";
import { writeAudit } from "./audit";
import { flattenIssues, projectPricingSchema, unitSchema } from "./validation";
import type { FormState } from "./form-state";

function field(form: FormData, name: string): string | undefined {
  const v = form.get(name);
  return typeof v === "string" ? v : undefined;
}

const SAVE_FAILED = "حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة مرة أخرى.";

export async function updateProjectPricing(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const projectId = field(form, "projectId");
  const slug = field(form, "slug");
  if (!projectId || !slug) return { status: "error", message: "تعذر تحديد المشروع." };

  const parsed = projectPricingSchema.safeParse({
    priceMin: field(form, "priceMin") ?? "",
    priceMax: field(form, "priceMax") ?? "",
    unitsCount: field(form, "unitsCount") || undefined,
    unitsRemaining: field(form, "unitsRemaining") || undefined,
    salesProgressPercent: field(form, "salesProgressPercent") || undefined,
    status: field(form, "status"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  try {
    await db.transaction(async (tx) => {
      const [before] = await tx
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId))
        .limit(1);
      if (!before) throw new Error("project not found");
      const values = {
        priceMin: parsed.data.priceMin,
        priceMax: parsed.data.priceMax,
        unitsCount: parsed.data.unitsCount ?? null,
        unitsRemaining: parsed.data.unitsRemaining ?? null,
        salesProgressPercent:
          parsed.data.salesProgressPercent != null
            ? String(parsed.data.salesProgressPercent)
            : null,
        status: parsed.data.status,
        updatedAt: new Date(),
      };
      await tx.update(schema.projects).set(values).where(eq(schema.projects.id, projectId));
      await writeAudit(tx, admin, {
        action: "update",
        entityType: "project",
        entityId: projectId,
        before,
        after: values,
      });
    });
  } catch (err) {
    console.error("[admin] project pricing update failed", err);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  return { status: "success", message: "تم تحديث بيانات المشروع بنجاح." };
}

export async function updateUnit(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const unitId = field(form, "unitId");
  const slug = field(form, "slug");
  if (!unitId || !slug) return { status: "error", message: "تعذر تحديد الوحدة." };

  const parsed = unitSchema.safeParse({
    price: field(form, "price") ?? "",
    status: field(form, "status"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  try {
    await db.transaction(async (tx) => {
      const [before] = await tx
        .select()
        .from(schema.projectUnits)
        .where(eq(schema.projectUnits.id, unitId))
        .limit(1);
      if (!before) throw new Error("unit not found");
      const values = {
        price: parsed.data.price,
        status: parsed.data.status,
        updatedAt: new Date(),
      };
      await tx.update(schema.projectUnits).set(values).where(eq(schema.projectUnits.id, unitId));
      await writeAudit(tx, admin, {
        action: "update",
        entityType: "project_unit",
        entityId: unitId,
        before,
        after: values,
      });
    });
  } catch (err) {
    console.error("[admin] unit update failed", err);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath(`/projects/${slug}`);
  return { status: "success", message: "تم تحديث الوحدة بنجاح." };
}
