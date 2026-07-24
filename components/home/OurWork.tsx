'use client';

import Link from 'next/link';

export default function OurWork() {
  return (
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 flex items-center justify-between">

          <div>
            <h2 className="text-4xl font-black text-white">
              Our Work
            </h2>

            <p className="mt-3 text-zinc-400">
              Explore projects created by QMZWERKZ.
            </p>
          </div>

          <Link
            href="/our-work"
            className="font-semibold text-pink-500 hover:text-pink-400"
          >
            View Portfolio →
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          <div className="aspect-[4/5] rounded-3xl bg-zinc-900" />

          <div className="aspect-[4/5] rounded-3xl bg-zinc-900" />

          <div className="aspect-[4/5] rounded-3xl bg-zinc-900" />

        </div>

      </div>
    </section>
  );
}