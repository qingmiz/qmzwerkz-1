'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import MyVouchesEmbed from '@/components/reviews/MyVouchesEmbed';

export default function ReviewsPageContent() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [carouselRef, carouselVisible] = useScrollReveal<HTMLDivElement>();
  const [ctaRef, ctaVisible] = useScrollReveal<HTMLDivElement>();

  // Hero is above the fold on load, so it fades in on mount rather than on scroll.
  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Hero banner */}
      <section
        className="relative overflow-hidden px-6 pb-20 pt-32 text-center text-white"
        style={{
          background: 'radial-gradient(circle at top, rgba(255,42,133,0.18), transparent 45%), #050505',
        }}
      >
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-pink-500/15 blur-[140px]"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-purple-500/15 blur-[120px]"
        />

        <div
          className={`relative mx-auto max-w-3xl transition-all duration-700 ease-out ${
            heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
            💗 Client Reviews
          </span>

          <h1 className="mt-4 text-4xl font-black tracking-wide text-white sm:text-5xl">
            Client Reviews
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            Real reviews from verified QMZ WERKZ customers, straight from our Discord vouches.
          </p>
        </div>
      </section>

      {/* Embedded MyVouches carousel */}
      <section className="relative overflow-hidden bg-black px-6 py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

        <div
          ref={carouselRef}
          className={`relative transition-all duration-700 ease-out ${
            carouselVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <MyVouchesEmbed />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-black px-6 pb-24">
        <div
          ref={ctaRef}
          className={`relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-purple-400/30 bg-white/5 p-10 text-center backdrop-blur-xl transition-all duration-700 ease-out sm:p-14 ${
            ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,42,133,0.15), 0 0 50px rgba(168,85,247,0.15), 0 0 100px rgba(255,42,133,0.08)',
          }}
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

          <h2 className="relative text-2xl font-black text-white sm:text-3xl">
            Love your purchase?
          </h2>
          <p className="relative mt-3 text-zinc-400">
            Every review helps QMZ grow.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://discord.com/channels/1458550712119070925/1458550715130581238"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-purple-400 px-7 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-400 hover:text-black"
            >
              Join Our Discord
            </a>

            <Link
              href="/shop"
              className="rounded-xl bg-pink-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
