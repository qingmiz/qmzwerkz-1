import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data: orders, error: ordersError } = await admin
    .from('orders')
    .select('user_id, product_id, status, created_at');

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  const { data: products } = await admin.from('products').select('id, price');
  const priceMap = new Map<string, number>((products ?? []).map((p) => [p.id, p.price as number]));

  const byUser = new Map<
    string,
    { orderCount: number; spent: number; firstOrder: string }
  >();

  for (const o of orders ?? []) {
    const entry = byUser.get(o.user_id) ?? { orderCount: 0, spent: 0, firstOrder: o.created_at };
    entry.orderCount += 1;
    if (o.status === 'completed') entry.spent += priceMap.get(o.product_id) ?? 0;
    if (new Date(o.created_at) < new Date(entry.firstOrder)) entry.firstOrder = o.created_at;
    byUser.set(o.user_id, entry);
  }

  const userIds = [...byUser.keys()];

  const customers = await Promise.all(
    userIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      const stats = byUser.get(id)!;
      return {
        id,
        name: (data?.user?.user_metadata?.full_name as string) || data?.user?.email || id,
        email: data?.user?.email ?? '-',
        orderCount: stats.orderCount,
        spent: stats.spent,
        joined: data?.user?.created_at ?? stats.firstOrder,
      };
    })
  );

  customers.sort((a, b) => b.spent - a.spent);

  return NextResponse.json({ customers });
}
