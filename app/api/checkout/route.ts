import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createBasket, addPackageToBasket } from '@/lib/tebex';

// Starts a real Tebex checkout for the items in the user's cart.
// Expects: { productIds: string[] }
export async function POST(request: Request) {
  try {
    const { productIds } = (await request.json()) as { productIds: string[] };

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'No items provided.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to check out.' }, { status: 401 });
    }

    // Look up authoritative product data server-side - never trust client-sent prices/ids.
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price, tebex_package_id')
      .in('id', productIds);

    if (productError || !products || products.length === 0) {
      return NextResponse.json({ error: 'Could not find those products.' }, { status: 400 });
    }

    const missingPackage = products.filter((p) => !p.tebex_package_id);
    if (missingPackage.length > 0) {
      return NextResponse.json(
        {
          error: `These products aren't linked to a Tebex package yet: ${missingPackage
            .map((p) => p.name)
            .join(', ')}. Add a Tebex Package ID in the admin marketplace editor first.`,
        },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: orders, error: orderError } = await admin
      .from('orders')
      .insert(
        products.map((p) => ({
          user_id: user.id,
          product_id: p.id,
          status: 'pending',
          payment_method: 'tebex',
        }))
      )
      .select('id, product_id');

    if (orderError || !orders) {
      return NextResponse.json({ error: 'Could not create your order. Please try again.' }, { status: 500 });
    }

    const origin = new URL(request.url).origin;

    const basket = await createBasket({
      completeUrl: `${origin}/cart?status=complete`,
      cancelUrl: `${origin}/cart?status=cancelled`,
      custom: {
        orderIds: orders.map((o) => o.id),
        userId: user.id,
      },
    });

    let checkoutUrl = basket.links.checkout;

    for (const product of products) {
      const result = await addPackageToBasket(basket.ident, product.tebex_package_id as number, 1);
      checkoutUrl = result.links.checkout || checkoutUrl;
    }

    if (!checkoutUrl) {
      return NextResponse.json({ error: 'Tebex did not return a checkout link.' }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message ?? 'Checkout failed.' }, { status: 500 });
  }
}
