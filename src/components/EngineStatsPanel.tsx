import React from 'react';
import type { EngineInfo } from '../chess/types';

interface EngineStatsPanelProps {
  engineInfo: EngineInfo;
  onHide: () => void;
}

const EngineStatsPanel = ({ engineInfo, onHide }: EngineStatsPanelProps) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800">Engine Stats</h3>
      <button onClick={onHide} className="text-gray-400 hover:text-gray-600">x</button>
    </div>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Search Type:</span>
        <span className={`font-semibold px-2 py-0.5 rounded text-xs ${engineInfo.usedDeepSearch ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {engineInfo.usedDeepSearch ? 'Deep' : 'Basic'}
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
        <span className="font-mono font-semibold text-purple-600">{engineInfo.lastBestStr || '-'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Nodes:</span>
        <span className="font-mono text-gray-800">{engineInfo.nodes.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Cutoffs:</span>
        <span className="font-mono text-gray-800">{engineInfo.cutoffs.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">TT Entries:</span>
        <span className="font-mono text-gray-800">{engineInfo.ttEntries.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Time:</span>
        <span className="font-mono text-gray-800">{engineInfo.timeMs}ms</span>
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
);

export default EngineStatsPanel;
