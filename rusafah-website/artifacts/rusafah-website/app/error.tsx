"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      id="main"
      className="bg-navy-900 text-cream-100 flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="text-4xl font-medium">حدث خطأ غير متوقع</h1>
      <p className="text-cream-200/80 mt-4 max-w-md text-lg">
        نعتذر عن ذلك. يمكنك إعادة المحاولة، أو التواصل معنا إذا استمرت المشكلة.
      </p>
      <Button variant="gold" className="mt-10" onClick={reset}>
        إعادة المحاولة
      </Button>
    </main>
  );
}
