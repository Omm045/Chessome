import { BinaryMetadata } from './provider';

export interface IBinaryVerifier {
  /**
   * Verifies that the downloaded file perfectly matches the expected SHA-256 hash.
   */
  verifyHash(filePath: string, expectedSha256: string): Promise<boolean>;

  /**
   * Ensures the binary has execution permissions for the current operating system.
   */
  verifyExecutable(filePath: string): Promise<boolean>;

  /**
   * Performs an end-to-end verification of the binary.
   */
  verifyBinary(filePath: string, metadata: BinaryMetadata): Promise<boolean>;
}
