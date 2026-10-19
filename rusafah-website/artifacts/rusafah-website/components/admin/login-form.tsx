"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/modules/admin/auth-actions";
import { initialFormState } from "@/modules/admin/form-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialFormState);
  return (
    <form action={action} className="space-y-4" noValidate>
      {state.message ? (
        <p role="alert" className="text-status-sold rounded-sm bg-white p-3 text-sm">
          {state.message}
        </p>
      ) : null}
      <Field id="login-email" label="البريد الإلكتروني" error={state.errors?.email} required>
        {(a11y) => <Input {...a11y} name="email" type="email" autoComplete="username" />}
      </Field>
      <Field id="login-password" label="كلمة المرور" error={state.errors?.password} required>
        {(a11y) => (
          <Input {...a11y} name="password" type="password" autoComplete="current-password" />
        )}
      </Field>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
      </Button>
    </form>
  );
}
