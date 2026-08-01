'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';
import MyVouchesEmbed from '@/components/reviews/MyVouchesEmbed';

// 💗 Client Reviews - powered by MyVouches. Auto-updates whenever someone
// leaves a /vouch in the QMZ Discord, no manual updates needed here.
export default function ClientReviews() {
  const [ref, visible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="reviews" className="relative overflow-hidden bg-black px-6 py-24 text-white">
      {/* hot pink + purple atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative mx-auto max-w-5xl text-center transition-all duration-700 ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
          💗 Client Reviews
        </span>

        <h2 className="mt-3 text-3xl font-black tracking-wide text-white sm:text-4xl">
          CLIENT VOUCHES
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Real reviews from verified QMZ WERKZ customers.
        </p>

        <div className="mt-10">
          <MyVouchesEmbed />
        </div>

        <Link
          href="/reviews"
          className="mt-8 inline-block text-sm font-semibold text-purple-400 transition hover:text-purple-300"
        >
          View all reviews →
        </Link>
      </div>
    </section>
  );
}
