"use client";

import { useActionState } from "react";
import type { AccountState } from "@/app/[lang]/account/actions";

const IDLE: AccountState = { status: "idle" };

type Props = {
  action: (state: AccountState, formData: FormData) => Promise<AccountState>;
  displayName: string;
  labels: { displayName: string; save: string; saved: string; error: string };
};

export default function ProfileForm({ action, displayName, labels }: Props) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  // The form is keyed on the saved name, so it shows the stored value again after a save.
  return (
    <form action={formAction} key={displayName} className="max-w-sm">
      <label htmlFor="display_name" className="field-label">
        {labels.displayName}
      </label>
      <div className="flex gap-3">
        <input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          maxLength={80}
          autoComplete="name"
          required
          className="input"
        />
        <button type="submit" className="btn" disabled={pending}>
          {labels.save}
        </button>
      </div>
      <p aria-live="polite" className={state.status === "error" ? "field-error" : "field-hint"}>
        {state.status === "saved" && labels.saved}
        {state.status === "error" && labels.error}
      </p>
    </form>
  );
}
