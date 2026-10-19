import { z } from "zod";

/**
 * Validation for the CMS admin forms. Every message is a complete Arabic sentence
 * (ENGINEERING.md §5), matching the public-form validation in modules/leads/validation.ts.
 */
export type FieldErrors = Record<string, string>;

export function flattenIssues(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const loginSchema = z.object({
  email: z
    .string({ error: "يرجى إدخال البريد الإلكتروني." })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "يرجى إدخال بريد إلكتروني صحيح." })),
  password: z.string({ error: "يرجى إدخال كلمة المرور." }).min(1, "يرجى إدخال كلمة المرور."),
});

const requiredText = (label: string, max = 200) =>
  z
    .string({ error: `${label} مطلوب.` })
    .trim()
    .min(1, `${label} مطلوب.`)
    .max(max, `${label} طويل جداً.`);

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.url({ error: `${label} يجب أن يكون رابطاً صحيحاً.` }).optional());

export const siteSettingsSchema = z.object({
  companyNameAr: requiredText("الاسم بالعربية"),
  companyNameEn: requiredText("الاسم بالإنجليزية"),
  taglineAr: requiredText("الشعار بالعربية"),
  taglineEn: requiredText("الشعار بالإنجليزية"),
  unifiedNumber: requiredText("الرقم الموحد", 40),
  internationalNumber: requiredText("الرقم الدولي", 40),
  whatsappNumber: requiredText("رقم واتساب", 40),
  email: z
    .string({ error: "يرجى إدخال البريد الإلكتروني." })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "يرجى إدخال بريد إلكتروني صحيح." })),
  googleMapsUrl: optionalUrl("رابط خرائط جوجل"),
  instagramUrl: optionalUrl("رابط إنستقرام"),
  xUrl: optionalUrl("رابط إكس"),
  linkedinUrl: optionalUrl("رابط لينكدإن"),
});

export const companyStatSchema = z.object({
  value: z
    .string({ error: "يرجى إدخال القيمة." })
    .trim()
    .regex(/^\d+(\.\d{1,4})?$/, "القيمة يجب أن تكون رقماً صحيحاً."),
  prefixAr: z.string().trim().max(20).optional(),
  labelAr: requiredText("التسمية بالعربية", 120),
  unitAr: z.string().trim().max(20).optional(),
  asOf: z
    .string({ error: "يرجى اختيار تاريخ الإصدار." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "يرجى اختيار تاريخ صحيح."),
  sourceAr: requiredText("المصدر", 200),
});

const moneyOrEmpty = (label: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : v))
    .refine((v) => v === null || /^\d+(\.\d{1,4})?$/.test(v), {
      error: `${label} يجب أن يكون رقماً موجباً.`,
    });

export const projectPricingSchema = z.object({
  priceMin: moneyOrEmpty("أقل سعر"),
  priceMax: moneyOrEmpty("أعلى سعر"),
  unitsCount: z.coerce
    .number({ error: "عدد الوحدات يجب أن يكون رقماً." })
    .int()
    .nonnegative("عدد الوحدات يجب أن يكون رقماً موجباً.")
    .optional(),
  unitsRemaining: z.coerce
    .number({ error: "عدد الوحدات المتبقية يجب أن يكون رقماً." })
    .int()
    .nonnegative("عدد الوحدات المتبقية يجب أن يكون رقماً موجباً.")
    .optional(),
  salesProgressPercent: z.coerce
    .number({ error: "نسبة الإنجاز يجب أن تكون رقماً." })
    .min(0, "نسبة الإنجاز يجب أن تكون بين 0 و100.")
    .max(100, "نسبة الإنجاز يجب أن تكون بين 0 و100.")
    .optional(),
  status: z.enum(["available", "coming_soon", "sold", "under_construction"], {
    error: "يرجى اختيار حالة صحيحة للمشروع.",
  }),
});

export const unitSchema = z.object({
  price: moneyOrEmpty("سعر الوحدة"),
  status: z.enum(["available", "reserved", "sold"], { error: "يرجى اختيار حالة صحيحة للوحدة." }),
});

export const imageMetaSchema = z.object({
  altAr: requiredText("الوصف بالعربية (لقارئ الشاشة)", 200),
  kind: z.enum(["card", "hero", "gallery"], { error: "يرجى اختيار نوع الصورة." }),
});
