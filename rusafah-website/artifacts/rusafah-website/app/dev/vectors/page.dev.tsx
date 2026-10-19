import { notFound } from "next/navigation";
import { ArtworkImg } from "@/components/patterns/artwork-img";

const VECTORS = [
  "partner-wafi",
  "partner-ministry",
  "partner-subdivision",
  "cert-rega-sale",
  "cert-rega-contrib",
  "cert-ministry",
];
const MASKS = ["seal", "subbrand", "icon-globe", "icon-hand", "icon-person", "icon-cert"];

/** Developer check page for the vectors extracted from the artboards. Never built in production (E-11). */
export default function VectorsDevPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_ROUTES !== "true") notFound();
  return (
    <main className="bg-cream-100 grid grid-cols-3 gap-6 p-8">
      {VECTORS.map((v) => (
        <figure key={v} className="border-gold-600/30 rounded border bg-white p-4">
          <ArtworkImg
            src={`/vectors/${v}.svg`}
            alt={v}
            className="mx-auto h-32 w-auto max-w-full"
          />
          <figcaption className="font-latin mt-2 text-center text-xs">{v}</figcaption>
        </figure>
      ))}
      <figure className="bg-navy-900 text-cream-100 col-span-3 flex flex-wrap items-center gap-8 rounded p-6">
        {MASKS.map((m) => (
          <span
            key={m}
            className="mask-icon block h-24 w-40"
            style={{ ["--mask" as string]: `url(/images/masks/${m}.png)` }}
          />
        ))}
        <figcaption className="font-latin w-full text-xs">masked (currentColor)</figcaption>
      </figure>
    </main>
  );
}
