import type { CompanyStat } from "@/modules/site/queries";
import { formatDecimal } from "@/lib/format";
import { Riyal } from "@/components/ui/riyal";
import { cn } from "@/lib/utils";

/** Headline figure: "+ 72,787 م²" in Barlow bold gold, caption below. */
export function Stat({
  stat,
  className,
  tone = "dark",
}: {
  stat: CompanyStat;
  className?: string;
  tone?: "dark" | "light";
}) {
  const isMillionRiyal = stat.unitAr === "مليون ريال";
  const number = formatDecimal(stat.value, 0);
  return (
    <div className={cn("text-center", className)}>
      <p className="text-gold-500 flex flex-wrap items-baseline justify-center gap-x-2">
        {stat.prefixAr && stat.prefixAr !== "+" ? (
          <span className="text-2xl md:text-3xl">{stat.prefixAr}</span>
        ) : null}
        <span className="font-latin text-3xl font-bold tabular-nums sm:text-4xl md:text-5xl">
          {stat.prefixAr === "+" ? <span aria-label="أكثر من">+</span> : null}
          {number}
        </span>
        {stat.unitAr ? (
          <span className="text-2xl md:text-3xl">
            {isMillionRiyal ? (
              <>
                مليون <Riyal className="h-[0.8em]" />
              </>
            ) : stat.unitAr === "م²" ? (
              <>
                م<sup className="font-latin">2</sup>
              </>
            ) : (
              stat.unitAr
            )}
          </span>
        ) : null}
      </p>
      <p
        className={cn(
          "mt-1 text-lg md:text-xl",
          tone === "light" ? "text-cream-200" : "text-navy-900",
        )}
      >
        {stat.labelAr}
      </p>
    </div>
  );
}
