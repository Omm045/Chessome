import { EnginePluginManifest } from '@chessome/engine';

export const STOCKFISH_MANIFEST: EnginePluginManifest = {
  id: 'org.stockfishchess.stockfish',
  name: 'Stockfish',
  version: '16.1', // the version this plugin natively wraps and supports
  uciVersion: '1.0',
  license: 'GPL-3.0',
  author: 'T. Romstad, M. Costalba, J. Kiiski, G. Linscott',
  minRuntimeVersion: '1.0.0',
  supportedPlatforms: ['darwin-x64', 'darwin-arm64', 'linux-x64', 'linux-arm64', 'win32-x64', 'wasm32'],
  capabilities: {
    name: 'Stockfish',
    version: '16.1',
    license: 'GPL-3.0',
    supportsNNUE: true,
    supportsSyzygy: true,
    supportsMultiPV: true,
    supportsChess960: true,
    supportsVariants: [],
    supportsGPU: false,
    minThreads: 1,
    maxThreads: 1024,
    hashLimitMb: 33554432
  }
};
