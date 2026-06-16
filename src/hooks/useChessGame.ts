import { useEffect, useRef, useState } from 'react';
import { getInitialBoard, isWhitePiece } from '../chess/board';
import { INITIAL_CASTLING_RIGHTS } from '../chess/constants';
import { findBestMove } from '../chess/engine';
import { createEngineState, resetEngineForNewGame } from '../chess/hashing';
import { applyMoveToBoard, makeMoveNotation } from '../chess/moves';
import { getAllLegalMoves, getPieceMoves, isInCheck } from '../chess/rules';
import type {
  Board,
  CapturedPieces,
  CastlingRights,
  EngineInfo,
  EngineState,
  GameStatus,
  MoveTarget,
  SearchType,
  Square
} from '../chess/types';

const createInitialEngineInfo = (): EngineInfo => ({
  lastBest: null,
  lastBestMove: null,
  lastBestStr: null,
  depth: 0,
  nodes: 0,
  cutoffs: 0,
  ttEntries: 0,
  timeMs: 0
});

export const useChessGame = () => {
  const [board, setBoard] = useState<Board>(getInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<MoveTarget[]>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ white: [], black: [] });
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveSearchTypes, setMoveSearchTypes] = useState<SearchType[]>([]);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>({ ...INITIAL_CASTLING_RIGHTS });
  const [enPassantTarget, setEnPassantTarget] = useState<Square | null>(null);
  const [searchDepth, setSearchDepth] = useState(3);
  const [allowDeepSearch, setAllowDeepSearch] = useState(false);
  const [showEnginePanel, setShowEnginePanel] = useState(true);
  const [engineInfo, setEngineInfo] = useState<EngineInfo>(createInitialEngineInfo());
  const engineStateRef = useRef<EngineState | null>(null);
  if (!engineStateRef.current) {
    engineStateRef.current = createEngineState();
  }

  const makeMove = (currentBoard: Board, from: Square, to: MoveTarget, updateState = true): Board => {
    const result = applyMoveToBoard(currentBoard, from, to, castlingRights);

    if (updateState) {
      setBoard(result.newBoard);

      if (result.capturedPiece) {
        const capturedBy: keyof CapturedPieces = result.isWhite ? 'white' : 'black';
        setCapturedPieces(prev => ({
          ...prev,
          [capturedBy]: [...prev[capturedBy], result.capturedPiece as string]
        }));
      }

      setCastlingRights(result.newCastlingRights);
      setEnPassantTarget(result.newEnPassant);
      setMoveHistory(prev => [...prev, makeMoveNotation(from, result.toRow, result.toCol, result.special, result.capturedPiece)]);
      setMoveSearchTypes(prev => [...prev, result.isWhite ? 'human' : engineStateRef.current!.lastSearchType]);
    }

    return result.newBoard;
  };

  const handleSquareClick = (row: number, col: number): void => {
    if (gameStatus !== 'playing' || !isWhiteTurn || isThinking) return;

    const piece = board[row][col];

    if (selectedSquare) {
      const validMove = validMoves.find(move => {
        const [r, c] = move;
        return r === row && c === col;
      });

      if (validMove) {
        makeMove(board, selectedSquare, validMove);
        setSelectedSquare(null);
        setValidMoves([]);
        setIsWhiteTurn(false);
      } else if (piece && isWhitePiece(piece)) {
        const moves = getPieceMoves(board, row, col, true, castlingRights, enPassantTarget);
        setSelectedSquare([row, col]);
        setValidMoves(moves);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && isWhitePiece(piece)) {
      const moves = getPieceMoves(board, row, col, true, castlingRights, enPassantTarget);
      setSelectedSquare([row, col]);
      setValidMoves(moves);
    }
  };

  useEffect(() => {
    if (!isWhiteTurn && gameStatus === 'playing' && !isThinking) {
      setIsThinking(true);

      const timeoutId = setTimeout(() => {
        const { bestMove, engineInfo: nextEngineInfo } = findBestMove(
          board,
          { castlingRights, enPassantTarget, searchDepth, allowDeepSearch },
          engineStateRef.current!
        );

        if (nextEngineInfo) setEngineInfo(nextEngineInfo);
        if (bestMove) {
          makeMove(board, bestMove.from, bestMove.to);
          setIsWhiteTurn(true);
        }
        setIsThinking(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isWhiteTurn, gameStatus, board]);

  useEffect(() => {
    const whiteMoves = getAllLegalMoves(board, true, castlingRights, enPassantTarget);
    const blackMoves = getAllLegalMoves(board, false, castlingRights, enPassantTarget);

    if (isWhiteTurn && whiteMoves.length === 0) {
      setGameStatus(isInCheck(board, true, castlingRights, enPassantTarget) ? 'blackWins' : 'stalemate');
    } else if (!isWhiteTurn && blackMoves.length === 0) {
      setGameStatus(isInCheck(board, false, castlingRights, enPassantTarget) ? 'whiteWins' : 'stalemate');
    }
  }, [board, isWhiteTurn, castlingRights, enPassantTarget]);

  const resetGame = (): void => {
    setBoard(getInitialBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setGameStatus('playing');
    setCapturedPieces({ white: [], black: [] });
    setMoveHistory([]);
    setMoveSearchTypes([]);
    setCastlingRights({ ...INITIAL_CASTLING_RIGHTS });
    setEnPassantTarget(null);
    setIsThinking(false);
    resetEngineForNewGame(engineStateRef.current!);
  };

  return {
    board,
    selectedSquare,
    validMoves,
    isWhiteTurn,
    gameStatus,
    capturedPieces,
    isThinking,
    moveHistory,
    moveSearchTypes,
    castlingRights,
    searchDepth,
    allowDeepSearch,
    showEnginePanel,
    engineInfo,
    setSearchDepth,
    setAllowDeepSearch,
    setShowEnginePanel,
    resetGame,
    handleSquareClick
  };
};
