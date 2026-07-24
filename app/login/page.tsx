'use client';

import { signInWithDiscord } from '../../lib/auth';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-3xl border border-pink-500/20 bg-zinc-900 p-10 text-center">
        <h1 className="text-4xl font-black text-white">
          Welcome to <span className="text-pink-500">QMZWERKZ</span>
        </h1>

        <p className="mt-4 text-zinc-400">
          Sign in with Discord to access your purchases, downloads, Lucky Wheel, and account.
        </p>

        <button
          onClick={signInWithDiscord}
          className="mt-8 w-full rounded-xl bg-[#5865F2] py-4 font-bold text-white hover:brightness-110"
        >
          Continue with Discord
        </button>
      </div>
    </main>
  );
}