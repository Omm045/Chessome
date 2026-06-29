import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAnalysisStore } from '../../store/analysisStore';
import { Chessboard } from '../../../../components/chess/Chessboard';

export function InteractiveBoard() {
  const { currentPly, scrubPly, evaluations, currentPv } = useAnalysisStore(
    useShallow((state) => ({
      currentPly: state.currentPly,
      scrubPly: state.scrubPly,
      evaluations: state.evaluations,
      currentPv: state.currentPv
    }))
  );

  const activePly = scrubPly ?? currentPly;
  const evaluation = evaluations[activePly];
  const f = evaluation?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Extract PV arrow from the engine evaluation
  const arrows = [];
  if (currentPv && currentPv.length > 0) {
    const firstPvMove = currentPv[0];
    // Simple algebraic parsing (e.g., 'e2e4' or 'e2e4q')
    if (firstPvMove.length >= 4) {
      const from = firstPvMove.substring(0, 2);
      const to = firstPvMove.substring(2, 4);
      arrows.push({ from, to, color: 'rgba(59, 130, 246, 0.6)' });
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Chessboard 
        fen={f} 
        arrows={arrows}
        className="max-h-full max-w-full"
      />
    </div>
  );
}
