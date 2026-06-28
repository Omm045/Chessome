import { IEnginePlugin } from '../plugin/manifest';
import { EngineHealthInfo } from '../plugin/health';
import { IEngineCapabilityModel } from '../capabilities';

export interface IEngineRegistry {
  /**
   * Discovers plugins and performs version negotiation.
   * If a plugin does not meet the minimum runtime version, it is actively rejected.
   */
  discover(plugins: IEnginePlugin[]): Promise<void>;
  register(plugin: IEnginePlugin): void;
  unregister(pluginId: string): void;
  resolve(pluginId: string): IEnginePlugin | undefined;
  resolveByCapability(requirements: Partial<IEngineCapabilityModel>): IEnginePlugin[];
  
  getHealth(pluginId: string): EngineHealthInfo | undefined;
  listPlugins(): IEnginePlugin[];
}
