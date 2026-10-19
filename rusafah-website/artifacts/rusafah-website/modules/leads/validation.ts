import { z } from "zod";

/**
 * Validation for the public forms. Every message is a complete Arabic sentence
 * (ENGINEERING.md §5). Phone numbers are normalised to E.164 for Saudi numbers.
 */
export const SAUDI_PHONE_MESSAGE = "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 أو +9665.";

export function normaliseSaudiPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, "").replace(/^00/, "+");
  const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
  const western = digits.replace(/[٠-٩]/g, (d) => String(arabicIndic.indexOf(d)));
  if (/^\+9665\d{8}$/.test(western)) return western;
  if (/^9665\d{8}$/.test(western)) return `+${western}`;
  if (/^05\d{8}$/.test(western)) return `+966${western.slice(1)}`;
  if (/^5\d{8}$/.test(western)) return `+966${western}`;
  return null;
}

const phoneSchema = z
  .string({ error: "يرجى إدخال رقم الجوال." })
  .trim()
  .min(1, "يرجى إدخال رقم الجوال.")
  .transform((v, ctx) => {
    const normalised = normaliseSaudiPhone(v);
    if (!normalised) {
      ctx.addIssue({ code: "custom", message: SAUDI_PHONE_MESSAGE });
      return z.NEVER;
    }
    return normalised;
  });

const nameSchema = z
  .string({ error: "يرجى إدخال الاسم الكامل." })
  .trim()
  .min(3, "يرجى إدخال الاسم الكامل كما هو في الهوية، بثلاثة أحرف على الأقل.")
  .max(120, "الاسم طويل جداً، يرجى إدخال اسم لا يتجاوز 120 حرفاً.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "يرجى إدخال بريد إلكتروني صحيح مثل name@example.com." }));

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(emailSchema.optional());

/** Hidden field that real users never fill. Bots do. */
const honeypot = z.string().max(0, "تعذر إرسال النموذج.").optional();

export const contactSchema = z.object({
  fullName: nameSchema,
  email: optionalEmail,
  phone: phoneSchema,
  message: z
    .string({ error: "يرجى كتابة استفسارك أو طلبك." })
    .trim()
    .min(10, "يرجى كتابة استفسارك بعشرة أحرف على الأقل حتى نتمكن من مساعدتك.")
    .max(2000, "الرسالة طويلة جداً، يرجى اختصارها إلى 2000 حرف."),
  company: honeypot,
});

export const interestSchema = z.object({
  fullName: nameSchema,
  email: optionalEmail,
  phone: phoneSchema,
  projectId: z.uuid({ error: "تعذر تحديد المشروع، يرجى تحديث الصفحة والمحاولة مرة أخرى." }),
  company: honeypot,
});

export const APPOINTMENT_TYPES = ["site_visit", "phone_call", "office_meeting"] as const;
export const APPOINTMENT_LABELS: Record<(typeof APPOINTMENT_TYPES)[number], string> = {
  site_visit: "زيارة موقع المشروع",
  phone_call: "مكالمة هاتفية",
  office_meeting: "اجتماع في مقر الشركة",
};

export const visitSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  email: optionalEmail,
  projectId: z.uuid({ error: "تعذر تحديد المشروع، يرجى تحديث الصفحة والمحاولة مرة أخرى." }),
  appointmentType: z.enum(APPOINTMENT_TYPES, { error: "يرجى اختيار نوع الموعد." }),
  preferredDate: z
    .string({ error: "يرجى اختيار التاريخ المناسب." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "يرجى اختيار التاريخ المناسب.")
    .refine((d) => {
      const chosen = new Date(`${d}T00:00:00+03:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen.getTime() >= today.getTime() - 24 * 3600 * 1000;
    }, "يرجى اختيار تاريخ من اليوم فصاعداً."),
  preferredTime: z
    .string({ error: "يرجى اختيار الوقت المناسب." })
    .regex(/^\d{2}:\d{2}$/, "يرجى اختيار الوقت المناسب."),
  company: honeypot,
});

export const newsletterSchema = z.object({
  email: emailSchema,
  company: honeypot,
});

export type FieldErrors = Record<string, string>;

export function flattenIssues(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
