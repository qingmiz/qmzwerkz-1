import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// Verifies admin status server-side using the service role key, so this
// check is never affected by whatever Row Level Security policies (or lack
// thereof) exist on admin_users. Takes the access_token from the client's
// just-completed signInWithPassword call and resolves the real user from it.
export async function POST(request: Request) {
  const { accessToken } = await request.json();

  if (!accessToken) {
    return NextResponse.json({ isAdmin: false, error: 'Missing access token.' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: { user }, error: userError } = await admin.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ isAdmin: false, error: 'Invalid session.' }, { status: 401 });
  }

  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  return NextResponse.json({ isAdmin: !!adminRow });
}
