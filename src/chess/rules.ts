import { findKing, getPieceType, isValidPosition, isWhitePiece } from './board';
import type { Board, CastlingRights, LegalMove, MoveTarget, Square } from './types';

export const pawnAttacks = (r: number, c: number, white: boolean): Square[] => {
  const dir = white ? -1 : 1;
  const attacks: Square[] = [];
  if (isValidPosition(r + dir, c - 1)) attacks.push([r + dir, c - 1]);
  if (isValidPosition(r + dir, c + 1)) attacks.push([r + dir, c + 1]);
  return attacks;
};

export const isSquareUnderAttack = (
  board: Board,
  row: number,
  col: number,
  byWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): boolean => {
  const pawnDir = byWhite ? 1 : -1;
  const pawnRow = row + pawnDir;

  if (isValidPosition(pawnRow, col - 1)) {
    const piece = board[pawnRow][col - 1];
    if (piece && getPieceType(piece) === 'P' && isWhitePiece(piece) === byWhite) return true;
  }

  if (isValidPosition(pawnRow, col + 1)) {
    const piece = board[pawnRow][col + 1];
    if (piece && getPieceType(piece) === 'P' && isWhitePiece(piece) === byWhite) return true;
  }

  const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  for (const [dr, dc] of knightMoves) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece && getPieceType(piece) === 'N' && isWhitePiece(piece) === byWhite) return true;
    }
  }

  const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  for (const [dr, dc] of kingMoves) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece && getPieceType(piece) === 'K' && isWhitePiece(piece) === byWhite) return true;
    }
  }

  const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of diagonalDirections) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      if (!isValidPosition(newRow, newCol)) break;

      const piece = board[newRow][newCol];
      if (piece) {
        const pieceType = getPieceType(piece);
        if (isWhitePiece(piece) === byWhite && (pieceType === 'B' || pieceType === 'Q')) return true;
        break;
      }
    }
  }

  const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of straightDirections) {
    for (let i = 1; i < 8; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      if (!isValidPosition(newRow, newCol)) break;

      const piece = board[newRow][newCol];
      if (piece) {
        const pieceType = getPieceType(piece);
        if (isWhitePiece(piece) === byWhite && (pieceType === 'R' || pieceType === 'Q')) return true;
        break;
      }
    }
  }

  return false;
};

export const getPieceMoves = (
  board: Board,
  row: number,
  col: number,
  checkForCheck: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): MoveTarget[] => {
  const piece = board[row][col];
  if (!piece) return [];

  const pieceType = getPieceType(piece);
  const isWhite = isWhitePiece(piece);
  const moves: MoveTarget[] = [];

  const addMove = (newRow: number, newCol: number, special: string | null = null): boolean => {
    if (!isValidPosition(newRow, newCol)) return false;

    const targetPiece = board[newRow][newCol];
    if (targetPiece && isWhitePiece(targetPiece) === isWhite) return false;

    if (special) moves.push([newRow, newCol, special]);
    else moves.push([newRow, newCol]);
    return !targetPiece;
  };

  switch (pieceType) {
    case 'P': {
      const direction = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;
      if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
        addMove(row + direction, col);
        if (row === startRow && isValidPosition(row + 2 * direction, col) && !board[row + 2 * direction][col]) {
          addMove(row + 2 * direction, col, 'doublePawn');
        }
      }

      [-1, 1].forEach(dc => {
        const captureRow = row + direction;
        const captureCol = col + dc;
        if (isValidPosition(captureRow, captureCol)) {
          const targetPiece = board[captureRow][captureCol];
          if (targetPiece && isWhitePiece(targetPiece) !== isWhite) addMove(captureRow, captureCol);
          if (enPassantTarget && enPassantTarget[0] === captureRow && enPassantTarget[1] === captureCol) {
            addMove(captureRow, captureCol, 'enPassant');
          }
        }
      });
      break;
    }
    case 'N':
      [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });
      break;
    case 'B':
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) if (!addMove(row + dr * i, col + dc * i)) break;
      });
      break;
    case 'R':
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) if (!addMove(row + dr * i, col + dc * i)) break;
      });
      break;
    case 'Q':
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) if (!addMove(row + dr * i, col + dc * i)) break;
      });
      break;
    case 'K':
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });

      if (checkForCheck) {
        const homeRow = isWhite ? 7 : 0;
        if (row === homeRow && col === 4) {
          if ((isWhite && castlingRights.whiteKingside) || (!isWhite && castlingRights.blackKingside)) {
            if (!board[homeRow][5] && !board[homeRow][6] && board[homeRow][7] && getPieceType(board[homeRow][7]) === 'R') {
              if (
                !isSquareUnderAttack(board, homeRow, 4, !isWhite, castlingRights, enPassantTarget) &&
                !isSquareUnderAttack(board, homeRow, 5, !isWhite, castlingRights, enPassantTarget) &&
                !isSquareUnderAttack(board, homeRow, 6, !isWhite, castlingRights, enPassantTarget)
              ) {
                moves.push([homeRow, 6, 'castleKingside']);
              }
            }
          }

          if ((isWhite && castlingRights.whiteQueenside) || (!isWhite && castlingRights.blackQueenside)) {
            if (!board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] && board[homeRow][0] && getPieceType(board[homeRow][0]) === 'R') {
              if (
                !isSquareUnderAttack(board, homeRow, 4, !isWhite, castlingRights, enPassantTarget) &&
                !isSquareUnderAttack(board, homeRow, 3, !isWhite, castlingRights, enPassantTarget) &&
                !isSquareUnderAttack(board, homeRow, 2, !isWhite, castlingRights, enPassantTarget)
              ) {
                moves.push([homeRow, 2, 'castleQueenside']);
              }
            }
          }
        }
      }
      break;
    default:
      break;
  }

  if (checkForCheck) {
    return moves.filter((move) => {
      const [newRow, newCol, special] = move;
      const newBoard = board.map(boardRow => [...boardRow]);

      if (special === 'enPassant') {
        const capturedPawnRow = isWhite ? newRow + 1 : newRow - 1;
        newBoard[capturedPawnRow][newCol] = null;
      }

      if (special === 'castleKingside' || special === 'castleQueenside') return true;

      newBoard[newRow][newCol] = newBoard[row][col];
      newBoard[row][col] = null;

      const kingPos = getPieceType(piece) === 'K' ? [newRow, newCol] : findKing(newBoard, isWhite);
      if (!kingPos) return false;
      return !isSquareUnderAttack(newBoard, kingPos[0], kingPos[1], !isWhite, castlingRights, enPassantTarget);
    });
  }

  return moves;
};

export const isInCheck = (
  board: Board,
  isWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): boolean => {
  const kingPos = findKing(board, isWhite);
  if (!kingPos) return false;
  return isSquareUnderAttack(board, kingPos[0], kingPos[1], !isWhite, castlingRights, enPassantTarget);
};

export const getAllLegalMoves = (
  board: Board,
  isWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): LegalMove[] => {
  const moves: LegalMove[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && isWhitePiece(piece) === isWhite) {
        const pieceMoves = getPieceMoves(board, row, col, true, castlingRights, enPassantTarget);
        pieceMoves.forEach(move => {
          moves.push({ from: [row, col], to: move });
        });
      }
    }
  }
  return moves;
};
