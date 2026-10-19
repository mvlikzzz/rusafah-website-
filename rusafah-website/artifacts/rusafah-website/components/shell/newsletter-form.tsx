"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { subscribeNewsletter } from "@/modules/leads/actions";
import { initialFormState } from "@/modules/leads/form-state";

/** Footer subscription. A real server action writes the subscriber and queues the alert. */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialFormState);
  const pathname = usePathname();
  const error =
    state.errors?.email ??
    state.errors?.form ??
    (state.status === "error" ? state.message : undefined);
  return (
    <form action={action} className="w-full min-w-0 space-y-2" noValidate>
      <input type="hidden" name="sourcePath" value={pathname} />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label htmlFor="newsletter-email" className="sr-only">
        البريد الإلكتروني للاشتراك في النشرة
      </label>
      <div className="bg-cream-200 flex">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ادخل بريدك الألكتروني هُنــا"
          aria-describedby="newsletter-status"
          aria-invalid={error ? true : undefined}
          className="text-navy-900 placeholder:text-gold-700/80 min-w-0 flex-1 bg-transparent px-4 py-4 sm:px-5 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="text-gold-700 hover:text-brown-800 shrink-0 px-4 py-4 font-medium sm:px-6 disabled:opacity-60"
        >
          {pending ? "جارٍ الإرسال…" : "اشترك"}
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        className={error ? "text-status-soon text-sm" : "text-gold-400 text-sm"}
      >
        {error ?? (state.status === "success" ? state.message : "")}
      </p>
    </form>
  );
}
