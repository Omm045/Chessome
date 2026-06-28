import { IEnginePlugin } from '../plugin/manifest';
import { IEngineRegistry } from '../registry';

/**
 * Advanced routing models for future hardware awareness.
 */
export interface EngineAffinity {
  readonly preferredEngineId?: string;
  readonly preferredThreads?: number;
  readonly preferredHashMb?: number;
  readonly preferredNumaNode?: number;
}

/**
 * Requirements required by the use case to match against plugin capabilities.
 */
export interface AllocationRequirements {
  readonly requiresNNUE?: boolean;
  readonly requiresMultiPV?: boolean;
  readonly requiresSyzygy?: boolean;
  readonly requiresVariants?: string[];
}

export interface IEngineAllocator {
  /**
   * Evaluates the registry to find the best matching engine for the requested capabilities.
   * @param registry The engine registry to query.
   * @param requirements The domain capabilities required.
   * @param affinity Hardware routing preferences.
   * @returns The resolved plugin, or undefined if no engine matches the requirements.
   */
  allocate(
    registry: IEngineRegistry,
    requirements: AllocationRequirements,
    affinity?: EngineAffinity
  ): Promise<IEnginePlugin | undefined>;
}
