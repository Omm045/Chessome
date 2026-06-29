# Chessome: Browser Memory & WebAssembly Strategy

## 1. The Challenge
Running a modern chess engine (Stockfish 16+ NNUE) locally in the browser via WebAssembly (WASM) provides free, zero-latency analysis. However, browsers impose strict limits on Web Workers and WebAssembly memory. Exceeding these limits causes silent crashes on desktop and aggressive app-kills by the OS on mobile (especially iOS Safari).

## 2. Memory Budgets & Constraints

### 2.1 The NNUE File
- Modern Stockfish relies on a Neural Network file (`.nnue`) for evaluation, which is typically 40MB-50MB.
- This must be fetched over the network and loaded into WASM memory before the engine can start.

### 2.2 Hash Tables (Transposition Table)
- Engines use RAM to store previously evaluated positions. A larger Hash = deeper analysis.
- Setting `Hash=1024` (1GB) in the browser will immediately crash Safari on iOS.

### 2.3 Browser-Specific Limits
- **Desktop Chrome/Firefox/Edge**: Generally allows up to 2GB-4GB of WASM memory per tab. Safe to use `Hash=128` or `Hash=256`.
- **Android Chrome**: Highly variable based on device RAM. Safe limit is `Hash=64`.
- **iOS Safari (iPhone)**: Notoriously aggressive OOM (Out of Memory) killer. Exceeding ~300MB of total tab memory (including DOM, JS heap, and WASM) will kill the page. Safe limit is `Hash=16`.

## 3. The Implementation Strategy

### 3.1 Dynamic Memory Allocation
The `LocalWasmAdapter` does not hardcode engine settings. It inspects the environment before spawning the Web Worker.

```typescript
function calculateSafeHashSize(): number {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const deviceMemory = navigator.deviceMemory || 4; // Defaults to 4GB if API unavailable

  if (isIOS) return 16; // 16MB Hash for iOS (Strict)
  if (deviceMemory <= 2) return 32; // Low-end Android/Laptops
  if (deviceMemory <= 4) return 64; // Mid-range
  return 128; // High-end Desktop (Conservative default to keep UI smooth)
}
```

### 3.2 Threading & SharedArrayBuffer (SAB)
Stockfish requires multi-threading to achieve high NPS (Nodes Per Second). WASM multi-threading relies on `SharedArrayBuffer`.
- **The Catch**: SAB is disabled by default in all modern browsers due to Spectre/Meltdown security vulnerabilities.
- **The Fix**: The Next.js server MUST emit strict security headers:
  ```http
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  ```
- **Fallback**: If SAB is unavailable (e.g., a user is embedding the site in a cross-origin iframe), the `LocalWasmAdapter` catches the error and automatically downloads the Single-Threaded WASM binary (`stockfish.wasm` instead of `stockfish-threads.wasm`).

### 3.3 HCE Fallback (No NNUE)
If fetching the 50MB `.nnue` file fails, or if a strict data-saver mode is active (`navigator.connection.saveData`), the engine automatically falls back to Hand-Crafted Evaluation (HCE). This drops engine strength by ~500 Elo but reduces memory footprint to under 10MB, ensuring the app functions on even the lowest-tier devices in developing nations.
