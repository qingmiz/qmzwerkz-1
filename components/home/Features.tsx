'use client';

const features = [
  {
    title: '⚡ Instant Delivery',
    description:
      'Receive your purchases instantly - files unlock the moment payment is confirmed, ready to download from your account.',
  },
  {
    title: '🔒 Secure Checkout',
    description:
      'Fast and secure payments with order history, download tracking, and account management.',
  },
  {
    title: '🎮 FiveM Ready',
    description:
      'High-quality assets built specifically for FiveM communities and roleplay servers.',
  },
  {
    title: '🎡 Daily Rewards',
    description:
      'Spin the QMZ Daily Wheel every 24 hours for premium prizes, discounts, and exclusive rewards.',
  },
];

export default function Features() {
  return (
    <section className="bg-[#050505] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black text-white">
            Why Choose QMZWERKZ?
          </h2>

          <p className="mt-4 text-zinc-400">
            Built for creators. Trusted by FiveM communities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:border-pink-500 hover:bg-white/10"
            >
              <h3 className="mb-4 text-xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="text-sm leading-7 text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}