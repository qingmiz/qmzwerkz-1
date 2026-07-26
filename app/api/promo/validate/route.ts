import { NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/promo';

export async function POST(request: Request) {
  const { code } = await request.json();
  const result = await validatePromoCode(code);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
