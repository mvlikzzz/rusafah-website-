"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateSiteSettings } from "@/modules/admin/settings-actions";
import { initialFormState } from "@/modules/admin/form-state";
import type { siteSettings } from "@/db/schema";

type Settings = typeof siteSettings.$inferSelect;

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(updateSiteSettings, initialFormState);
  return (
    <form action={action} className="max-w-xl space-y-4">
      {state.message ? (
        <p
          role="status"
          className={
            state.status === "success"
              ? "bg-status-available/15 text-status-available rounded-sm p-3 text-sm"
              : "text-status-sold rounded-sm bg-white p-3 text-sm"
          }
        >
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="s-name-ar"
          label="اسم الشركة (عربي)"
          error={state.errors?.companyNameAr}
          required
        >
          {(a11y) => <Input {...a11y} name="companyNameAr" defaultValue={settings.companyNameAr} />}
        </Field>
        <Field
          id="s-name-en"
          label="اسم الشركة (إنجليزي)"
          error={state.errors?.companyNameEn}
          required
        >
          {(a11y) => <Input {...a11y} name="companyNameEn" defaultValue={settings.companyNameEn} />}
        </Field>
        <Field id="s-tagline-ar" label="الشعار (عربي)" error={state.errors?.taglineAr} required>
          {(a11y) => <Input {...a11y} name="taglineAr" defaultValue={settings.taglineAr} />}
        </Field>
        <Field id="s-tagline-en" label="الشعار (إنجليزي)" error={state.errors?.taglineEn} required>
          {(a11y) => <Input {...a11y} name="taglineEn" defaultValue={settings.taglineEn} />}
        </Field>
        <Field id="s-unified" label="الرقم الموحد" error={state.errors?.unifiedNumber} required>
          {(a11y) => <Input {...a11y} name="unifiedNumber" defaultValue={settings.unifiedNumber} />}
        </Field>
        <Field id="s-intl" label="الرقم الدولي" error={state.errors?.internationalNumber} required>
          {(a11y) => (
            <Input
              {...a11y}
              name="internationalNumber"
              defaultValue={settings.internationalNumber}
            />
          )}
        </Field>
        <Field id="s-whatsapp" label="رقم واتساب" error={state.errors?.whatsappNumber} required>
          {(a11y) => (
            <Input {...a11y} name="whatsappNumber" defaultValue={settings.whatsappNumber} />
          )}
        </Field>
        <Field id="s-email" label="البريد الإلكتروني" error={state.errors?.email} required>
          {(a11y) => <Input {...a11y} name="email" type="email" defaultValue={settings.email} />}
        </Field>
        <Field id="s-maps" label="رابط خرائط جوجل" error={state.errors?.googleMapsUrl}>
          {(a11y) => (
            <Input {...a11y} name="googleMapsUrl" defaultValue={settings.googleMapsUrl ?? ""} />
          )}
        </Field>
        <Field id="s-instagram" label="رابط إنستقرام" error={state.errors?.instagramUrl}>
          {(a11y) => (
            <Input
              {...a11y}
              name="instagramUrl"
              defaultValue={settings.socialLinks.instagram ?? ""}
            />
          )}
        </Field>
        <Field id="s-x" label="رابط إكس (X)" error={state.errors?.xUrl}>
          {(a11y) => <Input {...a11y} name="xUrl" defaultValue={settings.socialLinks.x ?? ""} />}
        </Field>
        <Field id="s-linkedin" label="رابط لينكدإن" error={state.errors?.linkedinUrl}>
          {(a11y) => (
            <Input
              {...a11y}
              name="linkedinUrl"
              defaultValue={settings.socialLinks.linkedin ?? ""}
            />
          )}
        </Field>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
      </Button>
    </form>
  );
}
