'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop');
  };

  return (
    <section className="bg-black py-10">
      <div className="mx-auto max-w-4xl px-6">
        <form onSubmit={handleSearch} className="relative">
          <svg
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, scripts, mods..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-4 pl-14 pr-28 text-white placeholder-zinc-500 outline-none transition focus:border-pink-500"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
