import { Suspense } from 'react';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#888' }}>
          Loading assets...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
