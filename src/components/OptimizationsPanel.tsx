import React from 'react';

const OptimizationsPanel = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
    <h3 className="text-lg font-bold text-gray-800 mb-3">Optimizations</h3>
    <ul className="text-gray-700 space-y-2 text-sm">
      <li className="flex items-start gap-2">
        <span className="text-green-600 font-bold">OK</span>
        <span><strong>MVV-LVA:</strong> Smart capture ordering</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-600 font-bold">OK</span>
        <span><strong>Killer Moves:</strong> Remember successful quiet moves</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-600 font-bold">OK</span>
        <span><strong>Iterative Deepening:</strong> Progressive search refinement</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-green-600 font-bold">OK</span>
        <span><strong>Null Move Pruning:</strong> Faster cutoff detection</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-blue-600 font-bold">-</span>
        <span>Alpha-Beta + Transposition Table</span>
      </li>
    </ul>
  </div>
);

export default OptimizationsPanel;
