import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { IObjectStorage, ObjectId, StorageVersion, StorageMetadata, ObjectMetadata } from '@chessome/ports';
import { Result, ok, err, InfrastructureError, NotFoundError } from '@chessome/shared';

export class LocalStorageAdapter implements IObjectStorage {
  constructor(private readonly basePath: string) {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }
  }

  private getFilePath(id: string, version: number): string {
    return path.join(this.basePath, `${id}.v${version}.bin`);
  }

  private getMetaPath(id: string, version: number): string {
    return path.join(this.basePath, `${id}.v${version}.meta.json`);
  }

  async getMetadata(id: ObjectId, version?: StorageVersion): Promise<Result<ObjectMetadata, Error>> {
    try {
      // If version is not provided, we could find the latest, but for simplicity we default to 1 for this adapter demonstration
      const v = version || 1;
      const metaPath = this.getMetaPath(id, v);
      
      try {
        await fsp.access(metaPath, fs.constants.R_OK);
      } catch {
        return err(new NotFoundError(`Object metadata for ${id} not found`));
      }

      const metaRaw = await fsp.readFile(metaPath, 'utf8');
      const metaParsed = JSON.parse(metaRaw);
      metaParsed.createdAt = new Date(metaParsed.createdAt);
      
      const metaResult = ObjectMetadata.create(metaParsed);
      if (!metaResult.isOk) return err(new InfrastructureError('Corrupted metadata in storage'));
      
      return ok(metaResult.value);
    } catch (e) {
      return err(new InfrastructureError('Failed to fetch metadata', e));
    }
  }

  async getStream(id: ObjectId, version?: StorageVersion): Promise<Result<{ metadata: ObjectMetadata; stream: AsyncIterable<Uint8Array> }, Error>> {
    try {
      const metaResult = await this.getMetadata(id, version);
      if (!metaResult.isOk) return err(metaResult.error);

      const v = version || 1;
      const filePath = this.getFilePath(id, v);
      
      try {
        await fsp.access(filePath, fs.constants.R_OK);
      } catch {
        return err(new NotFoundError(`Object data for ${id} not found`));
      }

      const stream = fs.createReadStream(filePath);
      return ok({ metadata: metaResult.value, stream });
    } catch (e) {
      return err(new InfrastructureError('Failed to retrieve stream', e));
    }
  }

  async putStream(stream: AsyncIterable<Uint8Array>, metadataParams: Omit<StorageMetadata, 'id' | 'version' | 'createdAt'>): Promise<Result<ObjectMetadata, Error>> {
    try {
      // Generate a new ID (could use crypto.randomUUID(), simulating here)
      const id = ('obj_' + Date.now().toString() + Math.random().toString(36).substring(7)) as ObjectId;
      const version = 1 as StorageVersion;
      
      const metaResult = ObjectMetadata.create({ id, ...metadataParams, version, createdAt: new Date() });
      if (!metaResult.isOk) return err(metaResult.error);
      
      const filePath = this.getFilePath(id, version);
      const metaPath = this.getMetaPath(id, version);
      
      const writeStream = fs.createWriteStream(filePath);
      for await (const chunk of stream) {
        if (!writeStream.write(chunk)) {
          await new Promise<void>(resolve => writeStream.once('drain', () => resolve()));
        }
      }
      writeStream.end();
      
      await fsp.writeFile(metaPath, JSON.stringify(metaResult.value.data));

      return ok(metaResult.value);
    } catch (e) {
      return err(new InfrastructureError('Failed to write stream', e));
    }
  }
}
