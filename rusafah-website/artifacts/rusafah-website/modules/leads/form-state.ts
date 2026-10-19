import type { FieldErrors } from "./validation";

/** Result shape returned by every public form action. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
};

export const initialFormState: FormState = { status: "idle" };
