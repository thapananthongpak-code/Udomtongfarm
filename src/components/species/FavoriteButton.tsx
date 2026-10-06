import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { useSession } from "@/state/session";

/** Saves a species to the member's list. Visitors who are not signed in are sent to sign in first. */
export default function FavoriteButton({ speciesId }: { speciesId: string }) {
  const lang = useLang();
  const labels = useT().species;
  const { status, favorites, toggleFavorite } = useSession();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [busy, setBusy] = useState(false);
  const saved = favorites.has(speciesId);

  async function onClick() {
    if (status !== "member") {
      navigate(`${localePath(lang, "/login")}?next=${encodeURIComponent(pathname)}`);
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
