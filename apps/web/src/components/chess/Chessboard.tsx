import React from 'react';
import clsx from 'clsx';
import './Chessboard.css';
import { PieceRenderer } from './Pieces';

export interface ChessboardProps {
  fen?: string;
  orientation?: 'white' | 'black';
  className?: string;
}

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function Chessboard({
  fen = DEFAULT_FEN,
  orientation = 'white',
  className
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
                className={clsx('chess-square', isDark ? 'square-dark' : 'square-light')}
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
    </div>
  );
}
