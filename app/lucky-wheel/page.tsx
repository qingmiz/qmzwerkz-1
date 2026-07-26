'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { canSpin, generateClaimCode, saveSpin, getLastSpin } from '@/lib/wheel';
import PrizeWheel, { WHEEL_PRIZES } from '@/components/lucky-wheel/PrizeWheel';
import type { User } from '@supabase/supabase-js';

function pickPrizeIndex() {
  return Math.floor(Math.random() * WHEEL_PRIZES.length);
}

export default function LuckyWheelPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [result, setResult] = useState<{ prize: string; claimCode: string } | null>(null);
  const [nextSpinAt, setNextSpinAt] = useState<Date | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const able = await canSpin(user.id);
        setEligible(able);

        if (!able) {
          const { data } = await getLastSpin(user.id);
          if (data) {
            setNextSpinAt(new Date(new Date(data.created_at).getTime() + 24 * 60 * 60 * 1000));
          }
        }
      }

      setLoadingUser(false);
    }
    init();
  }, []);

  const handleSpin = async () => {
    if (!user || spinning) return;

    const index = pickPrizeIndex();
    setTargetIndex(index);
    setSpinning(true);
  };

  const handleSpinEnd = async () => {
    if (!user || targetIndex === null) return;

    const prize = WHEEL_PRIZES[targetIndex].label;
    const claimCode = generateClaimCode();

    const { error } = await saveSpin(user.id, prize, claimCode);

    setSpinning(false);

    if (!error) {
      setResult({ prize, claimCode });
      setEligible(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-4xl font-black text-white">
        Lucky <span className="text-pink-500">Wheel</span>
      </h1>
      <p className="mt-1 text-sm italic text-zinc-500">Spin. Win. Flex.</p>

      <p className="mt-4 max-w-md text-zinc-400">
        Sign in with Discord and spin once every 24 hours for exclusive
        rewards, discounts, and premium prizes.
      </p>

      <div className="mt-10">
        <PrizeWheel spinning={spinning} targetIndex={targetIndex} onSpinEnd={handleSpinEnd} />
      </div>

      <div className="mt-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
        {loadingUser ? (
          <p className="text-zinc-500">Loading...</p>
        ) : !user ? (
          <>
            <p className="mb-4 text-sm text-zinc-400">Sign in to spin the wheel.</p>
            <Link
              href="/login"
              className="block rounded-xl bg-[#5865F2] py-3 font-bold text-white hover:brightness-110"
            >
              Continue with Discord
            </Link>
          </>
        ) : result ? (
          <>
            <p className="text-sm text-zinc-400">You won</p>
            <p className="mt-1 text-2xl font-black text-pink-500">{result.prize}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500">Claim Code</p>
            <p className="mt-1 rounded-lg bg-black px-4 py-2 font-mono text-lg text-white">
              {result.claimCode}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Save this code and open a ticket on{' '}
              <Link href="/support" className="text-pink-500 hover:underline">Discord</Link>{' '}
              to claim it. Come back in 24 hours to spin again.
            </p>
          </>
        ) : eligible ? (
          <>
            <p className="mb-4 text-sm text-zinc-400">You have a spin available!</p>
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full rounded-xl bg-pink-500 py-3 font-bold text-white transition hover:bg-pink-600 disabled:opacity-60"
            >
              {spinning ? 'Spinning...' : 'Spin Now'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400">You've already spun today.</p>
            {nextSpinAt && (
              <p className="mt-2 text-xs text-zinc-500">
                Next spin available: {nextSpinAt.toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-12 grid w-full max-w-lg gap-2 text-left sm:grid-cols-2">
        {WHEEL_PRIZES.map((prize) => (
          <div
            key={prize.label}
            className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <span className="text-lg">{prize.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{prize.label}</div>
              <div className="text-xs text-zinc-500">{prize.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
