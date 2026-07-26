import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// Completes the Discord OAuth flow: exchanges the ?code= param for a real
// Supabase session, then redirects the user into the site.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
