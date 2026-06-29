import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Chessboard } from '../../../../components/chess/Chessboard';

export function InteractiveBoard() {
  const { currentPly, scrubPly } = useAnalysisStore();

  const activePly = scrubPly ?? currentPly;

  // Mocking FEN derivation from ply (since we don't have a real PGN replayer in the UI yet)
  // We'll just slightly mutate a FEN for demonstration purposes based on the ply count
  let f = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  if (activePly > 0) f = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
  if (activePly > 1) f = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2';
  if (activePly > 2) f = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2';
  if (activePly > 3) f = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <Chessboard fen={f} />
    </div>
  );
}
