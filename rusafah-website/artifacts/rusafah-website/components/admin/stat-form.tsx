"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateCompanyStat } from "@/modules/admin/settings-actions";
import { initialFormState } from "@/modules/admin/form-state";
import type { companyStats } from "@/db/schema";

type Stat = typeof companyStats.$inferSelect;

export function StatForm({ stat }: { stat: Stat }) {
  const [state, action, pending] = useActionState(updateCompanyStat, initialFormState);
  return (
    <form
      action={action}
      className="border-cream-300 grid items-end gap-3 rounded-md border bg-white p-4 sm:grid-cols-6"
    >
      <input type="hidden" name="id" value={stat.id} />
      <p className="text-navy-600 text-xs sm:col-span-6">{stat.key}</p>
      <Field id={`stat-${stat.id}-value`} label="القيمة" error={state.errors?.value} required>
        {(a11y) => <Input {...a11y} name="value" defaultValue={stat.value} />}
      </Field>
      <Field id={`stat-${stat.id}-prefix`} label="البادئة" error={state.errors?.prefixAr}>
        {(a11y) => <Input {...a11y} name="prefixAr" defaultValue={stat.prefixAr ?? ""} />}
      </Field>
      <Field id={`stat-${stat.id}-label`} label="التسمية" error={state.errors?.labelAr} required>
        {(a11y) => <Input {...a11y} name="labelAr" defaultValue={stat.labelAr} />}
      </Field>
      <Field id={`stat-${stat.id}-unit`} label="الوحدة" error={state.errors?.unitAr}>
        {(a11y) => <Input {...a11y} name="unitAr" defaultValue={stat.unitAr ?? ""} />}
      </Field>
      <Field id={`stat-${stat.id}-asof`} label="تاريخ الإصدار" error={state.errors?.asOf} required>
        {(a11y) => <Input {...a11y} name="asOf" type="date" defaultValue={stat.asOf} />}
      </Field>
      <Field id={`stat-${stat.id}-source`} label="المصدر" error={state.errors?.sourceAr} required>
        {(a11y) => <Input {...a11y} name="sourceAr" defaultValue={stat.sourceAr} />}
      </Field>
      <Button type="submit" size="sm" disabled={pending} className="w-fit sm:col-span-6">
        {pending ? "جارٍ الحفظ…" : "حفظ"}
      </Button>
      {state.message ? (
        <p role="status" className="text-sm sm:col-span-6">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
