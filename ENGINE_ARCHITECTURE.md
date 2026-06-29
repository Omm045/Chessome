# Chessome: Engine Architecture

## 1. Core Philosophy
Chess engines are the heart of Chessome. However, no specific engine (not even Stockfish) should be tightly coupled to the system. The platform must treat all engines as interchangeable black boxes that communicate via standardized protocols (primarily UCI - Universal Chess Interface).

## 2. Abstraction Layer: The Engine Adapter

Every engine is wrapped in an `IEngineAdapter` interface.

```typescript
interface IEngineAdapter {
  initialize(options: EngineOptions): Promise<void>;
  setPosition(fen: string, moves?: string[]): Promise<void>;
  evaluate(depth: number, multipv?: number): AsyncGenerator<EngineEvaluation, void, void>;
  stop(): Promise<void>;
  terminate(): Promise<void>;
}
```

### 2.1 Supported Environments
The adapter pattern abstracts *where* the engine is running:
- **LocalAdapter (WASM)**: Loads a WebAssembly compiled engine inside a Web Worker in the browser.
- **ProcessAdapter (Node.js)**: Spawns a native binary (e.g., `./engines/stockfish-ubuntu-x86-64-avx2`) via `child_process` on the cloud worker.
- **NetworkAdapter (TCP/WebSocket)**: Connects to a remote, bare-metal server cluster dedicated solely to engine compute.

## 3. Multi-Engine Support Strategy

To support engines like Stockfish, Berserk, Ethereal, and Koivisto:
1. **Engine Registry**: A database table mapping engine identifiers to their executable paths or WASM bundles.
2. **UCI Compatibility**: Most modern engines use UCI. A generic `UciAdapter` handles the parsing of standard UCI output (`info depth 20 seldepth 28 multipv 1 score cp 45 nodes 123456 nps 7890 time 123 pv e2e4 e7e5...`).
3. **Custom Adapters**: For non-UCI or experimental AI engines (e.g., Leela Chess Zero which requires GPU initialization flags), specific subclasses (e.g., `Lc0Adapter`) inherit from `UciAdapter` to override startup parameters.

## 4. Engine Comparison & Tournaments

Because engines are instantiated via factories, the platform natively supports Engine Comparison:
- A user can request an evaluation.
- The API spawns two separate Web Workers (Local) or queues two jobs (Cloud).
- UI subscribes to both streams and renders side-by-side evaluations of the exact same position, allowing researchers to spot differences in engine philosophy.

## 5. Architectural Decision Records (ADR)

### ADR-ENG-001: WebAssembly as the Primary Free Tier Engine
- **Why it exists**: Providing free, unlimited server-side CPU time for Stockfish 16 at depth 20+ is economically impossible for an open-source project without massive funding.
- **Trade-offs**: WASM Stockfish (via NNUE) is approximately 30-50% slower than a native AVX512 compiled binary. It also consumes the user's local battery and CPU.
- **Alternative approaches**: Throttling cloud compute (creates long queues), requiring users to pay (violates product vision).
- **Future scalability**: WebAssembly SIMD and WebWorker threading are continuously improving browser-side performance.
- **Risks**: Mobile devices with low RAM may crash if the NNUE evaluation file (~50MB) and hash tables are too large.
- **Engineering justification**: The Local WASM adapter will aggressively manage memory (Hash=16MB on mobile, 128MB on desktop) to prevent crashes. Users who demand faster analysis can configure the application to connect to their *own* locally hosted native engine via a local WebSocket relay, completely bypassing the browser's limitations while still using the Chessome UI.

### ADR-ENG-002: Abstracting Evaluation Scores
- **Why it exists**: Some engines output Centipawns (CP), some output Win/Draw/Loss (WDL) probabilities, and some (neural nets) output raw node percentages.
- **Trade-offs**: Normalizing scores requires mapping functions that might lose slight nuance.
- **Alternative approaches**: Displaying raw engine output to the user.
- **Future scalability**: Ensures the UI only ever has to deal with a unified `StandardizedEvaluation` object.
- **Risks**: Changing normalizations might skew historical Accuracy reports.
- **Engineering justification**: The `EngineAdapter` is strictly responsible for normalizing all outputs into a standard format: `{ type: 'cp' | 'mate', value: number, wdl?: { w, d, l } }`. The frontend only consumes this standardized format.
