import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ signedIn: false, eligible: false });
  }

  const admin = createAdminClient();
  const { data: lastSpin } = await admin
    .from('wheel_spins')
    .select('created_at, next_spin_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastSpin) {
    return NextResponse.json({ signedIn: true, eligible: true });
  }

  const nextSpinAt = lastSpin.next_spin_at
    ? new Date(lastSpin.next_spin_at)
    : new Date(new Date(lastSpin.created_at).getTime() + 24 * 60 * 60 * 1000);

  const eligible = new Date() >= nextSpinAt;

  return NextResponse.json({
    signedIn: true,
    eligible,
    nextSpinAt: eligible ? null : nextSpinAt.toISOString(),
  });
}
