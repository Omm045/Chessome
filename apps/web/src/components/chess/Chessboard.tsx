import React from 'react';
import clsx from 'clsx';
import './Chessboard.css';
import { PieceRenderer } from './Pieces';

export interface ChessboardProps {
  fen?: string;
  orientation?: 'white' | 'black';
  className?: string;
  arrows?: { from: string; to: string; color?: string }[];
  highlightSquares?: { square: string; color?: string }[];
}

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function Chessboard({
  fen = DEFAULT_FEN,
  orientation = 'white',
  className,
  arrows = [],
  highlightSquares = []
}: ChessboardProps) {
  const boardFen = fen.split(' ')[0];
  const rows = boardFen.split('/');
  
  const boardData: (string | null)[][] = [];

  rows.forEach(row => {
    const rowData: (string | null)[] = [];
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (/\d/.test(char)) {
        const spaces = parseInt(char, 10);
        for (let s = 0; s < spaces; s++) {
          rowData.push(null);
        }
      } else {
        rowData.push(char);
      }
    }
    boardData.push(rowData);
  });

  if (orientation === 'black') {
    boardData.reverse();
    boardData.forEach(r => r.reverse());
  }

  const ranks = orientation === 'white' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const files = orientation === 'white' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];

  return (
    <div className={clsx('chessboard-container', className)}>
      <div className="chessboard-grid">
        {boardData.map((row, rIdx) => (
          row.map((piece, fIdx) => {
            const isDark = (rIdx + fIdx) % 2 !== 0;
            return (
              <div 
                key={`${rIdx}-${fIdx}`} 
                className={clsx(
                  'chess-square relative', 
                  isDark ? 'square-dark' : 'square-light',
                  highlightSquares.find(h => h.square === `${files[fIdx]}${ranks[rIdx]}`) && 'bg-yellow-400/50'
                )}
              >
                {/* Coordinates */}
                {fIdx === 0 && (
                  <span className="coord coord-rank">{ranks[rIdx]}</span>
                )}
                {rIdx === 7 && (
                  <span className="coord coord-file">{files[fIdx]}</span>
                )}
                
                {/* Piece */}
                {piece && (
                  <div className="chess-piece-wrapper">
                    <PieceRenderer piece={piece} />
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* SVG Overlay for arrows */}
      {arrows.length > 0 && (
        <svg 
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          viewBox="0 0 800 800"
        >
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(59, 130, 246, 0.6)" />
            </marker>
          </defs>
          {arrows.map((a, idx) => {
            const f1 = files.indexOf(a.from[0]);
            const r1 = ranks.indexOf(parseInt(a.from[1], 10));
            const f2 = files.indexOf(a.to[0]);
            const r2 = ranks.indexOf(parseInt(a.to[1], 10));

            if (f1 === -1 || r1 === -1 || f2 === -1 || r2 === -1) return null;

            const x1 = (f1 + 0.5) * 100;
            const y1 = (r1 + 0.5) * 100;
            const x2 = (f2 + 0.5) * 100;
            const y2 = (r2 + 0.5) * 100;

            // Offset the end so arrow head doesn't go all the way to center
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const trim = 35; // trim 35 units (out of 800) from end
            
            const ex = x1 + dx * ((len - trim) / len);
            const ey = y1 + dy * ((len - trim) / len);

            return (
              <line 
                key={idx}
                x1={x1} y1={y1} x2={ex} y2={ey}
                stroke={a.color || 'rgba(59, 130, 246, 0.6)'} 
                strokeWidth="16"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
