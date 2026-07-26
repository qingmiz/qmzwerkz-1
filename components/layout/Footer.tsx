'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">

          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logos/qmz-icon.png"
                alt="QMZ"
                className="h-12 w-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <h2 className="text-2xl font-black text-white">
                QMZWERKZ<span className="text-pink-500">.ZIP</span>
              </h2>
            </div>

            <p className="mt-4 max-w-xs text-sm text-zinc-400">
              Premium FiveM assets, graphics, websites, and digital experiences.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Marketplace</h3>

            <div className="space-y-2 text-sm">
              <Link href="/shop" className="block text-pink-500 hover:text-pink-400">Shop</Link>
              <Link href="/featured" className="block text-pink-500 hover:text-pink-400">Featured</Link>
              <Link href="/lucky-wheel" className="block text-pink-500 hover:text-pink-400">Lucky Wheel</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Company</h3>

            <div className="space-y-2 text-sm">
              <Link href="/our-work" className="block text-purple-400 hover:text-purple-300">Our Work</Link>
              <Link href="/services" className="block text-purple-400 hover:text-purple-300">Services</Link>
              <Link href="/support" className="block text-purple-400 hover:text-purple-300">Support</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Community</h3>

            <div className="space-y-2 text-sm">
              <a href="https://discord.com/channels/1458550712119070925/1458550715130581238" target="_blank" rel="noreferrer" className="block text-purple-400 hover:text-purple-300">Discord</a>
              <Link href="/terms" className="block text-purple-400 hover:text-purple-300">Terms</Link>
              <Link href="/privacy" className="block text-purple-400 hover:text-purple-300">Privacy</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">Services</h3>

            <div className="space-y-2 text-sm text-zinc-300">
              <p>FiveM Development</p>
              <p>IMVU Development</p>
              <p>Website Creation</p>
              <p>Graphics Design</p>
              <p>Visual Editing</p>
              <p className="text-zinc-500">Second Life (Coming Soon)</p>
              <p className="text-zinc-500">Roblox (Coming Soon)</p>
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