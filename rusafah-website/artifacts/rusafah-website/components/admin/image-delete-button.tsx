"use client";

import { useActionState } from "react";
import { deleteProjectImage } from "@/modules/admin/media-actions";
import { initialFormState } from "@/modules/admin/form-state";

export function ImageDeleteButton({ imageId, slug }: { imageId: string; slug: string }) {
  const [, action, pending] = useActionState(deleteProjectImage, initialFormState);
  return (
    <form action={action}>
      <input type="hidden" name="imageId" value={imageId} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="text-status-sold rounded-sm bg-white/90 px-2 py-1 text-xs"
      >
        {pending ? "…" : "حذف"}
      </button>
    </form>
  );
}
