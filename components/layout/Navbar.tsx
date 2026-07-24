'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* Replace with animated logo component later */}
          <h1 className="text-3xl font-black tracking-wide text-white">
            QMZ<span className="text-pink-500">WERKZ</span>.ZIP
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/featured">Featured</Link>
          <Link href="/our-work">Our Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/lucky-wheel">Lucky Wheel</Link>
          <Link href="/support">Support</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <Link
            href="/admin/login"
            className="rounded-xl border border-pink-500 px-5 py-2 text-sm font-semibold text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            Admin Portal
          </Link>

          <button
            className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Sign In
          </button>

        </div>

      </div>
    </header>
  );
}