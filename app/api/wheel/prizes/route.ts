import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// Default prizes used only if the wheel_prizes table doesn't exist yet or is empty -
// keeps the wheel working before the admin has configured anything.
const FALLBACK_PRIZES = [
  { label: 'FREE Head', icon: '🆓', description: 'One free premade or custom head.' },
  { label: '$5 Store Credit', icon: '💵', description: '$5 credit toward any purchase in the shop.' },
  { label: '10% OFF', icon: '🏷️', description: 'Discount code for a future purchase.' },
  { label: 'Random Tattoo', icon: '🖋️', description: 'One random tattoo from the collection.' },
  { label: 'FREE Clothing', icon: '👕', description: 'One free clothing item or clothing pack.' },
  { label: 'Premium Skin', icon: '⭐', description: 'A premium premade skin.' },
  { label: 'Weapon Pack', icon: '🔫', description: 'One custom weapon pack.' },
  { label: 'JACKPOT', icon: '🎉', description: 'The grand prize.' },
];

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('wheel_prizes')
      .select('id, label, icon, description, weight')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ prizes: FALLBACK_PRIZES, source: 'fallback' });
    }

    return NextResponse.json({ prizes: data, source: 'database' });
  } catch {
    return NextResponse.json({ prizes: FALLBACK_PRIZES, source: 'fallback' });
  }
}
