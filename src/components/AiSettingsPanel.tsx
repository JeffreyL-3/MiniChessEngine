import React from 'react';

interface AiSettingsPanelProps {
  searchDepth: number;
  allowDeepSearch: boolean;
  onSearchDepthChange: (depth: number) => void;
  onAllowDeepSearchChange: (allow: boolean) => void;
}

const AiSettingsPanel = ({
  searchDepth,
  allowDeepSearch,
  onSearchDepthChange,
  onAllowDeepSearchChange
}: AiSettingsPanelProps) => (
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
        onChange={(e) => onSearchDepthChange(parseInt(e.target.value))}
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
          onChange={(e) => onAllowDeepSearchChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />
        <span className="text-sm text-gray-700">Deep Extension Search</span>
      </label>
      <p className="text-xs text-gray-500 mt-1 ml-6">Extends search for tactical moves</p>
    </div>
  </div>
);

export default AiSettingsPanel;
