'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  short_description: string;
  price: number;
  cover_image?: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (data && !error) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#090909] px-6 py-24 text-white">
      {/* subtle gold atmosphere behind the grid, sets this section apart */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              ⭐ Hand-Picked
            </span>
            <h2 className="mt-2 text-3xl font-black">Featured Products</h2>
          </div>
          <Link href="/featured" className="text-sm font-bold text-pink-500 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-1 hover:border-amber-400/60"
                style={{ boxShadow: '0 0 0 rgba(251,191,36,0)' }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(251,191,36,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 rgba(251,191,36,0)')}
              >
                {/* Gold star badge - marks this as a featured pick */}
                <div className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/50 bg-gradient-to-br from-amber-300 to-amber-500 text-base shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                  ⭐
                </div>

                {p.cover_image && (
                  <div className="h-44 w-full overflow-hidden bg-zinc-900">
                    <div
                      className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url("${p.cover_image}")` }}
                    />
                  </div>
                )}

                <div className="p-5">
                  <span className="inline-block rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-400">
                    {p.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{p.name}</h3>
                  <div className="mt-3 text-lg font-black text-white">${p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
