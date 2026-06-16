import React from 'react';

interface ChessPieceProps {
  piece: string;
  size?: number;
}

const ChessPiece = ({ piece, size = 48 }: ChessPieceProps) => {
  const isWhite = piece === piece.toUpperCase();
  const pieceType = piece.toUpperCase();
  const fillColor = isWhite ? '#ffffff' : '#000000';
  const strokeColor = isWhite ? '#000000' : '#ffffff';
  const strokeWidth = isWhite ? 2 : 0.5;

  const pieces: Record<string, React.ReactNode> = {
    K: (
      <g>
        <path d="M22,10 L27,10 L27,5 L30,5 L30,10 L35,10 L35,13 L30,13 L30,18 L27,18 L27,13 L22,13 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="28.5" cy="28" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M15,38 Q28.5,32 42,38 L40,44 Q28.5,40 17,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="45" rx="13" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    ),
    Q: (
      <g>
        <circle cx="28.5" cy="13" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="20" cy="16" r="2.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="37" cy="16" r="2.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="16" cy="22" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="41" cy="22" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="28.5" cy="27" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M15,38 Q28.5,32 42,38 L40,44 Q28.5,40 17,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="45" rx="13" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    ),
    R: (
      <g>
        <rect x="18" y="10" width="6" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <rect x="25" y="12" width="7" height="6" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <rect x="33" y="10" width="6" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <rect x="20" y="18" width="17" height="18" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M16,36 L41,36 L39,44 L18,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    ),
    B: (
      <g>
        <circle cx="28.5" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M28.5,15 L32,20 L25,20 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="27" rx="6" ry="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M16,38 Q28.5,32 41,38 L39,44 Q28.5,40 18,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    ),
    N: (
      <g>
        <path d="M20,12 Q24,8 30,10 Q34,8 36,12 L36,24 Q32,28 28,28 Q24,28 22,24 L22,18 L18,20 L18,16 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="32" cy="14" r="1.5" fill={strokeColor} />
        <path d="M16,38 Q28.5,32 41,38 L39,44 Q28.5,40 18,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    ),
    P: (
      <g>
        <circle cx="28.5" cy="18" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <path d="M20,24 Q28.5,28 37,24 L36,38 L21,38 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <ellipse cx="28.5" cy="43" rx="10" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    )
  };

  return (
    <svg width={size} height={size} viewBox="0 0 57 57" style={{ display: 'block' }}>
      {pieces[pieceType]}
    </svg>
  );
};

export default ChessPiece;
