import type { ContentBlock } from "@/lib/content-blocks";
import { cn } from "@/lib/utils";

/**
 * Renders validated content blocks. Tone "article" is the warm brown body copy
 * of the article page; tone "legal" is cream copy on the navy legal pages.
 */
export function ContentBlocks({
  blocks,
  tone = "article",
  className,
}: {
  blocks: ContentBlock[];
  tone?: "article" | "legal";
  className?: string;
}) {
  const heading = tone === "legal" ? "text-gold-400" : "text-gold-600";
  const body = tone === "legal" ? "text-cream-200/90" : "text-gold-700";
  const strongColor = tone === "legal" ? "text-cream-100" : "text-navy-900";
  return (
    <div className={cn("space-y-5 text-lg leading-[1.9]", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className={cn("pt-4 text-2xl font-medium md:text-3xl", heading)}>
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className={cn(body)}>
                <Emphasis text={block.text} strongClass={strongColor} />
              </p>
            );
          case "list":
            return (
              <ul key={i} className={cn("space-y-2 ps-1", body)}>
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3 inline-block size-1.5 shrink-0 rounded-full bg-current"
                    />
                    <span>
                      <Emphasis text={item} strongClass={strongColor} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={i}
                className={cn("border-gold-500/40 bg-gold-500/5 rounded-md border p-6", body)}
              >
                <p className={cn("mb-2 text-xl font-medium", strongColor)}>{block.title}</p>
                <p>{block.text}</p>
              </aside>
            );
        }
      })}
    </div>
  );
}

/** "**bold**" markers and a leading "label:" become emphasised spans. */
function Emphasis({ text, strongClass }: { text: string; strongClass: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1 && !parts[0]!.startsWith("**")) {
    const m = /^([^:：]{2,40})[:：]\s/.exec(text);
    if (m) {
      return (
        <>
          <strong className={cn("font-medium", strongClass)}>{m[1]}:</strong>{" "}
          {text.slice(m[0].length)}
        </>
      );
    }
    return <>{text}</>;
  }
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i} className={cn("font-medium", strongClass)}>
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
