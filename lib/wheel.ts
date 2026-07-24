import { supabase } from './supabase';

export async function getLastSpin(userId: string) {
  return supabase
    .from('wheel_spins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
}

export async function canSpin(userId: string) {
  const { data } = await getLastSpin(userId);

  if (!data) return true;

  const lastSpin = new Date(data.created_at).getTime();
  const nextSpin = lastSpin + 24 * 60 * 60 * 1000;

  return Date.now() >= nextSpin;
}

export function generateClaimCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `QMZ-${part()}-${part()}`;
}

export async function saveSpin(
  userId: string,
  prize: string,
  claimCode: string
) {
  return supabase.from('wheel_spins').insert({
    user_id: userId,
    prize,
    claim_code: claimCode,
    claimed: false,
  });
}