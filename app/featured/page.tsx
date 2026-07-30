'use client';

import React, { useEffect, useState } from 'react';
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

export default function FeaturedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (data && !error) setProducts(data);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="mx-auto min-h-[60vh] max-w-7xl px-6 py-16">
      <header className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-black text-white">Featured Products</h1>
        <p className="mt-2 text-sm text-zinc-500">Hand-picked drops from the QMZWERKZ catalog.</p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 py-20 text-center text-zinc-500">
          No featured products yet — check back soon.
        </div>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${p.id}`}
              className="block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:border-pink-500"
            >
              {p.cover_image && (
                <div
                  className="h-44 w-full bg-zinc-900 bg-cover bg-center"
                  style={{ backgroundImage: `url("${p.cover_image}")` }}
                />
              )}
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-pink-500">{p.category}</span>
                <h3 className="mt-1 text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{p.short_description}</p>
                <div className="mt-3 text-lg font-black text-white">${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
