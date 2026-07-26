'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PrizeWheel, { WheelPrize, DEFAULT_WHEEL_PRIZES } from '@/components/lucky-wheel/PrizeWheel';
import type { User } from '@supabase/supabase-js';

function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function LuckyWheelPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [prizes, setPrizes] = useState<WheelPrize[]>(DEFAULT_WHEEL_PRIZES);
  const [eligible, setEligible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [result, setResult] = useState<{ prize: string; claimCode: string } | null>(null);
  const [nextSpinAt, setNextSpinAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const [error, setError] = useState('');

  const refreshStatus = async () => {
    const res = await fetch('/api/wheel/status');
    const data = await res.json();

    if (data.signedIn) {
      setEligible(data.eligible);
      setNextSpinAt(data.nextSpinAt ? new Date(data.nextSpinAt) : null);
    }
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const [prizesRes] = await Promise.all([
        fetch('/api/wheel/prizes'),
        user ? refreshStatus() : Promise.resolve(),
      ]);

      const prizesData = await prizesRes.json();
      if (prizesData.prizes?.length) setPrizes(prizesData.prizes);

      setLoadingUser(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live countdown, re-checks eligibility with the server when it hits zero.
  useEffect(() => {
    if (!nextSpinAt) return;

    const interval = setInterval(() => {
      const remaining = nextSpinAt.getTime() - Date.now();

      if (remaining <= 0) {
        setCountdown('00:00:00');
        clearInterval(interval);
        refreshStatus();
        return;
      }

      setCountdown(formatCountdown(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSpinAt]);

  const handleSpin = async () => {
    if (!user || spinning) return;
    setError('');
    setSpinning(true);

    try {
      const res = await fetch('/api/wheel/spin', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setSpinning(false);
        setError(data.error || 'Could not spin right now.');
        if (data.nextSpinAt) {
          setEligible(false);
          setNextSpinAt(new Date(data.nextSpinAt));
        }
        return;
      }

      const index = prizes.findIndex((p) => p.label === data.prize);
      setTargetIndex(index >= 0 ? index : 0);
      setResult({ prize: data.prize, claimCode: data.claimCode });
      setNextSpinAt(new Date(data.nextSpinAt));
    } catch {
      setSpinning(false);
      setError('Network error - please try again.');
    }
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    setEligible(false);
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
        <PrizeWheel prizes={prizes} spinning={spinning} targetIndex={targetIndex} onSpinEnd={handleSpinEnd} />
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
            <p className="text-sm font-bold uppercase tracking-wide text-pink-500">Congratulations!</p>
            <p className="mt-1 text-xs text-zinc-500">Prize Won</p>
            <p className="text-2xl font-black text-white">{result.prize}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500">Claim Code</p>
            <p className="mt-1 rounded-lg bg-black px-4 py-2 font-mono text-lg text-white">
              {result.claimCode}
            </p>

            <a
              href="https://discord.com/channels/1458550712119070925/1458550715130581238"
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-xl bg-[#5865F2] py-3 font-bold text-white hover:brightness-110"
            >
              Claim Prize
            </a>

            <p className="mt-4 text-xs text-zinc-500">
              Open a support ticket and paste your claim code to redeem it.
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
              {spinning ? 'Spinning...' : 'SPIN'}
            </button>
          </>
        ) : (
          <>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-zinc-800 py-3 font-bold text-zinc-500"
            >
              TRY AGAIN LATER
            </button>
            {nextSpinAt && (
              <p className="mt-3 text-sm text-zinc-400">
                Next spin in <span className="font-mono font-bold text-white">{countdown}</span>
              </p>
            )}
          </>
        )}

        {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
      </div>

      <div className="mt-12 grid w-full max-w-lg gap-2 text-left sm:grid-cols-2">
        {prizes.map((prize) => (
          <div
            key={prize.label}
            className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <span className="text-lg">{prize.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{prize.label}</div>
              {prize.description && <div className="text-xs text-zinc-500">{prize.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
