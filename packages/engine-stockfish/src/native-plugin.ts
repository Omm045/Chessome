import { IEnginePlugin, EnginePluginManifest } from '@chessome/engine';
import { STOCKFISH_MANIFEST } from './manifest';

export class StockfishNativePlugin implements IEnginePlugin {
  get manifest(): EnginePluginManifest {
    return {
      ...STOCKFISH_MANIFEST,
      id: 'org.stockfishchess.stockfish.native'
    };
  }

  async initialize(): Promise<void> {
    // Acquire the correct binary for the host platform.
    // E.g., await binaryProvider.resolveBinary(this.manifest.id, { ... })
  }

  async dispose(): Promise<void> {
    // Cleanup any lingering processes or temporary files if necessary.
  }
}
