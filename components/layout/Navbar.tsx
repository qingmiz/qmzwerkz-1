'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    'Account';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center">
          <h1 className="text-3xl font-black tracking-wide text-white">
            QMZ<span className="text-pink-500">WERKZ</span>.ZIP
          </h1>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/featured">Featured</Link>
          <Link href="/our-work">Our Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/lucky-wheel">Lucky Wheel</Link>
          <Link href="/support">Support</Link>
        </nav>

        <div className="flex items-center gap-4">

          <Link
            href="/admin/login"
            className="rounded-xl border border-pink-500 px-5 py-2 text-sm font-semibold text-pink-500 transition hover:bg-pink-500 hover:text-white"
          >
            Admin Portal
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-6 w-6 rounded-full" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[120px] truncate">{displayName}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 py-2 shadow-xl">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    Cart
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-pink-500 hover:bg-zinc-900"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
