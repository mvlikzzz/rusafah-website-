"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Popover, Slider } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/input";
import { formatInteger } from "@/lib/format";
import { cn } from "@/lib/utils";
import { filterToSearchParams, type ProjectFilter } from "@/modules/projects/filters";
import { PROPERTY_TYPES, propertyTypeLabel } from "@/modules/projects/vocabulary";
import type { FilterOptions } from "@/modules/projects/queries";

type Props = { filter: ProjectFilter; options: FilterOptions; resultCount: number };

/**
 * Filter bar from the projects artboard: city, unit type, bedrooms and price,
 * each opening a panel; "عرض" navigates with the filter in the URL so the
 * server renders the real filtered list.
 */
export function FilterBar({ filter, options, resultCount }: Props) {
  const router = useRouter();
  const [draft, setDraft] = React.useState<ProjectFilter>(filter);
  const ceiling = Math.max(1_000_000, Math.ceil(options.priceCeiling / 100_000) * 100_000);
  const [range, setRange] = React.useState<[number, number]>([
    filter.priceMin ?? 0,
    filter.priceMax ?? ceiling,
  ]);
  const [citySearch, setCitySearch] = React.useState("");

  const apply = (next: ProjectFilter) => {
    router.push(`/projects${filterToSearchParams({ ...next, page: 1 })}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    apply({
      ...draft,
      priceMin: range[0] > 0 ? range[0] : undefined,
      priceMax: range[1] < ceiling ? range[1] : undefined,
    });
  };

  const summary = (v: string | undefined, fallback = "الكل") => v ?? fallback;
  const cities = options.cities.filter((c) => c.includes(citySearch.trim()));

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-stretch gap-3"
      aria-label="تصفية المشاريع"
    >
      <FilterPopover label="المدينة" value={summary(draft.city)}>
        <input
          type="search"
          value={citySearch}
          onChange={(e) => setCitySearch(e.target.value)}
          placeholder="يبحث حسب المدينة..."
          aria-label="ابحث عن مدينة"
          className="border-gold-600/40 bg-cream-100 mb-3 w-full rounded-xs border px-3 py-2 text-base md:text-sm"
        />
        <ul className="space-y-2">
          {cities.map((c) => (
            <li key={c}>
              <label className="flex items-center justify-between gap-3 text-lg">
                <span>{c}</span>
                <Checkbox
                  checked={draft.city === c}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      city: e.target.checked ? c : undefined,
                      district: undefined,
                    })
                  }
                />
              </label>
            </li>
          ))}
        </ul>
        {options.districts.length ? (
          <>
            <p className="text-gold-700 mt-4 mb-2 text-xs">الحي</p>
            <ul className="grid grid-cols-2 gap-2">
              {options.districts
                .filter((d) => !draft.city || d.city === draft.city)
                .map((d) => (
                  <li key={d.district}>
                    <label className="flex items-center justify-between gap-2 text-base">
                      <span>{d.district}</span>
                      <Checkbox
                        checked={draft.district === d.district}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            district: e.target.checked ? d.district : undefined,
                          })
                        }
                      />
                    </label>
                  </li>
                ))}
            </ul>
          </>
        ) : null}
      </FilterPopover>

      <FilterPopover
        label="نوع الوحدة"
        value={draft.types.length ? draft.types.map(propertyTypeLabel).join("، ") : "الكل"}
      >
        <p className="text-gold-700 mb-2 text-xs">نوع الوحدة</p>
        <ul className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <li key={t}>
              <label className="flex items-center justify-between gap-3 text-lg">
                <span>{propertyTypeLabel(t)}</span>
                <Checkbox
                  checked={draft.types.includes(t)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      types: e.target.checked
                        ? [...draft.types, t]
                        : draft.types.filter((x) => x !== t),
                    })
                  }
                />
              </label>
            </li>
          ))}
        </ul>
      </FilterPopover>

      <FilterPopover
        label="عدد الغرف"
        value={draft.bedrooms ? formatInteger(draft.bedrooms) : "الكل"}
      >
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="عدد الغرف">
          <button
            type="button"
            onClick={() => setDraft({ ...draft, bedrooms: undefined })}
            aria-pressed={!draft.bedrooms}
            className={chip(!draft.bedrooms)}
          >
            الكل
          </button>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setDraft({ ...draft, bedrooms: n })}
              aria-pressed={draft.bedrooms === n}
              className={cn(chip(draft.bedrooms === n), "font-latin")}
            >
              {n}
            </button>
          ))}
        </div>
      </FilterPopover>

      <FilterPopover
        label="الســعر"
        value={
          range[0] === 0 && range[1] === ceiling
            ? "الكل"
            : `${formatInteger(range[0])} - ${formatInteger(range[1])}`
        }
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-gold-700 text-xs">الأدنى</span>
            <input
              type="number"
              min={0}
              max={range[1]}
              step={10_000}
              value={range[0]}
              onChange={(e) => setRange([Math.min(Number(e.target.value), range[1]), range[1]])}
              className="font-latin border-gold-600/40 bg-cream-100 w-full max-w-32 min-w-0 rounded-xs border px-2 py-1 text-base md:text-sm"
              aria-label="أدنى سعر بالريال"
            />
          </label>
          <span aria-hidden="true">—</span>
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-gold-700 text-xs">الأعلى</span>
            <input
              type="number"
              min={range[0]}
              max={ceiling}
              step={10_000}
              value={range[1]}
              onChange={(e) => setRange([range[0], Math.max(Number(e.target.value), range[0])])}
              className="font-latin border-gold-600/40 bg-cream-100 w-full max-w-32 min-w-0 rounded-xs border px-2 py-1 text-base md:text-sm"
              aria-label="أعلى سعر بالريال"
            />
          </label>
        </div>
        <Slider.Root
          dir="rtl"
          className="relative mt-5 flex h-5 w-full touch-none items-center select-none"
          min={0}
          max={ceiling}
          step={10_000}
          value={range}
          onValueChange={(v) => setRange([v[0] ?? 0, v[1] ?? ceiling])}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="bg-gold-600/60 relative h-px grow">
            <Slider.Range className="bg-gold-600 absolute h-full" />
          </Slider.Track>
          <Slider.Thumb
            aria-label="أدنى سعر"
            className="bg-gold-600 focus-visible:ring-gold-500 block size-3 rotate-45 focus:outline-none focus-visible:ring-2"
          />
          <Slider.Thumb
            aria-label="أعلى سعر"
            className="bg-gold-600 focus-visible:ring-gold-500 block size-3 rotate-45 focus:outline-none focus-visible:ring-2"
          />
        </Slider.Root>
      </FilterPopover>

      <Button type="submit" variant="gold" className="min-h-12 flex-1 rounded-xs px-8 sm:flex-none">
        عرض
      </Button>

      <div
        className="bg-navy-900 text-cream-100 flex flex-1 overflow-hidden rounded-md sm:flex-none"
        role="group"
        aria-label="نوع العرض"
      >
        {(["sale", "rent"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={draft.listing === v}
            onClick={() => apply({ ...draft, listing: v })}
            className={cn(
              "min-h-12 flex-1 px-6 text-lg sm:flex-none",
              draft.listing === v ? "text-gold-400" : "opacity-75 hover:opacity-100",
            )}
          >
            {v === "sale" ? "بيــع" : "ايجار"}
          </button>
        ))}
      </div>

      <p className="text-gold-700 w-full text-sm" role="status">
        {resultCount === 0
          ? "لا توجد مشاريع مطابقة لخيارات التصفية الحالية."
          : `${formatInteger(resultCount)} مشروع`}
      </p>
    </form>
  );
}

function chip(active: boolean) {
  return cn(
    "min-h-11 rounded-xs border px-3 py-1.5 text-sm md:min-h-0",
    active
      ? "border-gold-600 bg-gold-600 text-cream-100"
      : "border-gold-600/40 text-navy-900 hover:bg-gold-600/10",
  );
}

function FilterPopover({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger className="bg-navy-900 text-cream-100 hover:bg-navy-800 flex min-w-0 basis-full items-center sm:min-w-48 sm:flex-1 sm:basis-0 justify-between gap-4 rounded-md px-5 py-3 text-start">
        <span>
          <span className="block text-lg">{label}</span>
          <span className="text-cream-200/70 block text-sm">{value}</span>
        </span>
        <ChevronDown className="text-cream-200/70 size-5 shrink-0" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          dir="rtl"
          align="start"
          sideOffset={8}
          className="border-gold-600/40 bg-cream-200 text-navy-900 shadow-card z-40 w-[min(20rem,calc(100vw-2rem))] max-h-[min(28rem,70dvh)] overflow-y-auto rounded-md border p-4 focus:outline-none"
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
