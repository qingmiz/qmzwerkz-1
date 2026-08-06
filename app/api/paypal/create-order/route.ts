import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createPayPalOrder } from '@/lib/paypal';
import { validatePromoCode, applyPromoDiscount } from '@/lib/promo';

export async function POST(request: Request) {
  try {
    const { productIds, promoCode, cfxUsername } = (await request.json()) as {
      productIds: string[];
      promoCode?: string;
      cfxUsername?: string;
    };

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No items provided.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to check out.' }, { status: 401 });
    }

    // Look up authoritative prices server-side - never trust client-sent amounts.
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (productError || !products || products.length === 0) {
      return NextResponse.json({ error: 'Could not find those products.' }, { status: 400 });
    }

    let total = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

    let validPromoCode: string | null = null;
    if (promoCode) {
      const result = await validatePromoCode(promoCode);
      if (result.valid) {
        validPromoCode = result.code!;
        total = applyPromoDiscount(total, {
          discountPercent: result.discountPercent ?? null,
          discountAmount: result.discountAmount ?? null,
        });
      }
    }

    const admin = createAdminClient();

    const { data: orders, error: orderError } = await admin
      .from('orders')
      .insert(
        products.map((p) => ({
          user_id: user.id,
          product_id: p.id,
          status: 'pending',
          payment_method: 'paypal',
          promo_code: validPromoCode,
          cfx_username: cfxUsername || null,
        }))
      )
      .select('id');

    if (orderError || !orders) {
      return NextResponse.json({ error: 'Could not create your order. Please try again.' }, { status: 500 });
    }

    const referenceId = orders.map((o) => o.id).join(',');

    const paypalOrder = await createPayPalOrder(total, referenceId);

    // Tag our pending orders with the PayPal order id so capture can find them again.
    await admin
      .from('orders')
      .update({ paypal_order_id: paypalOrder.id })
      .in('id', orders.map((o) => o.id));

    return NextResponse.json({ paypalOrderId: paypalOrder.id });
  } catch (err: any) {
    console.error('PayPal create-order error:', err);
    return NextResponse.json({ error: err.message ?? 'Checkout failed.' }, { status: 500 });
  }
}
