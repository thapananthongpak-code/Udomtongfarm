import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteAccount from "@/components/account/DeleteAccount";
import ProfileForm from "@/components/account/ProfileForm";
import SavedList from "@/components/account/SavedList";
import { format, getDictionary, isLocale, localePath } from "@/i18n";
import { requireProfile } from "@/lib/auth";
import { toCardData, type Species } from "@/lib/species/types";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";
import { deleteAccount, updateProfile } from "./actions";

// Depends on who is signed in, so it is never prerendered.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).account.title, robots: { index: false } };
}

export default async function AccountPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const profile = await requireProfile(lang, "/account");
  const dict = getDictionary(lang);
  const t = dict.account;

  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("favorites").select("species (*)").order("created_at", { ascending: false })
    : { data: null };
  const saved = ((data ?? []) as unknown as { species: Species | null }[])
    .map((row) => row.species)
    .filter((sp): sp is Species => sp !== null && sp.published)
    .map(toCardData);

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
            <Link href={localePath(lang, "/admin")} className="btn btn-primary">
              {t.adminLink}
            </Link>
          )}
          <form action={signOut.bind(null, lang)}>
            <button type="submit" className="btn btn-quiet">
              {t.signOut}
            </button>
          </form>
        </div>
      </header>

      <section className="mt-14 border-t border-ink pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.savedTitle}</h2>
        <div className="mt-8">
          <SavedList
            items={saved}
            lang={lang}
            statusLabels={dict.status}
            labels={{ empty: t.savedEmpty, emptyCta: t.savedEmptyCta, remove: t.remove }}
            collectionHref={localePath(lang, "/collection")}
          />
        </div>
      </section>

      <section className="mt-16 border-t border-ink pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.profileTitle}</h2>
        <div className="mt-6">
          <ProfileForm
            action={updateProfile.bind(null, lang)}
            displayName={profile.display_name}
            labels={{ displayName: t.displayName, save: t.saveProfile, saved: t.profileSaved, error: t.profileError }}
          />
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-8">
        <h2 className="display text-2xl md:text-3xl">{t.dangerTitle}</h2>
        <p className="mt-3 max-w-md text-[0.9375rem] text-muted">{t.dangerBody}</p>
        <div className="mt-5">
          <DeleteAccount
            action={deleteAccount.bind(null, lang)}
            labels={{
              open: t.deleteCta,
              confirm: t.deleteConfirm,
              submit: t.deleteSubmit,
              mismatch: t.deleteMismatch,
              cancel: t.cancel,
            }}
          />
        </div>
      </section>
    </div>
  );
}
