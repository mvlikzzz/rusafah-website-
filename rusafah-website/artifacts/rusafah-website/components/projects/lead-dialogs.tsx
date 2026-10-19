"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { bookVisit, registerInterest } from "@/modules/leads/actions";
import { initialFormState, type FormState } from "@/modules/leads/form-state";
import { APPOINTMENT_LABELS, APPOINTMENT_TYPES } from "@/modules/leads/validation";

/** Phone input with the Saudi flag and +966 prefix as drawn on the forms. */
export function PhoneField({ error, id = "phone" }: { error?: string; id?: string }) {
  return (
    <Field id={id} label="رقم الهاتف" srOnlyLabel error={error} required>
      {(a11y) => (
        <div className="bg-cream-200 flex" dir="ltr">
          <span className="border-gold-600/20 flex items-center gap-2 border-e px-3">
            <Image
              src="/images/brand/flag-sa.png"
              alt=""
              width={30}
              height={20}
              className="h-5 w-auto rounded-xs"
            />
            <span className="font-latin text-navy-900/70 text-sm">+966</span>
          </span>
          <Input
            {...a11y}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="رقم الهاتف"
            dir="rtl"
            className="bg-transparent"
          />
        </div>
      )}
    </Field>
  );
}

function StatusLine({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  const isError = state.status === "error";
  const text = state.message ?? state.errors?.form;
  if (!text) return null;
  return (
    <p
      role={isError ? "alert" : "status"}
      className={isError ? "text-status-sold" : "text-navy-900 font-medium"}
    >
      {text}
    </p>
  );
}

export function InterestDialog({
  projectId,
  projectName,
  triggerClassName,
}: {
  projectId: string;
  projectName: string;
  triggerClassName?: string;
}) {
  const [state, action, pending] = useActionState(registerInterest, initialFormState);
  const pathname = usePathname();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gold" size="lg" className={triggerClassName}>
          سجــل اهتمامك
        </Button>
      </DialogTrigger>
      <DialogContent title="سجّل اهتمامك" description={projectName}>
        {state.status === "success" ? (
          <StatusLine state={state} />
        ) : (
          <form action={action} className="space-y-4" noValidate>
            <p className="text-gold-700 text-sm">*يستغرق أقل من دقيقة</p>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="sourcePath" value={pathname} />
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <Field
              id="interest-name"
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
              id="interest-email"
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
            <PhoneField id="interest-phone" error={state.errors?.phone} />
            <StatusLine state={state} />
            <div className="flex items-center justify-between gap-4 pt-2">
              <Button type="submit" variant="gold" size="lg" disabled={pending}>
                {pending ? "جارٍ الإرسال…" : "ارسال"}
              </Button>
              <p className="text-navy-900/80 text-sm">
                *بياناتك سرية ولا تتم مشاركتها مع أي طرف ثالث.
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function VisitDialog({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [state, action, pending] = useActionState(bookVisit, initialFormState);
  const pathname = usePathname();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">احجز زيارتــك</Button>
      </DialogTrigger>
      <DialogContent title="احجز موعد" description={projectName}>
        {state.status === "success" ? (
          <StatusLine state={state} />
        ) : (
          <form action={action} className="space-y-4" noValidate>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="sourcePath" value={pathname} />
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <Field
              id="visit-type"
              label="نوع الموعد"
              srOnlyLabel
              error={state.errors?.appointmentType}
              required
            >
              {(a11y) => (
                <Select {...a11y} name="appointmentType" defaultValue="">
                  <option value="" disabled>
                    نوع الموعد
                  </option>
                  {APPOINTMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {APPOINTMENT_LABELS[t]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="visit-date" label="التاريخ" error={state.errors?.preferredDate} required>
                {(a11y) => (
                  <Input
                    {...a11y}
                    name="preferredDate"
                    type="date"
                    min={today}
                    className="font-latin"
                  />
                )}
              </Field>
              <Field id="visit-time" label="الوقت" error={state.errors?.preferredTime} required>
                {(a11y) => (
                  <Input
                    {...a11y}
                    name="preferredTime"
                    type="time"
                    step={900}
                    className="font-latin"
                  />
                )}
              </Field>
            </div>
            <Field
              id="visit-name"
              label="الإسم الكامل"
              srOnlyLabel
              error={state.errors?.fullName}
              required
            >
              {(a11y) => (
                <Input {...a11y} name="fullName" autoComplete="name" placeholder="الإسم الكامل" />
              )}
            </Field>
            <PhoneField id="visit-phone" error={state.errors?.phone} />
            <StatusLine state={state} />
            <div className="flex items-center justify-between gap-4 pt-2">
              <Button type="submit" variant="gold" size="lg" disabled={pending}>
                {pending ? "جارٍ الحجز…" : "حجز"}
              </Button>
              <p className="text-navy-900/80 text-sm">*سيتواصل معك أحد مستشارينا خلال ٢٤ ساعة.</p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
