import { createAdminClient } from '@/lib/supabase-admin';

// Verifies the request belongs to a real admin, using a Bearer access token
// sent in the Authorization header (see lib/admin-fetch.ts on the client side).
// We use a token, not cookies, because admin email/password sign-in stores
// its session in localStorage, not cookies - so a cookie-based check would
// never see it.
export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { user: null, admin: null, error: 'Not signed in.' as const };
  }

  const admin = createAdminClient();
  const { data: { user }, error: userError } = await admin.auth.getUser(token);

  if (userError || !user) {
    return { user: null, admin: null, error: 'Not signed in.' as const };
  }

  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return { user: null, admin: null, error: 'Not an admin.' as const };
  }

  return { user, admin, error: null };
}
