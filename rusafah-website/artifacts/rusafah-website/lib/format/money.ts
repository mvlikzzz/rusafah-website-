import { Decimal } from "decimal.js";

/**
 * Money presentation. E-01: NUMERIC(19,4) in the database, decimal in code,
 * half-up rounding at the presentation boundary only. Prices on the public site
 * are whole riyals, so the default shows no fraction; the Decimal path still
 * guarantees no float drift on the way to the screen.
 */
Decimal.set({ rounding: Decimal.ROUND_HALF_UP, precision: 34 });

export type MoneyInput = string | Decimal;

export function toDecimal(value: MoneyInput): Decimal {
  return value instanceof Decimal ? value : new Decimal(value);
}

export function roundHalfUp(value: MoneyInput, places = 2): Decimal {
  return toDecimal(value).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

export type FormatSarOptions = {
  fractionDigits?: 0 | 2;
  numerals?: "western" | "arabic-indic";
};

/**
 * Formats a SAR amount as digits only ("1,359,660"). The riyal symbol is drawn by
 * the <Riyal /> component next to the figure, because the new Saudi riyal sign
 * (U+20C1) is not yet present in the brand fonts.
 */
export function formatSarAmount(value: MoneyInput, options: FormatSarOptions = {}): string {
  const { fractionDigits = 0, numerals = "western" } = options;
  const rounded = roundHalfUp(value, fractionDigits);
  return new Intl.NumberFormat(`ar-SA-u-nu-${numerals === "western" ? "latn" : "arab"}`, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number(rounded.toFixed(fractionDigits)));
}

/** "1,359,660 - 2,073,139" for a price range; a single figure when equal or one side missing. */
export function formatSarRange(min: MoneyInput | null, max: MoneyInput | null): string | null {
  if (!min && !max) return null;
  if (min && max && !toDecimal(min).equals(toDecimal(max))) {
    return `${formatSarAmount(min)} - ${formatSarAmount(max)}`;
  }
  return formatSarAmount((min ?? max) as MoneyInput);
}
