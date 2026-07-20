# Mini Chess Engine

React mini chess engine with a browser-playable board, basic chess rules, and an AI opponent.

## Web App Structure

The app is split between React UI code and React-free chess logic:

- `a5566b2d-39c7-42e8-baf5-ed9191358b7c.tsx` keeps the original default export path as a compatibility shim for the host environment.
- `src/ChessGame.tsx` is the main screen. It lays out the status, AI settings, board, move history, engine stats, castling rights, and captured pieces panels.
- `src/hooks/useChessGame.ts` owns the application state and game flow. It tracks the board, selected square, legal moves, whose turn it is, move history, captured pieces, castling rights, en passant target, AI settings, and the latest engine stats. It also triggers the AI after the player moves.
- `src/components/` contains presentational React components. These components receive state and callbacks from `useChessGame` and render panels, controls, and the board.
- `src/chess/` contains the chess engine and rules with no React dependency. Board setup, legal move generation, move application, evaluation, hashing, and search all live here.

This separation lets the browser UI stay thin: React manages interaction and display, while `src/chess/` decides which moves are legal and which move the AI should play.

## AI Settings

### Search Depth

`Search Depth` is shown in moves from the AI's point of view. A depth of `1` means the AI compares its legal moves using a direct evaluation after each move. A depth of `2` means the AI looks at each AI move, then one player reply. Higher values continue alternating sides.

Inside the engine, this is implemented in plies. A ply is one half-move by one side. For example:

- Search depth `1`: choose among AI moves, then evaluate the resulting positions.
- Search depth `2`: AI move + player reply.
- Search depth `3`: AI move + player reply + AI move.

The UI uses the word "depth" because that is friendlier for play, but the recursive search counts down one ply at a time after each candidate AI move.

### Deep Search

`Deep Search` is an optional tactical search that runs only at the leaves of the normal search tree. When the normal depth reaches zero, the engine continues exploring forcing moves, currently captures and checks, within the selected `Deep Plies` budget. If the side to move is in check, the engine searches every legal evasion instead of using the static evaluation as though that side could pass. A check at the edge of the selected budget is extended until the checked side can legally respond, with `MAX_PLY` as the overall safety limit.

This helps avoid the horizon effect. Without deep search, the engine might stop in the middle of a capture sequence and evaluate an unstable position too early. With deep search enabled, the engine can keep following tactical forcing lines until the position becomes quieter or the deep limit is reached.

Deep search does not make every branch deeper. Outside check, quiet moves are not expanded by the deep search; checked positions still include every legal evasion. It is a targeted continuation for tactical positions, so it can find sharper moves without multiplying the full search tree as much as raising the main search depth would.

`Deep Plies` controls the normal forcing-move budget after the main search depth is exhausted. Mandatory check evasions may extend past that budget as described above. The setting defaults to `DEEP_EXT_PLIES`, which is currently `6`.

The engine stats panel reports `Deep` when any part of the last AI search used deep search, including branches that were later discarded. It reports `Basic` when the last search only used the normal search/evaluation path.

## Engine Search

The AI search combines several techniques:

- Iterative deepening searches depth `1`, then `2`, and so on up to the selected search depth. The best move from the previous pass is searched first on the next pass.
- Alpha-beta pruning skips branches that cannot affect the final decision.
- A transposition table reuses previously evaluated board positions.
- MVV-LVA move ordering prioritizes promising captures.
- Killer moves remember quiet moves that previously caused alpha-beta cutoffs.
- Null-move pruning searches a reduced "pass" line to detect faster cutoffs in positions where the side to move appears to have enough material and is not in check.
- Optional deep search extends tactical leaf positions through captures and checks.

The transposition table persists across moves so the engine can reuse calculations from earlier positions in the same game. It is cleared when Deep Search or Deep Plies changes because those settings affect the meaning of cached evaluations.

## Tests

The deployment workflow runs the chess regression suite before building the site. The suite covers mate detection at the normal-search horizon and standard perft baselines for ordinary movement, castling, checks, and en passant-sensitive move generation.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.

The workflow generates a minimal Vite app in CI, imports `src/ChessGame.tsx` from `src/main.tsx`, installs the required dependencies, runs the chess regression suite, builds with `vite build --base=./`, and deploys `dist`.
