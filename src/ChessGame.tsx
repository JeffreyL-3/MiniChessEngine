import React from 'react';
import AiSettingsPanel from './components/AiSettingsPanel';
import CapturedPiecesPanel from './components/CapturedPiecesPanel';
import CastlingRightsPanel from './components/CastlingRightsPanel';
import ChessBoard from './components/ChessBoard';
import EngineStatsPanel from './components/EngineStatsPanel';
import GameStatusPanel from './components/GameStatusPanel';
import MoveHistoryPanel from './components/MoveHistoryPanel';
import { useChessGame } from './hooks/useChessGame';

const ChessGame = () => {
  const game = useChessGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Mini Chess Engine
          </h1>
          <p className="text-purple-200 text-lg">
            Play a compact chess match against the browser AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <GameStatusPanel
              isWhiteTurn={game.isWhiteTurn}
              isThinking={game.isThinking}
              gameStatus={game.gameStatus}
              onReset={game.resetGame}
            />
            <AiSettingsPanel
              searchDepth={game.searchDepth}
              allowDeepSearch={game.allowDeepSearch}
              onSearchDepthChange={game.setSearchDepth}
              onAllowDeepSearchChange={game.setAllowDeepSearch}
            />
            {game.showEnginePanel && (
              <EngineStatsPanel
                engineInfo={game.engineInfo}
                onHide={() => game.setShowEnginePanel(false)}
              />
            )}
            <CastlingRightsPanel castlingRights={game.castlingRights} />
          </div>

          <div className="lg:col-span-2">
            <ChessBoard
              board={game.board}
              selectedSquare={game.selectedSquare}
              validMoves={game.validMoves}
              onSquareClick={game.handleSquareClick}
            />
            <MoveHistoryPanel
              moveHistory={game.moveHistory}
              moveSearchTypes={game.moveSearchTypes}
            />
          </div>

          <div className="space-y-4">
            <CapturedPiecesPanel capturedPieces={game.capturedPieces} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
