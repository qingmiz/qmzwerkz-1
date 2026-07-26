'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page was a non-functional duplicate of /admin/marketplace (its
// "Publish" button only console.logged and never touched Supabase).
// /admin/marketplace is the real, working product-creation form, so we
// redirect here instead of leaving a dead end for anyone with this URL saved.
export default function NewProductRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/marketplace');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Redirecting to the product editor...
    </div>
  );
}
