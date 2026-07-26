import Footer from '@/components/layout/Footer';

const FIVEM_ITEMS = [
  'Custom Faces', 'Premade Faces', 'Tattoos', 'Clothing', 'Chains & Accessories',
  'Weapons', 'Road Mods', 'Scripts', 'UI Design', 'MLOs', 'Server Development',
];

const WEB_ITEMS = [
  'Business Websites', 'Marketplace Websites', 'Portfolio Websites', 'Landing Pages', 'Admin Dashboards',
];

const DESIGN_ITEMS = [
  'Logos', 'Banners', 'Stream Packages', 'Social Media Graphics', 'Branding Kits', 'Posters', 'Advertisements',
];

const ASSET_ITEMS = [
  'Templates', 'Creative Packs', 'Digital Resources', 'Downloadable Content',
];

const FUTURE_ITEMS = [
  'Roblox Assets', 'Second Life Assets', 'IMVU Content', 'Creator Tools',
];

const VALUES = [
  { title: 'Quality First', desc: 'Every product is crafted to meet a high standard.' },
  { title: 'Creativity', desc: 'We build unique assets that stand out.' },
  { title: 'Innovation', desc: 'We embrace new ideas and technologies.' },
  { title: 'Reliability', desc: 'Customers should feel confident in every purchase.' },
  { title: 'Community', desc: 'We build with creators and gamers in mind.' },
];

const WHY_US = [
  'Premium quality over quantity',
  'Original custom work',
  'Fast and reliable support',
  'Professional presentation',
  'Clean, modern design',
  'Constant innovation',
  'Community-driven development',
];

function CategoryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-4 text-lg font-bold text-pink-500">{title}</h3>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-pink-500">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-6 py-20">

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white sm:text-5xl">
            About <span className="text-pink-500">QMZWERKZ.ZIP</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            QMZWERKZ.ZIP is a premium digital creative studio specializing in
            high-quality custom content for gaming communities, creators,
            businesses, and virtual worlds.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            We build more than digital products - we create experiences. From
            custom FiveM assets and immersive server development to
            professional websites, graphics, branding, and digital design,
            our goal is to deliver products that stand out through
            creativity, quality, and attention to detail.
          </p>
          <p className="mt-6 text-xl font-bold text-white">
            Original. Premium. Reliable.
          </p>
        </div>

        {/* Why QMZ */}
        <section className="mt-20">
          <h2 className="text-2xl font-black text-white">Why "QMZ"?</h2>
          <div className="mt-4 space-y-3 text-zinc-400">
            <p>
              QMZ represents creativity, innovation, and craftsmanship. It
              isn't meant to stand for a long phrase - it's our brand
              identity, chosen to be unique, recognizable, and memorable
              within the gaming and digital creator community.
            </p>
            <p>
              Adding ".ZIP" reflects exactly what we deliver: downloadable
              digital products, creative assets, complete project packages,
              and ready-to-use resources - a modern twist that immediately
              communicates what our marketplace is built around.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mt-16 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-8 text-center">
          <h2 className="text-2xl font-black text-white">Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            To make premium digital assets accessible to creators,
            businesses, and gaming communities by delivering products that
            combine quality, creativity, and reliability. We believe every
            project deserves the same level of care - whether it's a custom
            FiveM face, a website, a script, or a complete digital brand.
          </p>
        </section>

        {/* What we do */}
        <section className="mt-20">
          <h2 className="text-2xl font-black text-white">What We Do</h2>
          <p className="mt-2 text-zinc-500">
            A growing collection of digital products and creative services.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <CategoryList title="FiveM Development" items={FIVEM_ITEMS} />
            <CategoryList title="Website Development" items={WEB_ITEMS} />
            <CategoryList title="Graphic Design" items={DESIGN_ITEMS} />
            <CategoryList title="Digital Assets" items={ASSET_ITEMS} />
          </div>

          <div className="mt-6">
            <CategoryList title="Future Expansions" items={FUTURE_ITEMS} />
          </div>
        </section>

        {/* Why choose us */}
        <section className="mt-20">
          <h2 className="text-2xl font-black text-white">Why Choose QMZWERKZ.ZIP?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {WHY_US.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="text-pink-500">✓</span>
                <span className="text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-zinc-500">
            Every product is created with attention to detail to ensure it
            performs as well as it looks.
          </p>
        </section>

        {/* Vision */}
        <section className="mt-20">
          <h2 className="text-2xl font-black text-white">Our Vision</h2>
          <p className="mt-4 text-zinc-400">
            To become one of the leading digital marketplaces for gaming
            communities and creators by offering professional-quality
            products backed by excellent customer support and continuous
            innovation. As QMZWERKZ.ZIP grows, so will our range of
            products, services, and tools - giving creators everything they
            need in one place.
          </p>
        </section>

        {/* Core values */}
        <section className="mt-20">
          <h2 className="text-2xl font-black text-white">Our Core Values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="font-bold text-pink-500">{v.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motto */}
        <div className="mt-20 text-center">
          <p className="text-3xl font-black text-white sm:text-4xl">
            WE BUILD <span className="text-pink-500">DIGITAL EXPERIENCES.</span>
          </p>
        </div>

      </div>

      <Footer />
    </>
  );
}
