import { getPieceType, isWhitePiece } from './board';
import { PIECE_VALUES, POS_WEIGHT, PST } from './constants';
import type { Board, LegalMove } from './types';

export const evaluateBoard = (board: Board): number => {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const pieceType = getPieceType(piece);
      if (!pieceType) continue;
      const isWhite = isWhitePiece(piece);
      let value = PIECE_VALUES[pieceType];

      const pstIndex = isWhite ? row * 8 + col : (7 - row) * 8 + col;
      value += POS_WEIGHT * PST[pieceType][pstIndex];
      score += isWhite ? value : -value;
    }
  }

  return score;
};

export const isCaptureMove = (board: Board, move: LegalMove): boolean => {
  const [toRow, toCol, special] = move.to;
  if (special === 'enPassant') return true;
  return !!board[toRow][toCol];
};

export const getMVVLVAScore = (board: Board, move: LegalMove): number => {
  if (!isCaptureMove(board, move)) return 0;

  const [fr, fc] = move.from;
  const [toRow, toCol, special] = move.to;
  const attacker = board[fr][fc];
  const attackerType = getPieceType(attacker);
  const attackerValue = attackerType ? PIECE_VALUES[attackerType] || 0 : 0;

  let victimValue = 0;
  if (special === 'enPassant') {
    victimValue = PIECE_VALUES.P;
  } else {
    const victim = board[toRow][toCol];
    const victimType = getPieceType(victim);
    if (victimType) victimValue = PIECE_VALUES[victimType] || 0;
  }

  return victimValue * 10 - attackerValue;
};
