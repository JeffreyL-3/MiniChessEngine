import { getPieceType, isWhitePiece } from './board';
import { MAX_KILLER_MOVES, MAX_PLY } from './constants';
import { evaluateBoard, getMVVLVAScore, isCaptureMove } from './evaluation';
import { computeHash } from './hashing';
import { simulateMove } from './moves';
import { getAllLegalMoves, isInCheck } from './rules';
import type { Board, CastlingRights, EngineInfo, EngineState, LegalMove, Square } from './types';

export interface FindBestMoveOptions {
  castlingRights: CastlingRights;
  enPassantTarget: Square | null;
  searchDepth: number;
  allowDeepSearch: boolean;
  deepSearchPlies: number;
}

export interface FindBestMoveResult {
  bestMove: LegalMove | null;
  engineInfo: EngineInfo | null;
}

const MATE_SCORE = 999999;

const terminalScore = (sideToMoveIsWhite: boolean, inCheck: boolean): number => {
  if (!inCheck) return 0;
  return sideToMoveIsWhite ? -MATE_SCORE : MATE_SCORE;
};

const movesEqual = (a: LegalMove | null | undefined, b: LegalMove | null | undefined): boolean => {
  if (!a || !b) return false;
  const [afr, afc] = a.from;
  const [bfr, bfc] = b.from;
  const [atr, atc, aspec] = a.to;
  const [btr, btc, bspec] = b.to;
  return afr === bfr && afc === bfc && atr === btr && atc === btc && (aspec || null) === (bspec || null);
};

const squareStr = (r: number, c: number): string => `${String.fromCharCode(97 + c)}${8 - r}`;

const moveToString = (board: Board, move: LegalMove): string => {
  const [fr, fc] = move.from;
  const [tr, tc, special] = move.to;
  if (special === 'castleKingside') return 'O-O';
  if (special === 'castleQueenside') return 'O-O-O';
  const captureMark = isCaptureMove(board, move) ? 'x' : '-';
  return `${squareStr(fr, fc)}${captureMark}${squareStr(tr, tc)}`;
};

const addKillerMove = (engineState: EngineState, ply: number, move: LegalMove): void => {
  const killers = engineState.killerMoves[ply];
  const isDuplicate = killers.some(km => movesEqual(km, move));
  if (isDuplicate) return;

  killers.unshift(move);
  if (killers.length > MAX_KILLER_MOVES) killers.pop();
};

const isKillerMove = (engineState: EngineState, ply: number, move: LegalMove): boolean => {
  return engineState.killerMoves[ply].some(km => movesEqual(km, move));
};

const orderMoves = (
  moves: LegalMove[],
  board: Board,
  ttMove: LegalMove | null | undefined,
  ply: number | undefined,
  engineState: EngineState
): LegalMove[] => {
  const scoredMoves = moves.slice().map(move => {
    let score = 0;
    if (ttMove && movesEqual(move, ttMove)) score = 100000;
    else if (isCaptureMove(board, move)) score = 10000 + getMVVLVAScore(board, move);
    else if (ply !== undefined && isKillerMove(engineState, ply, move)) score = 5000;
    return { move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves.map(sm => sm.move);
};

const isCheckMove = (
  board: Board,
  move: LegalMove,
  sideToMoveIsWhite: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): boolean => {
  const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, castlingRights);
  return isInCheck(newBoard, !sideToMoveIsWhite, newCastlingRights, newEnPassant);
};

const deepExtension = (
  board: Board,
  alphaInput: number,
  betaInput: number,
  maximizingPlayer: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null,
  remaining: number,
  ply: number,
  engineState: EngineState
): number => {
  engineState.nodes++;
  let alpha = alphaInput;
  let beta = betaInput;
  const inCheck = isInCheck(board, maximizingPlayer, castlingRights, enPassantTarget);
  let moves = getAllLegalMoves(board, maximizingPlayer, castlingRights, enPassantTarget);

  if (moves.length === 0) return terminalScore(maximizingPlayer, inCheck);

  const standPat = evaluateBoard(board);

  if (ply >= MAX_PLY || (remaining <= 0 && !inCheck)) return standPat;

  if (!inCheck) {
    if (maximizingPlayer) {
      if (standPat >= beta) return standPat;
      if (standPat > alpha) alpha = standPat;
    } else {
      if (standPat <= alpha) return standPat;
      if (standPat < beta) beta = standPat;
    }

    moves = moves.filter(
      move => isCaptureMove(board, move)
        || isCheckMove(board, move, maximizingPlayer, castlingRights, enPassantTarget)
    );
    if (moves.length === 0) return standPat;
  }

  moves = orderMoves(moves, board, null, undefined, engineState);

  if (maximizingPlayer) {
    let value = inCheck ? -Infinity : standPat;
    for (const move of moves) {
      const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, castlingRights);
      const score = deepExtension(
        newBoard,
        alpha,
        beta,
        false,
        newCastlingRights,
        newEnPassant,
        remaining - 1,
        ply + 1,
        engineState
      );
      if (score > value) value = score;
      if (score > alpha) alpha = score;
      if (beta <= alpha) {
        engineState.cutoffs++;
        break;
      }
    }
    return value;
  }

  let value = inCheck ? Infinity : standPat;
  for (const move of moves) {
    const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, castlingRights);
    const score = deepExtension(
      newBoard,
      alpha,
      beta,
      true,
      newCastlingRights,
      newEnPassant,
      remaining - 1,
      ply + 1,
      engineState
    );
    if (score < value) value = score;
    if (score < beta) beta = score;
    if (beta <= alpha) {
      engineState.cutoffs++;
      break;
    }
  }
  return value;
};

const canDoNullMove = (
  board: Board,
  maximizingPlayer: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null
): boolean => {
  let pieceCount = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && isWhitePiece(piece) === maximizingPlayer) {
        const pt = getPieceType(piece);
        if (pt !== 'P' && pt !== 'K') pieceCount++;
      }
    }
  }
  return pieceCount > 0 && !isInCheck(board, maximizingPlayer, castlingRights, enPassantTarget);
};

const minimax = (
  board: Board,
  depth: number,
  alphaInput: number,
  betaInput: number,
  maximizingPlayer: boolean,
  castlingRights: CastlingRights,
  enPassantTarget: Square | null,
  allowDeepSearch: boolean,
  deepSearchPlies: number,
  engineState: EngineState,
  ply = 0,
  allowNullMove = true
): number => {
  engineState.nodes++;
  let alpha = alphaInput;
  let beta = betaInput;
  const alphaOrig = alpha;
  const betaOrig = beta;

  const key = computeHash(board, maximizingPlayer, castlingRights, enPassantTarget, engineState.zobrist);
  const ttEntry = engineState.tt.get(key);
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === 'EXACT') return ttEntry.value;
    if (ttEntry.flag === 'LOWER') alpha = Math.max(alpha, ttEntry.value);
    else if (ttEntry.flag === 'UPPER') beta = Math.min(beta, ttEntry.value);
    if (alpha >= beta) return ttEntry.value;
  }

  let moves = getAllLegalMoves(board, maximizingPlayer, castlingRights, enPassantTarget);
  if (moves.length === 0) {
    const inCheck = isInCheck(board, maximizingPlayer, castlingRights, enPassantTarget);
    return terminalScore(maximizingPlayer, inCheck);
  }

  if (depth <= 0) {
    if (!allowDeepSearch) return evaluateBoard(board);

    engineState.deepSearchUsed = true;
    return deepExtension(
      board,
      alpha,
      beta,
      maximizingPlayer,
      castlingRights,
      enPassantTarget,
      deepSearchPlies,
      ply,
      engineState
    );
  }

  const R = 2;
  if (
    allowNullMove
    && depth >= R + 1
    && canDoNullMove(board, maximizingPlayer, castlingRights, enPassantTarget)
  ) {
    // Scores are always from White's perspective, so null searches use ordinary
    // max/min windows rather than negamax sign inversion.
    if (maximizingPlayer && Number.isFinite(beta)) {
      const nullScore = minimax(
        board,
        depth - R - 1,
        beta - 1,
        beta,
        false,
        castlingRights,
        null,
        allowDeepSearch,
        deepSearchPlies,
        engineState,
        ply + 1,
        false
      );
      if (nullScore >= beta) return beta;
    } else if (!maximizingPlayer && Number.isFinite(alpha)) {
      const nullScore = minimax(
        board,
        depth - R - 1,
        alpha,
        alpha + 1,
        true,
        castlingRights,
        null,
        allowDeepSearch,
        deepSearchPlies,
        engineState,
        ply + 1,
        false
      );
      if (nullScore <= alpha) return alpha;
    }
  }

  moves = orderMoves(moves, board, ttEntry?.bestMove, ply, engineState);
  let bestMoveLocal: LegalMove | null = null;

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, castlingRights);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, newCastlingRights, newEnPassant, allowDeepSearch, deepSearchPlies, engineState, ply + 1, true);
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMoveLocal = move;
      }
      if (evaluation > alpha) alpha = evaluation;
      if (beta <= alpha) {
        engineState.cutoffs++;
        if (!isCaptureMove(board, move)) addKillerMove(engineState, ply, move);
        break;
      }
    }

    let flag = 'EXACT';
    if (maxEval <= alphaOrig) flag = 'UPPER';
    else if (maxEval >= betaOrig) flag = 'LOWER';
    engineState.tt.set(key, { depth, value: maxEval, flag, bestMove: bestMoveLocal });
    return maxEval;
  }

  let minEval = Infinity;
  for (const move of moves) {
    const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, castlingRights);
    const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, newCastlingRights, newEnPassant, allowDeepSearch, deepSearchPlies, engineState, ply + 1, true);
    if (evaluation < minEval) {
      minEval = evaluation;
      bestMoveLocal = move;
    }
    if (evaluation < beta) beta = evaluation;
    if (beta <= alpha) {
      engineState.cutoffs++;
      if (!isCaptureMove(board, move)) addKillerMove(engineState, ply, move);
      break;
    }
  }

  let flag = 'EXACT';
  if (minEval <= alphaOrig) flag = 'UPPER';
  else if (minEval >= betaOrig) flag = 'LOWER';
  engineState.tt.set(key, { depth, value: minEval, flag, bestMove: bestMoveLocal });
  return minEval;
};

export const findBestMove = (
  board: Board,
  options: FindBestMoveOptions,
  engineState: EngineState
): FindBestMoveResult => {
  engineState.killerMoves = Array.from({ length: MAX_PLY }, () => []);
  engineState.nodes = 0;
  engineState.cutoffs = 0;
  engineState.deepSearchUsed = false;

  const now = (typeof performance !== 'undefined' && performance.now) ? () => performance.now() : () => Date.now();
  const t0 = now();
  const moves = getAllLegalMoves(board, false, options.castlingRights, options.enPassantTarget);
  if (moves.length === 0) return { bestMove: null, engineInfo: null };

  let bestMove = moves[0];
  let bestValue = Infinity;

  for (let currentDepth = 1; currentDepth <= options.searchDepth; currentDepth++) {
    let depthBestMove: LegalMove | null = null;
    let depthBestValue = Infinity;
    const ordered = orderMoves(moves, board, bestMove, 0, engineState);

    for (const move of ordered) {
      const { newBoard, newCastlingRights, newEnPassant } = simulateMove(board, move.from, move.to, options.castlingRights);
      const boardValue = minimax(
        newBoard,
        currentDepth - 1,
        -Infinity,
        Infinity,
        true,
        newCastlingRights,
        newEnPassant,
        options.allowDeepSearch,
        options.deepSearchPlies,
        engineState,
        1,
        true
      );

      if (boardValue < depthBestValue) {
        depthBestValue = boardValue;
        depthBestMove = move;
      }
    }

    if (depthBestMove) {
      bestMove = depthBestMove;
      bestValue = depthBestValue;
    }
  }

  const t1 = now();
  const usedDeepSearch = engineState.deepSearchUsed;
  engineState.lastSearchType = usedDeepSearch ? 'deep' : 'basic';

  return {
    bestMove,
    engineInfo: {
      lastBest: bestValue,
      lastBestMove: bestMove,
      lastBestStr: bestMove ? moveToString(board, bestMove) : null,
      depth: options.searchDepth,
      nodes: engineState.nodes,
      cutoffs: engineState.cutoffs,
      ttEntries: engineState.tt.size,
      timeMs: Math.round(t1 - t0),
      usedDeepSearch
    }
  };
};
