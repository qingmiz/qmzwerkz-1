import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

// Verifies the current request's session belongs to a real admin.
// Use at the top of every /api/admin/* route - the client-side layout guard
// is UX only, this is the actual security boundary.
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, error: 'Not signed in.' as const };
  }

  const admin = createAdminClient();
  const { data: adminRow } = await admin
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return { user: null, error: 'Not an admin.' as const };
  }

  return { user, admin, error: null };
}
