import { IEnginePlugin, IEnginePluginManifestV2 } from '@chessome/engine';
import { STOCKFISH_MANIFEST } from './manifest';

export class StockfishNativePlugin implements IEnginePlugin {
  get manifest(): IEnginePluginManifestV2 {
    return {
      ...STOCKFISH_MANIFEST,
      pluginId: 'org.stockfishchess.stockfish.native',
      runtimeType: 'native'
    };
  }

  async install(): Promise<void> {
    // Download binary from the BinarySource
  }

  async verify(): Promise<boolean> {
    // Verify hash, signature, and permissions
    return true;
  }

  async activate(): Promise<void> {
    // Bring the plugin into a Ready state
  }

  async deactivate(): Promise<void> {
    // Gracefully shut down any processes
  }

  async update(): Promise<void> {
    // Perform auto-update if configured
  }

  async uninstall(): Promise<void> {
    // Delete binaries and cached data
  }
}
