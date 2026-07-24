'use client';

import Link from 'next/link';

export default function LuckyWheelBanner() {
  return (
    <section className="bg-pink-600 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center">

        <h2 className="text-5xl font-black text-white">
          🎡 Lucky Wheel
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-pink-100">
          Sign in with Discord and spin once every 24 hours for exclusive
          rewards, discounts, and premium prizes.
        </p>

        <Link
          href="/lucky-wheel"
          className="mt-10 rounded-xl bg-white px-8 py-4 font-bold text-pink-600 transition hover:scale-105"
        >
          Spin Now
        </Link>

      </div>
    </section>
  );
}