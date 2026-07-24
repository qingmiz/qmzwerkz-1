'use client';

import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import LuckyWheelBanner from '../components/home/LuckyWheelBanner';
import Features from '../components/home/Features';
import Newsletter from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <Categories />
      <FeaturedProducts />
      <LuckyWheelBanner />
      <Features />
      <Newsletter />
    </main>
  );
}