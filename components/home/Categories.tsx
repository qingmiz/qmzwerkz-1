'use client';

const categories = [
  {
    title: 'FiveM',
    items: [
      'Faces',
      'Skins',
      'Tattoos',
      'Road Mods',
      'Weapons',
    ],
  },
  {
    title: 'IMVU',
    items: [
      'Faces',
      'Skins',
      'Chains (Coming Soon)',
    ],
  },
  {
    title: 'Second Life',
    items: ['Coming Soon'],
  },
  {
    title: 'Roblox',
    items: ['Coming Soon'],
  },
];

export default function Categories() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-3 text-4xl font-black text-white">
          Categories
        </h2>

        <p className="mb-12 text-zinc-400">
          Browse everything QMZWERKZ has to offer.
        </p>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:border-pink-500"
            >
              <h3 className="mb-6 text-2xl font-bold text-white">
                {category.title}
              </h3>

              <div className="space-y-3">

                {category.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg bg-zinc-900 px-4 py-3 text-zinc-300"
                  >
                    {item}
                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}