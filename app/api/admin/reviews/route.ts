import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data: reviews, error: dbError } = await admin
    .from('reviews')
    .select('id, product_id, rating, comment, reviewer_name, created_at')
    .order('created_at', { ascending: false });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  const productIds = [...new Set((reviews ?? []).map((r) => r.product_id))];
  const { data: products } = await admin
    .from('products')
    .select('id, name')
    .in('id', productIds.length ? productIds : ['00000000-0000-0000-0000-000000000000']);

  const productMap = new Map((products ?? []).map((p) => [p.id, p.name]));

  const enriched = (reviews ?? []).map((r) => ({
    ...r,
    product_name: productMap.get(r.product_id) ?? 'Unknown product',
  }));

  return NextResponse.json({ reviews: enriched });
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: deleteError } = await admin.from('reviews').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
