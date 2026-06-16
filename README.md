# Mini Chess Engine

React mini chess engine with a browser-playable board, basic chess rules, and an AI opponent using alpha-beta search with transposition table, killer moves, MVV-LVA move ordering, iterative deepening, null-move pruning, and optional tactical deep extension.

## Project Structure

- `a5566b2d-39c7-42e8-baf5-ed9191358b7c.tsx` keeps the original default export path as a compatibility shim.
- `src/ChessGame.tsx` composes the main application UI.
- `src/hooks/useChessGame.ts` owns React state, turn flow, reset behavior, AI timing, move history, captured pieces, and engine stats.
- `src/components/` contains presentational React components.
- `src/chess/` contains React-free chess logic, including board setup, rules, move application, evaluation, hashing, and engine search.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.

The workflow generates a minimal Vite app in CI, imports `src/ChessGame.tsx` from `src/main.tsx`, installs the required React/Vite dependencies, builds with `vite build --base=./`, and deploys `dist`.
