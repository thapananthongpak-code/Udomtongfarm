"use client";

import { useTransition } from "react";

type Props = { action: () => Promise<void>; label: string; confirmText: string };

export default function DeleteSpeciesButton({ action, label, confirmText }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-danger"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) startTransition(action);
      }}
    >
      {label}
    </button>
  );
}
