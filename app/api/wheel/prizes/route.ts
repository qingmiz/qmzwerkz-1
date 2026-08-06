import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// Default prizes used only if the wheel_prizes table doesn't exist yet or is empty -
// keeps the wheel working before the admin has configured anything.
const FALLBACK_PRIZES = [
  { label: '$5 OFF', icon: '🎉', description: 'Discount code for a future purchase.' },
  { label: '$10 OFF', icon: '💸', description: 'Discount code for a future purchase.' },
  { label: '$10 Shop Credit', icon: '💰', description: '$10 credit toward any purchase in the shop.' },
  { label: 'Mystery Freebie', icon: '🎁', description: 'A surprise free item.' },
  { label: 'FREE Premade Tattoo', icon: '✨', description: 'One free premade tattoo.' },
  { label: 'FREE $10 Membership Access', icon: '💎', description: '$10 worth of membership access, free.' },
  { label: 'FREE Premade Face', icon: '🎭', description: 'One free premade face.' },
  { label: 'FREE Add-On', icon: '➕', description: 'Free add-on - tattoo, makeup, etc.' },
  { label: '15% OFF', icon: '🛍️', description: 'Discount code for a future purchase.' },
  { label: 'Pink Slip (FREE Custom)', icon: '🎟️', description: 'One free custom order.' },
  { label: 'FREE Sleeve Tattoo Add-On', icon: '🖤', description: 'One free sleeve tattoo add-on.' },
  { label: 'FREE Face Edit', icon: '🎨', description: 'One free face edit.' },
  { label: 'BOGO 50% OFF Premades', icon: '🎊', description: 'Buy one premade, get one 50% off.' },
  { label: '$20 Shop Credit (Rare)', icon: '💵', description: '$20 credit toward any purchase in the shop.' },
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
