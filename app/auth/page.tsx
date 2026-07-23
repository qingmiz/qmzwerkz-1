'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('Success! Check your email to confirm your account.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('Successfully signed in!');
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#111',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: '12px',
          padding: '32px',
          color: '#fff',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '26px',
            fontWeight: 800,
          }}
        >
          QMZ<span style={{ color: '#ec4899' }}>WERKZ</span>.ZIP
        </h1>

        <form
          onSubmit={handleAuth}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#1a1a1a',
              color: '#fff',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#1a1a1a',
              color: '#fff',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: '#ec4899',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {loading
              ? 'Processing...'
              : isSignUp
              ? 'Create Account'
              : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>

          {status && (
            <p
              style={{
                textAlign: 'center',
                color: status.startsWith('Error')
                  ? '#ef4444'
                  : '#10b981',
              }}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}