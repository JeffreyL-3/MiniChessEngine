import assert from 'node:assert/strict';
import test from 'node:test';
import { getInitialBoard } from '../src/chess/board';
import { findBestMove } from '../src/chess/engine';
import { createEngineState } from '../src/chess/hashing';
import { simulateMove } from '../src/chess/moves';
import { getAllLegalMoves } from '../src/chess/rules';
import type { Board, CastlingRights, Square } from '../src/chess/types';

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

const place = (board: Board, square: string, piece: string): void => {
  const row = 8 - Number(square[1]);
  const col = square.charCodeAt(0) - 97;
  board[row][col] = piece;
};

const boardFromFen = (fenBoard: string): Board => {
  return fenBoard.split('/').map(rank => {
    const row: Array<string | null> = [];
    for (const char of rank) {
      if (/\d/.test(char)) row.push(...Array(Number(char)).fill(null));
      else row.push(char);
    }
    return row;
  });
};

const perft = (
  board: Board,
  sideToMoveIsWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null,
  depth: number
): number => {
  if (depth === 0) return 1;

  let nodes = 0;
  for (const move of getAllLegalMoves(board, sideToMoveIsWhite, castlingRights, enPassantTarget)) {
    const next = simulateMove(board, move.from, move.to, castlingRights);
    nodes += perft(next.newBoard, !sideToMoveIsWhite, next.newCastlingRights, next.newEnPassant, depth - 1);
  }
  return nodes;
};

test('detects checkmate at the normal-search horizon', () => {
  const board = emptyBoard();
  place(board, 'h1', 'K');
  place(board, 'b8', 'Q');
  place(board, 'f3', 'k');
  place(board, 'g3', 'q');

  for (const allowDeepSearch of [false, true]) {
    const result = findBestMove(
      board,
      {
        castlingRights: NO_CASTLING_RIGHTS,
        enPassantTarget: null,
        searchDepth: 1,
        allowDeepSearch,
        deepSearchPlies: 1
      },
      createEngineState()
    );

    assert.equal(result.engineInfo?.lastBest, -999999);
    assert.deepEqual(result.bestMove, { from: [5, 6], to: [6, 6] });
  }
});

test('matches the initial-position perft baseline through depth 4', () => {
  assert.equal(perft(getInitialBoard(), true, ALL_CASTLING_RIGHTS, null, 4), 197281);
});

test('matches the Kiwipete castling/check perft baseline through depth 3', () => {
  const board = boardFromFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R');
  assert.equal(perft(board, true, ALL_CASTLING_RIGHTS, null, 3), 97862);
});

test('matches the en passant endgame perft baseline through depth 5', () => {
  const board = boardFromFen('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8');
  assert.equal(perft(board, true, NO_CASTLING_RIGHTS, null, 5), 674624);
});
