# Chessome: Frontend Architecture

## 1. Core Framework
The frontend is built using **Next.js (App Router)**. This provides a balance between SEO requirements (for public game shares) and highly interactive Client Components (for the chessboard and analysis UI).

## 2. Directory Structure (Feature-First)
We strictly avoid grouping files by technical role (e.g., all `components` in one folder, all `hooks` in another). Instead, we group by business feature.

```text
apps/web/src/
├── app/                  # Next.js App Router (Pages & Layouts)
├── features/             # Feature-first modules
│   ├── auth/
│   ├── analysis-board/   # The core chessboard, eval bar, and engine UI
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types.ts
│   ├── repertoire/
│   └── game-review/
├── shared/               # Truly global utilities
│   ├── ui/               # (Imported from packages/ui)
│   ├── api/              # Axios/Fetch clients
│   └── lib/              # PGN/FEN parsing utilities
```

## 3. State Management

Chess analysis is highly stateful. The user navigates a move tree, engines evaluate in the background, and arrows are drawn on the board.

- **Server State**: Managed by `@tanstack/react-query`. This handles fetching game histories, master databases, and synchronizing with the backend. It provides built-in caching, retry logic, and optimistic updates.
- **Client/UI State**: Managed by **Zustand**. 
  - Why Zustand? It's unopinionated, avoids React Context re-render hell, and allows state to be accessed outside of React components (e.g., inside a WebWorker message handler).
  - The `useAnalysisStore` handles the current FEN, the move tree (variations), and the selected move index.

## 4. The Chessboard Component
The chessboard is the most complex component. We will **NOT** use existing heavy libraries like `react-chessboard` if they lack performance or customization.
We will build a custom SVG/Canvas hybrid board tailored for performance:
- **CSS Grid** for the 64 squares.
- **Framer Motion** for piece animations (smooth sliding).
- **SVG overlays** for highlighting squares and drawing arrows (right-click drag).

## 5. Architectural Decision Records (ADR)

### ADR-FE-001: Separation of Engine State from React State
- **Why it exists**: Stockfish evaluating at 3M nodes/sec emits MultiPV updates incredibly fast. Pumping 20 evaluation updates per second directly into React State (`setState`) will cause continuous re-renders and freeze the UI.
- **Trade-offs**: Requires manual DOM manipulation or specialized subscription patterns to update the evaluation bar without triggering a full component tree render.
- **Alternative approaches**: Throttling React state updates to 1 per second (looks laggy).
- **Future scalability**: Ensures the UI remains 60fps regardless of engine speed.
- **Risks**: Bypassing React state can lead to desynchronization if not handled carefully.
- **Engineering justification**: We will use Zustand's transient updates (`useStore.subscribe`) and React's `useRef` to directly mutate the DOM node of the Evaluation Bar (the filling rectangle) based on engine events. This keeps React completely out of the high-frequency render loop, ensuring buttery-smooth piece dragging while the engine calculates.

### ADR-FE-002: Progressive Web App (PWA) Offline Capabilities
- **Why it exists**: Users may want to analyze games on airplanes or trains without internet access.
- **Trade-offs**: Service workers are notoriously difficult to debug and cache invalidation is hard.
- **Alternative approaches**: Require internet connection at all times.
- **Future scalability**: PWA is the first step toward native mobile apps.
- **Risks**: Storing massive opening books in IndexedDB can exceed browser storage limits.
- **Engineering justification**: The app will be registered as a PWA. Core static assets and the WASM engine binaries will be cached aggressively. A user can open Chessome offline, paste a PGN, and analyze it using the local WASM engine with zero network requests.
