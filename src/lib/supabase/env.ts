// Supabase connection settings. Both values are public: access is controlled by row level security.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseEnv = url && key ? { url, key } : null;

/** False until the Supabase values are set. The site then runs on the bundled data, without accounts. */
export const isSupabaseConfigured = supabaseEnv !== null;

export const SPECIES_BUCKET = "species";
