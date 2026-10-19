import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RusafahLogo } from "@/components/patterns/rusafah-logo";

export default function NotFound() {
  return (
    <main
      id="main"
      className="watermark-light bg-navy-900 text-cream-100 flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <RusafahLogo className="text-cream-200 h-16 w-auto" />
      <h1 className="mt-10 text-4xl font-medium md:text-5xl">الصفحة غير موجودة</h1>
      <p className="text-cream-200/80 mt-4 max-w-md text-lg">
        قد يكون الرابط الذي وصلت منه قديماً أو تمت كتابته بشكل غير صحيح.
      </p>
      <Button asChild variant="gold" className="mt-10">
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </main>
  );
}
