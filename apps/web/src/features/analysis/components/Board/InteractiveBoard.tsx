import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Chessboard } from '../../../../components/chess/Chessboard';

export function InteractiveBoard() {
  const { currentPly, scrubPly, evaluations } = useAnalysisStore();

  const activePly = scrubPly ?? currentPly;

  // Read the FEN from the evaluations array. Fallback to starting position if not available.
  const evaluation = evaluations[activePly];
  const f = evaluation?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <Chessboard fen={f} />
    </div>
  );
}
