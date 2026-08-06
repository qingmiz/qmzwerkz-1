import { createAdminClient } from '@/lib/supabase-admin';

export async function validatePromoCode(code: string) {
  if (!code) return { valid: false, error: 'No code provided.' };

  const admin = createAdminClient();

  const { data: promo } = await admin
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .maybeSingle();

  if (!promo) return { valid: false, error: 'Invalid promo code.' };

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { valid: false, error: 'This promo code has expired.' };
  }

  if (promo.max_uses && promo.uses_count >= promo.max_uses) {
    return { valid: false, error: 'This promo code has reached its usage limit.' };
  }

  return {
    valid: true,
    discountPercent: promo.discount_percent as number | null,
    discountAmount: promo.discount_amount as number | null,
    code: promo.code as string,
  };
}

// Applies a validated promo (percent OR flat amount) to a subtotal, floored at 0.
export function applyPromoDiscount(
  subtotal: number,
  promo: { discountPercent: number | null; discountAmount: number | null }
) {
  let discount = 0;
  if (promo.discountPercent) discount = subtotal * (promo.discountPercent / 100);
  else if (promo.discountAmount) discount = promo.discountAmount;
  return Math.max(0, subtotal - Math.min(discount, subtotal));
}

export async function incrementPromoUsage(code: string) {
  const admin = createAdminClient();
  const { data: promo } = await admin.from('promo_codes').select('id, uses_count').eq('code', code).maybeSingle();
  if (promo) {
    await admin.from('promo_codes').update({ uses_count: (promo.uses_count || 0) + 1 }).eq('id', promo.id);
  }
}
