import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data, error: dbError } = await admin
    .from('wheel_spins')
    .select('id, discord_username, discord_id, prize, claim_code, claimed, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ spins: data });
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { id, claimed } = await request.json();
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: updateError } = await admin.from('wheel_spins').update({ claimed }).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
