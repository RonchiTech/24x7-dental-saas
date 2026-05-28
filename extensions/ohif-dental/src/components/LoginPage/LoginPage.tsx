import React, { useState } from 'react';

interface Props { apiBase: string; onSuccess: () => void; }

export default function LoginPage({ apiBase, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Login failed'); return; }
    localStorage.setItem('dental_jwt', data.token);
    onSuccess();
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f5f5', fontFamily: 'var(--font-family, system-ui)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: '6px', border: '1px solid #ddd', width: '320px' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '16px', fontWeight: 600 }}>Sign in to Dental Viewer</h2>

        <label htmlFor="email" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: '14px', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '13px' }} />

        <label htmlFor="password" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: '14px', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '13px' }} />

        {error && <p style={{ color: '#c0392b', fontSize: '12px', margin: '0 0 12px' }}>{error}</p>}

        <button type="submit"
          style={{ width: '100%', background: '#2c7a7b', color: '#fff', border: 'none', padding: '8px', borderRadius: '3px', fontSize: '13px', cursor: 'pointer' }}>
          Sign in
        </button>
      </form>
    </div>
  );
}
