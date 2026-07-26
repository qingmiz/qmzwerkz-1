import React from 'react';
import Script from 'next/script';
import Navbar from '../components/layout/Navbar';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://qmzwerkz-1.vercel.app'),
  title: 'QMZWERKZ // Luxury FiveM Marketplace',
  description: 'Premium FiveM assets, custom skins, and automated delivery marketplace.',
  openGraph: {
    title: 'QMZWERKZ.ZIP // Luxury FiveM Marketplace',
    description: 'Premium FiveM assets, custom skins, and automated delivery marketplace.',
    url: 'https://qmzwerkz-1.vercel.app',
    siteName: 'QMZWERKZ.ZIP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QMZWERKZ.ZIP',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QMZWERKZ.ZIP // Luxury FiveM Marketplace',
    description: 'Premium FiveM assets, custom skins, and automated delivery marketplace.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <Script src="https://js.tebex.io/v/1.js" strategy="afterInteractive" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}