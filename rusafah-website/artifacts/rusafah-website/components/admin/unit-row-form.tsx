"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { updateUnit } from "@/modules/admin/projects-actions";
import { initialFormState } from "@/modules/admin/form-state";
import type { projectUnits } from "@/db/schema";

type Unit = typeof projectUnits.$inferSelect;

const STATUS_OPTIONS = [
  { value: "available", label: "متاحة" },
  { value: "reserved", label: "محجوزة" },
  { value: "sold", label: "مباعة" },
];

/** One row = one small independent form, so saving a unit never touches the others. */
export function UnitRowForm({ unit, slug }: { unit: Unit; slug: string }) {
  const [state, action, pending] = useActionState(updateUnit, initialFormState);
  return (
    <form
      action={action}
      className="border-cream-200 grid grid-cols-[1fr_1fr_1fr_8rem_8rem_auto] items-center gap-3 border-t px-3 py-2 text-sm"
    >
      <input type="hidden" name="unitId" value={unit.id} />
      <input type="hidden" name="slug" value={slug} />
      <span>{unit.code}</span>
      <span>{unit.modelCode}</span>
      <span>{unit.floorLabelAr}</span>
      <Input
        name="price"
        defaultValue={unit.price ?? ""}
        aria-label={`سعر الوحدة ${unit.code}`}
        aria-invalid={state.errors?.price ? true : undefined}
        className="px-3 py-2"
      />
      <Select
        name="status"
        defaultValue={unit.status}
        aria-label={`حالة الوحدة ${unit.code}`}
        className="px-3 py-2"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "…" : "حفظ"}
      </Button>
      {state.message ? (
        <p role="status" className="col-span-full text-xs">
          {state.errors?.price ?? state.message}
        </p>
      ) : null}
    </form>
  );
}
