'use client';

import { useEffect, useState } from 'react';

// Real, live counts pulled from /api/stats - deliberately NOT hardcoded
// marketing numbers. We don't show a numeric "average rating" stat here
// because MyVouches doesn't expose one through its embed/API, and we'd
// rather show nothing than a made-up figure.
export default function ReviewStats() {
  const [stats, setStats] = useState<{ happyClients: number; productsDelivered: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing worth bragging about yet - stay quiet rather than show 0s.
  if (!stats || (stats.happyClients === 0 && stats.productsDelivered === 0)) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
      {stats.happyClients > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-white/5 px-5 py-2 backdrop-blur-xl">
          <span className="text-lg">💗</span>
          <span className="text-sm font-bold text-white">{stats.happyClients}</span>
          <span className="text-sm text-zinc-400">Happy {stats.happyClients === 1 ? 'Client' : 'Clients'}</span>
        </div>
      )}

      {stats.productsDelivered > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-white/5 px-5 py-2 backdrop-blur-xl">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-bold text-white">{stats.productsDelivered}</span>
          <span className="text-sm text-zinc-400">
            {stats.productsDelivered === 1 ? 'Product' : 'Products'} Delivered
          </span>
        </div>
      )}
    </div>
  );
}
