"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { PhoneField } from "@/components/projects/lead-dialogs";
import { COPY } from "@/lib/copy";
import { submitContact } from "@/modules/leads/actions";
import { initialFormState } from "@/modules/leads/form-state";

/** The glass card form on the contact page. Submits to a server action that stores the lead. */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialFormState);
  return (
    <div className="border-cream-100/20 bg-cream-100/10 text-cream-100 shadow-glow relative rounded-md border p-5 backdrop-blur-xl sm:p-8 md:p-10">
      <span
        aria-hidden="true"
        className="bg-gold-600 absolute start-1/2 -top-px h-1.5 w-40 translate-x-1/2 sm:w-56 rounded-b-sm"
      />
      <p className="mb-6 text-xl leading-snug sm:mb-8 sm:text-2xl font-medium">{COPY.contact.formIntro}</p>
      {state.status === "success" ? (
        <p role="status" className="bg-cream-100/15 rounded-sm p-5 text-xl">
          {state.message}
        </p>
      ) : (
        <form action={action} className="space-y-4" noValidate>
          <input type="hidden" name="sourcePath" value="/contact" />
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <Field
            id="contact-name"
            label="الإسم الكامل"
            srOnlyLabel
            error={state.errors?.fullName}
            required
          >
            {(a11y) => (
              <Input {...a11y} name="fullName" autoComplete="name" placeholder="الإسم الكامل" />
            )}
          </Field>
          <Field
            id="contact-email"
            label="البريد الإلكتروني"
            srOnlyLabel
            error={state.errors?.email}
          >
            {(a11y) => (
              <Input
                {...a11y}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="البريد الإلكتروني"
                dir="ltr"
                className="text-end"
              />
            )}
          </Field>
          <PhoneField id="contact-phone" error={state.errors?.phone} />
          <Field
            id="contact-message"
            label="استفسارك أو طلباتك"
            srOnlyLabel
            error={state.errors?.message}
            required
          >
            {(a11y) => (
              <Textarea
                {...a11y}
                name="message"
                placeholder={"استفسارك او طلباتك....\nمثال (انا مهتم بشقة بعدد غرف ٤ وبسعر معين)"}
                rows={5}
              />
            )}
          </Field>
          {state.status === "error" && state.message ? (
            <p role="alert" className="text-status-soon">
              {state.message}
            </p>
          ) : null}
          <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" variant="gold" size="lg" disabled={pending}>
              {pending ? "جارٍ الإرسال…" : "ارسال"}
            </Button>
            <p className="text-sm">{COPY.contact.privacyNote}</p>
          </div>
        </form>
      )}
    </div>
  );
}
