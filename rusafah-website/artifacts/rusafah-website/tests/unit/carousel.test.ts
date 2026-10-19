import { describe, expect, it } from "vitest";
import { nextSlide } from "@/lib/carousel";

describe("hero slide order", () => {
  it("starts with the first project after the brand", () => {
    expect(nextSlide(["rusafah-14", "rusafah-11"], null)).toBe("rusafah-14");
  });
  it("advances between projects", () => {
    expect(nextSlide(["rusafah-14", "rusafah-11"], "rusafah-14")).toBe("rusafah-11");
  });
  it("returns to the brand after the last project", () => {
    expect(nextSlide(["rusafah-14", "rusafah-11"], "rusafah-11")).toBeNull();
  });
  it("keeps the brand when no projects are published", () => {
    expect(nextSlide([], null)).toBeNull();
  });
  it("resets safely when a project is no longer present", () => {
    expect(nextSlide(["rusafah-14"], "removed-project")).toBeNull();
  });
});
