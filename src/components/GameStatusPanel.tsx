import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { GameStatus } from '../chess/types';

interface GameStatusPanelProps {
  isWhiteTurn: boolean;
  isThinking: boolean;
  gameStatus: GameStatus;
  onReset: () => void;
}

const GameStatusPanel = ({ isWhiteTurn, isThinking, gameStatus, onReset }: GameStatusPanelProps) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Game Status</h3>
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 font-semibold">Turn:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${isWhiteTurn ? 'bg-blue-100 text-blue-800' : 'bg-gray-700 text-white'}`}>
          {isWhiteTurn ? 'White' : 'Black'}
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
        {gameStatus === 'whiteWins' && 'White Wins!'}
        {gameStatus === 'blackWins' && 'Black Wins!'}
        {gameStatus === 'stalemate' && 'Stalemate!'}
      </div>
    )}

    <button
      onClick={onReset}
      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
    >
      <RotateCcw size={18} />
      New Game
    </button>
  </div>
);

export default GameStatusPanel;
