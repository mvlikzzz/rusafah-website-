import { describe, expect, it } from "vitest";
import {
  formatCardDate,
  formatGregorianLong,
  formatHijriForScreen,
  formatInteger,
  formatPercent,
  formatSarAmount,
  formatSarRange,
  roundHalfUp,
} from "@/lib/format";

describe("number formatting", () => {
  it("uses Western digits with Arabic grouping by default", () => {
    expect(formatInteger(72787)).toBe("72,787");
    expect(formatInteger("230")).toBe("230");
  });
  it("can render Arabic-Indic digits when asked", () => {
    expect(formatInteger(2026, "arabic-indic")).toBe("٢٬٠٢٦");
  });
  it("formats percentages from percentage figures", () => {
    expect(formatPercent(10)).toBe("10%");
  });
});

describe("money", () => {
  it("rounds half-up at the presentation boundary only", () => {
    expect(roundHalfUp("1.005").toString()).toBe("1.01");
    expect(roundHalfUp("2.675").toString()).toBe("2.68");
  });
  it("formats whole-riyal prices without a fraction", () => {
    expect(formatSarAmount("1359660.0000")).toBe("1,359,660");
    expect(formatSarAmount("1693135.5000", { fractionDigits: 2 })).toBe("1,693,135.50");
  });
  it("formats a range, collapsing equal or missing ends", () => {
    expect(formatSarRange("1359660", "2073139")).toBe("1,359,660 - 2,073,139");
    expect(formatSarRange("1000", "1000")).toBe("1,000");
    expect(formatSarRange(null, "5000")).toBe("5,000");
    expect(formatSarRange(null, null)).toBeNull();
  });
});

describe("dates", () => {
  const d = new Date("2026-09-06T09:00:00+03:00");
  it("shows Gregorian with Western digits", () => {
    expect(formatGregorianLong(d)).toBe("6 سبتمبر 2026");
  });
  it("splits the card date into month and year,day", () => {
    expect(formatCardDate(d)).toEqual({ month: "سبتمبر", yearDay: "2026,06" });
  });
  it("renders Hijri as display chrome using Umm al-Qura", () => {
    expect(formatHijriForScreen(d)).toMatch(/1448/);
    expect(formatHijriForScreen(d)).toMatch(/هـ/);
  });
});
