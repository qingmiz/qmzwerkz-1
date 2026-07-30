import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getR2DownloadUrl } from '@/lib/r2';

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
  if (/^https?:\/\//.test(product.zip_file)) {
    return NextResponse.redirect(product.zip_file);
  }

  // Large files (>50MB) are hosted on Cloudflare R2, stored with an "r2:" prefix.
  if (product.zip_file.startsWith('r2:')) {
    const key = product.zip_file.slice(3);
    try {
      const signedUrl = await getR2DownloadUrl(key);
      return NextResponse.redirect(signedUrl);
    } catch (err: any) {
      return NextResponse.json({ error: err.message ?? 'Could not generate download link.' }, { status: 500 });
    }
  }

  // Otherwise it's a Supabase Storage path.
  const { data: signed, error } = await admin.storage
    .from('product-files')
    .createSignedUrl(product.zip_file, 60);

  if (error || !signed) {
    return NextResponse.json({ error: 'Could not generate download link.' }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
