import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testPool } from "../helpers/db";

const { seed } = await import("@/db/seed/index");
const { listProjects, getProjectBySlug, listFeaturedProjects, getFilterOptions } =
  await import("@/modules/projects/queries");
const { parseProjectFilter } = await import("@/modules/projects/filters");
const { listPosts, getPostBySlug } = await import("@/modules/posts/queries");
const { getLegalDocument, listPublishedLegalSlugs, getSiteSettings } =
  await import("@/modules/site/queries");
const { searchSite } = await import("@/modules/search/queries");

const pool = testPool();

beforeAll(async () => {
  await seed(process.env.TEST_DATABASE_URL);
});
afterAll(async () => {
  await pool.end();
});

describe("projects", () => {
  it("lists only published projects, newest code first", async () => {
    await pool.query("update projects set publication_status = 'unpublished' where code = '01'");
    const r = await listProjects(parseProjectFilter({}));
    expect(r.total).toBe(11);
    expect(r.items.map((p) => p.code).slice(0, 3)).toEqual(["16", "15", "14"]);
    expect(r.items.every((p) => p.cardImage !== null)).toBe(true);
    await pool.query("update projects set publication_status = 'published' where code = '01'");
  });
  it("filters by type overlap, price range and bedrooms", async () => {
    const villas = await listProjects(parseProjectFilter({ types: "villas" }));
    expect(villas.items.every((p) => p.propertyTypes.includes("villas"))).toBe(true);
    const priced = await listProjects(
      parseProjectFilter({ priceMin: "1500000", priceMax: "1800000" }),
    );
    expect(priced.items.map((p) => p.code)).toEqual(["14"]);
    const threeBeds = await listProjects(parseProjectFilter({ bedrooms: "3" }));
    expect(threeBeds.items.map((p) => p.code)).toEqual(["14"]);
    expect((await listProjects(parseProjectFilter({ bedrooms: "6" }))).total).toBe(0);
  });
  it("returns the full detail graph for a project", async () => {
    const p = await getProjectBySlug("rusafah-14");
    expect(p?.features.length).toBe(6);
    expect(p?.warranties.map((w) => w.years)).toEqual([1, 2, 5, 10, 15, 25]);
    expect(p?.units[0]?.code).toBe("A-1");
    expect(p?.images.length).toBe(4);
    expect(await getProjectBySlug("does-not-exist")).toBeNull();
  });
  it("exposes only catalogue values as filter options", async () => {
    const o = await getFilterOptions();
    expect(o.cities).toEqual(["الرياض"]);
    expect(o.districts.map((d) => d.district)).toContain("الريان");
    expect(o.priceCeiling).toBe(2073139);
    expect((await listFeaturedProjects()).map((p) => p.code)).toEqual(["14", "11", "09", "08"]);
  });
});

describe("posts and legal", () => {
  it("serves published posts only", async () => {
    const r = await listPosts();
    expect(r.items.map((p) => p.slug)).toEqual(["floors-for-sale-al-rayyan-rusafah-14"]);
    expect(await getPostBySlug("apartments-for-sale-al-rayyan-guide")).toBeNull();
    const post = await getPostBySlug("floors-for-sale-al-rayyan-rusafah-14");
    expect(post?.relatedProject?.slug).toBe("rusafah-14");
  });
  it("footer links follow published legal documents", async () => {
    expect((await listPublishedLegalSlugs()).map((d) => d.slug)).toEqual(["privacy", "terms"]);
    await pool.query("update legal_documents set status = 'draft' where slug = 'terms'");
    expect(await getLegalDocument("terms")).toBeNull();
    await pool.query("update legal_documents set status = 'published' where slug = 'terms'");
  });
  it("reads site settings from the database", async () => {
    const s = await getSiteSettings();
    expect(s.unifiedNumber).toBe("920032809");
    expect(Object.keys(s.socialLinks).sort()).toEqual(["instagram", "x"]);
  });
});

describe("search", () => {
  it("finds projects and posts case-insensitively with thumbnails", async () => {
    const r = await searchSite("الريان");
    expect(r.filter((x) => x.kind === "project").length).toBeGreaterThan(0);
    expect(r.filter((x) => x.kind === "post").length).toBe(1);
    expect(r.filter((x) => x.kind === "project").every((x) => x.image)).toBe(true);
    expect(await searchSite("x")).toEqual([]);
  });
});
