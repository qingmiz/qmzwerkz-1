'use client';

/**
 * Shared MyVouches embed - rounded glass container with QMZ neon accents
 * wrapped around the official MyVouches iframe.
 *
 * IMPORTANT: nothing in this wrapper may sit behind the iframe with an
 * opaque/dark fill - MyVouches renders its own background, and a solid
 * dark div behind it can visually swallow dark-on-transparent widget
 * content. Only translucent glass + glow effects are used here.
 *
 * The iframe is taller than MyVouches' default 300px snippet on purpose -
 * at 300px it was cropping the widget to a single card. We can't reach
 * into the widget's own (cross-origin) internal layout - e.g. how it
 * centers/spaces individual cards - only the size of the box around it.
 */
export default function MyVouchesEmbed({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-pink-500/30 bg-white/5 p-4 backdrop-blur-xl sm:p-6 ${className}`}
      style={{
        boxShadow:
          '0 0 0 1px rgba(168,85,247,0.15), 0 0 50px rgba(255,42,133,0.22), 0 0 110px rgba(168,85,247,0.14)',
      }}
    >
      {/* big centered pink glow behind the whole card, so it "pops" against the black page background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/15 blur-[100px]" />
      {/* neon corner glows */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-pink-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-500/25 blur-3xl" />

      {/* No background fill here on purpose - see note above. */}
      <div className="relative min-h-[660px] overflow-hidden rounded-2xl border border-purple-400/20 sm:min-h-[810px] lg:min-h-[910px]">
        <iframe
          src="https://myvouch.es/api/qmz-client-reviews/vouches/embed"
          title="QMZ WERKZ verified client reviews"
          loading="lazy"
          allow="clipboard-write"
          frameBorder="0"
          scrolling="no"
          className="block h-[600px] w-full sm:h-[750px] lg:h-[850px]"
          style={{
            border: 'none',
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
