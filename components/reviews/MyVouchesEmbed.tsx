'use client';

/**
 * Shared MyVouches embed - compact rounded glass container with QMZ neon
 * accents wrapped around the official MyVouches iframe.
 *
 * Kept deliberately compact: a prior attempt inflated the iframe to
 * 600-850px tall to "fit more reviews," but MyVouches' own page has a
 * plain background outside its card content, so the extra height just
 * showed up as a big blank area (and exposed whatever sits at the bottom
 * of their page, e.g. a footer/label, that was previously cropped out at
 * a shorter height). Reverted to a short, fixed height and full width -
 * MyVouches controls its own internal card layout, we only size the box
 * around it.
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
      }}
    >
      {/* neon corner glows */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-pink-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-500/25 blur-3xl" />

      {/* No background fill here on purpose - see note above. */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-400/20">
        <iframe
          src="https://myvouch.es/api/qmz-client-reviews/vouches/embed"
          title="QMZ WERKZ Client Vouches"
          className="block h-[400px] w-full border-0 sm:h-[340px]"
          style={{
            width: '100%',
            minHeight: 0,
            background: 'transparent',
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
