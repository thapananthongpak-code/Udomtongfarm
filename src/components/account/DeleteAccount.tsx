"use client";

import { useActionState, useState } from "react";
import type { AccountState } from "@/app/[lang]/account/actions";

const IDLE: AccountState = { status: "idle" };

type Props = {
  action: (state: AccountState, formData: FormData) => Promise<AccountState>;
  labels: { open: string; confirm: string; submit: string; mismatch: string; cancel: string };
};

export default function DeleteAccount({ action, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, IDLE);

  if (!open) {
    return (
      <button type="button" className="btn btn-danger" onClick={() => setOpen(true)}>
        {labels.open}
      </button>
    );
  }

  return (
    <form action={formAction} className="max-w-sm">
      <label htmlFor="confirm-delete" className="field-label">
        {labels.confirm}
      </label>
      <input
        id="confirm-delete"
        name="confirm"
        autoComplete="off"
        autoCapitalize="characters"
        aria-invalid={state.status === "error"}
        required
        className="input"
      />
      {state.status === "error" && <p className="field-error">{labels.mismatch}</p>}
      <div className="mt-4 flex gap-3">
        <button type="submit" className="btn btn-danger" disabled={pending}>
          {labels.submit}
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setOpen(false)}>
          {labels.cancel}
        </button>
      </div>
    </form>
  );
}
