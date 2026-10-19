"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { uploadProjectImage } from "@/modules/admin/media-actions";
import { initialFormState } from "@/modules/admin/form-state";

export function ImageUploadForm({ projectId, slug }: { projectId: string; slug: string }) {
  const [state, action, pending] = useActionState(uploadProjectImage, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="border-cream-300 grid items-end gap-3 rounded-md border bg-white p-4 sm:grid-cols-4"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="slug" value={slug} />
      <Field id="img-file" label="الصورة" error={state.errors?.file} required>
        {(a11y) => (
          <Input {...a11y} name="file" type="file" accept="image/png,image/jpeg" required />
        )}
      </Field>
      <Field id="img-kind" label="النوع" required>
        {(a11y) => (
          <Select {...a11y} name="kind" defaultValue="gallery">
            <option value="card">بطاقة</option>
            <option value="hero">رئيسية</option>
            <option value="gallery">معرض</option>
          </Select>
        )}
      </Field>
      <Field id="img-alt" label="الوصف (لقارئ الشاشة)" error={state.errors?.altAr} required>
        {(a11y) => <Input {...a11y} name="altAr" />}
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "جارٍ الرفع…" : "رفع الصورة"}
      </Button>
      {state.message ? (
        <p
          role="status"
          className={
            state.status === "success"
              ? "bg-status-available/15 text-status-available rounded-sm p-2 text-sm sm:col-span-4"
              : "text-status-sold text-sm sm:col-span-4"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
