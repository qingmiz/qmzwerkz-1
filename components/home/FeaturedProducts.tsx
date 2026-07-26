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
    <section className="bg-[#090909] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-black">Featured Products</h2>
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
                className="block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:border-pink-500"
              >
                {p.cover_image && (
                  <div
                    className="h-40 w-full bg-zinc-900 bg-cover bg-center"
                    style={{ backgroundImage: `url(${p.cover_image})` }}
                  />
                )}
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-pink-500">{p.category}</span>
                  <h3 className="mt-1 text-lg font-bold text-white">{p.name}</h3>
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
