import { describe, expect, it } from "vitest";
import { heroSlideReducer, initialHeroSlideState } from "@/lib/hero-slides";

describe("homepage project picture transitions", () => {
  it("keeps the brand until the chosen project's own picture is ready", () => {
    const pending = heroSlideReducer(initialHeroSlideState, { type: "select", slug: "rusafah-14" });
    expect(pending.active).toBeNull();
    expect(pending.requested).toBe("rusafah-14");
    expect(heroSlideReducer(pending, { type: "ready", slug: "rusafah-14" }).active).toBe("rusafah-14");
  });

  it("preloading another picture does not switch the selected project", () => {
    const pending = heroSlideReducer(initialHeroSlideState, { type: "select", slug: "rusafah-14" });
    expect(heroSlideReducer(pending, { type: "ready", slug: "rusafah-11" }).active).toBeNull();
  });

  it("ignores stale image completion after rapidly selecting another project", () => {
    const first = heroSlideReducer(initialHeroSlideState, { type: "select", slug: "rusafah-14" });
    const second = heroSlideReducer(first, { type: "select", slug: "rusafah-11" });
    const late = heroSlideReducer(second, { type: "ready", slug: "rusafah-14" });
    expect(late.active).toBeNull();
    expect(heroSlideReducer(late, { type: "ready", slug: "rusafah-11" }).active).toBe("rusafah-11");
  });

  it("selecting the active project again never returns to the brand picture", () => {
    const ready = heroSlideReducer(initialHeroSlideState, { type: "ready", slug: "rusafah-14" });
    const active = heroSlideReducer(ready, { type: "select", slug: "rusafah-14" });
    expect(heroSlideReducer(active, { type: "select", slug: "rusafah-14" }).active).toBe("rusafah-14");
  });

  it("preserves the current project if the next project's picture fails", () => {
    const state = {
      active: "rusafah-14", requested: "rusafah-11", ready: ["rusafah-14"], failed: null,
    };
    const failed = heroSlideReducer(state, { type: "failed", slug: "rusafah-11" });
    expect(failed.active).toBe("rusafah-14");
    expect(failed.requested).toBe("rusafah-14");
    expect(failed.failed).toBe("rusafah-11");
    expect(heroSlideReducer(state, { type: "failed", slug: "rusafah-09" })).toBe(state);
  });

  it("allows autoplay to return to the brand without waiting for another picture", () => {
    const state = {
      active: "rusafah-14", requested: "rusafah-14", ready: ["rusafah-14"], failed: null,
    };
    expect(heroSlideReducer(state, { type: "select", slug: null }).active).toBeNull();
  });
});
