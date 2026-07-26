import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

async function uploadCover(admin: any, file: File | null) {
  if (!file) return undefined;
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await admin.storage.from('product-images').upload(fileName, file);
  if (error) throw error;
  return admin.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
}

async function uploadZip(admin: any, file: File | null) {
  if (!file) return undefined;
  const zipName = `${Date.now()}-${file.name}`;
  const { error } = await admin.storage.from('product-files').upload(zipName, file);
  if (error) throw error;
  return zipName; // private bucket path, not a public URL
}

function parseFields(form: FormData) {
  const get = (key: string) => (form.get(key) as string) || '';
  const bool = (key: string) => form.get(key) === 'true';

  return {
    name: get('name'),
    slug: get('slug'),
    platform: get('platform'),
    category: get('category'),
    subcategory: get('subcategory'),
    status: get('status'),
    short_description: get('short_description'),
    description: get('description'),
    price: parseFloat(get('price')) || 0,
    sale_price: get('sale_price') ? parseFloat(get('sale_price')) : null,
    featured: bool('featured'),
    bestseller: bool('bestseller'),
    new_release: bool('new_release'),
    free_product: bool('free_product'),
    version: get('version'),
    changelog: get('changelog'),
    tags: get('tags').split(',').map((t) => t.trim()).filter(Boolean),
    tebex_package_id: get('tebex_package_id') ? parseInt(get('tebex_package_id'), 10) : null,
  };
}

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  try {
    const form = await request.formData();
    const fields = parseFields(form);
    const coverFile = form.get('cover') as File | null;
    const zipFile = form.get('zip') as File | null;

    const cover_image = await uploadCover(admin, coverFile && coverFile.size > 0 ? coverFile : null);
    const zip_file = await uploadZip(admin, zipFile && zipFile.size > 0 ? zipFile : null);

    const { error: insertError } = await admin.from('products').insert([
      { ...fields, cover_image: cover_image ?? '', zip_file: zip_file ?? '' },
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
    const form = await request.formData();
    const id = form.get('id') as string;
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    const fields = parseFields(form);
    const coverFile = form.get('cover') as File | null;
    const zipFile = form.get('zip') as File | null;

    const cover_image = await uploadCover(admin, coverFile && coverFile.size > 0 ? coverFile : null);
    const zip_file = await uploadZip(admin, zipFile && zipFile.size > 0 ? zipFile : null);

    const updates: Record<string, unknown> = { ...fields };
    if (cover_image) updates.cover_image = cover_image;
    if (zip_file) updates.zip_file = zip_file;

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
