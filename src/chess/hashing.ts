import { MAX_PLY } from './constants';
import type { Board, CastlingRights, EngineState, Square, ZobristTable } from './types';

const pieceToIndex = (ch: string): number => {
  switch (ch) {
    case 'P': return 0;
    case 'N': return 1;
    case 'B': return 2;
    case 'R': return 3;
    case 'Q': return 4;
    case 'K': return 5;
    case 'p': return 6;
    case 'n': return 7;
    case 'b': return 8;
    case 'r': return 9;
    case 'q': return 10;
    case 'k': return 11;
    default: return -1;
  }
};

const rand64 = (): bigint => {
  const a = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
  const b = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
  return BigInt.asUintN(64, (a << 32n) ^ b);
};

export const createZobristTable = (): ZobristTable => {
  return {
    pieceSquare: Array.from({ length: 12 }, () => Array.from({ length: 64 }, () => rand64())),
    castling: {
      wk: rand64(),
      wq: rand64(),
      bk: rand64(),
      bq: rand64()
    },
    epFile: Array.from({ length: 8 }, () => rand64()),
    side: rand64()
  };
};

export const createEngineState = (): EngineState => ({
  tt: new Map(),
  killerMoves: Array.from({ length: MAX_PLY }, () => []),
  nodes: 0,
  cutoffs: 0,
  deepSearchUsed: false,
  lastSearchType: 'basic',
  zobrist: createZobristTable()
});

export const resetEngineForNewGame = (engineState: EngineState): void => {
  engineState.tt.clear();
  engineState.killerMoves = Array.from({ length: MAX_PLY }, () => []);
  engineState.nodes = 0;
  engineState.cutoffs = 0;
  engineState.deepSearchUsed = false;
  engineState.lastSearchType = 'basic';
};

export const computeHash = (
  board: Board,
  sideToMoveIsWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null,
  zobrist: ZobristTable
): string => {
  let h = 0n;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const idx = pieceToIndex(p);
      if (idx >= 0) h ^= zobrist.pieceSquare[idx][r * 8 + c];
    }
  }

  if (castlingRights.whiteKingside) h ^= zobrist.castling.wk;
  if (castlingRights.whiteQueenside) h ^= zobrist.castling.wq;
  if (castlingRights.blackKingside) h ^= zobrist.castling.bk;
  if (castlingRights.blackQueenside) h ^= zobrist.castling.bq;
  if (enPassantTarget) h ^= zobrist.epFile[enPassantTarget[1]];
  if (sideToMoveIsWhite) h ^= zobrist.side;
  return h.toString();
};
