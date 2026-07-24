'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(255,42,133,0.18), transparent 45%), #050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'rgba(255,42,133,0.12)',
          filter: 'blur(140px)',
          top: -220,
          right: -180,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '60px',
          alignItems: 'center',
        }}
      >
        {/* LEFT */}
        <div>
          <span
            style={{
              color: '#ff2a85',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              fontSize: '13px',
            }}
          >
            QMZWERKZ
          </span>

          <h1
            style={{
              fontSize: '68px',
              lineHeight: 1,
              fontWeight: 900,
              color: '#fff',
              margin: '20px 0',
            }}
          >
            WE BUILD
            <br />
            DIGITAL
            <br />
            EXPERIENCES.
          </h1>

          <p
            style={{
              color: '#b8b8b8',
              fontSize: '20px',
              lineHeight: 1.7,
              maxWidth: '600px',
            }}
          >
            Premium FiveM Development, IMVU Development, luxury digital
            products, custom assets and web experiences built for creators.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '18px',
              marginTop: '40px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/shop"
              style={{
                background: '#ff2a85',
                color: '#fff',
                padding: '16px 34px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              SHOP NOW
            </Link>

            <Link
              href="#our-work"
              style={{
                border: '1px solid rgba(255,255,255,.2)',
                color: '#fff',
                padding: '16px 34px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              VIEW OUR WORK
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              aspectRatio: '1 / 1',
              borderRadius: '30px',
              background:
                'linear-gradient(145deg,#141414,#090909)',
              border: '1px solid rgba(255,255,255,.08)',
              boxShadow: '0 0 80px rgba(255,42,133,.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#777',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            3D PRODUCT SHOWCASE
            <br />
            (Coming Next)
          </div>
        </div>
      </div>
    </section>
  );
}