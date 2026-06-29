import React from 'react';

// Very minimal inline SVG pieces for MVP
export const PieceRenderer = ({ piece }: { piece: string }) => {
  const isWhite = piece === piece.toUpperCase();
  const fill = isWhite ? '#ffffff' : '#000000';
  const stroke = isWhite ? '#000000' : '#ffffff';
  
  const pieceMap: Record<string, React.ReactNode> = {
    'p': <circle cx="50" cy="50" r="30" fill={fill} stroke={stroke} strokeWidth="4" />,
    'r': <rect x="25" y="25" width="50" height="50" fill={fill} stroke={stroke} strokeWidth="4" />,
    'n': <path d="M 30,70 L 40,30 L 60,30 L 70,50 L 50,70 Z" fill={fill} stroke={stroke} strokeWidth="4" />,
    'b': <polygon points="50,20 70,70 30,70" fill={fill} stroke={stroke} strokeWidth="4" />,
    'q': <polygon points="20,20 35,40 50,20 65,40 80,20 70,80 30,80" fill={fill} stroke={stroke} strokeWidth="4" />,
    'k': <path d="M 40,30 L 60,30 M 50,20 L 50,70 M 30,80 L 70,80" stroke={fill} strokeWidth="10" strokeLinecap="round" />
  };

  const node = pieceMap[piece.toLowerCase()];
  if (!node) return null;

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
      {node}
    </svg>
  );
};
