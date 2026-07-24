'use client';

import Link from 'next/link';

export default function LuckyWheelBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 py-20">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 text-center lg:flex-row lg:text-left">

        <div>
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white">
            Daily Rewards
          </span>

          <h2 className="mt-6 text-5xl font-black text-white">
            🎡 QMZ Daily Spin
          </h2>

          <p className="mt-5 max-w-2xl text-lg text-pink-100">
            Log in with Discord and spin once every 24 hours for a chance to win
            premium skins, clothing, Tebex packages, GitHub downloads, store
            credit, discount codes, and more.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/wheel"
              className="rounded-xl bg-white px-8 py-4 font-bold text-pink-600 transition hover:scale-105"
            >
              🎡 Spin Now
            </Link>

            <Link
              href="/shop"
              className="rounded-xl border border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-pink-600"
            >
              Browse Store
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h3 className="text-3xl">💎</h3>
            <p className="mt-3 font-bold text-white">
              Premium Packages
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h3 className="text-3xl">🎁</h3>
            <p className="mt-3 font-bold text-white">
              Mystery Rewards
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h3 className="text-3xl">💵</h3>
            <p className="mt-3 font-bold text-white">
              Store Credit
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <h3 className="text-3xl">🏷️</h3>
            <p className="mt-3 font-bold text-white">
              Discount Codes
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}