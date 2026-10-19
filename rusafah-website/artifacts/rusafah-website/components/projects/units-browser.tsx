"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Riyal } from "@/components/ui/riyal";
import { COPY } from "@/lib/copy";
import { formatDecimal, formatInteger, formatSarAmount } from "@/lib/format";
import type { ProjectUnit } from "@/modules/projects/queries";

const UNIT_STATUS: Record<string, string> = {
  available: "متاح الآن",
  reserved: "محجوز",
  sold: "مباع",
};

/** Unit selector with spec tiles and the floor plan, from the navy "الوحدات" band. */
export function UnitsBrowser({ units }: { units: ProjectUnit[] }) {
  const [i, setI] = React.useState(0);
  const u = units[i];
  if (!u) return null;
  const tiles: [string, React.ReactNode][] = [
    [COPY.project.floor, u.floorLabelAr],
    [
      COPY.project.area,
      <span key="a" className="font-latin">
        {formatDecimal(u.areaSqm, 2)} م<sup>2</sup>
      </span>,
    ],
    [
      COPY.project.bedrooms,
      <span key="b" className="font-latin">
        {formatInteger(u.bedrooms)}
      </span>,
    ],
    [
      COPY.project.bathrooms,
      <span key="c" className="font-latin">
        {formatInteger(u.bathrooms)}
      </span>,
    ],
  ];
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <label htmlFor="unit-select" className="sr-only">
          اختر الوحدة
        </label>
        <select
          id="unit-select"
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="select-brand font-latin border-gold-500 text-cream-100 w-48 rounded-md border bg-transparent py-3 text-center text-2xl"
        >
          {units.map((x, k) => (
            <option key={x.id} value={k} className="text-navy-900">
              {x.code}
            </option>
          ))}
        </select>
        <dl className="mt-8 grid gap-3">
          {tiles.map(([k, v]) => (
            <div
              key={k}
              className="border-cream-100/70 text-cream-100 flex items-center justify-between rounded-md border px-6 py-4"
            >
              <dt className="text-xl">{k}</dt>
              <dd className="text-2xl font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="border-cream-100/70 text-cream-100 mt-4 inline-block rounded-md border px-5 py-1.5">
          {UNIT_STATUS[u.status] ?? u.status}
        </p>
        {u.price ? (
          <div className="text-cream-100 mt-6">
            <p className="flex items-center gap-3 text-2xl">
              <span aria-hidden="true" className="diamond text-gold-400" />
              {COPY.project.price}
            </p>
            <p className="font-latin mt-2 text-4xl font-bold tabular-nums">
              {formatSarAmount(u.price)} <Riyal className="h-[0.8em]" />
            </p>
          </div>
        ) : null}
      </div>
      <div className="relative">
        {units.length > 1 ? (
          <div className="text-cream-100 absolute start-1/2 -top-12 flex translate-x-1/2 gap-6">
            <button
              type="button"
              onClick={() => setI((k) => (k - 1 + units.length) % units.length)}
              aria-label="الوحدة السابقة"
            >
              <ArrowUp className="size-6" aria-hidden="true" />
            </button>
          </div>
        ) : null}
        {u.floorPlanPath ? (
          <Image
            src={u.floorPlanPath}
            alt={`المخطط الأرضي للوحدة ${u.code}`}
            width={1400}
            height={1073}
            className="bg-cream-100 w-full rounded-sm"
          />
        ) : null}
        {u.specsAr ? <p className="text-cream-200/85 mt-4">{u.specsAr}</p> : null}
        {units.length > 1 ? (
          <div className="text-cream-100 mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setI((k) => (k + 1) % units.length)}
              aria-label="الوحدة التالية"
            >
              <ArrowDown className="size-6" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
