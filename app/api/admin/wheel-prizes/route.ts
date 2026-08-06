import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data, error: dbError } = await admin
    .from('wheel_prizes')
    .select('*')
    .order('sort_order', { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ prizes: data });
}

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { label, icon, description, weight, sortOrder, autoDiscountPercent, autoDiscountAmount } = await request.json();

  if (!label || !weight) {
    return NextResponse.json({ error: 'label and weight are required.' }, { status: 400 });
  }

  const { error: insertError } = await admin.from('wheel_prizes').insert({
    label,
    icon: icon || '🎁',
    description: description || null,
    weight,
    sort_order: sortOrder ?? 0,
    active: true,
    auto_discount_percent: autoDiscountPercent || null,
    auto_discount_amount: autoDiscountAmount || null,
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: updateError } = await admin.from('wheel_prizes').update(updates).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: deleteError } = await admin.from('wheel_prizes').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
