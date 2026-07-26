import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY client using the service role key.
// This bypasses Row Level Security - never import this into a 'use client' file
// and never expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it in Vercel → Project → Settings → Environment Variables (Supabase Dashboard → Settings → API → service_role key).'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
