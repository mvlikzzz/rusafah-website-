import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/lib/env";
import type { MailNotification } from "./outbox";
import { APPOINTMENT_LABELS } from "@/modules/leads/validation";

let transporter: Transporter | null | undefined;

export function getTransporter(): Transporter | null {
  if (transporter !== undefined) return transporter;
  const url = env().SMTP_URL;
  transporter = url ? nodemailer.createTransport(url) : null;
  return transporter;
}

const LEAD_KIND_LABEL = {
  contact: "استفسار من صفحة تواصل معنا",
  interest: "تسجيل اهتمام بمشروع",
  visit: "طلب حجز زيارة",
} as const;

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export function renderNotification(payload: MailNotification): {
  subject: string;
  html: string;
  text: string;
} {
  if (payload.kind === "newsletter.subscribed") {
    const subject = `اشتراك جديد في النشرة البريدية: ${payload.email}`;
    const text = `اشترك ${payload.email} في النشرة البريدية عبر الصفحة ${payload.sourcePath}.`;
    return {
      subject,
      text,
      html: `<div dir="rtl" style="font-family:sans-serif"><p>${escapeHtml(text)}</p></div>`,
    };
  }
  const rows: [string, string | undefined][] = [
    ["نوع الطلب", LEAD_KIND_LABEL[payload.leadKind]],
    ["الاسم", payload.fullName],
    ["الجوال", payload.phone],
    ["البريد الإلكتروني", payload.email],
    ["المشروع", payload.projectName],
    [
      "الموعد",
      payload.appointment
        ? `${APPOINTMENT_LABELS[payload.appointment.type as keyof typeof APPOINTMENT_LABELS] ?? payload.appointment.type} — ${payload.appointment.date} ${payload.appointment.time}`
        : undefined,
    ],
    ["الرسالة", payload.message],
    ["الصفحة", payload.sourcePath],
    ["معرّف الطلب", payload.leadId],
  ];
  const present = rows.filter((r): r is [string, string] => Boolean(r[1]));
  const subject = `${LEAD_KIND_LABEL[payload.leadKind]} — ${payload.fullName}`;
  const text = present.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<div dir="rtl" style="font-family:sans-serif;line-height:1.7"><h2 style="color:#002231">${escapeHtml(subject)}</h2><table cellpadding="6" style="border-collapse:collapse">${present
    .map(
      ([k, v]) =>
        `<tr><th style="text-align:start;color:#a4744b;white-space:nowrap">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table></div>`;
  return { subject, html, text };
}

export async function sendNotification(payload: MailNotification): Promise<void> {
  const t = getTransporter();
  const to = env().LEADS_NOTIFY_EMAIL;
  if (!t) throw new Error("SMTP_URL is not configured");
  if (!to) throw new Error("LEADS_NOTIFY_EMAIL is not configured");
  const { subject, html, text } = renderNotification(payload);
  await t.sendMail({ from: env().SMTP_FROM, to, subject, html, text });
}
