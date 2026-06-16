import React, { useState } from 'react';

interface ChessPieceProps {
  piece: string;
  size?: number;
}

const PIECE_THEME_BASE_URL = 'https://chessboardjs.com/img/chesspieces/wikipedia';

const PIECE_SYMBOLS: Record<string, number> = {
  K: 0x2654,
  Q: 0x2655,
  R: 0x2656,
  B: 0x2657,
  N: 0x2658,
  P: 0x2659,
  k: 0x265a,
  q: 0x265b,
  r: 0x265c,
  b: 0x265d,
  n: 0x265e,
  p: 0x265f
};

const PIECE_NAMES: Record<string, string> = {
  K: 'King',
  Q: 'Queen',
  R: 'Rook',
  B: 'Bishop',
  N: 'Knight',
  P: 'Pawn'
};

const ChessPiece = ({ piece, size = 48 }: ChessPieceProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const isWhite = piece === piece.toUpperCase();
  const pieceType = piece.toUpperCase();
  const pieceCode = `${isWhite ? 'w' : 'b'}${pieceType}`;
  const pieceName = `${isWhite ? 'White' : 'Black'} ${PIECE_NAMES[pieceType]}`;

  if (imageFailed) {
    return (
      <span
        aria-label={pieceName}
        role="img"
        style={{
          display: 'block',
          width: size,
          height: size,
          fontSize: Math.round(size * 0.78),
          lineHeight: `${size}px`,
          textAlign: 'center',
          color: isWhite ? '#f8fafc' : '#111827',
          textShadow: isWhite
            ? '0 1px 2px rgba(17, 24, 39, 0.95), 0 0 1px rgba(17, 24, 39, 0.95)'
            : '0 1px 1px rgba(255, 255, 255, 0.7)'
        }}
      >
        {String.fromCodePoint(PIECE_SYMBOLS[piece])}
      </span>
    );
  }

  return (
    <img
      src={`${PIECE_THEME_BASE_URL}/${pieceCode}.png`}
      alt={pieceName}
      draggable={false}
      onError={() => setImageFailed(true)}
      style={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    />
  );
};

export default ChessPiece;
