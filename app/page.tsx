import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OurWork from '@/components/home/OurWork';
import Services from '@/components/home/Services';
import ProductSearchBar from '@/components/home/ProductSearchBar';
import LuckyWheelBanner from '@/components/home/LuckyWheelBanner';
import ClientReviews from '@/components/home/ClientReviews';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <ProductSearchBar />

      <LuckyWheelBanner />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <OurWork />

      <Services />

      <ClientReviews />

      <Footer />
    </>
  );
}