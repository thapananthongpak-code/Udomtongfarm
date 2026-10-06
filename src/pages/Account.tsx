import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageLoading from "@/components/PageLoading";
import SpeciesCard from "@/components/species/SpeciesCard";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";
import { useSession } from "@/state/session";

export default function Account() {
  const lang = useLang();
  const dict = useT();
  const t = dict.account;
  const navigate = useNavigate();
  const { status, profile, favorites, toggleFavorite, signOut } = useSession();
  const data = useData();
  usePageMeta(t.title);

  if (status === "loading" || data.status === "loading") return <PageLoading />;
  if (status === "anon" || !profile) {
    return <Navigate to={`${localePath(lang, "/login")}?next=${encodeURIComponent(localePath(lang, "/account"))}`} replace />;
  }

  const saved = data.species.filter((sp) => favorites.has(sp.id));

  async function leave() {
    await signOut();
    navigate(localePath(lang));
  }

  return (
    <div className="shell pb-8 pt-14 md:pt-20">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-4 text-4xl md:text-5xl">{profile.display_name || t.title}</h1>
          <p className="mt-3 text-[0.9375rem] text-muted">{format(t.signedInAs, { email: profile.email })}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.role === "admin" && (
            <Link to={localePath(lang, "/admin")} className="btn btn-primary">
              {t.adminLink}
            </Link>
          )}
          <button type="button" onClick={leave} className="btn btn-quiet">
            {t.signOut}
          </button>
        </div>
      </header>

      <section className="mt-14 border-t border-ink pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.savedTitle}</h2>
        <div className="mt-8">
          {saved.length === 0 ? (
            <div className="border-t border-line py-10">
              <p className="text-muted">{t.savedEmpty}</p>
              <Link to={localePath(lang, "/collection")} className="btn mt-5">
                {t.savedEmptyCta}
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {saved.map((sp) => (
                <li key={sp.id}>
                  <SpeciesCard species={sp} />
                  <button type="button" onClick={() => toggleFavorite(sp.id)} className="link mt-2 text-[0.8125rem] text-muted">
                    {t.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-16 border-t border-ink pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.profileTitle}</h2>
        <div className="mt-6">
          <ProfileForm key={profile.display_name} />
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.dangerTitle}</h2>
        <p className="mt-3 max-w-md text-[0.9375rem] text-muted">{t.dangerBody}</p>
        <div className="mt-5">
          <DeleteAccount />
        </div>
      </section>
    </div>
  );
}

function ProfileForm() {
  const t = useT().account;
  const { profile, updateDisplayName } = useSession();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [result, setResult] = useState<"idle" | "busy" | "saved" | "error">("idle");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 80);
    if (!trimmed) return setResult("error");
    setResult("busy");
    setResult((await updateDisplayName(trimmed)) ? "saved" : "error");
  }

  return (
    <form onSubmit={save} className="max-w-sm">
      <label htmlFor="display_name" className="field-label">
        {t.displayName}
      </label>
      <div className="flex gap-3">
        <input
          id="display_name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          autoComplete="name"
          required
          className="input"
        />
        <button type="submit" className="btn" disabled={result === "busy"}>
          {t.saveProfile}
        </button>
      </div>
      <p aria-live="polite" className={result === "error" ? "field-error" : "field-hint"}>
        {result === "saved" && t.profileSaved}
        {result === "error" && t.profileError}
      </p>
    </form>
  );
}

function DeleteAccount() {
  const lang = useLang();
  const dict = useT();
  const t = dict.account;
  const navigate = useNavigate();
  const { deleteAccount } = useSession();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button type="button" className="btn btn-danger" onClick={() => setOpen(true)}>
        {t.deleteCta}
      </button>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (confirm.trim() !== "DELETE") return setProblem(t.deleteMismatch);
    setBusy(true);
    if (await deleteAccount()) return navigate(localePath(lang));
    setProblem(dict.auth.messages.unknown);
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="max-w-sm">
      <label htmlFor="confirm-delete" className="field-label">
        {t.deleteConfirm}
      </label>
      <input
        id="confirm-delete"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        aria-invalid={problem ? true : undefined}
        required
        className="input"
      />
      {problem && <p className="field-error">{problem}</p>}
      <div className="mt-4 flex gap-3">
        <button type="submit" className="btn btn-danger" disabled={busy}>
          {t.deleteSubmit}
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setOpen(false)}>
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
