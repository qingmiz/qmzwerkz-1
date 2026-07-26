import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';

export async function GET(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { data, error: dbError } = await admin
    .from('portfolio_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  try {
    const form = await request.formData();
    const title = form.get('title') as string;
    const description = form.get('description') as string;
    const linkUrl = form.get('link_url') as string;
    const image = form.get('image') as File | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    let image_url: string | undefined;

    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await admin.storage.from('portfolio-images').upload(fileName, image);
      if (uploadError) throw uploadError;
      image_url = admin.storage.from('portfolio-images').getPublicUrl(fileName).data.publicUrl;
    }

    const { data: existing } = await admin.from('portfolio_items').select('id').order('sort_order', { ascending: false }).limit(1);
    const nextSortOrder = existing && existing.length > 0 ? undefined : 0;

    const { error: insertError } = await admin.from('portfolio_items').insert({
      title,
      description: description || '',
      link_url: linkUrl || null,
      image_url: image_url || null,
      active: true,
      sort_order: nextSortOrder ?? Date.now(),
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to add project.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: updateError } = await admin.from('portfolio_items').update(updates).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireAdmin(request);
  if (error || !admin) return NextResponse.json({ error }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const { error: deleteError } = await admin.from('portfolio_items').delete().eq('id', id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
