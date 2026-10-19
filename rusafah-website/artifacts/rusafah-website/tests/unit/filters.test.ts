import { describe, expect, it } from "vitest";
import { filterToSearchParams, parseProjectFilter } from "@/modules/projects/filters";

describe("project filters", () => {
  it("parses comma-separated types and numeric bounds", () => {
    const f = parseProjectFilter({
      types: "villas,floors",
      priceMin: "1000000",
      priceMax: "2500000",
      bedrooms: "3",
      city: "الرياض",
      page: "2",
    });
    expect(f.types).toEqual(["villas", "floors"]);
    expect(f.priceMin).toBe(1_000_000);
    expect(f.priceMax).toBe(2_500_000);
    expect(f.bedrooms).toBe(3);
    expect(f.city).toBe("الرياض");
    expect(f.page).toBe(2);
    expect(f.listing).toBe("sale");
  });
  it("falls back to defaults on garbage instead of failing the page", () => {
    const f = parseProjectFilter({ types: "castles", bedrooms: "99", page: "-3" });
    expect(f.types).toEqual([]);
    expect(f.bedrooms).toBeUndefined();
    expect(f.page).toBe(1);
  });
  it("round-trips through the query string without defaults", () => {
    const f = parseProjectFilter({ types: "apartments", district: "الريان", listing: "rent" });
    const qs = filterToSearchParams(f);
    expect(qs).toBe("?district=%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D9%86&types=apartments&listing=rent");
    expect(parseProjectFilter(Object.fromEntries(new URLSearchParams(qs)))).toEqual(f);
    expect(filterToSearchParams(parseProjectFilter({}))).toBe("");
  });
});
