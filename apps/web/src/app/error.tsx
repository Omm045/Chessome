'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--eval-blunder)' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        We experienced an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background-color var(--transition-fast)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
      >
        Try again
      </button>
    </div>
  );
}
