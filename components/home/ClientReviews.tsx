'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';
import MyVouchesEmbed from '@/components/reviews/MyVouchesEmbed';
import ReviewStats from '@/components/home/ReviewStats';

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
        className={`relative mx-auto max-w-7xl text-center transition-all duration-700 ease-out ${
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
          <ReviewStats />

          <MyVouchesEmbed />
        </div>

        <Link
          href="/reviews"
          className="mt-8 inline-block text-sm font-semibold text-purple-400 transition hover:text-purple-300"
        >
          💗 Read More Reviews
        </Link>

        {/* CTA */}
        <div
          className="relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-3xl border border-pink-500/30 bg-white/5 p-10 backdrop-blur-xl"
          style={{
            boxShadow: '0 0 0 1px rgba(168,85,247,0.15), 0 0 40px rgba(255,42,133,0.15), 0 0 90px rgba(168,85,247,0.10)',
          }}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

          <h3 className="relative text-2xl font-black text-white sm:text-3xl">Love what you see?</h3>
          <p className="relative mt-3 text-zinc-400">
            Join our growing list of satisfied QMZ WERKZ customers.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-xl bg-pink-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
            >
              Shop Now
            </Link>

            <a
              href="https://discord.com/channels/1458550712119070925/1458550715130581238"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-purple-400 px-7 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-400 hover:text-black"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
