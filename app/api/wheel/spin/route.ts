import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { notifyDiscordWinner } from '@/lib/discord-notify';
import { sendClaimEmail } from '@/lib/email';

const FALLBACK_PRIZES = [
  { label: '$5 OFF', weight: 15, auto_discount_amount: 5, auto_discount_percent: null },
  { label: '$10 OFF', weight: 10, auto_discount_amount: 10, auto_discount_percent: null },
  { label: '$10 Shop Credit', weight: 10, auto_discount_amount: 10, auto_discount_percent: null },
  { label: 'Mystery Freebie', weight: 8, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE Premade Tattoo', weight: 6, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE $10 Membership Access', weight: 5, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE Premade Face', weight: 5, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE Add-On', weight: 8, auto_discount_amount: null, auto_discount_percent: null },
  { label: '15% OFF', weight: 10, auto_discount_amount: null, auto_discount_percent: 15 },
  { label: 'Pink Slip (FREE Custom)', weight: 2, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE Sleeve Tattoo Add-On', weight: 5, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'FREE Face Edit', weight: 6, auto_discount_amount: null, auto_discount_percent: null },
  { label: 'BOGO 50% OFF Premades', weight: 6, auto_discount_amount: null, auto_discount_percent: null },
  { label: '$20 Shop Credit (Rare)', weight: 3, auto_discount_amount: 20, auto_discount_percent: null },
];

function generateClaimCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `QMZ-${part()}-${part()}`;
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    if (roll < item.weight) return item;
    roll -= item.weight;
  }
  return items[0];
}

export async function POST(request: Request) {
  // 1. Confirm the user is authenticated.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to spin.' }, { status: 401 });
  }

  // 2. Read the authenticated Discord user ID - never trust anything from the client body.
  const discordIdentity = user.identities?.find((i) => i.provider === 'discord');
  const discordId = discordIdentity?.id ?? (user.user_metadata?.provider_id as string | undefined);

  if (!discordId) {
    return NextResponse.json({ error: 'No Discord identity found on this account.' }, { status: 400 });
  }

  const discordUsername =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.custom_claims?.global_name as string) ||
    'Unknown';

  const admin = createAdminClient();

  // 3-4. Check the user's latest next_spin_at and reject if still on cooldown.
  const { data: lastSpin } = await admin
    .from('wheel_spins')
    .select('created_at, next_spin_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastSpin) {
    const nextSpinAt = lastSpin.next_spin_at
      ? new Date(lastSpin.next_spin_at)
      : new Date(new Date(lastSpin.created_at).getTime() + 24 * 60 * 60 * 1000);

    if (new Date() < nextSpinAt) {
      return NextResponse.json(
        { error: 'Cooldown still active.', nextSpinAt: nextSpinAt.toISOString() },
        { status: 429 }
      );
    }
  }

  // 5. Select the prize on the server.
  const { data: dbPrizes } = await admin
    .from('wheel_prizes')
    .select('label, weight, auto_discount_percent, auto_discount_amount')
    .eq('active', true);

  const pool = dbPrizes && dbPrizes.length > 0 ? dbPrizes : FALLBACK_PRIZES;
  const wonPrize = pickWeighted(pool);
  const prize = wonPrize.label;

  // 6. Generate a unique claim code (retry on the astronomically unlikely collision).
  let claimCode = generateClaimCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await admin
      .from('wheel_spins')
      .select('id')
      .eq('claim_code', claimCode)
      .maybeSingle();
    if (!existing) break;
    claimCode = generateClaimCode();
  }

  // 7-8. Save the spin result and set next_spin_at.
  const nextSpinAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const { error: insertError } = await admin.from('wheel_spins').insert({
    user_id: user.id,
    discord_id: discordId,
    discord_username: discordUsername,
    prize,
    claim_code: claimCode,
    claimed: false,
    next_spin_at: nextSpinAt.toISOString(),
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // If this prize is a discount type (flat $ or %), the claim code doubles as
  // a real, single-use promo code usable immediately at checkout - no staff
  // involvement needed. Non-monetary prizes (free items/services) still go
  // through the Discord ticket flow, since those need manual fulfillment.
  const autoDiscountPercent = (wonPrize as any).auto_discount_percent ?? null;
  const autoDiscountAmount = (wonPrize as any).auto_discount_amount ?? null;
  const autoApplied = !!(autoDiscountPercent || autoDiscountAmount);

  if (autoApplied) {
    await admin.from('promo_codes').insert({
      code: claimCode,
      discount_percent: autoDiscountPercent,
      discount_amount: autoDiscountAmount,
      max_uses: 1,
      active: true,
    });
  }

  // 9. Notify the Discord winners channel (no-ops if not configured).
  const origin = new URL(request.url).origin;
  await notifyDiscordWinner({
    discordId,
    prize,
    claimCode,
    spinUrl: `${origin}/lucky-wheel`,
  });

  if (user.email) {
    await sendClaimEmail(user.email, claimCode, prize);
  }

  // 10. Return the server-determined result.
  return NextResponse.json({ prize, claimCode, nextSpinAt: nextSpinAt.toISOString(), autoApplied });
}
