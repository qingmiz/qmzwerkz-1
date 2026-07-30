import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getR2UploadUrl } from '@/lib/r2';

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return NextResponse.json({ error }, { status: 403 });

  try {
    const { fileName, contentType } = await request.json();
    if (!fileName) return NextResponse.json({ error: 'fileName is required.' }, { status: 400 });

    const key = `products/${Date.now()}-${fileName}`;
    const uploadUrl = await getR2UploadUrl(key, contentType || 'application/zip');

    return NextResponse.json({ uploadUrl, key });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Could not create upload URL.' }, { status: 500 });
  }
}
