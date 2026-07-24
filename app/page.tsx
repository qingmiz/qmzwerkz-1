import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OurWork from '@/components/home/OurWork';
import Services from '@/components/home/Services';
import LuckyWheelBanner from '@/components/home/LuckyWheelBanner';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <OurWork />

      <Services />

      <LuckyWheelBanner />

      <Footer />
    </>
  );
}