import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data: orders, error: ordersError } = await admin
    .from('orders')
    .select('id, user_id, product_id, status, payment_method, tebex_transaction_id, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const productIds = [...new Set((orders ?? []).map((o) => o.product_id))];
  const userIds = [...new Set((orders ?? []).map((o) => o.user_id))];

  const { data: products } = await admin
    .from('products')
    .select('id, name, price')
    .in('id', productIds.length ? productIds : ['00000000-0000-0000-0000-000000000000']);

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  const userMap = new Map<string, string>();
  await Promise.all(
    userIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      if (data?.user) {
        userMap.set(
          id,
          (data.user.user_metadata?.full_name as string) || data.user.email || id
        );
      }
    })
  );

  const enriched = (orders ?? []).map((o) => ({
    ...o,
    product_name: productMap.get(o.product_id)?.name ?? 'Unknown product',
    amount: productMap.get(o.product_id)?.price ?? null,
    customer: userMap.get(o.user_id) ?? o.user_id,
  }));

  return NextResponse.json({ orders: enriched });
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin();
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { orderId, status } = await request.json();

  if (!orderId || !status) {
    return NextResponse.json({ error: 'orderId and status are required.' }, { status: 400 });
  }

  const { error: updateError } = await admin.from('orders').update({ status }).eq('id', orderId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
