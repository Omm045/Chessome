import React, { useRef, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAnalysisStore } from '../../store/analysisStore';
import { Panel } from '../../../../components/ui/Panel';

export function EvaluationGraph() {
  const { currentPly, scrubPly, evaluations, setScrubPly } = useAnalysisStore(
    useShallow((state) => ({
      currentPly: state.currentPly,
      scrubPly: state.scrubPly,
      evaluations: state.evaluations,
      setScrubPly: state.setScrubPly
    }))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activePly = scrubPly ?? currentPly;

  const maxPlies = Math.max(evaluations.length - 1, 40);

  // Generate SVG path data
  const { pathData, areaData } = useMemo(() => {
    if (evaluations.length < 2) return { pathData: '', areaData: '', points: [] };

    const points: { x: number, y: number, ply: number, val: number }[] = [];
    
    evaluations.forEach((ev, i) => {
      if (!ev) return;
      const xPercent = (i / maxPlies) * 100;
      
      // Clamp between -500 and +500 CP for visualization
      const val = ev.evaluation.type === 'mate' 
        ? (ev.evaluation.value > 0 ? 500 : -500) 
        : Math.max(-500, Math.min(500, ev.evaluation.value));
      
      // Normalize to 0-100% where 50% is 0.00
      const yPercent = 100 - ((val + 500) / 1000) * 100;
      
      points.push({ x: xPercent, y: yPercent, ply: i, val });
    });

    if (points.length === 0) return { pathData: '', areaData: '', points: [] };

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // For area, we need to close the path down to the center line (y=50)
    const firstP = points[0];
    const lastP = points[points.length - 1];
    const areaData = `${pathData} L ${lastP.x} 50 L ${firstP.x} 50 Z`;

    return { pathData, areaData, points };
  }, [evaluations, maxPlies]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (evaluations.length < 2 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const ply = Math.round(xPercent * maxPlies);
    if (ply >= 0 && ply < evaluations.length) {
      setScrubPly(ply);
    }
  };

  const handleMouseLeave = () => {
    setScrubPly(null);
  };

  const playheadPercent = maxPlies > 0 ? (activePly / maxPlies) * 100 : 0;

  return (
    <Panel padding="sm" style={{ width: '100%', height: '120px', display: 'flex', flexDirection: 'column' }}>
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-crosshair overflow-hidden rounded-md"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full"
        >
          {/* Background indicating White/Black advantage areas loosely */}
          <rect x="0" y="0" width="100" height="50" fill="rgba(255, 255, 255, 0.02)" />
          <rect x="0" y="50" width="100" height="50" fill="rgba(0, 0, 0, 0.2)" />
          
          {/* Center line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          
          {/* Fill Area */}
          {areaData && (
            <defs>
              <linearGradient id="evalGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          )}
          {areaData && (
            <path 
              d={areaData} 
              fill="url(#evalGradient)" 
            />
          )}

          {/* Main Line */}
          {pathData && (
            <path 
              d={pathData} 
              fill="none" 
              stroke="var(--accent-primary)" 
              strokeWidth="2" 
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Playhead Indicator */}
        {evaluations.length > 0 && activePly > 0 && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${playheadPercent}%` }}
          />
        )}
      </div>
    </Panel>
  );
}
