export type BinarySourceType = 'github' | 'mirror' | 'local' | 'enterprise';

export interface IBinarySource {
  readonly type: BinarySourceType;
  readonly url: string;
}

export interface IEnginePluginManifestV2 {
  readonly pluginId: string;
  readonly engineId: string;
  readonly name: string;
  readonly runtimeType: 'native' | 'wasm' | 'remote';
  readonly version: string;
  readonly license: string;
  readonly author: string;
  
  readonly minRuntimeVersion: string;
  readonly supportedPlatforms: string[];
  
  readonly hash?: string;
  readonly signature?: string;
  readonly binarySource?: IBinarySource;
  
  readonly autoUpdate: boolean;
  readonly dependencies: Record<string, string>;
  
  // Exposes specific UCI capabilities
  readonly capabilities: {
    readonly uciVersion: string;
    readonly supportsMultiPV: boolean;
    readonly supportsSyzygy: boolean;
    readonly supportsNNUE: boolean;
    readonly supportsChess960: boolean;
    readonly supportsVariants: string[];
    readonly supportsGPU: boolean;
    readonly minThreads: number;
    readonly maxThreads: number;
    readonly hashLimitMb: number;
    readonly customOptions: string[];
  };
}

export interface IEnginePlugin {
  readonly manifest: IEnginePluginManifestV2;
  
  // Lifecycle Methods
  install(): Promise<void>;
  verify(): Promise<boolean>;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  update(): Promise<void>;
  uninstall(): Promise<void>;
}
