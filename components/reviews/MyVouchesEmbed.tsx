'use client';

/**
 * Shared MyVouches embed - rounded glass container with QMZ neon accents
 * wrapped around the official MyVouches iframe.
 *
 * IMPORTANT: nothing in this wrapper may sit behind the iframe with an
 * opaque/dark fill - MyVouches renders its own background, and a solid
 * dark div behind it can visually swallow dark-on-transparent widget
 * content. Only translucent glass + glow effects are used here.
 */
export default function MyVouchesEmbed({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-pink-500/30 bg-white/5 p-4 backdrop-blur-xl sm:p-6 ${className}`}
      style={{
        boxShadow:
          '0 0 0 1px rgba(168,85,247,0.15), 0 0 40px rgba(255,42,133,0.18), 0 0 90px rgba(168,85,247,0.10)',
        // Reserve the iframe's height up front so there's no layout shift while it lazy-loads.
        minHeight: 732,
      }}
    >
      {/* neon corner glows */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-pink-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-500/25 blur-3xl" />

      {/* No background fill here on purpose - see note above. */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-400/20">
        <iframe
          src="https://myvouch.es/api/qmz-client-reviews/vouches/embed"
          title="QMZ WERKZ verified client reviews"
          width="100%"
          height="700"
          loading="lazy"
          allow="clipboard-write"
          style={{
            border: 'none',
            display: 'block',
            width: '100%',
            minHeight: '700px',
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
