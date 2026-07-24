'use client';

import Link from 'next/link';

const featured = [
  {
    name: 'Kira',
    category: 'Female Face',
    price: '$35',
  },
  {
    name: 'Nyri',
    category: 'Premium Skin',
    price: '$35',
  },
  {
    name: 'Candy',
    category: 'Premium Face',
    price: '$35',
  },
  {
    name: 'Weapon Pack',
    category: 'FiveM',
    price: '$20',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 flex items-center justify-between">

          <div>
            <h2 className="text-4xl font-black text-white">
              Featured Products
            </h2>

            <p className="mt-3 text-zinc-400">
              Discover our hand-picked premium releases.
            </p>
          </div>

          <Link
            href="/shop"
            className="font-semibold text-pink-500 hover:text-pink-400"
          >
            View All →
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {featured.map((product) => (
            <div
              key={product.name}
              className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition hover:border-pink-500"
            >
              <div className="aspect-square bg-zinc-900" />

              <div className="p-6">

                <p className="text-sm text-pink-500">
                  {product.category}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {product.name}
                </h3>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-xl font-bold text-white">
                    {product.price}
                  </span>

                  <button className="rounded-xl bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600">
                    View
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}