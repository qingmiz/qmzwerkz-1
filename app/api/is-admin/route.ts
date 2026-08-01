import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

// Lightweight check used only to adjust UI copy (e.g. "Admin Preview" vs
// "Download") - the actual security gate lives in /api/download, this
// endpoint has no bearing on access itself.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ isAdmin: false });

  const admin = createAdminClient();
  const { data } = await admin.from('admin_users').select('id').eq('id', user.id).maybeSingle();

  return NextResponse.json({ isAdmin: !!data });
}
