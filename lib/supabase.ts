// Browser-side Supabase client — safe to use in any "use client" component.
// @supabase/ssr is the modern replacement for @supabase/auth-helpers-nextjs.

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";

// Call this inside a component (not at module level) so each render
// gets a fresh client with up-to-date cookie state.
export function createBrowserClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
