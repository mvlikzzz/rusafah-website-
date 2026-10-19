/**
 * Dates: stored UTC, displayed Gregorian with Hijri secondary (E-07).
 * Hijri is display-only chrome (D-17 note) and is never stored.
 * The public site shows dates in Riyadh local time.
 */
const TZ = "Asia/Riyadh";
const GREGORIAN = "ar-SA-u-ca-gregory-nu-latn";
const HIJRI = "ar-SA-u-ca-islamic-umalqura-nu-latn";

export function formatGregorianLong(date: Date): string {
  return new Intl.DateTimeFormat(GREGORIAN, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  }).format(date);
}

/** "سبتمبر 2026,06" — the compact month + year,day style used on the article cards. */
export function formatCardDate(date: Date): { month: string; yearDay: string } {
  const month = new Intl.DateTimeFormat(GREGORIAN, { month: "long", timeZone: TZ }).format(date);
  const year = new Intl.DateTimeFormat(GREGORIAN, { year: "numeric", timeZone: TZ }).format(date);
  const day = new Intl.DateTimeFormat(GREGORIAN, { day: "2-digit", timeZone: TZ }).format(date);
  return { month, yearDay: `${year},${day}` };
}

export function formatHijriForScreen(date: Date): string {
  return new Intl.DateTimeFormat(HIJRI, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  }).format(date);
}

/** ISO date (yyyy-mm-dd) → Date at Riyadh midnight, for date-only columns. */
export function isoDateToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00+03:00`);
}

/** "2026-6-7" style shown for construction dates in the design, Western digits. */
export function formatShortNumericDate(date: Date): string {
  return new Intl.DateTimeFormat(GREGORIAN, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: TZ,
  }).format(date);
}
