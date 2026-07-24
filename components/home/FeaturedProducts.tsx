'use client';

import Link from 'next/link';

const products = [
  {
    name: 'Kira Premium Skin',
    category: 'Face',
    price: '$35',
    image: '/images/products/kira.png',
  },
  {
    name: 'Female Clothing Pack',
    category: 'Clothing',
    price: '$25',
    image: '/images/products/clothing.png',
  },
  {
    name: 'Weapon Pack',
    category: 'Weapons',
    price: '$20',
    image: '/images/products/weapons.png',
  },
  {
    name: 'Roads Pack',
    category: 'Maps',
    price: '$18',
    image: '/images/products/roads.png',
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
            <p className="mt-2 text-zinc-400">
              Our most popular premium assets.
            </p>
          </div>

          <Link
            href="/shop"
            className="rounded-lg border border-pink-500 px-5 py-3 font-bold text-pink-400 transition hover:bg-pink-500 hover:text-white"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-pink-500"
            >
              <div className="flex aspect-square items-center justify-center bg-zinc-900">
                <span className="text-zinc-500">Image</span>
              </div>

              <div className="p-5">
                <span className="text-sm text-pink-400">
                  {product.category}
                </span>

                <h3 className="mt-2 text-lg font-bold text-white">
                  {product.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-white">
                    {product.price}
                  </span>

                  <Link
                    href="/shop"
                    className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-400"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}