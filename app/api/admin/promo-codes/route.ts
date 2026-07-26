import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data, error: dbError } = await admin
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ promoCodes: data });
}

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const body = await request.json();
  const { code, discountPercent, maxUses, expiresAt } = body;

  if (!code || !discountPercent) {
    return NextResponse.json({ error: 'code and discountPercent are required.' }, { status: 400 });
  }

  const { error: insertError } = await admin.from('promo_codes').insert({
    code: code.toUpperCase().trim(),
    discount_percent: discountPercent,
    max_uses: maxUses || null,
    uses_count: 0,
    expires_at: expiresAt || null,
    active: true,
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { id, active } = await request.json();
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: updateError } = await admin.from('promo_codes').update({ active }).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: deleteError } = await admin.from('promo_codes').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
