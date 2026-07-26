'use client';

const services = [
  { title: 'FiveM Development', icon: '🚗', desc: 'Custom faces, scripts, MLOs, and full server builds.' },
  { title: 'IMVU Development', icon: '💎', desc: 'Custom mesh, textures, and avatar content.' },
  { title: 'Website Creation', icon: '💻', desc: 'Business, marketplace, and portfolio sites.' },
  { title: 'Graphics Design', icon: '🎨', desc: 'Logos, banners, branding kits, and stream packages.' },
  { title: 'Visual Editing', icon: '✂️', desc: 'Promo videos, thumbnails, and social content.' },
  { title: 'Second Life', icon: '🌐', desc: 'Expanding into Second Life assets.', comingSoon: true },
  { title: 'Roblox', icon: '🎮', desc: 'Expanding into Roblox assets.', comingSoon: true },
];

export default function Services() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-4xl font-black text-white">
          Services
        </h2>

        <p className="mt-3 mb-12 text-zinc-400">
          Everything you need to build your brand.
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {services.map((service) => (
            <div
              key={service.title}
              className={`group relative overflow-hidden rounded-3xl border p-8 transition ${
                service.comingSoon
                  ? 'border-zinc-800 bg-zinc-950/50'
                  : 'border-zinc-800 bg-zinc-950 hover:border-pink-500 hover:-translate-y-1'
              }`}
            >
              {/* subtle glow on hover */}
              {!service.comingSoon && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/0 blur-2xl transition group-hover:bg-pink-500/20" />
              )}

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/10 text-2xl">
                {service.icon}
              </div>

              <h3 className="relative mt-6 text-2xl font-bold text-white">
                {service.title}
              </h3>

              <p className="relative mt-2 text-sm text-zinc-500">
                {service.desc}
              </p>

              {service.comingSoon && (
                <span className="relative mt-4 inline-block rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400">
                  Coming Soon
                </span>
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
