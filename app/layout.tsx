import React from 'react';
import Script from 'next/script';
import Navbar from '../components/layout/Navbar';
import './globals.css';

export const metadata = {
  title: 'QMZWERKZ // Luxury FiveM Marketplace',
  description: 'Premium FiveM assets, custom skins, and automated delivery marketplace.',
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