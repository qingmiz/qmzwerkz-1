import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function SupportPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-black text-white">
          Need <span className="text-pink-500">Help?</span>
        </h1>

        <p className="mt-4 text-zinc-400">
          For order issues, download problems, refunds, or custom work
          inquiries, reach out through Discord — that's where we're fastest.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href="https://discord.gg/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#5865F2] px-6 py-4 font-bold text-white transition hover:brightness-110"
          >
            Open a Discord Ticket
          </a>

          <Link
            href="/account"
            className="rounded-xl border border-zinc-700 px-6 py-4 font-bold text-white transition hover:border-pink-500"
          >
            View My Orders
          </Link>
        </div>

        <div className="mt-16 space-y-6 text-left">
          <div>
            <h3 className="font-bold text-white">My download link isn't working</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Downloads are tied to your account. Make sure you're signed in
              with the same Discord account used at checkout, then check{' '}
              <Link href="/account" className="text-pink-500 hover:underline">
                My Account
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">I want a refund</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Open a Discord ticket with your order reference and we'll take care of it.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Can I request custom work?</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Yes — message us on Discord with details about what you need.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
