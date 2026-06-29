import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Settings2, Cpu } from 'lucide-react';

export function EnginePanel() {
  const { depth, nodes, nps, currentPv, status, evaluations, currentPly } = useAnalysisStore();

  const isAnalyzing = status === 'running';

  const formatNodes = (n: number) => {
    if (n > 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n > 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const currentEval = evaluations[currentPly];
  
  // Format score based on centipawns vs mate
  let evalScoreStr = '';
  if (currentEval) {
    if (currentEval.evaluation.type === 'mate') {
      evalScoreStr = `M${Math.abs(currentEval.evaluation.value)}`;
    } else {
      const cp = currentEval.evaluation.value / 100;
      evalScoreStr = cp > 0 ? `+${cp.toFixed(2)}` : cp.toFixed(2);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-gray-200 text-sm">
          <Cpu size={16} className={isAnalyzing ? 'text-blue-500 animate-pulse' : 'text-gray-500'} />
          <span>Stockfish 16.1</span>
        </div>
        <div className="flex items-center gap-3">
          {evalScoreStr && (
            <span className="font-mono text-sm font-bold text-gray-200 bg-gray-800 px-2 py-0.5 rounded">
              {evalScoreStr}
            </span>
          )}
          <button className="text-gray-500 hover:text-white transition-colors">
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-xs font-mono text-gray-400 bg-gray-950">
        <div><span className="text-gray-500">depth</span> {depth}</div>
        <div><span className="text-gray-500">nodes</span> {formatNodes(nodes)}</div>
        <div><span className="text-gray-500">nps</span> {formatNodes(nps)}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-sm font-mono text-gray-300">
        {status === 'queued' ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-800"></div>
          </div>
        ) : currentPv.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 leading-relaxed">
            {currentPv.map((move, i) => (
              <span 
                key={i} 
                className={`${
                  i === 0 
                    ? 'font-bold text-blue-400 bg-blue-900/20 px-1 rounded' 
                    : 'text-gray-400'
                }`}
              >
                {move}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-600">Awaiting engine data...</span>
        )}
      </div>
    </div>
  );
}
