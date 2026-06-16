import { getPieceType, isWhitePiece } from './board';
import type { Board, CastlingRights, MoveTarget, Square } from './types';

export interface MoveApplication {
  newBoard: Board;
  newCastlingRights: CastlingRights;
  newEnPassant: Square | null;
  capturedPiece: string | null;
  piece: string | null;
  pieceType: string | null;
  isWhite: boolean;
  special?: string;
  toRow: number;
  toCol: number;
}

export const unpackMoveTarget = (to: MoveTarget): [number, number, string | undefined] => {
  const [toRow, toCol, special] = to;
  return [toRow, toCol, special];
};

export const applyMoveToBoard = (
  board: Board,
  from: Square,
  to: MoveTarget,
  castlingRights: CastlingRights
): MoveApplication => {
  const newBoard = board.map(row => [...row]);
  const [fromRow, fromCol] = from;
  const [toRow, toCol, special] = unpackMoveTarget(to);

  const piece = newBoard[fromRow][fromCol];
  const pieceType = getPieceType(piece);
  const isWhite = isWhitePiece(piece);
  let capturedPiece = newBoard[toRow][toCol];

  if (special === 'enPassant') {
    const capturedPawnRow = isWhite ? toRow + 1 : toRow - 1;
    capturedPiece = newBoard[capturedPawnRow][toCol];
    newBoard[capturedPawnRow][toCol] = null;
  }

  if (special === 'castleKingside') {
    const homeRow = isWhite ? 7 : 0;
    newBoard[homeRow][5] = newBoard[homeRow][7];
    newBoard[homeRow][7] = null;
  } else if (special === 'castleQueenside') {
    const homeRow = isWhite ? 7 : 0;
    newBoard[homeRow][3] = newBoard[homeRow][0];
    newBoard[homeRow][0] = null;
  }

  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;

  if (pieceType === 'P' && (toRow === 0 || toRow === 7)) {
    newBoard[toRow][toCol] = isWhite ? 'Q' : 'q';
  }

  const newCastlingRights = { ...castlingRights };
  if (pieceType === 'K') {
    if (isWhite) {
      newCastlingRights.whiteKingside = false;
      newCastlingRights.whiteQueenside = false;
    } else {
      newCastlingRights.blackKingside = false;
      newCastlingRights.blackQueenside = false;
    }
  }

  if (pieceType === 'R') {
    if (isWhite && fromRow === 7) {
      if (fromCol === 7) newCastlingRights.whiteKingside = false;
      if (fromCol === 0) newCastlingRights.whiteQueenside = false;
    } else if (!isWhite && fromRow === 0) {
      if (fromCol === 7) newCastlingRights.blackKingside = false;
      if (fromCol === 0) newCastlingRights.blackQueenside = false;
    }
  }

  if (capturedPiece && getPieceType(capturedPiece) === 'R') {
    if (isWhitePiece(capturedPiece) && toRow === 7) {
      if (toCol === 7) newCastlingRights.whiteKingside = false;
      if (toCol === 0) newCastlingRights.whiteQueenside = false;
    } else if (!isWhitePiece(capturedPiece) && toRow === 0) {
      if (toCol === 7) newCastlingRights.blackKingside = false;
      if (toCol === 0) newCastlingRights.blackQueenside = false;
    }
  }

  let newEnPassant: Square | null = null;
  if (special === 'doublePawn') {
    const epRow = isWhite ? fromRow - 1 : fromRow + 1;
    newEnPassant = [epRow, fromCol];
  }

  return {
    newBoard,
    newCastlingRights,
    newEnPassant,
    capturedPiece,
    piece,
    pieceType,
    isWhite,
    special,
    toRow,
    toCol
  };
};

export const simulateMove = (
  board: Board,
  from: Square,
  to: MoveTarget,
  castlingRights: CastlingRights
) => {
  const { newBoard, newCastlingRights, newEnPassant } = applyMoveToBoard(board, from, to, castlingRights);
  return { newBoard, newCastlingRights, newEnPassant };
};

export const makeMoveNotation = (
  from: Square,
  toRow: number,
  toCol: number,
  special: string | undefined,
  capturedPiece: string | null
): string => {
  const [fromRow, fromCol] = from;
  let moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}`;
  if (special === 'castleKingside') moveNotation = 'O-O';
  if (special === 'castleQueenside') moveNotation = 'O-O-O';
  if (capturedPiece) moveNotation += 'x';
  return moveNotation;
};
