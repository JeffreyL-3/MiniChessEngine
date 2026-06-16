# Mini Chess Engine

React mini chess engine with a browser-playable board, basic chess rules, and an AI opponent.

## Engine Search

The AI search combines several techniques:

- Alpha-beta search limits branches that cannot affect the final decision.
- A transposition table reuses previously evaluated board positions.
- MVV-LVA move ordering prioritizes promising captures.
- Killer moves remember quiet moves that previously caused cutoffs.
- Iterative deepening searches progressively deeper positions.
- Null-move pruning detects faster cutoffs in positions where passing would still hold an advantage.
- The optional tactical deep extension allows deeper analysis when the position calls for it.

## Project Structure

- `a5566b2d-39c7-42e8-baf5-ed9191358b7c.tsx` keeps the original default export path as a compatibility shim.
- `src/ChessGame.tsx` composes the main application UI.
- `src/hooks/useChessGame.ts` owns React state, turn flow, reset behavior, AI timing, move history, captured pieces, and engine stats.
- `src/components/` contains presentational React components.
- `src/chess/` contains React-free chess logic, including board setup, rules, move application, evaluation, hashing, and engine search.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.

The workflow generates a minimal Vite app in CI, imports `src/ChessGame.tsx` from `src/main.tsx`, installs the required React/Vite dependencies, builds with `vite build --base=./`, and deploys `dist`.
