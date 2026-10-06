import { createContext, useContext } from "react";

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: "member" | "admin";
  created_at: string;
};

export type SessionState = {
  /** "loading" until the browser has checked for a session and read the member's profile. */
  status: "loading" | "anon" | "member";
  profile: Profile | null;
  favorites: ReadonlySet<string>;
  /** Saves or removes a species. Resolves to false when the change could not be stored. */
  toggleFavorite: (speciesId: string) => Promise<boolean>;
  /** Sends the visitor to Google, which sends them back to `next`. Resolves to false if it could not start. */
  signInWithGoogle: (next: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<boolean>;
  /** Permanently removes the member's account and saved list. */
  deleteAccount: () => Promise<boolean>;
};

export const SessionContext = createContext<SessionState>({
  status: "anon",
  profile: null,
  favorites: new Set(),
  toggleFavorite: async () => false,
  signInWithGoogle: async () => false,
  signOut: async () => {},
  updateDisplayName: async () => false,
  deleteAccount: async () => false,
});

export const useSession = () => useContext(SessionContext);
