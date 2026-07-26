'use client';

import { supabase } from '@/lib/supabase';

// Wraps fetch() for /api/admin/* routes, automatically attaching the current
// session's access token as a Bearer header - this is what requireAdmin() on
// the server checks. Use this instead of plain fetch() for any admin API call.
export async function adminFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(url, { ...options, headers });
}
