import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Panel } from '../../../../components/ui/Panel';
import { Settings2, Cpu } from 'lucide-react';

export function EnginePanel() {
  const { depth, nodes, nps, currentPv, status } = useAnalysisStore();

  const isAnalyzing = status === 'running';

  const formatNodes = (n: number) => {
    if (n > 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n > 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <Panel padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', minHeight: '150px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Cpu size={18} color={isAnalyzing ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          <span>Stockfish 16.1</span>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Settings2 size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Depth:</span> {depth}</div>
        <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Nodes:</span> {formatNodes(nodes)}</div>
        <div><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NPS:</span> {formatNodes(nps)}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.875rem', fontFamily: 'monospace', lineHeight: 1.6, paddingRight: '0.5rem' }}>
        {currentPv.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {currentPv.map((move, i) => (
              <span key={i} style={{ color: i === 0 ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: i === 0 ? 600 : 400 }}>
                {move}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>Awaiting engine data...</span>
        )}
      </div>
    </Panel>
  );
}
