import { IEngineCapabilityModel } from '../capabilities';

export interface EnginePluginManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly uciVersion: string;
  readonly license: string;
  readonly author: string;
  readonly minRuntimeVersion: string;
  readonly supportedPlatforms: string[];
  readonly capabilities: IEngineCapabilityModel;
}

export interface IEnginePlugin {
  readonly manifest: EnginePluginManifest;
  
  initialize(): Promise<void>;
  dispose(): Promise<void>;
  
  // Future methods like getProcess() or createSession() could go here
  // based on the runtime contract.
}
