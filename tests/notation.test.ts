import assert from 'node:assert/strict';
import test from 'node:test';
import { getInitialBoard } from '../src/chess/board';
import { applyMoveToBoard } from '../src/chess/moves';
import { makeMoveNotation } from '../src/chess/notation';
import type { Board, CastlingRights, MoveTarget, Square } from '../src/chess/types';

const ALL_CASTLING_RIGHTS: CastlingRights = {
  whiteKingside: true,
  whiteQueenside: true,
  blackKingside: true,
  blackQueenside: true
};

const NO_CASTLING_RIGHTS: CastlingRights = {
  whiteKingside: false,
  whiteQueenside: false,
  blackKingside: false,
  blackQueenside: false
};

const emptyBoard = (): Board => Array.from({ length: 8 }, () => Array(8).fill(null));

const square = (name: string): Square => [8 - Number(name[1]), name.charCodeAt(0) - 97];

const place = (board: Board, name: string, piece: string): void => {
  const [row, col] = square(name);
  board[row][col] = piece;
};

const notationFor = (
  board: Board,
  fromName: string,
  toName: string,
  special?: string,
  castlingRights: CastlingRights = NO_CASTLING_RIGHTS,
  enPassantTarget: Square | null = null
): string => {
  const from = square(fromName);
  const [toRow, toCol] = square(toName);
  const to: MoveTarget = special ? [toRow, toCol, special] : [toRow, toCol];
  const result = applyMoveToBoard(board, from, to, castlingRights);
  return makeMoveNotation(board, from, castlingRights, enPassantTarget, result);
};

test('formats ordinary pawn and piece moves as standard algebraic notation', () => {
  assert.equal(notationFor(getInitialBoard(), 'e2', 'e4', 'doublePawn', ALL_CASTLING_RIGHTS), 'e4');
  assert.equal(notationFor(getInitialBoard(), 'g1', 'f3', undefined, ALL_CASTLING_RIGHTS), 'Nf3');
  assert.equal(notationFor(getInitialBoard(), 'g8', 'f6', undefined, ALL_CASTLING_RIGHTS), 'Nf6');
});

test('formats captures, checks, and checkmates', () => {
  const captureBoard = emptyBoard();
  place(captureBoard, 'a1', 'K');
  place(captureBoard, 'd3', 'Q');
  place(captureBoard, 'h7', 'r');
  place(captureBoard, 'h8', 'k');
  assert.equal(notationFor(captureBoard, 'd3', 'h7'), 'Qxh7+');

  const mateBoard = emptyBoard();
  place(mateBoard, 'f6', 'K');
  place(mateBoard, 'g6', 'Q');
  place(mateBoard, 'h8', 'k');
  assert.equal(notationFor(mateBoard, 'g6', 'g7'), 'Qg7#');
});

test('disambiguates identical pieces by file or rank', () => {
  const knightBoard = emptyBoard();
  place(knightBoard, 'a1', 'K');
  place(knightBoard, 'd2', 'N');
  place(knightBoard, 'h2', 'N');
  place(knightBoard, 'h8', 'k');
  assert.equal(notationFor(knightBoard, 'd2', 'f3'), 'Ndf3');

  const rookBoard = emptyBoard();
  place(rookBoard, 'h1', 'K');
  place(rookBoard, 'a1', 'R');
  place(rookBoard, 'a3', 'R');
  place(rookBoard, 'h8', 'k');
  assert.equal(notationFor(rookBoard, 'a1', 'a2'), 'R1a2');

  const fullSquareBoard = emptyBoard();
  place(fullSquareBoard, 'h1', 'K');
  place(fullSquareBoard, 'a1', 'Q');
  place(fullSquareBoard, 'a3', 'Q');
  place(fullSquareBoard, 'c1', 'Q');
  place(fullSquareBoard, 'h7', 'k');
  assert.equal(notationFor(fullSquareBoard, 'a1', 'c3'), 'Qa1c3');
});

test('does not disambiguate against an identical piece that is pinned', () => {
  const board = emptyBoard();
  place(board, 'e1', 'K');
  place(board, 'a2', 'R');
  place(board, 'e2', 'R');
  place(board, 'e8', 'r');
  place(board, 'h8', 'k');
  assert.equal(notationFor(board, 'a2', 'c2'), 'Rc2');
});

test('formats castling, en passant, and automatic queen promotion', () => {
  const castlingBoard = emptyBoard();
  place(castlingBoard, 'e1', 'K');
  place(castlingBoard, 'h1', 'R');
  place(castlingBoard, 'e8', 'k');
  assert.equal(notationFor(castlingBoard, 'e1', 'g1', 'castleKingside', ALL_CASTLING_RIGHTS), 'O-O');

  const queensideCastlingBoard = emptyBoard();
  place(queensideCastlingBoard, 'e1', 'K');
  place(queensideCastlingBoard, 'a1', 'R');
  place(queensideCastlingBoard, 'e8', 'k');
  assert.equal(
    notationFor(queensideCastlingBoard, 'e1', 'c1', 'castleQueenside', ALL_CASTLING_RIGHTS),
    'O-O-O'
  );

  const enPassantBoard = emptyBoard();
  place(enPassantBoard, 'a1', 'K');
  place(enPassantBoard, 'e5', 'P');
  place(enPassantBoard, 'd5', 'p');
  place(enPassantBoard, 'h8', 'k');
  assert.equal(notationFor(enPassantBoard, 'e5', 'd6', 'enPassant', NO_CASTLING_RIGHTS, square('d6')), 'exd6');

  const promotionBoard = emptyBoard();
  place(promotionBoard, 'a1', 'K');
  place(promotionBoard, 'e7', 'P');
  place(promotionBoard, 'h8', 'k');
  assert.equal(notationFor(promotionBoard, 'e7', 'e8'), 'e8=Q+');
});
