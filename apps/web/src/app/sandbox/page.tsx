'use client';

import React from 'react';
import { Chessboard } from '../../components/chess/Chessboard';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';

export default function SandboxPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <section>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Design System Sandbox</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          A playground for verifying Phase 3.1 Frontend Foundation elements (Chessboard, UI components, Theme styling).
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Buttons Panel */}
        <Panel padding="lg">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Buttons</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </Panel>

        {/* Colors Panel */}
        <Panel padding="lg">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Evaluation Colors</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ColorSwatch color="var(--eval-brilliant)" label="Brilliant" />
            <ColorSwatch color="var(--eval-good)" label="Good" />
            <ColorSwatch color="var(--eval-inaccuracy)" label="Inaccuracy" />
            <ColorSwatch color="var(--eval-mistake)" label="Mistake" />
            <ColorSwatch color="var(--eval-blunder)" label="Blunder" />
          </div>
        </Panel>

      </div>

      {/* Chessboard Section */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Chessboard Component</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
            <Chessboard fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3" />
          </div>

          <Panel style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Board Controls (Mock)</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              This board uses pure CSS Grid and FEN parsing.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary">Flip Board</Button>
              <Button variant="primary">Analyze</Button>
            </div>
          </Panel>

        </div>
      </section>

    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '2rem', height: '2rem', backgroundColor: color, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}></div>
      <span style={{ fontWeight: 500 }}>{label}</span>
    </div>
  );
}
