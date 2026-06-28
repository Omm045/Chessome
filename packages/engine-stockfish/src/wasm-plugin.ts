import { IEnginePlugin, EnginePluginManifest } from '@chessome/engine';
import { STOCKFISH_MANIFEST } from './manifest';

export class StockfishWasmPlugin implements IEnginePlugin {
  get manifest(): EnginePluginManifest {
    return {
      ...STOCKFISH_MANIFEST,
      id: 'org.stockfishchess.stockfish.wasm',
      supportedPlatforms: ['wasm32']
    };
  }

  async initialize(): Promise<void> {
    // Load WASM module 
  }

  async dispose(): Promise<void> {
    // Terminate WASM workers
  }
}
