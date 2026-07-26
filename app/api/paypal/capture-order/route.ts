import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { capturePayPalOrder } from '@/lib/paypal';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { incrementPromoUsage } from '@/lib/promo';

export async function POST(request: Request) {
  try {
    const { paypalOrderId } = (await request.json()) as { paypalOrderId: string };

    if (!paypalOrderId) {
      return NextResponse.json({ error: 'paypalOrderId is required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
    }

    const capture = await capturePayPalOrder(paypalOrderId);

    const status = capture?.status;
    if (status !== 'COMPLETED') {
      return NextResponse.json({ error: `Payment not completed (status: ${status}).` }, { status: 402 });
    }

    const admin = createAdminClient();

    // Only mark orders completed if they belong to this user and this PayPal order -
    // never trust the client to say which product IDs were paid for.
    const { data: updatedOrders, error: updateError } = await admin
      .from('orders')
      .update({ status: 'completed' })
      .eq('paypal_order_id', paypalOrderId)
      .eq('user_id', user.id)
      .select('product_id, promo_code');

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (updatedOrders && updatedOrders.length > 0) {
      const promoCode = updatedOrders.find((o) => o.promo_code)?.promo_code;
      if (promoCode) await incrementPromoUsage(promoCode);

      if (user.email) {
        const { data: products } = await admin
          .from('products')
          .select('name, price')
          .in('id', updatedOrders.map((o) => o.product_id));

        if (products) {
          const total = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
          await sendOrderConfirmationEmail(user.email, products, total);
        }
      }
    }

    return NextResponse.json({
      success: true,
      productIds: (updatedOrders ?? []).map((o) => o.product_id),
    });
  } catch (err: any) {
    console.error('PayPal capture-order error:', err);
    return NextResponse.json({ error: err.message ?? 'Payment capture failed.' }, { status: 500 });
  }
}
