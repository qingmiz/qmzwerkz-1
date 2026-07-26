import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const [{ data: orders }, { data: products }] = await Promise.all([
    admin.from('orders').select('id, user_id, product_id, status, created_at'),
    admin.from('products').select('id, price'),
  ]);

  const priceMap = new Map((products ?? []).map((p) => [p.id, p.price as number]));

  const completed = (orders ?? []).filter((o) => o.status === 'completed');
  const pending = (orders ?? []).filter((o) => o.status === 'pending');
  const revenue = completed.reduce((sum, o) => sum + (priceMap.get(o.product_id) ?? 0), 0);
  const uniqueCustomers = new Set((orders ?? []).map((o) => o.user_id)).size;

  // Last 14 days of completed-order revenue, for a simple sales chart.
  const days: { date: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayRevenue = completed
      .filter((o) => o.created_at.slice(0, 10) === key)
      .reduce((sum, o) => sum + (priceMap.get(o.product_id) ?? 0), 0);
    days.push({ date: key, revenue: dayRevenue });
  }

  return NextResponse.json({
    revenue,
    completedOrders: completed.length,
    pendingOrders: pending.length,
    totalProducts: (products ?? []).length,
    uniqueCustomers,
    dailyRevenue: days,
  });
}
