import { getPieceType } from './board';
import type { MoveApplication } from './moves';
import { getAllLegalMoves, isInCheck } from './rules';
import type { Board, CastlingRights, Square } from './types';

const fileName = (col: number): string => String.fromCharCode(97 + col);
const rankName = (row: number): string => String(8 - row);
const squareName = (row: number, col: number): string => `${fileName(col)}${rankName(row)}`;

const getDisambiguation = (
  board: Board,
  from: Square,
  result: MoveApplication,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): string => {
  const [fromRow, fromCol] = from;
  const alternatives = getAllLegalMoves(board, result.isWhite, castlingRights, enPassantTarget).filter(move => {
    const [candidateRow, candidateCol] = move.from;
    const [targetRow, targetCol] = move.to;

    return (
      (candidateRow !== fromRow || candidateCol !== fromCol) &&
      targetRow === result.toRow &&
      targetCol === result.toCol &&
      getPieceType(board[candidateRow][candidateCol]) === result.pieceType
    );
  });

  if (alternatives.length === 0) return '';

  const sharesFile = alternatives.some(move => move.from[1] === fromCol);
  const sharesRank = alternatives.some(move => move.from[0] === fromRow);

  if (!sharesFile) return fileName(fromCol);
  if (!sharesRank) return rankName(fromRow);
  return squareName(fromRow, fromCol);
};

export const makeMoveNotation = (
  board: Board,
  from: Square,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null,
  result: MoveApplication
): string => {
  const pieceType = result.pieceType;
  if (!pieceType) throw new Error('Cannot format notation for a move without a piece');

  const [, fromCol] = from;
  const isCapture = result.capturedPiece !== null;
  let notation: string;

  if (result.special === 'castleKingside') {
    notation = 'O-O';
  } else if (result.special === 'castleQueenside') {
    notation = 'O-O-O';
  } else if (pieceType === 'P') {
    notation = `${isCapture ? `${fileName(fromCol)}x` : ''}${squareName(result.toRow, result.toCol)}`;

    if (result.toRow === 0 || result.toRow === 7) {
      const promotedPiece = getPieceType(result.newBoard[result.toRow][result.toCol]);
      notation += `=${promotedPiece || 'Q'}`;
    }
  } else {
    const disambiguation = getDisambiguation(board, from, result, castlingRights, enPassantTarget);
    notation = `${pieceType}${disambiguation}${isCapture ? 'x' : ''}${squareName(result.toRow, result.toCol)}`;
  }

  const opponentIsWhite = !result.isWhite;
  if (isInCheck(result.newBoard, opponentIsWhite, result.newCastlingRights, result.newEnPassant)) {
    const replies = getAllLegalMoves(
      result.newBoard,
      opponentIsWhite,
      result.newCastlingRights,
      result.newEnPassant
    );
    notation += replies.length === 0 ? '#' : '+';
  }

  return notation;
};
