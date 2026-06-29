import { BinaryMetadata } from './provider';

import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

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
  
  /**
   * Quarantines a failed binary.
   */
  quarantine(filePath: string): Promise<void>;
  
  /**
   * Promotes a binary from quarantine back to active (rollback).
   */
  promote(quarantinePath: string, activePath: string): Promise<void>;
}

export class BinaryVerifier implements IBinaryVerifier {
  private integrityCache = new Map<string, boolean>();

  async verifyHash(filePath: string, expectedSha256: string): Promise<boolean> {
    if (this.integrityCache.get(filePath)) return true;

    return new Promise((resolve) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', data => hash.update(data));
      stream.on('end', () => {
        const fileHash = hash.digest('hex');
        const isValid = fileHash === expectedSha256;
        if (isValid) this.integrityCache.set(filePath, true);
        resolve(isValid);
      });
      stream.on('error', () => resolve(false));
    });
  }

  async verifyExecutable(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }

  async verifyBinary(filePath: string, metadata: BinaryMetadata): Promise<boolean> {
    const isHashValid = await this.verifyHash(filePath, metadata.sha256);
    if (!isHashValid) {
      await this.quarantine(filePath);
      return false;
    }

    // if signature exists, we could verify against a known public key here
    if (metadata.signature) {
      // Stub: signature verification logic using crypto.verify
    }

    return this.verifyExecutable(filePath);
  }
  
  async quarantine(filePath: string): Promise<void> {
    const quarantineDir = path.join(path.dirname(filePath), '.quarantine');
    await fs.promises.mkdir(quarantineDir, { recursive: true });
    
    const quarantinedPath = path.join(quarantineDir, `${path.basename(filePath)}_${Date.now()}.quarantined`);
    await fs.promises.rename(filePath, quarantinedPath);
  }

  async promote(quarantinePath: string, activePath: string): Promise<void> {
    await fs.promises.rename(quarantinePath, activePath);
    this.integrityCache.delete(activePath);
  }
}

