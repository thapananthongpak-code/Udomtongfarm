"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { localePath, type Locale } from "@/i18n";
import { useSession } from "@/components/SessionProvider";

type Props = {
  speciesId: string;
  lang: Locale;
  labels: { save: string; saved: string; signInToSave: string };
};

/** Saves a species to the member's list. Visitors who are not signed in are sent to sign in first. */
export default function FavoriteButton({ speciesId, lang, labels }: Props) {
  const { status, favorites, toggleFavorite } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const saved = favorites.has(speciesId);

  async function onClick() {
    if (status !== "member") {
      router.push(`${localePath(lang, "/login")}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    await toggleFavorite(speciesId);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || status === "loading"}
      aria-pressed={saved}
      title={status === "anon" ? labels.signInToSave : undefined}
      className={`btn ${saved ? "btn-primary" : ""}`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.25">
        <path d="M3.5 2h9v12L8 10.6 3.5 14V2Z" strokeLinejoin="round" />
      </svg>
      {saved ? labels.saved : labels.save}
    </button>
  );
}
