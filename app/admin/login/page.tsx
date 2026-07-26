'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      const verifyRes = await fetch('/api/admin/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: data.session?.access_token }),
      });

      const verify = await verifyRes.json();

      if (!verify.isAdmin) {
        await supabase.auth.signOut();

        setError(verify.error || 'You are not an admin.');
        setLoading(false);

        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Could not reach the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={login}
        style={{
          background: '#111',
          padding: 40,
          borderRadius: 12,
          width: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          border: '1px solid #222',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          QMZWERKZ Admin
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Signing In...' : 'Login'}
        </button>

        {error && (
          <div
            style={{
              color: '#ef4444',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '14px',
  background: '#161616',
  border: '1px solid #333',
  borderRadius: 8,
  color: '#fff',
};

const buttonStyle: React.CSSProperties = {
  padding: '15px',
  background: '#ec4899',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700,
};