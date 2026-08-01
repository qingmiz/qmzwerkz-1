import ReviewsPageContent from '@/components/reviews/ReviewsPageContent';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Client Reviews | QMZ WERKZ',
  description: 'Read verified customer reviews and testimonials from QMZ WERKZ clients.',
  openGraph: {
    title: 'Client Reviews | QMZ WERKZ',
    description: 'Read verified customer reviews and testimonials from QMZ WERKZ clients.',
    url: 'https://qmzwerkz-1.vercel.app/reviews',
    siteName: 'QMZWERKZ.ZIP',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QMZ WERKZ Client Reviews',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client Reviews | QMZ WERKZ',
    description: 'Read verified customer reviews and testimonials from QMZ WERKZ clients.',
    images: ['/og-image.png'],
  },
};

export default function ReviewsPage() {
  return (
    <>
      <ReviewsPageContent />
      <Footer />
    </>
  );
}
