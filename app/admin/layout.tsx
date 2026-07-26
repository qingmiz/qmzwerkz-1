'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayoutShell from '@/components/admin/AdminLayout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/admin/login');
        return;
      }

      try {
        const verifyRes = await fetch('/api/admin/verify-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: session.access_token }),
        });

        const verify = await verifyRes.json();

        if (!verify.isAdmin) {
          router.replace('/admin/login');
          return;
        }

        setAuthorized(true);
        setChecking(false);
      } catch {
        router.replace('/admin/login');
      }
    }

    checkAdmin();
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
