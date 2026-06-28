# Chessome: Bug Prevention Checklist

Certain classes of bugs are notorious in chess applications. This checklist defines how to physically prevent them in code.

## 1. The React "Stale Closure" Bug (Frontend)
- **Why it happens**: WebSockets and WebWorkers push high-frequency events. If an event listener captures a React state variable (e.g., `currentMove`), it captures the value from the *initial* render. When the event fires later, it uses stale data.
- **Prevention**: 
  - NEVER use `useState` inside a WebSocket listener.
  - ALWAYS use `useRef` to hold mutable values that event listeners need, or use a state manager outside of React (Zustand's `useStore.getState()`).

## 2. The WASM Memory Leak (Frontend/Worker)
- **Why it happens**: Stockfish WASM allocates a massive Hash table in browser memory. If the user navigates away from the analysis page, React unmounts the component, but the WebWorker process keeps running in the background, holding 128MB of RAM forever.
- **Prevention**:
  - Implement a `useEffect` cleanup function that explicitly calls `worker.terminate()`.
  - Required Assertion: Playwright test navigating between "Home" and "Analysis" 10 times, verifying `performance.memory.usedJSHeapSize` does not continually escalate.

## 3. The PGN Regex DOS (Backend)
- **Why it happens**: Malicious users upload PGNs with extreme nested variations: `1. e4 (1. d4 (1. c4 ...))`. A poorly written regex used to strip comments will cause catastrophic backtracking, locking the Node.js event loop at 100% CPU.
- **Prevention**:
  - NEVER use Regex to parse PGNs.
  - Required validation: Always use an AST-based lexer (`chess.js` or custom Rust parser) and enforce a strict `1MB` upload limit on the API Gateway.

## 4. The Database N+1 Query (Backend)
- **Why it happens**: Fetching a Collection containing 100 Games, and the ORM executes 1 query for the Collection, and 100 separate queries to fetch the games.
- **Prevention**:
  - Required Logging: Prisma query logging MUST be enabled in dev mode. 
  - If a loop contains a database `await`, the code review fails automatically. Use Prisma's `include` or Dataloader.

## 5. The Phantom Engine Eval (API/Sockets)
- **Why it happens**: User A starts evaluating a position on a Worker. User A disconnects. The Worker continues calculating for 10 minutes, burning CPU for nobody.
- **Prevention**:
  - The WebSocket Gateway MUST listen for the `disconnect` event.
  - Required Action: Upon disconnect, emit a `JobCancelled` event to Redis. The Scheduler must intercept this and kill the Stockfish child process on the Worker node immediately.
