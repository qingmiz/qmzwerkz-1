import FeaturedProducts from '@/components/home/FeaturedProducts';
import OurWork from '@/components/home/OurWork';
import Footer from '@/components/layout/Footer';

export default function OurWorkPage() {
  return (
    <>
      <div className="pt-12">
        <FeaturedProducts />
      </div>
      <OurWork />
      <Footer />
    </>
  );
}
