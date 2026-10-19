"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { updateProjectPricing } from "@/modules/admin/projects-actions";
import { initialFormState } from "@/modules/admin/form-state";
import type { projects } from "@/db/schema";

type Project = typeof projects.$inferSelect;

const STATUS_OPTIONS = [
  { value: "available", label: "متاح" },
  { value: "coming_soon", label: "قريباً" },
  { value: "sold", label: "مباع" },
  { value: "under_construction", label: "قيد الإنشاء" },
];

export function ProjectPricingForm({ project }: { project: Project }) {
  const [state, action, pending] = useActionState(updateProjectPricing, initialFormState);
  return (
    <form action={action} className="max-w-xl space-y-4">
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="slug" value={project.slug} />
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
        <Field id="p-price-min" label="أقل سعر (ريال)" error={state.errors?.priceMin}>
          {(a11y) => <Input {...a11y} name="priceMin" defaultValue={project.priceMin ?? ""} />}
        </Field>
        <Field id="p-price-max" label="أعلى سعر (ريال)" error={state.errors?.priceMax}>
          {(a11y) => <Input {...a11y} name="priceMax" defaultValue={project.priceMax ?? ""} />}
        </Field>
        <Field id="p-units-count" label="إجمالي الوحدات" error={state.errors?.unitsCount}>
          {(a11y) => (
            <Input
              {...a11y}
              name="unitsCount"
              type="number"
              min={0}
              defaultValue={project.unitsCount ?? ""}
            />
          )}
        </Field>
        <Field id="p-units-remaining" label="الوحدات المتبقية" error={state.errors?.unitsRemaining}>
          {(a11y) => (
            <Input
              {...a11y}
              name="unitsRemaining"
              type="number"
              min={0}
              defaultValue={project.unitsRemaining ?? ""}
            />
          )}
        </Field>
        <Field id="p-progress" label="نسبة الإنجاز %" error={state.errors?.salesProgressPercent}>
          {(a11y) => (
            <Input
              {...a11y}
              name="salesProgressPercent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              defaultValue={project.salesProgressPercent ?? ""}
            />
          )}
        </Field>
        <Field id="p-status" label="حالة المشروع" error={state.errors?.status} required>
          {(a11y) => (
            <Select {...a11y} name="status" defaultValue={project.status}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "جارٍ الحفظ…" : "حفظ بيانات المشروع"}
      </Button>
    </form>
  );
}
