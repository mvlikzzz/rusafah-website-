"use server";

import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { enqueueNotification } from "@/modules/notifications/outbox";
import { triggerDelivery } from "@/modules/notifications/worker";
import { enqueueCrmLeadSyncIfConfigured } from "@/modules/integrations/crm/outbox";
import { clientKey, consumeRateLimit, RATE_LIMITED_MESSAGE } from "@/lib/rate-limit";
import {
  contactSchema,
  flattenIssues,
  interestSchema,
  newsletterSchema,
  visitSchema,
} from "./validation";
import type { FormState } from "./form-state";

const GENERIC_ERROR =
  "حدث خطأ غير متوقع أثناء إرسال النموذج. يرجى المحاولة مرة أخرى أو التواصل معنا عبر الرقم الموحد.";

function field(form: FormData, name: string): string | undefined {
  const v = form.get(name);
  return typeof v === "string" ? v : undefined;
}

async function limited(scope: string): Promise<boolean> {
  const { allowed } = await consumeRateLimit({
    key: await clientKey(scope),
    limit: 6,
    windowSeconds: 600,
  });
  return !allowed;
}

async function projectName(projectId: string): Promise<string | undefined> {
  const [p] = await db
    .select({ nameEn: schema.projects.nameEn, nameAr: schema.projects.nameAr })
    .from(schema.projects)
    .where(eq(schema.projects.id, projectId))
    .limit(1);
  return p ? `${p.nameEn} — ${p.nameAr}` : undefined;
}

export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    fullName: field(form, "fullName"),
    email: field(form, "email") ?? "",
    phone: field(form, "phone"),
    message: field(form, "message"),
    company: field(form, "company") ?? "",
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };
  if (await limited("contact")) return { status: "error", message: RATE_LIMITED_MESSAGE };
  const sourcePath = field(form, "sourcePath") ?? "/contact";
  try {
    await db.transaction(async (tx) => {
      const [lead] = await tx
        .insert(schema.leads)
        .values({
          kind: "contact",
          fullName: parsed.data.fullName,
          email: parsed.data.email ?? null,
          phone: parsed.data.phone,
          message: parsed.data.message,
          sourcePath,
        })
        .returning({ id: schema.leads.id });
      await enqueueNotification(tx, {
        kind: "lead.created",
        leadId: lead!.id,
        leadKind: "contact",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        sourcePath,
      });
      await enqueueCrmLeadSyncIfConfigured(tx, {
        leadId: lead!.id,
        leadKind: "contact",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        sourcePath,
        createdAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error("[leads] contact failed", err);
    return { status: "error", message: GENERIC_ERROR };
  }
  void triggerDelivery();
  return {
    status: "success",
    message: "شكراً لك، وصلنا استفسارك وسيتواصل معك أحد مستشارينا في أقرب وقت.",
  };
}

export async function registerInterest(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = interestSchema.safeParse({
    fullName: field(form, "fullName"),
    email: field(form, "email") ?? "",
    phone: field(form, "phone"),
    projectId: field(form, "projectId"),
    company: field(form, "company") ?? "",
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };
  if (await limited("interest")) return { status: "error", message: RATE_LIMITED_MESSAGE };
  const sourcePath = field(form, "sourcePath") ?? "/projects";
  try {
    const name = await projectName(parsed.data.projectId);
    if (!name)
      return {
        status: "error",
        message: "تعذر تحديد المشروع، يرجى تحديث الصفحة والمحاولة مرة أخرى.",
      };
    await db.transaction(async (tx) => {
      const [lead] = await tx
        .insert(schema.leads)
        .values({
          kind: "interest",
          fullName: parsed.data.fullName,
          email: parsed.data.email ?? null,
          phone: parsed.data.phone,
          projectId: parsed.data.projectId,
          sourcePath,
        })
        .returning({ id: schema.leads.id });
      await enqueueNotification(tx, {
        kind: "lead.created",
        leadId: lead!.id,
        leadKind: "interest",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        projectName: name,
        sourcePath,
      });
      await enqueueCrmLeadSyncIfConfigured(tx, {
        leadId: lead!.id,
        leadKind: "interest",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        projectName: name,
        sourcePath,
        createdAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error("[leads] interest failed", err);
    return { status: "error", message: GENERIC_ERROR };
  }
  void triggerDelivery();
  return {
    status: "success",
    message: "تم تسجيل اهتمامك بنجاح، وسيتواصل معك أحد مستشارينا خلال ٢٤ ساعة.",
  };
}

export async function bookVisit(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = visitSchema.safeParse({
    fullName: field(form, "fullName"),
    phone: field(form, "phone"),
    email: field(form, "email") ?? "",
    projectId: field(form, "projectId"),
    appointmentType: field(form, "appointmentType"),
    preferredDate: field(form, "preferredDate"),
    preferredTime: field(form, "preferredTime"),
    company: field(form, "company") ?? "",
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };
  if (await limited("visit")) return { status: "error", message: RATE_LIMITED_MESSAGE };
  const sourcePath = field(form, "sourcePath") ?? "/projects";
  try {
    const name = await projectName(parsed.data.projectId);
    if (!name)
      return {
        status: "error",
        message: "تعذر تحديد المشروع، يرجى تحديث الصفحة والمحاولة مرة أخرى.",
      };
    await db.transaction(async (tx) => {
      const [lead] = await tx
        .insert(schema.leads)
        .values({
          kind: "visit",
          fullName: parsed.data.fullName,
          email: parsed.data.email ?? null,
          phone: parsed.data.phone,
          projectId: parsed.data.projectId,
          appointmentType: parsed.data.appointmentType,
          preferredDate: parsed.data.preferredDate,
          preferredTime: parsed.data.preferredTime,
          sourcePath,
        })
        .returning({ id: schema.leads.id });
      const appointment = {
        type: parsed.data.appointmentType,
        date: parsed.data.preferredDate,
        time: parsed.data.preferredTime,
      };
      await enqueueNotification(tx, {
        kind: "lead.created",
        leadId: lead!.id,
        leadKind: "visit",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        projectName: name,
        appointment,
        sourcePath,
      });
      await enqueueCrmLeadSyncIfConfigured(tx, {
        leadId: lead!.id,
        leadKind: "visit",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        projectName: name,
        appointment,
        sourcePath,
        createdAt: new Date().toISOString(),
      });
    });
  } catch (err) {
    console.error("[leads] visit failed", err);
    return { status: "error", message: GENERIC_ERROR };
  }
  void triggerDelivery();
  return {
    status: "success",
    message: "تم استلام طلب الحجز، وسيتواصل معك أحد مستشارينا خلال ٢٤ ساعة لتأكيد الموعد.",
  };
}

export async function subscribeNewsletter(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: field(form, "email"),
    company: field(form, "company") ?? "",
  });
  if (!parsed.success) return { status: "error", errors: flattenIssues(parsed.error) };
  if (await limited("newsletter")) return { status: "error", message: RATE_LIMITED_MESSAGE };
  const sourcePath = field(form, "sourcePath") ?? "/";
  try {
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(schema.newsletterSubscribers)
        .values({ email: parsed.data.email, sourcePath })
        .onConflictDoUpdate({
          target: schema.newsletterSubscribers.email,
          set: { unsubscribedAt: null },
        })
        // Postgres sets xmax = 0 on a fresh insert; an upsert that updated has xmax > 0.
        .returning({ inserted: sql<boolean>`(xmax = 0)` });
      if (inserted[0]?.inserted) {
        await enqueueNotification(tx, {
          kind: "newsletter.subscribed",
          email: parsed.data.email,
          sourcePath,
        });
      }
    });
  } catch (err) {
    console.error("[leads] newsletter failed", err);
    return { status: "error", message: GENERIC_ERROR };
  }
  void triggerDelivery();
  return { status: "success", message: "تم اشتراكك في النشرة البريدية بنجاح." };
}
