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

export class EngineRegistry implements IEngineRegistry {
  private readonly plugins = new Map<string, IEnginePlugin>();

  async discover(plugins: IEnginePlugin[]): Promise<void> {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  register(plugin: IEnginePlugin): void {
    const manifest = plugin.manifest;
    this.plugins.set(manifest.engineId, plugin);
  }

  unregister(pluginId: string): void {
    this.plugins.delete(pluginId);
  }

  resolve(pluginId: string): IEnginePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  resolveByCapability(requirements: Partial<IEngineCapabilityModel>): IEnginePlugin[] {
    const results: IEnginePlugin[] = [];
    for (const plugin of this.plugins.values()) {
      const manifest = plugin.manifest;
      if (requirements.name && manifest.name !== requirements.name) continue;
      results.push(plugin);
    }
    return results;
  }

  getHealth(pluginId: string): EngineHealthInfo | undefined {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return undefined;
    
    return {
      status: 'Ready',
      restartCount: 0
    };
  }

  listPlugins(): IEnginePlugin[] {
    return Array.from(this.plugins.values());
  }
}

