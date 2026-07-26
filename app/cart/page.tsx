import { Suspense } from 'react';
import CartContent from './CartContent';

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#888' }}>
          Loading cart...
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
