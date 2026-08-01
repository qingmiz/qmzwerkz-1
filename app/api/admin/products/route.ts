import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

// NOTE: file uploads (cover image, zip, gallery) are done directly from the
// browser to Supabase Storage - NOT sent through this route - because Vercel
// serverless functions have a hard request-size limit (~4.5MB) that most zip
// files exceed. This route only ever receives small JSON: text fields plus
// the resulting storage URLs/paths after the client has already uploaded.

function parseFields(body: any) {
  return {
    name: body.name || '',
    slug: body.slug || '',
    platform: body.platform || '',
    category: body.category || '',
    subcategory: body.subcategory || '',
    gender: body.gender || '',
    gender_detail: body.gender_detail || '',
    status: body.status || 'draft',
    short_description: body.short_description || '',
    description: body.description || '',
    price: parseFloat(body.price) || 0,
    sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
    featured: !!body.featured,
    bestseller: !!body.bestseller,
    new_release: !!body.new_release,
    free_product: !!body.free_product,
    version: body.version || '',
    changelog: body.changelog || '',
    tags: (body.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    tebex_package_id: body.tebex_package_id ? parseInt(body.tebex_package_id, 10) : null,
  };
}

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  try {
    const body = await request.json();
    const fields = parseFields(body);

    const { error: insertError } = await admin.from('products').insert([
      {
        ...fields,
        cover_image: body.cover_image || '',
        zip_file: body.zip_file || '',
        gallery_images: body.gallery_images || [],
        preview_video: body.preview_video || null,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to create product.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    const fields = parseFields(body);
    const updates: Record<string, unknown> = { ...fields };

    if (body.cover_image) updates.cover_image = body.cover_image;
    if (body.zip_file) updates.zip_file = body.zip_file;
    if (body.preview_video) updates.preview_video = body.preview_video;

    if (body.new_gallery_images && body.new_gallery_images.length > 0) {
      const { data: existing } = await admin.from('products').select('gallery_images').eq('id', id).maybeSingle();
      const existingUrls = Array.isArray(existing?.gallery_images) ? existing.gallery_images : [];
      updates.gallery_images = [...existingUrls, ...body.new_gallery_images];
    }

    const { error: updateError } = await admin.from('products').update(updates).eq('id', id);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: deleteError } = await admin.from('products').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
