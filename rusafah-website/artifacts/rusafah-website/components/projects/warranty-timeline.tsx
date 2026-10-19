import { formatInteger } from "@/lib/format";
import type { ProjectWarranty } from "@/modules/projects/queries";

function yearsWord(n: number) {
  if (n === 1) return "سنة";
  if (n === 2) return "سنتان";
  if (n >= 3 && n <= 10) return "سنوات";
  return "سنة";
}

/** Circles on a rule — "1 /سنة, 2 /سنة, 5 /سنوات …" — with the covered items under each. */
export function WarrantyTimeline({ warranties }: { warranties: ProjectWarranty[] }) {
  return (
    <ol className="relative grid gap-10 sm:grid-cols-3 lg:grid-cols-6" aria-label="مدد الضمان">
      <span
        aria-hidden="true"
        className="bg-gold-600/70 absolute inset-x-8 top-8 hidden h-px lg:block"
      />
      {warranties.map((w) => (
        <li key={w.id} className="relative text-center lg:text-start">
          <div className="flex items-center gap-3 lg:flex-col lg:items-start">
            <span className="font-latin border-gold-600 bg-cream-200 text-navy-900 relative z-10 flex size-16 items-center justify-center rounded-full border text-3xl font-medium">
              {formatInteger(w.years)}
            </span>
            <span className="text-gold-700">/{yearsWord(w.years)}</span>
          </div>
          <ul className="text-navy-900 mt-3 space-y-1 text-lg">
            {w.itemsAr.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
