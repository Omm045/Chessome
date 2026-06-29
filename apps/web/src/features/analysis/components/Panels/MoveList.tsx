import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Panel } from '../../../../components/ui/Panel';
import { FileClock } from 'lucide-react';
import { PositionCompletedEventDto } from '@chessome/types';

export function MoveList() {
  const { currentPly, scrubPly, setScrubPly, evaluations } = useAnalysisStore();

  const activePly = scrubPly ?? currentPly;

  // Mock a basic move list derived from the ply count
  // In a real implementation, this requires full PGN parsing to standard algebraic notation.
  const moves = Array.from({ length: currentPly }, (_, i) => i + 1);

  return (
    <Panel padding="none" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <FileClock size={18} />
        <span>Game Record</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr', gap: '0.25rem', fontSize: '0.9rem' }}>
          {moves.map((ply) => {
            if (ply % 2 === 0) return null; // Only render on White's turn (odd plies)
            const moveNum = Math.ceil(ply / 2);
            
            return (
              <React.Fragment key={moveNum}>
                <div style={{ color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '0.5rem', alignSelf: 'center' }}>
                  {moveNum}.
                </div>
                
                <MoveButton 
                  ply={ply}
                  isActive={activePly === ply}
                  evalData={evaluations[ply]}
                  onClick={() => setScrubPly(ply)}
                />
                
                {ply + 1 <= currentPly && (
                  <MoveButton 
                    ply={ply + 1}
                    isActive={activePly === ply + 1}
                    evalData={evaluations[ply + 1]}
                    onClick={() => setScrubPly(ply + 1)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function MoveButton({ ply, isActive, evalData, onClick }: { ply: number, isActive: boolean, evalData: PositionCompletedEventDto | undefined, onClick: () => void }) {
  // Determine icon/color based on classification
  let color = 'inherit';
  if (evalData?.classification === 'blunder') color = 'var(--eval-blunder)';
  else if (evalData?.classification === 'mistake') color = 'var(--eval-mistake)';
  else if (evalData?.classification === 'inaccuracy') color = 'var(--eval-inaccuracy)';
  else if (evalData?.classification === 'good') color = 'var(--eval-good)';
  else if (evalData?.classification === 'brilliant') color = 'var(--eval-brilliant)';

  return (
    <button
      onClick={onClick}
      style={{
        background: isActive ? 'var(--bg-secondary)' : 'transparent',
        border: 'none',
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        textAlign: 'left',
        fontWeight: isActive ? 600 : 400,
        display: 'flex',
        justifyContent: 'space-between',
        transition: 'background-color 0.1s'
      }}
      onMouseOver={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
      onMouseOut={(e) => { if(!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <span>{evalData?.san || `Move ${ply}`}</span>
      {evalData?.classification && (
        <span style={{ color, fontWeight: 800 }}>
          {evalData.classification === 'blunder' ? '??' : evalData.classification === 'brilliant' ? '!!' : evalData.classification === 'mistake' ? '?' : '!'}
        </span>
      )}
    </button>
  );
}
