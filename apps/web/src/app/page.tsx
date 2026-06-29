import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
        Welcome to <span style={{ color: 'var(--accent-primary)' }}>Chessome</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
        The world's most powerful open-source chess analysis platform. 
        Start exploring engine evaluations, opening repertoires, and insightful analytics.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/analyze/mock" passHref>
          <Button size="lg" variant="primary">
            Analyze Game (Mock)
          </Button>
        </Link>
        <Link href="/sandbox" passHref>
          <Button size="lg" variant="secondary">
            View Components
          </Button>
        </Link>
      </div>
    </div>
  );
}
