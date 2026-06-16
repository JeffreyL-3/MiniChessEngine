import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const ChessGame = () => {
  // SVG Chess Piece Components
  const ChessPiece = ({ piece, size = 48 }) => {
    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toUpperCase();
    
    const fillColor = isWhite ? '#ffffff' : '#000000';
    const strokeColor = isWhite ? '#000000' : '#ffffff';
    const strokeWidth = isWhite ? 2 : 0.5;

    const pieces = {
      K: (
        <g>
          <path d="M22,10 L27,10 L27,5 L30,5 L30,10 L35,10 L35,13 L30,13 L30,18 L27,18 L27,13 L22,13 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="28.5" cy="28" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M15,38 Q28.5,32 42,38 L40,44 Q28.5,40 17,44 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="45" rx="13" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      ),
      Q: (
        <g>
          <circle cx="28.5" cy="13" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="20" cy="16" r="2.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="37" cy="16" r="2.5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="16" cy="22" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="41" cy="22" r="2" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="28.5" cy="27" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M15,38 Q28.5,32 42,38 L40,44 Q28.5,40 17,44 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="45" rx="13" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      ),
      R: (
        <g>
          <rect x="18" y="10" width="6" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <rect x="25" y="12" width="7" height="6" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <rect x="33" y="10" width="6" height="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <rect x="20" y="18" width="17" height="18" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M16,36 L41,36 L39,44 L18,44 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      ),
      B: (
        <g>
          <circle cx="28.5" cy="12" r="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M28.5,15 L32,20 L25,20 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="27" rx="6" ry="9" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M16,38 Q28.5,32 41,38 L39,44 Q28.5,40 18,44 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      ),
      N: (
        <g>
          <path d="M20,12 Q24,8 30,10 Q34,8 36,12 L36,24 Q32,28 28,28 Q24,28 22,24 L22,18 L18,20 L18,16 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <circle cx="32" cy="14" r="1.5" fill={strokeColor}/>
          <path d="M16,38 Q28.5,32 41,38 L39,44 Q28.5,40 18,44 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="45" rx="12" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      ),
      P: (
        <g>
          <circle cx="28.5" cy="18" r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <path d="M20,24 Q28.5,28 37,24 L36,38 L21,38 Z" 
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
          <ellipse cx="28.5" cy="43" rx="10" ry="3" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}/>
        </g>
      )
    };

    return (
      <svg width={size} height={size} viewBox="0 0 57 57" style={{ display: 'block' }}>
        {pieces[pieceType]}
      </svg>
    );
  };

  // Piece types
  const PIECES = {
    PAWN: 'P', KNIGHT: 'N', BISHOP: 'B', 
    ROOK: 'R', QUEEN: 'Q', KING: 'K'
  };

  // Piece values for evaluation
  const PIECE_VALUES = {
    'P': 100, 'N': 320, 'B': 330, 
    'R': 500, 'Q': 900, 'K': 20000
  };

  // Piece-Square Tables (from white's perspective)
  const PST = {
    'P': [
      0,  0,  0,  0,  0,  0,  0,  0,
      50, 50, 50, 50, 50, 50, 50, 50,
      10, 10, 20, 30, 30, 20, 10, 10,
      5,  5, 10, 25, 25, 10,  5,  5,
      0,  0,  0, 20, 20,  0,  0,  0,
      5, -5,-10,  0,  0,-10, -5,  5,
      5, 10, 10,-20,-20, 10, 10,  5,
      0,  0,  0,  0,  0,  0,  0,  0
    ],
    'N': [
      -50,-40,-30,-30,-30,-30,-40,-50,
      -40,-20,  0,  0,  0,  0,-20,-40,
      -30,  0, 10, 15, 15, 10,  0,-30,
      -30,  5, 15, 20, 20, 15,  5,-30,
      -30,  0, 15, 20, 20, 15,  0,-30,
      -30,  5, 10, 15, 15, 10,  5,-30,
      -40,-20,  0,  5,  5,  0,-20,-40,
      -50,-40,-30,-30,-30,-30,-40,-50
    ],
    'B': [
      -20,-10,-10,-10,-10,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0,  5, 10, 10,  5,  0,-10,
      -10,  5,  5, 10, 10,  5,  5,-10,
      -10,  0, 10, 10, 10, 10,  0,-10,
      -10, 10, 10, 10, 10, 10, 10,-10,
      -10,  5,  0,  0,  0,  0,  5,-10,
      -20,-10,-10,-10,-10,-10,-10,-20
    ],
    'R': [
      0,  0,  0,  0,  0,  0,  0,  0,
      5, 10, 10, 10, 10, 10, 10,  5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      -5,  0,  0,  0,  0,  0,  0, -5,
      0,  0,  0,  5,  5,  0,  0,  0
    ],
    'Q': [
      -20,-10,-10, -5, -5,-10,-10,-20,
      -10,  0,  0,  0,  0,  0,  0,-10,
      -10,  0,  5,  5,  5,  5,  0,-10,
      -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
      -10,  5,  5,  5,  5,  5,  0,-10,
      -10,  0,  5,  0,  0,  0,  0,-10,
      -20,-10,-10, -5, -5,-10,-10,-20
    ],
    'K': [
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20,
      -10,-20,-20,-20,-20,-20,-20,-10,
      20, 20,  0,  0,  0,  0, 20, 20,
      20, 30, 10,  0,  0, 10, 30, 20
    ]
  };

  // Positional weight (halve positional terms)
  const POS_WEIGHT = 0.5;

  // Deep search toggle (captures/checks beyond limit)
  const [allowDeepSearch, setAllowDeepSearch] = useState(false);
  const DEEP_EXT_PLIES = 16; // Search 16 additional plies for tactical moves

  // Initial board setup
  const getInitialBoard = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Black pieces (top)
    board[0] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    board[1] = Array(8).fill('p');
    
    // White pieces (bottom)
    board[6] = Array(8).fill('P');
    board[7] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    
    return board;
  };

  const [board, setBoard] = useState(getInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing');
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveSearchTypes, setMoveSearchTypes] = useState([]); // Track search type per move
  const [castlingRights, setCastlingRights] = useState({
    whiteKingside: true,
    whiteQueenside: true,
    blackKingside: true,
    blackQueenside: true
  });
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [searchDepth, setSearchDepth] = useState(3);

  // --- Transposition Table & Zobrist hashing ---
  const ttRef = useRef(new Map());

  // Map piece char to index 0..11 for zobrist (P,N,B,R,Q,K,p,n,b,r,q,k)
  const pieceToIndex = (ch) => {
    switch (ch) {
      case 'P': return 0; case 'N': return 1; case 'B': return 2; case 'R': return 3; case 'Q': return 4; case 'K': return 5;
      case 'p': return 6; case 'n': return 7; case 'b': return 8; case 'r': return 9; case 'q': return 10; case 'k': return 11;
      default: return -1;
    }
  };

  const rand64 = () => {
    const a = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
    const b = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
    return BigInt.asUintN(64, (a << 32n) ^ b);
  };

  const zobristRef = useRef(null);
  if (!zobristRef.current) {
    const pieceSquare = Array.from({ length: 12 }, () => Array.from({ length: 64 }, () => rand64()));
    const castling = {
      wk: rand64(), wq: rand64(), bk: rand64(), bq: rand64()
    };
    const epFile = Array.from({ length: 8 }, () => rand64());
    const side = rand64();
    zobristRef.current = { pieceSquare, castling, epFile, side };
  }

  const computeHash = (board, sideToMoveIsWhite, castlingRightsParam = castlingRights, enPassantParam = enPassantTarget) => {
    const Z = zobristRef.current;
    let h = 0n;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p) continue;
        const idx = pieceToIndex(p);
        if (idx >= 0) {
          const sq = r * 8 + c;
          h ^= Z.pieceSquare[idx][sq];
        }
      }
    }
    if (castlingRightsParam.whiteKingside) h ^= Z.castling.wk;
    if (castlingRightsParam.whiteQueenside) h ^= Z.castling.wq;
    if (castlingRightsParam.blackKingside) h ^= Z.castling.bk;
    if (castlingRightsParam.blackQueenside) h ^= Z.castling.bq;
    if (enPassantParam) {
      const file = enPassantParam[1];
      h ^= Z.epFile[file];
    }
    // include side to move (White to move)
    if (sideToMoveIsWhite) h ^= Z.side;
    return h.toString(); // use as Map key
  };

  // --- OPTIMIZATION: Killer Moves ---
  // Store up to 2 killer moves per ply (depth level)
  const MAX_KILLER_MOVES = 2;
  const MAX_PLY = 64;
  const killerMovesRef = useRef(Array.from({ length: MAX_PLY }, () => []));

  const addKillerMove = (ply, move) => {
    const killers = killerMovesRef.current[ply];
    // Don't add duplicate
    const isDuplicate = killers.some(km => movesEqual(km, move));
    if (isDuplicate) return;
    
    // Add to front, keep only MAX_KILLER_MOVES
    killers.unshift(move);
    if (killers.length > MAX_KILLER_MOVES) {
      killers.pop();
    }
  };

  const isKillerMove = (ply, move) => {
    return killerMovesRef.current[ply].some(km => movesEqual(km, move));
  };

  // --- Engine output & counters ---
  const nodesRef = useRef(0);
  const cutoffsRef = useRef(0);
  const deepSearchUsedRef = useRef(false); // Track if deep search was used for current move
  const lastSearchTypeRef = useRef('basic');
  const [showEnginePanel, setShowEnginePanel] = useState(true);
  const [engineInfo, setEngineInfo] = useState({
    lastBest: null,
    lastBestMove: null,
    lastBestStr: null,
    depth: 0,
    nodes: 0,
    cutoffs: 0,
    ttEntries: 0,
    timeMs: 0
  });

  // Helper functions
  const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
  const isBlackPiece = (piece) => piece && piece === piece.toLowerCase();
  const getPieceType = (piece) => piece ? piece.toUpperCase() : null;

  const isValidPosition = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const getPieceAt = (board, row, col) => {
    return isValidPosition(row, col) ? board[row][col] : null;
  };

  // Find king position
  const findKing = (board, isWhite) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && getPieceType(piece) === 'K' && 
            isWhitePiece(piece) === isWhite) {
          return [row, col];
        }
      }
    }
    return null;
  };

  // --- NEW: explicit pawn attack helper (always attacks diagonals regardless of occupancy)
  const pawnAttacks = (r, c, white) => {
    const dir = white ? -1 : 1;
    const attacks = [];
    if (isValidPosition(r + dir, c - 1)) attacks.push([r + dir, c - 1]);
    if (isValidPosition(r + dir, c + 1)) attacks.push([r + dir, c + 1]);
    return attacks;
  };

  // Check if a square is under attack
  const isSquareUnderAttack = (board, row, col, byWhite, castlingRightsParam = castlingRights, enPassantParam = enPassantTarget) => {
    // Check for pawn attacks
    const pawnDir = byWhite ? 1 : -1;
    const pawnRow = row + pawnDir;
    
    if (isValidPosition(pawnRow, col - 1)) {
      const piece = board[pawnRow][col - 1];
      if (piece && getPieceType(piece) === 'P' && isWhitePiece(piece) === byWhite) {
        return true;
      }
    }
    
    if (isValidPosition(pawnRow, col + 1)) {
      const piece = board[pawnRow][col + 1];
      if (piece && getPieceType(piece) === 'P' && isWhitePiece(piece) === byWhite) {
        return true;
      }
    }

    // Check for knight attacks
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValidPosition(newRow, newCol)) {
        const piece = board[newRow][newCol];
        if (piece && getPieceType(piece) === 'N' && isWhitePiece(piece) === byWhite) {
          return true;
        }
      }
    }

    // Check for king attacks
    const kingMoves = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    for (const [dr, dc] of kingMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValidPosition(newRow, newCol)) {
        const piece = board[newRow][newCol];
        if (piece && getPieceType(piece) === 'K' && isWhitePiece(piece) === byWhite) {
          return true;
        }
      }
    }

    // Check for diagonal attacks (bishop, queen)
    const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagonalDirections) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (!isValidPosition(newRow, newCol)) break;
        
        const piece = board[newRow][newCol];
        if (piece) {
          const pieceType = getPieceType(piece);
          if (isWhitePiece(piece) === byWhite && (pieceType === 'B' || pieceType === 'Q')) {
            return true;
          }
          break;
        }
      }
    }

    // Check for straight attacks (rook, queen)
    const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirections) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (!isValidPosition(newRow, newCol)) break;
        
        const piece = board[newRow][newCol];
        if (piece) {
          const pieceType = getPieceType(piece);
          if (isWhitePiece(piece) === byWhite && (pieceType === 'R' || pieceType === 'Q')) {
            return true;
          }
          break;
        }
      }
    }

    return false;
  };

  // Get all possible moves for a piece
  const getPieceMoves = (board, row, col, checkForCheck = true, castlingRightsParam = castlingRights, enPassantParam = enPassantTarget) => {
    const piece = board[row][col];
    if (!piece) return [];

    const pieceType = getPieceType(piece);
    const isWhite = isWhitePiece(piece);
    const moves = [];

    const addMove = (newRow, newCol, special = null) => {
      if (!isValidPosition(newRow, newCol)) return false;
      
      const targetPiece = board[newRow][newCol];
      if (targetPiece && isWhitePiece(targetPiece) === isWhite) return false;
      
      if (special) {
        moves.push([newRow, newCol, special]);
      } else {
        moves.push([newRow, newCol]);
      }
      return !targetPiece;
    };

    switch (pieceType) {
      case 'P': {
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        // Forward move
        if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
          addMove(row + direction, col);
          
          // Double pawn move from starting position
          if (row === startRow && isValidPosition(row + 2 * direction, col) && !board[row + 2 * direction][col]) {
            addMove(row + 2 * direction, col, 'doublePawn');
          }
        }

        // Captures
        [-1, 1].forEach(dc => {
          const captureRow = row + direction;
          const captureCol = col + dc;
          
          if (isValidPosition(captureRow, captureCol)) {
            const targetPiece = board[captureRow][captureCol];
            if (targetPiece && isWhitePiece(targetPiece) !== isWhite) {
              addMove(captureRow, captureCol);
            }
            
            // En passant
            if (enPassantParam && 
                enPassantParam[0] === captureRow && 
                enPassantParam[1] === captureCol) {
              addMove(captureRow, captureCol, 'enPassant');
            }
          }
        });
        break;
      }

      case 'N': {
        [[-2, -1], [-2, 1], [-1, -2], [-1, 2],
         [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
          addMove(row + dr, col + dc);
        });
        break;
      }

      case 'B': {
        [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => {
          for (let i = 1; i < 8; i++) {
            if (!addMove(row + dr * i, col + dc * i)) break;
          }
        });
        break;
      }

      case 'R': {
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
          for (let i = 1; i < 8; i++) {
            if (!addMove(row + dr * i, col + dc * i)) break;
          }
        });
        break;
      }

      case 'Q': {
        [[-1, -1], [-1, 0], [-1, 1], [0, -1], 
         [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
          for (let i = 1; i < 8; i++) {
            if (!addMove(row + dr * i, col + dc * i)) break;
          }
        });
        break;
      }

      case 'K': {
        [[-1, -1], [-1, 0], [-1, 1], [0, -1],
         [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
          addMove(row + dr, col + dc);
        });
        
        // Castling
        if (checkForCheck) {
          const homeRow = isWhite ? 7 : 0;
          if (row === homeRow && col === 4) {
            // Kingside castling
            if ((isWhite && castlingRightsParam.whiteKingside) || 
                (!isWhite && castlingRightsParam.blackKingside)) {
              if (!board[homeRow][5] && !board[homeRow][6] &&
                  board[homeRow][7] && getPieceType(board[homeRow][7]) === 'R') {
                // Check if squares are not under attack
                if (!isSquareUnderAttack(board, homeRow, 4, !isWhite, castlingRightsParam, enPassantParam) &&
                    !isSquareUnderAttack(board, homeRow, 5, !isWhite, castlingRightsParam, enPassantParam) &&
                    !isSquareUnderAttack(board, homeRow, 6, !isWhite, castlingRightsParam, enPassantParam)) {
                  moves.push([homeRow, 6, 'castleKingside']);
                }
              }
            }
            
            // Queenside castling
            if ((isWhite && castlingRightsParam.whiteQueenside) || 
                (!isWhite && castlingRightsParam.blackQueenside)) {
              if (!board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] &&
                  board[homeRow][0] && getPieceType(board[homeRow][0]) === 'R') {
                // Check if squares are not under attack
                if (!isSquareUnderAttack(board, homeRow, 4, !isWhite, castlingRightsParam, enPassantParam) &&
                    !isSquareUnderAttack(board, homeRow, 3, !isWhite, castlingRightsParam, enPassantParam) &&
                    !isSquareUnderAttack(board, homeRow, 2, !isWhite, castlingRightsParam, enPassantParam)) {
                  moves.push([homeRow, 2, 'castleQueenside']);
                }
              }
            }
          }
        }
        break;
      }
      default:
        break;
    }

    // Filter out moves that would leave king in check
    if (checkForCheck) {
      return moves.filter((move) => {
        const [newRow, newCol, special] = move;
        const newBoard = board.map(row => [...row]);
        
        // Handle en passant capture
        if (special === 'enPassant') {
          const capturedPawnRow = isWhite ? newRow + 1 : newRow - 1;
          newBoard[capturedPawnRow][newCol] = null;
        }
        
        // Handle castling - don't need to check here as we already checked
        if (special === 'castleKingside' || special === 'castleQueenside') {
          return true;
        }
        
        newBoard[newRow][newCol] = newBoard[row][col];
        newBoard[row][col] = null;

        const kingPos = getPieceType(piece) === 'K' ? 
          [newRow, newCol] : findKing(newBoard, isWhite);
        
        if (!kingPos) return false;
        return !isSquareUnderAttack(newBoard, kingPos[0], kingPos[1], !isWhite, castlingRightsParam, enPassantParam);
      });
    }

    return moves;
  };

  // Check if current player is in check
  const isInCheck = (board, isWhite, castlingRightsParam = castlingRights, enPassantParam = enPassantTarget) => {
    const kingPos = findKing(board, isWhite);
    if (!kingPos) return false;
    return isSquareUnderAttack(board, kingPos[0], kingPos[1], !isWhite, castlingRightsParam, enPassantParam);
  };

  // Get all legal moves for a color
  const getAllLegalMoves = (board, isWhite, castlingRightsParam = castlingRights, enPassantParam = enPassantTarget) => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && isWhitePiece(piece) === isWhite) {
          const pieceMoves = getPieceMoves(board, row, col, true, castlingRightsParam, enPassantParam);
          pieceMoves.forEach(move => {
            moves.push({ from: [row, col], to: Array.isArray(move) ? move : [move] });
          });
        }
      }
    }
    return moves;
  };

  // Evaluate board position
  const evaluateBoard = (board) => {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;

        const pieceType = getPieceType(piece);
        const isWhite = isWhitePiece(piece);
        
        // Material value
        let value = PIECE_VALUES[pieceType];
        
        // Positional bonus from PST
        const pstIndex = isWhite ? row * 8 + col : (7 - row) * 8 + col;
        value += POS_WEIGHT * PST[pieceType][pstIndex];
        
        score += isWhite ? value : -value;
      }
    }
    
    return score;
  };

  // --- NEW: helper to detect if a move is a capture (for quiescence / ordering)
  const isCaptureMove = (board, move) => {
    const [fr, fc] = move.from;
    let toRow, toCol, special;
    if (Array.isArray(move.to)) {
      [toRow, toCol, special] = move.to;
    } else {
      toRow = move.to[0];
      toCol = move.to[1];
    }
    const target = board[toRow][toCol];
    if (special === 'enPassant') return true;
    return !!target;
  };

  // --- OPTIMIZATION: MVV-LVA score for capture ordering ---
  const getMVVLVAScore = (board, move) => {
    if (!isCaptureMove(board, move)) return 0;
    
    const [fr, fc] = move.from;
    let toRow, toCol, special;
    if (Array.isArray(move.to)) {
      [toRow, toCol, special] = move.to;
    } else {
      toRow = move.to[0];
      toCol = move.to[1];
    }
    
    const attacker = board[fr][fc];
    const attackerValue = PIECE_VALUES[getPieceType(attacker)] || 0;
    
    let victimValue = 0;
    if (special === 'enPassant') {
      victimValue = PIECE_VALUES['P'];
    } else {
      const victim = board[toRow][toCol];
      if (victim) {
        victimValue = PIECE_VALUES[getPieceType(victim)] || 0;
      }
    }
    
    // MVV-LVA: prioritize high-value victims, then low-value attackers
    // Multiply victim by 10 to prioritize victim value over attacker value
    return victimValue * 10 - attackerValue;
  };

  // --- Move helpers for display and TT ordering
  const movesEqual = (a, b) => {
    if (!a || !b) return false;
    const [afr, afc] = a.from; const [bfr, bfc] = b.from;
    let [atr, atc, aspec] = Array.isArray(a.to) ? a.to : [a.to[0], a.to[1], undefined];
    let [btr, btc, bspec] = Array.isArray(b.to) ? b.to : [b.to[0], b.to[1], undefined];
    return afr === bfr && afc === bfc && atr === btr && atc === btc && (aspec || null) === (bspec || null);
  };

  const squareStr = (r, c) => `${String.fromCharCode(97 + c)}${8 - r}`;

  const moveToString = (board, move) => {
    const [fr, fc] = move.from;
    let tr, tc, special;
    if (Array.isArray(move.to)) {
      [tr, tc, special] = move.to;
    } else {
      tr = move.to[0];
      tc = move.to[1];
    }
    if (special === 'castleKingside') return 'O-O';
    if (special === 'castleQueenside') return 'O-O-O';
    const captureMark = isCaptureMove(board, move) ? 'x' : '-';
    return `${squareStr(fr, fc)}${captureMark}${squareStr(tr, tc)}`;
  };

  // --- OPTIMIZATION: Enhanced move ordering with MVV-LVA and Killer Moves ---
  const orderMoves = (moves, board, ttMove, ply) => {
    const arr = moves.slice();
    
    // Score each move
    const scoredMoves = arr.map(move => {
      let score = 0;
      
      // 1. TT move gets highest priority
      if (ttMove && movesEqual(move, ttMove)) {
        score = 100000;
      }
      // 2. Captures ordered by MVV-LVA
      else if (isCaptureMove(board, move)) {
        score = 10000 + getMVVLVAScore(board, move);
      }
      // 3. Killer moves (non-captures that caused beta cutoffs)
      else if (ply !== undefined && isKillerMove(ply, move)) {
        score = 5000;
      }
      // 4. Everything else gets base score
      else {
        score = 0;
      }
      
      return { move, score };
    });
    
    // Sort by score (descending)
    scoredMoves.sort((a, b) => b.score - a.score);
    
    return scoredMoves.map(sm => sm.move);
  };

  // Check if a move gives check to the opponent
  const isCheckMove = (board, move, sideToMoveIsWhite, castlingRightsParam, enPassantParam) => {
    const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
      board, move.from, move.to, castlingRightsParam, enPassantParam
    );
    // after the move, opponent is !sideToMoveIsWhite
    return isInCheck(newBoard, !sideToMoveIsWhite, newCastlingRights, newEnPassant);
  };

  // Limited deep search extension: only captures or checks, alpha-beta, with a small ply cap
  const deepExtension = (board, alpha, beta, maximizingPlayer, castlingRightsParam, enPassantParam, remaining) => {
    nodesRef.current++;
    // Don't mark deepSearchUsed here - we'll mark it only if the result is actually used
    const standPat = evaluateBoard(board);

    if (maximizingPlayer) {
      if (standPat >= beta) return standPat;
      if (standPat > alpha) alpha = standPat;
    } else {
      if (standPat <= alpha) return standPat;
      if (standPat < beta) beta = standPat;
    }

    if (remaining <= 0) return standPat;

    let moves = getAllLegalMoves(board, maximizingPlayer, castlingRightsParam, enPassantParam)
      .filter(m => isCaptureMove(board, m) || isCheckMove(board, m, maximizingPlayer, castlingRightsParam, enPassantParam));

    if (moves.length === 0) return standPat;

    // Prefer captures first (MVV-LVA)
    moves = orderMoves(moves, board, null, undefined);

    if (maximizingPlayer) {
      let value = -Infinity;
      for (const move of moves) {
        const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
          board, move.from, move.to, castlingRightsParam, enPassantParam
        );
        const score = deepExtension(newBoard, alpha, beta, false, newCastlingRights, newEnPassant, remaining - 1);
        if (score > value) value = score;
        if (score > alpha) alpha = score;
        if (beta <= alpha) { cutoffsRef.current++; break; }
      }
      return value;
    } else {
      let value = Infinity;
      for (const move of moves) {
        const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
          board, move.from, move.to, castlingRightsParam, enPassantParam
        );
        const score = deepExtension(newBoard, alpha, beta, true, newCastlingRights, newEnPassant, remaining - 1);
        if (score < value) value = score;
        if (score < beta) beta = score;
        if (beta <= alpha) { cutoffsRef.current++; break; }
      }
      return value;
    }
  };

  // --- OPTIMIZATION: Null Move Pruning ---
  const canDoNullMove = (board, maximizingPlayer) => {
    // Don't use null move in endgame or when in check
    // Count non-pawn, non-king pieces
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
    // Require at least one non-pawn, non-king piece
    return pieceCount > 0 && !isInCheck(board, maximizingPlayer);
  };

  // Minimax with Alpha-Beta Pruning + Transposition Table (TT) + Null Move Pruning
  const minimax = (board, depth, alpha, beta, maximizingPlayer, castlingRightsParam, enPassantParam, ply = 0, allowNullMove = true) => {
    // node counter
    nodesRef.current++;
    const alphaOrig = alpha;
    const betaOrig = beta;

    // TT probe
    const key = computeHash(board, maximizingPlayer, castlingRightsParam, enPassantParam);
    const ttEntry = ttRef.current.get(key);
    if (ttEntry && ttEntry.depth >= depth) {
      if (ttEntry.flag === 'EXACT') return ttEntry.value;
      if (ttEntry.flag === 'LOWER') alpha = Math.max(alpha, ttEntry.value);
      else if (ttEntry.flag === 'UPPER') beta = Math.min(beta, ttEntry.value);
      if (alpha >= beta) return ttEntry.value;
    }

    if (depth <= 0) {
      // Step 1 & 2: Reach max basic depth and evaluate
      const basicEval = evaluateBoard(board);
      
      if (!allowDeepSearch) {
        return basicEval;
      }
      
      // Step 3 & 4: Perform deep search and evaluate
      // Note: maximizingPlayer tells us which color moves first in deep search
      const deepEval = deepExtension(board, alpha, beta, maximizingPlayer, castlingRightsParam, enPassantParam, DEEP_EXT_PLIES);
      
      // Step 5: Use basic eval if it's better for the side that moves first in deep search
      let finalEval;
      let usedDeep = false;
      
      if (maximizingPlayer) {
        // White moves first in deep search - higher is better for white
        if (basicEval > deepEval) {
          // Basic position is better than tactical continuation
          finalEval = basicEval;
          usedDeep = false;
        } else {
          // Tactical moves found improvement
          finalEval = deepEval;
          usedDeep = true;
        }
      } else {
        // Black moves first in deep search - lower is better for black  
        if (basicEval < deepEval) {
          // Basic position is better than tactical continuation
          finalEval = basicEval;
          usedDeep = false;
        } else {
          // Tactical moves found improvement
          finalEval = deepEval;
          usedDeep = true;
        }
      }
      
      // Only mark deep search as used if we actually used the deep result
      if (usedDeep) {
        deepSearchUsedRef.current = true;
      }
      
      return finalEval;
    }

    // --- OPTIMIZATION: Null Move Pruning ---
    // Try null move pruning before generating all moves (if conditions are met)
    const R = 2; // Reduction depth
    if (allowNullMove && depth >= R + 1 && canDoNullMove(board, maximizingPlayer)) {
      // Do a reduced depth search with null move (swap sides without making a move)
      const nullScore = -minimax(board, depth - R - 1, -beta, -beta + 1, !maximizingPlayer, castlingRightsParam, enPassantParam, ply + 1, false);
      if (nullScore >= beta) {
        // Null move caused a cutoff
        return beta;
      }
    }

    let moves = getAllLegalMoves(board, maximizingPlayer, castlingRightsParam, enPassantParam);
    
    // Check for checkmate or stalemate
    if (moves.length === 0) {
      if (isInCheck(board, maximizingPlayer, castlingRightsParam, enPassantParam)) {
        return maximizingPlayer ? -999999 : 999999; // Checkmate
      }
      return 0; // Stalemate
    }

    // --- OPTIMIZATION: Enhanced move ordering (TT, MVV-LVA, Killers) ---
    moves = orderMoves(moves, board, ttEntry?.bestMove, ply);

    let bestMoveLocal = null;

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
          board, move.from, move.to, castlingRightsParam, enPassantParam
        );
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, newCastlingRights, newEnPassant, ply + 1, true);
        if (evaluation > maxEval) {
          maxEval = evaluation;
          bestMoveLocal = move;
        }
        if (evaluation > alpha) alpha = evaluation;
        if (beta <= alpha) {
          cutoffsRef.current++;
          // Store killer move (if it's not a capture)
          if (!isCaptureMove(board, move)) {
            addKillerMove(ply, move);
          }
          break; // Alpha-beta pruning
        }
      }

      // Store in TT
      let flag = 'EXACT';
      if (maxEval <= alphaOrig) flag = 'UPPER';
      else if (maxEval >= betaOrig) flag = 'LOWER';
      ttRef.current.set(key, { depth, value: maxEval, flag, bestMove: bestMoveLocal });
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
          board, move.from, move.to, castlingRightsParam, enPassantParam
        );
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, newCastlingRights, newEnPassant, ply + 1, true);
        if (evaluation < minEval) {
          minEval = evaluation;
          bestMoveLocal = move;
        }
        if (evaluation < beta) beta = evaluation;
        if (beta <= alpha) {
          cutoffsRef.current++;
          // Store killer move (if it's not a capture)
          if (!isCaptureMove(board, move)) {
            addKillerMove(ply, move);
          }
          break; // Alpha-beta pruning
        }
      }

      // Store in TT
      let flag = 'EXACT';
      if (minEval <= alphaOrig) flag = 'UPPER';
      else if (minEval >= betaOrig) flag = 'LOWER';
      ttRef.current.set(key, { depth, value: minEval, flag, bestMove: bestMoveLocal });
      return minEval;
    }
  };

  // Simulate a move without updating state (for AI calculation)
  const simulateMove = (board, from, to, castlingRightsParam, enPassantParam) => {
    const newBoard = board.map(row => [...row]);
    const [fromRow, fromCol] = from;
    
    let toRow, toCol, special;
    if (Array.isArray(to)) {
      [toRow, toCol, special] = to;
    } else {
      toRow = to[0];
      toCol = to[1];
    }
    
    const piece = newBoard[fromRow][fromCol];
    const pieceType = getPieceType(piece);
    const isWhite = isWhitePiece(piece);
    let capturedPiece = newBoard[toRow][toCol];
    
    // Handle en passant
    if (special === 'enPassant') {
      const capturedPawnRow = isWhite ? toRow + 1 : toRow - 1;
      newBoard[capturedPawnRow][toCol] = null;
    }
    
    // Handle castling
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
    
    // Pawn promotion
    if (pieceType === 'P' && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol] = isWhite ? 'Q' : 'q';
    }
    
    // Update castling rights
    const newCastlingRights = { ...castlingRightsParam };
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
    
    // Update en passant
    let newEnPassant = null;
    if (special === 'doublePawn') {
      const epRow = isWhite ? fromRow - 1 : fromRow + 1;
      newEnPassant = [epRow, fromCol];
    }
    
    return { newBoard, newCastlingRights, newEnPassant };
  };

  // --- OPTIMIZATION: Iterative Deepening ---
  // Find best move for AI using iterative deepening
  const findBestMove = (board) => {
    // Clear killer moves for new search
    killerMovesRef.current = Array.from({ length: MAX_PLY }, () => []);
    
    // Don't clear TT - keep it across searches for better performance
    // Only clear it when starting a new game
    
    // reset counters & timings
    nodesRef.current = 0;
    cutoffsRef.current = 0;
    deepSearchUsedRef.current = false; // Reset deep search flag
    const now = (typeof performance !== 'undefined' && performance.now) ? () => performance.now() : () => Date.now();
    const t0 = now();

    const moves = getAllLegalMoves(board, false, castlingRights, enPassantTarget);
    if (moves.length === 0) return null;
    
    let bestMove = moves[0];
    let bestValue = Infinity;

    // Iterative deepening: search from depth 1 up to searchDepth
    for (let currentDepth = 1; currentDepth <= searchDepth; currentDepth++) {
      let depthBestMove = null;
      let depthBestValue = Infinity;
      
      // Order moves based on previous iteration's results (TT will help)
      const ordered = orderMoves(moves, board, bestMove, 0);

      for (const move of ordered) {
        const { newBoard, newCastlingRights, newEnPassant } = simulateMove(
          board, move.from, move.to, castlingRights, enPassantTarget
        );
        const boardValue = minimax(newBoard, currentDepth - 1, -Infinity, Infinity, true, newCastlingRights, newEnPassant, 1, true);
        
        if (boardValue < depthBestValue) {
          depthBestValue = boardValue;
          depthBestMove = move;
        }
      }
      
      // Update best move for this depth
      if (depthBestMove) {
        bestMove = depthBestMove;
        bestValue = depthBestValue;
      }
    }

    const t1 = now();

    const usedDeepSearch = deepSearchUsedRef.current;
    lastSearchTypeRef.current = usedDeepSearch ? 'deep' : 'basic';

    // update engine info for UI
    setEngineInfo({
      lastBest: bestValue,
      lastBestMove: bestMove,
      lastBestStr: bestMove ? moveToString(board, bestMove) : null,
      depth: searchDepth,
      nodes: nodesRef.current,
      cutoffs: cutoffsRef.current,
      ttEntries: ttRef.current.size,
      timeMs: Math.round(t1 - t0),
      usedDeepSearch
    });

    return bestMove;
  };

  // Make a move on the board
  const makeMove = (currentBoard, from, to, updateState = true) => {
    const newBoard = currentBoard.map(row => [...row]);
    const [fromRow, fromCol] = from;
    
    // Handle array format with or without special move flag
    let toRow, toCol, special;
    if (Array.isArray(to)) {
      [toRow, toCol, special] = to;
    } else {
      toRow = to[0];
      toCol = to[1];
    }
    
    const piece = newBoard[fromRow][fromCol];
    const pieceType = getPieceType(piece);
    const isWhite = isWhitePiece(piece);
    let capturedPiece = newBoard[toRow][toCol];
    
    // Handle en passant capture
    if (special === 'enPassant') {
      const capturedPawnRow = isWhite ? toRow + 1 : toRow - 1;
      capturedPiece = newBoard[capturedPawnRow][toCol];
      newBoard[capturedPawnRow][toCol] = null;
    }
    
    // Handle castling
    if (special === 'castleKingside') {
      const homeRow = isWhite ? 7 : 0;
      newBoard[homeRow][5] = newBoard[homeRow][7]; // Move rook
      newBoard[homeRow][7] = null;
    } else if (special === 'castleQueenside') {
      const homeRow = isWhite ? 7 : 0;
      newBoard[homeRow][3] = newBoard[homeRow][0]; // Move rook
      newBoard[homeRow][0] = null;
    }
    
    // Move the piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    // Pawn promotion
    if (pieceType === 'P' && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol] = isWhite ? 'Q' : 'q';
    }

    if (updateState) {
      setBoard(newBoard);
      
      // Update captured pieces
      if (capturedPiece) {
        const capturedBy = isWhite ? 'white' : 'black';
        setCapturedPieces(prev => ({
          ...prev,
          [capturedBy]: [...prev[capturedBy], capturedPiece]
        }));
      }

      // Update castling rights
      const newCastlingRights = { ...castlingRights };
      
      // If king moves, lose both castling rights
      if (pieceType === 'K') {
        if (isWhite) {
          newCastlingRights.whiteKingside = false;
          newCastlingRights.whiteQueenside = false;
        } else {
          newCastlingRights.blackKingside = false;
          newCastlingRights.blackQueenside = false;
        }
      }
      
      // If rook moves from starting position, lose that side's castling
      if (pieceType === 'R') {
        if (isWhite && fromRow === 7) {
          if (fromCol === 7) newCastlingRights.whiteKingside = false;
          if (fromCol === 0) newCastlingRights.whiteQueenside = false;
        } else if (!isWhite && fromRow === 0) {
          if (fromCol === 7) newCastlingRights.blackKingside = false;
          if (fromCol === 0) newCastlingRights.blackQueenside = false;
        }
      }
      
      // If rook is captured, lose that side's castling
      if (capturedPiece && getPieceType(capturedPiece) === 'R') {
        if (isWhitePiece(capturedPiece) && toRow === 7) {
          if (toCol === 7) newCastlingRights.whiteKingside = false;
          if (toCol === 0) newCastlingRights.whiteQueenside = false;
        } else if (!isWhitePiece(capturedPiece) && toRow === 0) {
          if (toCol === 7) newCastlingRights.blackKingside = false;
          if (toCol === 0) newCastlingRights.blackQueenside = false;
        }
      }
      
      setCastlingRights(newCastlingRights);

      // Update en passant target
      if (special === 'doublePawn') {
        const epRow = isWhite ? fromRow - 1 : fromRow + 1;
        setEnPassantTarget([epRow, fromCol]);
      } else {
        setEnPassantTarget(null);
      }

      // Update move history
      let moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow}-${String.fromCharCode(97 + toCol)}${8 - toRow}`;
      if (special === 'castleKingside') moveNotation = 'O-O';
      if (special === 'castleQueenside') moveNotation = 'O-O-O';
      if (capturedPiece) moveNotation += 'x';
      
      setMoveHistory(prev => [...prev, moveNotation]);
      
      // Store search type for this move (only for AI moves)
      if (!isWhite) {
        setMoveSearchTypes(prev => [...prev, lastSearchTypeRef.current]);
      } else {
        // For human moves, just mark as 'human'
        setMoveSearchTypes(prev => [...prev, 'human']);
      }
    }

    return newBoard;
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing' || !isWhiteTurn || isThinking) return;

    const piece = board[row][col];

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
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
        const moves = getPieceMoves(board, row, col);
        setSelectedSquare([row, col]);
        setValidMoves(moves);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && isWhitePiece(piece)) {
      const moves = getPieceMoves(board, row, col);
      setSelectedSquare([row, col]);
      setValidMoves(moves);
    }
  };

  // AI makes a move
  useEffect(() => {
    if (!isWhiteTurn && gameStatus === 'playing' && !isThinking) {
      setIsThinking(true);
      
      const timeoutId = setTimeout(() => {
        const bestMove = findBestMove(board);
        if (bestMove) {
          makeMove(board, bestMove.from, bestMove.to);
          setIsWhiteTurn(true);
        }
        setIsThinking(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isWhiteTurn, gameStatus, board]);

  // Check game status
  useEffect(() => {
    const whiteMoves = getAllLegalMoves(board, true, castlingRights, enPassantTarget);
    const blackMoves = getAllLegalMoves(board, false, castlingRights, enPassantTarget);

    if (isWhiteTurn && whiteMoves.length === 0) {
      setGameStatus(isInCheck(board, true) ? 'blackWins' : 'stalemate');
    } else if (!isWhiteTurn && blackMoves.length === 0) {
      setGameStatus(isInCheck(board, false) ? 'whiteWins' : 'stalemate');
    }
  }, [board, isWhiteTurn, castlingRights, enPassantTarget]);

  // Reset game
  const resetGame = () => {
    setBoard(getInitialBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setGameStatus('playing');
    setCapturedPieces({ white: [], black: [] });
    setMoveHistory([]);
    setMoveSearchTypes([]); // Reset search types
    setCastlingRights({
      whiteKingside: true,
      whiteQueenside: true,
      blackKingside: true,
      blackQueenside: true
    });
    setEnPassantTarget(null);
    setIsThinking(false);
    // Clear TT when starting new game
    ttRef.current.clear();
    killerMovesRef.current = Array.from({ length: MAX_PLY }, () => []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            ♔ Optimized Chess Engine ♚
          </h1>
          <p className="text-purple-200 text-lg">
            Enhanced with MVV-LVA, Killer Moves, Iterative Deepening & Null Move Pruning
          </p>
        </div>

        {/* Main game container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Game Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Game Status</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Turn:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isWhiteTurn ? 'bg-blue-100 text-blue-800' : 'bg-gray-700 text-white'
                  }`}>
                    {isWhiteTurn ? '⚪ White' : '⚫ Black'}
                  </span>
                </div>

                {isThinking && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm font-semibold">AI Thinking...</span>
                  </div>
                )}
              </div>

              {gameStatus !== 'playing' && (
                <div className={`p-4 rounded-lg text-center font-bold ${
                  gameStatus === 'whiteWins' ? 'bg-blue-100 text-blue-800' :
                  gameStatus === 'blackWins' ? 'bg-gray-700 text-white' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {gameStatus === 'whiteWins' && '⚪ White Wins!'}
                  {gameStatus === 'blackWins' && '⚫ Black Wins!'}
                  {gameStatus === 'stalemate' && '🤝 Stalemate!'}
                </div>
              )}

              <button
                onClick={resetGame}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                New Game
              </button>
            </div>

            {/* AI Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">AI Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Depth: {searchDepth}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={searchDepth}
                  onChange={(e) => setSearchDepth(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Easier</span>
                  <span>Harder</span>
                </div>
              </div>

              <div className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDeepSearch}
                    onChange={(e) => setAllowDeepSearch(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Deep Extension Search</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Extends search for tactical moves
                </p>
              </div>
            </div>

            {/* Engine Stats */}
            {showEnginePanel && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Engine Stats</h3>
                  <button
                    onClick={() => setShowEnginePanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Search Type:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                      engineInfo.usedDeepSearch 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {engineInfo.usedDeepSearch ? 'Deep Extension' : 'Basic'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evaluation:</span>
                    <span className="font-mono font-semibold text-gray-800">
                      {engineInfo.lastBest !== null ? (engineInfo.lastBest / 100).toFixed(2) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Move:</span>
                    <span className="font-mono font-semibold text-purple-600">
                      {engineInfo.lastBestStr || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nodes:</span>
                    <span className="font-mono text-gray-800">
                      {engineInfo.nodes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cutoffs:</span>
                    <span className="font-mono text-gray-800">
                      {engineInfo.cutoffs.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TT Entries:</span>
                    <span className="font-mono text-gray-800">
                      {engineInfo.ttEntries.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-mono text-gray-800">
                      {engineInfo.timeMs}ms
                    </span>
                  </div>
                  {engineInfo.nodes > 0 && engineInfo.timeMs > 0 && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Nodes/sec:</span>
                      <span className="font-mono text-green-600">
                        {Math.round((engineInfo.nodes / engineInfo.timeMs) * 1000).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Castling Rights */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Castling Rights</h3>
              <div className="space-y-2">
                {castlingRights.whiteKingside && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>White Kingside</span>
                  </div>
                )}
                {castlingRights.whiteQueenside && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>White Queenside</span>
                  </div>
                )}
                {castlingRights.blackKingside && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    <span>Black Kingside</span>
                  </div>
                )}
                {castlingRights.blackQueenside && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    <span>Black Queenside</span>
                  </div>
                )}
                {!castlingRights.whiteKingside && !castlingRights.whiteQueenside && 
                 !castlingRights.blackKingside && !castlingRights.blackQueenside && (
                  <p className="text-gray-500 italic text-center py-2">None available</p>
                )}
              </div>
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
              <div className="inline-block mx-auto">
                {/* Row numbers on the left */}
                <div className="flex">
                  <div className="flex flex-col justify-around mr-2">
                    {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                      <div key={num} className="h-14 sm:h-16 flex items-center justify-center text-gray-600 font-bold text-sm w-5">
                        {num}
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-2 border-gray-800 rounded-sm overflow-hidden">
                    {board.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((piece, colIndex) => {
                          const isLight = (rowIndex + colIndex) % 2 === 0;
                          const isSelected = selectedSquare && 
                            selectedSquare[0] === rowIndex && 
                            selectedSquare[1] === colIndex;
                          const isValidMove = validMoves.some(move => {
                            const [r, c] = move;
                            return r === rowIndex && c === colIndex;
                          });

                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleSquareClick(rowIndex, colIndex)}
                              className={`
                                w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer
                                transition-all duration-100 relative
                                ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                                ${isSelected ? 'ring-4 ring-inset ring-blue-500 z-10' : ''}
                                ${isValidMove && !isSelected ? 'ring-4 ring-inset ring-green-500' : ''}
                                hover:brightness-95 active:scale-95
                              `}
                            >
                              {piece && (
                                <div className={`${isSelected ? 'scale-110' : ''} transition-transform`}>
                                  <ChessPiece piece={piece} size={isLight ? 50 : 52} />
                                </div>
                              )}
                              {isValidMove && !piece && (
                                <div className="absolute w-4 h-4 bg-green-500 rounded-full opacity-70 shadow-lg" />
                              )}
                              {isValidMove && piece && (
                                <>
                                  <div className="absolute inset-0 bg-red-400 opacity-25" />
                                  <div className="absolute inset-2 border-2 border-red-500 rounded-sm pointer-events-none" />
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column letters at the bottom */}
                <div className="flex ml-7">
                  {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                    <span key={letter} className="w-14 sm:w-16 text-center text-gray-600 font-bold text-sm mt-2">
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Move History */}
            {moveHistory.length > 0 && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Move History</h3>
                <div className="max-h-32 overflow-y-auto text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                  {moveHistory.map((move, idx) => {
                    const searchType = moveSearchTypes[idx];
                    const isWhiteMove = idx % 2 === 0;
                    
                    return (
                      <div key={idx} className="inline-flex items-center gap-1 mr-3 mb-1">
                        <span className={`font-mono ${isWhiteMove ? 'font-semibold' : ''}`}>
                          {isWhiteMove ? `${Math.floor(idx / 2) + 1}.` : ''} {move}
                        </span>
                        {searchType && searchType !== 'human' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            searchType === 'deep' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {searchType === 'deep' ? 'D' : 'B'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-500 flex gap-3">
                  <span className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">B</span>
                    Basic Search
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">D</span>
                    Deep Search
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Captured Pieces */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Captured Pieces</h3>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-semibold text-gray-700">By You (White)</p>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[60px] bg-blue-50 rounded-lg p-3 border border-blue-200">
                  {capturedPieces.white.length > 0 ? (
                    capturedPieces.white.map((piece, idx) => (
                      <div key={idx} className="w-10 h-10">
                        <ChessPiece piece={piece} size={40} />
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">None yet</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                  <p className="text-sm font-semibold text-gray-700">By AI (Black)</p>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[60px] bg-gray-100 rounded-lg p-3 border border-gray-300">
                  {capturedPieces.black.length > 0 ? (
                    capturedPieces.black.map((piece, idx) => (
                      <div key={idx} className="w-10 h-10">
                        <ChessPiece piece={piece} size={40} />
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">None yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Optimizations</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>MVV-LVA:</strong> Smart capture ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Killer Moves:</strong> Remember successful quiet moves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Iterative Deepening:</strong> Progressive search refinement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Null Move Pruning:</strong> Faster cutoff detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Alpha-Beta + Transposition Table</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
