import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

// Only issues a download link if the signed-in user has a completed order
// for this product (or is an admin). The zip bucket itself should be PRIVATE
// in Supabase Storage - this route is the only legitimate way to reach a file.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to download this product.' }, { status: 401 });
  }

  const admin = createAdminClient();

  const [{ data: order }, { data: admin_user }, { data: product }] = await Promise.all([
    admin
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .limit(1)
      .maybeSingle(),
    admin.from('admin_users').select('id').eq('id', user.id).maybeSingle(),
    admin.from('products').select('zip_file').eq('id', productId).maybeSingle(),
  ]);

  if (!order && !admin_user) {
    return NextResponse.json({ error: 'You have not purchased this product.' }, { status: 403 });
  }

  if (!product?.zip_file) {
    return NextResponse.json({ error: 'No file is attached to this product.' }, { status: 404 });
  }

  // Backwards-compat: older products may have a full public URL stored.
  // New uploads store just the storage path (see admin/marketplace).
  if (/^https?:\/\//.test(product.zip_file)) {
    return NextResponse.redirect(product.zip_file);
  }

  const { data: signed, error } = await admin.storage
    .from('product-files')
    .createSignedUrl(product.zip_file, 60);

  if (error || !signed) {
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
