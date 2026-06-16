import React from 'react';
import type { CapturedPieces } from '../chess/types';
import ChessPiece from './ChessPiece';

interface CapturedPiecesPanelProps {
  capturedPieces: CapturedPieces;
}

const CapturedPiecesPanel = ({ capturedPieces }: CapturedPiecesPanelProps) => (
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
);

export default CapturedPiecesPanel;
