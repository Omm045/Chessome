import React, { useRef, useEffect } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Panel } from '../../../../components/ui/Panel';

export function EvaluationGraph() {
  const { currentPly, scrubPly, evaluations, setScrubPly } = useAnalysisStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const activePly = scrubPly ?? currentPly;

  // Simple Canvas render for the evaluation line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw center line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (evaluations.length < 2) return;

    // Draw graph line
    ctx.beginPath();
    ctx.strokeStyle = 'var(--accent-primary)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    const stepX = width / Math.max(evaluations.length - 1, 40);

    evaluations.forEach((ev, i) => {
      if (!ev) return;
      const x = i * stepX;
      // Clamp between -500 and +500 CP for visualization
      const val = ev.evaluation.type === 'mate' 
        ? (ev.evaluation.value > 0 ? 500 : -500) 
        : Math.max(-500, Math.min(500, ev.evaluation.value));
      
      const normalized = (val + 500) / 1000; // 0 to 1
      const y = height - (normalized * height);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

  }, [evaluations]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (evaluations.length < 2) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const stepX = rect.width / Math.max(evaluations.length - 1, 40);
    const ply = Math.round(x / stepX);
    if (ply >= 0 && ply < evaluations.length) {
      setScrubPly(ply);
    }
  };

  const handleMouseLeave = () => {
    setScrubPly(null);
  };

  // Calculate playhead position
  const maxPlies = Math.max(evaluations.length - 1, 40);
  const playheadPercent = maxPlies > 0 ? (activePly / maxPlies) * 100 : 0;

  return (
    <Panel padding="sm" style={{ width: '100%', height: '120px', display: 'flex' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <canvas 
          ref={canvasRef}
          width={800} // Internal resolution
          height={100} // Internal resolution
          style={{ width: '100%', height: '100%', cursor: 'crosshair', display: 'block' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Playhead Indicator */}
        {evaluations.length > 0 && activePly > 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${playheadPercent}%`,
            width: '2px',
            backgroundColor: 'var(--accent-primary)',
            pointerEvents: 'none',
            transition: 'left 0.1s ease-out',
            boxShadow: '0 0 8px var(--accent-primary)',
            zIndex: 10
          }} />
        )}
      </div>
    </Panel>
  );
}
