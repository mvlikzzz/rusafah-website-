import { z } from "zod";

/** Rich-text blocks used by posts and legal documents. Validated at seed and render time. */
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: z.string().min(1) }),
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("callout"), title: z.string().min(1), text: z.string().min(1) }),
]);

export const contentBlocksSchema = z.array(contentBlockSchema);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

export function parseContentBlocks(value: unknown): ContentBlock[] {
  return contentBlocksSchema.parse(value);
}

/** Plain-text excerpt of the first paragraph, for metadata descriptions. */
export function firstParagraph(blocks: ContentBlock[], max = 160): string {
  const p = blocks.find((b) => b.type === "paragraph");
  const text = p && p.type === "paragraph" ? p.text : "";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
