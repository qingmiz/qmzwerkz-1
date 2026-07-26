import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { verifyTebexWebhookSignature } from '@/lib/tebex';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { incrementPromoUsage } from '@/lib/promo';

// Tebex sends events here (configure at Tebex dashboard -> Webhooks -> Endpoints).
// We only trust this payload after verifying the X-Tebex-Signature HMAC.
// Docs: https://docs.tebex.io/developers/webhooks/overview
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-tebex-signature');

  let valid = false;
  try {
    valid = verifyTebexWebhookSignature(rawBody, signature);
  } catch (err: any) {
    console.error('Webhook signature check failed to run:', err.message);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Tebex sends a one-time validation webhook when you first add the endpoint.
  if (event.type === 'validation.webhook') {
    return NextResponse.json({ id: event.id }, { status: 200 });
  }

  if (event.type === 'payment.completed') {
    const custom = event.subject?.custom ?? event.subject?.basket?.custom ?? {};
    const orderIds: string[] = custom.orderIds ?? [];
    const userId: string | undefined = custom.userId;
    const transactionId: string | undefined = event.subject?.transaction_id ?? event.subject?.id;

    if (orderIds.length > 0) {
      const admin = createAdminClient();

      const { data: completedOrders } = await admin
        .from('orders')
        .update({ status: 'completed', tebex_transaction_id: transactionId })
        .in('id', orderIds)
        .select('product_id, promo_code');

      if (completedOrders && completedOrders.length > 0) {
        const promoCode = completedOrders.find((o) => o.promo_code)?.promo_code;
        if (promoCode) await incrementPromoUsage(promoCode);

        const { data: products } = await admin
          .from('products')
          .select('name, price')
          .in('id', completedOrders.map((o) => o.product_id));

        if (userId) {
          const { data: userData } = await admin.auth.admin.getUserById(userId);
          if (userData?.user?.email && products) {
            const total = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
            await sendOrderConfirmationEmail(userData.user.email, products, total);
          }
        }
      }
    }
  }

  if (event.type === 'payment.declined') {
    const custom = event.subject?.custom ?? {};
    const orderIds: string[] = custom.orderIds ?? [];

    if (orderIds.length > 0) {
      const admin = createAdminClient();
      await admin.from('orders').update({ status: 'declined' }).in('id', orderIds);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
