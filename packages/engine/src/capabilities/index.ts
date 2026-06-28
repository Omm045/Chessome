export interface IEngineCapabilityModel {
  readonly name: string;
  readonly version: string;
  readonly supportsNNUE: boolean;
  readonly supportsSyzygy: boolean;
  readonly supportsMultiPV: boolean;
  readonly supportsChess960: boolean;
  readonly supportsVariants: string[];
  readonly supportsGPU: boolean;
  readonly minThreads: number;
  readonly maxThreads: number;
  readonly hashLimitMb: number;
  readonly license: string;
}
