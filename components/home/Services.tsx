'use client';

const services = [
  'FiveM Development',
  'IMVU Development',
  'Website Creation',
  'Graphics Design',
  'Visual Editing',
  'Second Life (Coming Soon)',
  'Roblox (Coming Soon)',
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
              key={service}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-pink-500"
            >
              <h3 className="text-2xl font-bold text-white">
                {service}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}