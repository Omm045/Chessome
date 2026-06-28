import { IEngineCapabilityModel } from '../capabilities';

export interface IEngineRegistry {
  register(id: string, capabilities: IEngineCapabilityModel): void;
  getCapabilities(id: string): IEngineCapabilityModel | undefined;
  listEngines(): IEngineCapabilityModel[];
}
