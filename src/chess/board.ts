import type { Board, Piece } from './types';

export const getInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  board[0] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  board[1] = Array(8).fill('p');
  board[6] = Array(8).fill('P');
  board[7] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

  return board;
};

export const isWhitePiece = (piece: Piece): boolean => !!piece && piece === piece.toUpperCase();
export const isBlackPiece = (piece: Piece): boolean => !!piece && piece === piece.toLowerCase();
export const getPieceType = (piece: Piece): string | null => piece ? piece.toUpperCase() : null;

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const getPieceAt = (board: Board, row: number, col: number): Piece => {
  return isValidPosition(row, col) ? board[row][col] : null;
};

export const findKing = (board: Board, isWhite: boolean): [number, number] | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && getPieceType(piece) === 'K' && isWhitePiece(piece) === isWhite) {
        return [row, col];
      }
    }
  }
  return null;
};
