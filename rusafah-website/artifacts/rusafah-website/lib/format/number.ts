/**
 * Number formatting for display. Western digits by default (ENGINEERING.md §5),
 * Arabic locale grouping. Nothing here may be used to compute a stored figure.
 */
const WESTERN = "ar-SA-u-nu-latn";
const ARABIC_INDIC = "ar-SA-u-nu-arab";

export type Numerals = "western" | "arabic-indic";

export function formatInteger(value: number | string, numerals: Numerals = "western"): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat(numerals === "western" ? WESTERN : ARABIC_INDIC, {
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDecimal(
  value: number | string,
  fractionDigits = 2,
  numerals: Numerals = "western",
): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat(numerals === "western" ? WESTERN : ARABIC_INDIC, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

/**
 * Percent for display, e.g. "10%" — value is the percentage figure itself (10 = ten
 * percent). The artboards use the Latin percent sign, so the Arabic "٪" that the
 * ar-SA locale would emit is deliberately not used.
 */
export function formatPercent(value: number | string, numerals: Numerals = "western"): string {
  return `${formatDecimal(value, 1, numerals)}%`;
}
