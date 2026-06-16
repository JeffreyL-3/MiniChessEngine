export type Piece = string | null;
export type Board = Piece[][];
export type Square = [number, number];
export type MoveTarget = [number, number] | [number, number, string];

export interface LegalMove {
  from: Square;
  to: MoveTarget;
}

export interface CastlingRights {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
}

export type GameStatus = 'playing' | 'whiteWins' | 'blackWins' | 'stalemate';
export type SearchType = 'human' | 'basic' | 'deep';

export interface CapturedPieces {
  white: string[];
  black: string[];
}

export interface EngineInfo {
  lastBest: number | null;
  lastBestMove: LegalMove | null;
  lastBestStr: string | null;
  depth: number;
  nodes: number;
  cutoffs: number;
  ttEntries: number;
  timeMs: number;
  usedDeepSearch?: boolean;
}

export interface ZobristTable {
  pieceSquare: bigint[][];
  castling: {
    wk: bigint;
    wq: bigint;
    bk: bigint;
    bq: bigint;
  };
  epFile: bigint[];
  side: bigint;
}

export interface EngineState {
  tt: Map<string, { depth: number; value: number; flag: string; bestMove: LegalMove | null }>;
  killerMoves: LegalMove[][];
  nodes: number;
  cutoffs: number;
  deepSearchUsed: boolean;
  lastSearchType: Exclude<SearchType, 'human'>;
  zobrist: ZobristTable;
}
