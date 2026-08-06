import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase-admin';

// This layout exists purely to generate per-product Open Graph/Twitter
// metadata - the actual page (page.tsx) is a client component and can't
// export generateMetadata itself, but a layout wrapping it can.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const admin = createAdminClient();
    const { data: product } = await admin
      .from('products')
      .select('name, short_description, cover_image, price')
      .eq('id', id)
      .maybeSingle();

    if (!product) {
      return { title: 'Product // QMZWERKZ.ZIP' };
    }

    const title = `${product.name} // QMZWERKZ.ZIP`;
    const description =
      product.short_description || `$${product.price} - Premium FiveM asset from QMZWERKZ.ZIP.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.cover_image ? [{ url: product.cover_image, width: 1200, height: 630 }] : undefined,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.cover_image ? [product.cover_image] : undefined,
      },
    };
  } catch {
    return { title: 'Product // QMZWERKZ.ZIP' };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
