import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAnalysisStore } from '../../store/analysisStore';
import { FileClock } from 'lucide-react';
import { PositionCompletedEventDto } from '@chessome/types';

export function MoveList() {
  const { currentPly, scrubPly, setScrubPly, evaluations } = useAnalysisStore(
    useShallow((state) => ({
      currentPly: state.currentPly,
      scrubPly: state.scrubPly,
      setScrubPly: state.setScrubPly,
      evaluations: state.evaluations
    }))
  );
  const activeMoveRef = useRef<HTMLButtonElement>(null);

  const activePly = scrubPly ?? currentPly;

  useEffect(() => {
    if (activeMoveRef.current) {
      activeMoveRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePly]);

  // Mock a basic move list derived from the ply count
  // In a real implementation, this requires full PGN parsing to standard algebraic notation.
  const moves = Array.from({ length: currentPly }, (_, i) => i + 1);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900/80 px-4 py-3 text-sm font-semibold text-gray-200">
        <FileClock size={16} className="text-gray-400" />
        <span>Game Record</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700">
        <div className="grid grid-cols-[36px_1fr_1fr] gap-x-2 gap-y-1 text-[13px]">
          {moves.map((ply) => {
            if (ply % 2 === 0) return null; // Only render on White's turn (odd plies)
            const moveNum = Math.ceil(ply / 2);
            
            return (
              <React.Fragment key={moveNum}>
                <div className="flex items-center justify-end pr-2 font-mono text-gray-500">
                  {moveNum}.
                </div>
                
                <MoveButton 
                  ply={ply}
                  isActive={activePly === ply}
                  evalData={evaluations[ply]}
                  onClick={() => setScrubPly(ply)}
                  ref={activePly === ply ? activeMoveRef : null}
                />
                
                {ply + 1 <= currentPly && (
                  <MoveButton 
                    ply={ply + 1}
                    isActive={activePly === ply + 1}
                    evalData={evaluations[ply + 1]}
                    onClick={() => setScrubPly(ply + 1)}
                    ref={activePly === ply + 1 ? activeMoveRef : null}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const MoveButton = React.forwardRef<HTMLButtonElement, { ply: number, isActive: boolean, evalData: PositionCompletedEventDto | undefined, onClick: () => void }>(
  ({ ply, isActive, evalData, onClick }, ref) => {
  
  // Determine text color class based on classification
  let colorClass = 'text-gray-400';
  if (evalData?.classification === 'blunder') colorClass = 'text-red-500';
  else if (evalData?.classification === 'mistake') colorClass = 'text-orange-500';
  else if (evalData?.classification === 'inaccuracy') colorClass = 'text-yellow-500';
  else if (evalData?.classification === 'good') colorClass = 'text-green-500';
  else if (evalData?.classification === 'brilliant') colorClass = 'text-cyan-400';

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group flex items-center justify-between rounded px-2 py-1 transition-all ${
        isActive 
          ? 'bg-blue-600/20 font-semibold text-blue-400' 
          : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      <span className="font-mono">{evalData?.san || `Move ${ply}`}</span>
      {evalData?.classification && (
        <span className={`font-bold ${colorClass}`}>
          {evalData.classification === 'blunder' ? '??' : evalData.classification === 'brilliant' ? '!!' : evalData.classification === 'mistake' ? '?' : '!'}
        </span>
      )}
    </button>
  );
});

MoveButton.displayName = 'MoveButton';
