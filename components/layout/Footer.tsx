'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          <div>
            <h2 className="text-3xl font-black text-white">
              QMZ<span className="text-pink-500">WERKZ</span>.ZIP
            </h2>

            <p className="mt-4 text-zinc-400">
              Premium FiveM assets, graphics, websites, and digital experiences.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Marketplace</h3>

            <div className="space-y-2 text-zinc-400">
              <Link href="/shop">Shop</Link><br />
              <Link href="/featured">Featured</Link><br />
              <Link href="/lucky-wheel">Lucky Wheel</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Company</h3>

            <div className="space-y-2 text-zinc-400">
              <Link href="/our-work">Our Work</Link><br />
              <Link href="/services">Services</Link><br />
              <Link href="/support">Support</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Community</h3>

            <div className="space-y-2 text-zinc-400">
              <a href="#">Discord</a><br />
              <a href="#">Terms</a><br />
              <a href="#">Privacy</a>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-zinc-500">
          © {new Date().getFullYear()} QMZWERKZ.ZIP. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}