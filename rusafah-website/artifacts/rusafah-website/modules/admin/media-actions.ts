"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { getStorage } from "@/modules/media/local-storage";
import { processAndStoreImage } from "@/modules/media/image-upload";
import { requireAdmin } from "./queries";
import { writeAudit } from "./audit";
import { flattenIssues, imageMetaSchema } from "./validation";
import type { FormState } from "./form-state";

const SAVE_FAILED = "حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة مرة أخرى.";

export async function uploadProjectImage(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const projectId = form.get("projectId");
  const slug = form.get("slug");
  const file = form.get("file");
  if (typeof projectId !== "string" || typeof slug !== "string")
    return { status: "error", message: "تعذر تحديد المشروع." };
  if (!(file instanceof File) || file.size === 0)
    return { status: "error", errors: { file: "يرجى اختيار صورة." } };

  const parsed = imageMetaSchema.safeParse({
    altAr: form.get("altAr"),
    kind: form.get("kind"),
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };

  const stored = await processAndStoreImage(file, `projects/${projectId}`);
  if ("error" in stored) return { status: "error", errors: { file: stored.error } };

  try {
    await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(schema.projectImages)
        .values({
          projectId,
          path: stored.path,
          altAr: parsed.data.altAr,
          kind: parsed.data.kind,
        })
        .returning();
      await writeAudit(tx, admin, {
        action: "create",
        entityType: "project_image",
        entityId: inserted?.id,
        before: null,
        after: inserted ?? null,
      });
    });
  } catch (err) {
    console.error("[admin] project image upload failed", err);
    await getStorage().remove(stored.path);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  return { status: "success", message: "تم رفع الصورة بنجاح." };
}

export async function deleteProjectImage(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const imageId = form.get("imageId");
  const slug = form.get("slug");
  if (typeof imageId !== "string" || typeof slug !== "string")
    return { status: "error", message: "تعذر تحديد الصورة." };

  try {
    let removedPath: string | null = null;
    await db.transaction(async (tx) => {
      const [before] = await tx
        .select()
        .from(schema.projectImages)
        .where(eq(schema.projectImages.id, imageId))
        .limit(1);
      if (!before) throw new Error("image not found");
      await tx.delete(schema.projectImages).where(eq(schema.projectImages.id, imageId));
      await writeAudit(tx, admin, {
        action: "delete",
        entityType: "project_image",
        entityId: imageId,
        before,
        after: null,
      });
      removedPath = before.path;
    });
    if (removedPath) await getStorage().remove(removedPath);
  } catch (err) {
    console.error("[admin] project image delete failed", err);
    return { status: "error", message: SAVE_FAILED };
  }

  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  return { status: "success", message: "تم حذف الصورة بنجاح." };
}
