import React from 'react';
import type { CastlingRights } from '../chess/types';

interface CastlingRightsPanelProps {
  castlingRights: CastlingRights;
}

const CastlingRightsPanel = ({ castlingRights }: CastlingRightsPanelProps) => (
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
);

export default CastlingRightsPanel;
