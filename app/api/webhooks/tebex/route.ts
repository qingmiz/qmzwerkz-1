import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { verifyTebexWebhookSignature } from '@/lib/tebex';

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
    const transactionId: string | undefined = event.subject?.transaction_id ?? event.subject?.id;

    if (orderIds.length > 0) {
      const admin = createAdminClient();

      await admin
        .from('orders')
        .update({ status: 'completed', tebex_transaction_id: transactionId })
        .in('id', orderIds);
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
