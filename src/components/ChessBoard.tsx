import React from 'react';
import type { Board, MoveTarget, Square } from '../chess/types';
import ChessPiece from './ChessPiece';

interface ChessBoardProps {
  board: Board;
  selectedSquare: Square | null;
  validMoves: MoveTarget[];
  onSquareClick: (row: number, col: number) => void;
}

const ChessBoard = ({ board, selectedSquare, validMoves, onSquareClick }: ChessBoardProps) => (
  <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
    <div className="inline-block mx-auto">
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
                const isSelected = !!selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                const isValidMove = validMoves.some(move => {
                  const [r, c] = move;
                  return r === rowIndex && c === colIndex;
                });

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => onSquareClick(rowIndex, colIndex)}
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

      <div className="flex ml-7">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <span key={letter} className="w-14 sm:w-16 text-center text-gray-600 font-bold text-sm mt-2">
            {letter}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ChessBoard;
