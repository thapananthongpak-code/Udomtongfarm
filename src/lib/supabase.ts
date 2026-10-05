import { createClient } from "@supabase/supabase-js";

// Both values are public: access is controlled by row level security in the database.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The Supabase client, or null until the two settings are filled in.
 * Without it the site runs on the bundled data, and sign-in and the admin dashboard are switched off.
 */
export const supabase = url && key ? createClient(url, key, { auth: { flowType: "pkce" } }) : null;

export const isSupabaseConfigured = supabase !== null;

export const SPECIES_BUCKET = "species";

/** Where uploaded photographs live, used to check an image address before saving it. */
export const STORAGE_PREFIX = url ? `${url}/storage/v1/object/public/${SPECIES_BUCKET}/` : null;
