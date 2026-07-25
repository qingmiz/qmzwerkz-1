'use client';

import Link from 'next/link';

export default function LuckyWheelBanner() {
  return (
    <section className="bg-black pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pink-500/40 bg-pink-500/10 text-xl">
            🎡
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Lucky Wheel</h3>

            <p className="mt-1 text-sm text-zinc-400">
              Sign in with Discord and spin once every 24 hours for exclusive
              rewards, discounts, and premium prizes.
            </p>

            <Link
              href="/lucky-wheel"
              className="mt-2 inline-block text-sm font-semibold text-pink-500 hover:text-pink-400"
            >
              Spin Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
