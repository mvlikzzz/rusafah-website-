import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PostRow } from "@/modules/posts/queries";
import { formatCardDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Article card: cover with the date and short title over it, then the full title and a read-more rule. */
export function PostCard({
  post,
  className,
  priority = false,
}: {
  post: PostRow;
  className?: string;
  priority?: boolean;
}) {
  const date = post.publishedAt ? formatCardDate(post.publishedAt) : null;
  const href = `/blog/${post.slug}`;
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="bg-navy-800 relative block aspect-[3/4] overflow-hidden">
        <Image
          src={post.coverPath}
          alt={post.coverAltAr}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="from-navy-950/85 absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent"
        />
        <div className="text-cream-100 absolute inset-x-0 bottom-0 p-5">
          {date ? (
            <p className="flex items-center gap-2 text-base">
              <span aria-hidden="true" className="diamond text-gold-400" />
              <span className="font-medium">{date.month}</span>
              <span className="font-latin">{date.yearDay}</span>
            </p>
          ) : null}
          <p className="mt-1 text-xl">{post.excerptAr.split(":")[0]}</p>
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-gold-700 text-xl leading-snug font-medium">
          <Link href={href}>{post.titleAr}</Link>
        </h3>
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="border-gold-700/60 text-gold-700 hover:text-brown-800 flex items-center justify-between border-b pb-2"
          >
            <span>اقرأ المزيد</span>
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
