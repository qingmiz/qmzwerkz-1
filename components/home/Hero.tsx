'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-500/20 blur-[180px]" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
          Premium FiveM Marketplace
        </span>

        <h1 className="mt-8 text-6xl font-black leading-none md:text-8xl">
          QMZ
          <span className="text-pink-500 drop-shadow-[0_0_35px_rgba(255,42,133,.7)]">
            WERKZ
          </span>
          .ZIP
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
          Premium clothing, faces, scripts, weapons, MLOs, maps and digital
          assets built for serious FiveM communities.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link
            href="/shop"
            className="rounded-xl bg-pink-500 px-8 py-4 font-bold text-white transition hover:scale-105 hover:bg-pink-400"
          >
            Shop Now
          </Link>

          <Link
            href="/wheel"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white transition hover:border-pink-500 hover:text-pink-400"
          >
            🎡 Daily Spin
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-black text-pink-500">500+</h3>
            <p className="mt-2 text-sm text-zinc-400">Premium Assets</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-black text-pink-500">24/7</h3>
            <p className="mt-2 text-sm text-zinc-400">Instant Delivery</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-black text-pink-500">100%</h3>
            <p className="mt-2 text-sm text-zinc-400">Secure Checkout</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-black text-pink-500">🎮</h3>
            <p className="mt-2 text-sm text-zinc-400">Built for FiveM</p>
          </div>

        </div>

      </div>
    </section>
  );
}