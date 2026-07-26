import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) return NextResponse.json({ error: 'productId is required.' }, { status: 400 });

  const admin = createAdminClient();

  const { data: reviews, error } = await admin
    .from('reviews')
    .select('id, user_id, rating, comment, created_at, reviewer_name')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const average = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return NextResponse.json({ reviews: reviews ?? [], average, count: reviews?.length ?? 0 });
}

export async function POST(request: Request) {
  try {
    const { productId, rating, comment } = (await request.json()) as {
      productId: string;
      rating: number;
      comment: string;
    };

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'A product and a 1-5 star rating are required.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Sign in to leave a review.' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Only verified purchasers can review - checked server-side, not trusted from the client.
    const { data: order } = await admin
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .limit(1)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: 'Only verified purchasers can leave a review.' }, { status: 403 });
    }

    const { data: existing } = await admin
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    const reviewerName =
      (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || 'Verified Buyer';

    if (existing) {
      const { error } = await admin
        .from('reviews')
        .update({ rating, comment, reviewer_name: reviewerName })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        rating,
        comment,
        reviewer_name: reviewerName,
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to submit review.' }, { status: 500 });
  }
}
