import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// Public, read-only site stats used for on-site social proof (the Client
// Reviews section's stats row). Only ever returns aggregate counts - no
// emails, names, order contents, or revenue figures - so this is safe to
// leave unauthenticated, unlike the /api/admin/* stats routes.
export async function GET() {
  try {
    const admin = createAdminClient();

    const [{ count: productsDelivered }, { data: completedOrders }] = await Promise.all([
      admin.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      admin.from('orders').select('user_id').eq('status', 'completed'),
    ]);

    const happyClients = new Set((completedOrders ?? []).map((o) => o.user_id)).size;

    return NextResponse.json({
      productsDelivered: productsDelivered ?? 0,
      happyClients,
    });
  } catch (err: any) {
    console.error('stats error:', err);
    // Fail soft - the stats row simply hides itself on the client rather
    // than showing a broken 0/0 or an error to visitors.
    return NextResponse.json({ productsDelivered: 0, happyClients: 0, error: true }, { status: 200 });
  }
}
