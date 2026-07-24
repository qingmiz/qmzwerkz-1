'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-24">

        <div className="max-w-3xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-pink-500">
            QMZWERKZ
          </p>

          <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
            WE BUILD
            <br />
            <span className="text-pink-500">
              PREMIUM DIGITAL
            </span>
            <br />
            EXPERIENCES
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Premium FiveM assets, graphics design, website creation,
            visual editing, IMVU development, and more.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">

            <Link
              href="/shop"
              className="rounded-xl bg-pink-500 px-8 py-4 font-bold text-white transition hover:bg-pink-600"
            >
              Shop Now
            </Link>

            <Link
              href="/our-work"
              className="rounded-xl border border-zinc-700 px-8 py-4 font-bold text-white transition hover:border-pink-500 hover:text-pink-500"
            >
              Explore Our Work
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}