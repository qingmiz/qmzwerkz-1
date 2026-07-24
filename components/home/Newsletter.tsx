'use client';

import Link from 'next/link';

export default function Newsletter() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-12 text-center">

        <h2 className="text-4xl font-black text-white">
          Join the QMZ Community
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
          Get notified about new releases, flash sales, exclusive drops,
          Lucky Wheel events, and premium FiveM content.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-xl bg-pink-500 px-8 py-4 font-bold text-white transition hover:scale-105"
          >
            Shop Now
          </Link>

          <Link
            href="/wheel"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white transition hover:border-pink-500 hover:text-pink-400"
          >
            🎡 Daily Spin
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-pink-500 px-8 py-4 font-bold text-pink-400 transition hover:bg-pink-500 hover:text-white"
          >
            Login with Discord
          </Link>
        </div>
      </div>
    </section>
  );
}