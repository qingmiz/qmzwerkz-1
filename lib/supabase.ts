import { createBrowserClient } from '@supabase/ssr';

// Cookie-aware browser client - this keeps the session in sync with what the
// server sees (set during /auth/callback, refreshed by proxy.ts middleware).
// A plain @supabase/supabase-js client stores its session in localStorage
// only, which never matches the server's cookie-based session - that
// mismatch was why sign-in state only ever looked correct in ad hoc testing
// and silently failed for real visitors.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
