export interface BinaryMetadata {
  readonly version: string;
  readonly url: string;
  readonly sha256: string;
  readonly signature?: string;
  readonly os: NodeJS.Platform;
  readonly arch: NodeJS.Architecture;
}

export interface IBinaryProvider {
  /**
   * Resolves a binary path for the given plugin. Downloads and verifies it if necessary.
   * @param pluginId - The unique identifier of the plugin.
   * @param metadata - The metadata needed to acquire the binary.
   * @returns The absolute path to the verified executable.
   */
  resolveBinary(pluginId: string, metadata: BinaryMetadata): Promise<string>;
}
