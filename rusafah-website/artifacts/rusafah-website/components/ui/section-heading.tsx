import { cn } from "@/lib/utils";

type Props = {
  title: string;
  /** Adds the short ornament lines either side of the title, as in "مايميز رُصافة". */
  ornament?: boolean;
  /** Renders the title inside a translucent pill, as in "شركاء النجاح". */
  pill?: boolean;
  align?: "center" | "start";
  eyebrow?: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
};

export function SectionHeading({
  title,
  ornament,
  pill,
  align = "center",
  eyebrow,
  description,
  className,
  as: Tag = "h2",
  tone = "dark",
}: Props) {
  const color = tone === "light" ? "text-cream-100" : "text-navy-900";
  return (
    <div className={cn(align === "center" ? "text-center" : "text-start", className)}>
      {eyebrow ? <p className="text-gold-700 mb-2 text-sm tracking-wide">{eyebrow}</p> : null}
      <Tag
        className={cn(
          "inline-flex items-center gap-4 text-3xl font-medium md:text-4xl",
          color,
          pill && "bg-cream-200/10 rounded-md px-8 py-2 text-2xl md:text-3xl",
        )}
      >
        {ornament ? <span aria-hidden="true" className="ornament-line text-gold-500" /> : null}
        <span>{title}</span>
        {ornament ? (
          <span aria-hidden="true" className="ornament-line text-gold-500 -scale-x-100" />
        ) : null}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-lg leading-relaxed",
            tone === "light" ? "text-cream-200/85" : "text-navy-900/80",
            align === "start" && "mx-0",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Title with a diamond bullet in front, e.g. "◆ السعر", "◆ المميزات". */
export function DiamondTitle({
  children,
  className,
  as: Tag = "h3",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <Tag className={cn("flex items-center gap-3 text-2xl font-medium", className)}>
      <span aria-hidden="true" className="diamond text-gold-500" />
      <span>{children}</span>
    </Tag>
  );
}
