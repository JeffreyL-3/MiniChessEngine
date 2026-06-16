import React from 'react';
import type { SearchType } from '../chess/types';

interface MoveHistoryPanelProps {
  moveHistory: string[];
  moveSearchTypes: SearchType[];
}

const MoveHistoryPanel = ({ moveHistory, moveSearchTypes }: MoveHistoryPanelProps) => {
  if (moveHistory.length === 0) return null;

  return (
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
                  searchType === 'deep' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
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
  );
};

export default MoveHistoryPanel;
