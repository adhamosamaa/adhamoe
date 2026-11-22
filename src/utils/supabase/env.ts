/**
 * Public Supabase credentials. Accessed via literal `process.env.NEXT_PUBLIC_*`
 * reads so Next.js can inline them into the browser bundle.
 *
 * Supports both the new "publishable" key naming and the legacy "anon" key.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
        '(or NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local.',
    );
  }

  return { url, key };
}
