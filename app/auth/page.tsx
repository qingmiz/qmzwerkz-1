import { redirect } from 'next/navigation';

// This was an old email/password sign-up flow from before the site
// standardized on Discord-only auth. Accounts created here would have no
// Discord identity attached, which breaks the Lucky Wheel and other
// features that expect one. Nothing links here anymore, but redirect
// just in case someone has it bookmarked.
export default function AuthPageRedirect() {
  redirect('/login');
}
