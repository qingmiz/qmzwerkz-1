import React from 'react';
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}