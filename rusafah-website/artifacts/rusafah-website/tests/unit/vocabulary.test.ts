import { describe, expect, it } from "vitest";
import {
  projectStatusLabel,
  propertyTypesLabel,
  propertyTypesLabelEn,
} from "@/modules/projects/vocabulary";
import { contentBlocksSchema, firstParagraph } from "@/lib/content-blocks";
import { legalDocuments, posts, projects } from "@/db/seed/content";

describe("vocabulary", () => {
  it("joins property types with a slash as on the artboards", () => {
    expect(propertyTypesLabel(["villas", "floors"])).toBe("فلل/أدوار");
    expect(propertyTypesLabelEn(["villas", "floors"])).toBe("VILLA/FLOORS");
    expect(projectStatusLabel("coming_soon")).toBe("قريباً");
  });
});

describe("seed content integrity", () => {
  it("has unique project codes and valid content blocks", () => {
    const codes = projects.map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const post of posts) expect(() => contentBlocksSchema.parse(post.body)).not.toThrow();
    for (const doc of legalDocuments)
      expect(() => contentBlocksSchema.parse(doc.body)).not.toThrow();
  });
  it("publishes only posts that have a body", () => {
    for (const post of posts) {
      if (post.status === "published") expect(post.body.length).toBeGreaterThan(0);
    }
  });
  it("derives a metadata description from the first paragraph", () => {
    const post = posts.find((p) => p.status === "published")!;
    expect(firstParagraph(post.body, 60).length).toBeLessThanOrEqual(60);
  });
});
