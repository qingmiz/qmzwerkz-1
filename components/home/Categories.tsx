'use client';

import Link from 'next/link';

const categories = [
  {
    title: 'Clothing',
    icon: '👕',
    href: '/shop?category=clothing',
  },
  {
    title: 'Faces',
    icon: '💄',
    href: '/shop?category=faces',
  },
  {
    title: 'Scripts',
    icon: '💻',
    href: '/shop?category=scripts',
  },
  {
    title: 'Weapons',
    icon: '🔫',
    href: '/shop?category=weapons',
  },
  {
    title: 'Maps & MLOs',
    icon: '🗺️',
    href: '/shop?category=maps',
  },
  {
    title: 'Vehicles',
    icon: '🚗',
    href: '/shop?category=vehicles',
  },
];

export default function Categories() {
  return (
    <section className="bg-[#050505] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-white">
            Shop By Category
          </h2>
          <p className="mt-3 text-zinc-400">
            Browse premium FiveM assets built for your community.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:border-pink-500 hover:bg-pink-500/10"
            >
              <div className="mb-5 text-5xl">{category.icon}</div>

              <h3 className="text-2xl font-bold text-white group-hover:text-pink-400">
                {category.title}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                View all {category.title.toLowerCase()}.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}