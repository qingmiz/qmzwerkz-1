'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Add Product', href: '/admin/marketplace' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Lucky Wheel', href: '/admin/lucky-wheel' },
  { label: 'Our Work', href: '/admin/our-work' },
  { label: 'Reviews', href: '/admin/reviews' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Promo Codes', href: '/admin/promo-codes' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[#222] bg-[#111] p-6">
      <h2 className="mb-8 text-2xl font-bold text-pink-500">QMZWERKZ</h2>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-pink-500/10 text-pink-500'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-8 block rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:text-white"
      >
        ← Back to site
      </Link>
    </aside>
  );
}
