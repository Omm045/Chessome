import { Result, ok, err, ValidationError, Brand } from '@chessome/shared';

export type ObjectId = Brand<string, 'ObjectId'>;
export type StorageVersion = Brand<number, 'StorageVersion'>;

export interface StorageMetadata {
  readonly id: ObjectId;
  readonly sha256: string;
  readonly size: number;
  readonly contentType: string;
  readonly version: StorageVersion;
  readonly owner: string; // e.g., System or UserId
  readonly createdAt: Date;
}

export class ObjectMetadata {
  private constructor(public readonly data: StorageMetadata) {}

  public static create(data: Omit<StorageMetadata, 'version' | 'createdAt'> & { version?: number, createdAt?: Date }): Result<ObjectMetadata, ValidationError> {
    if (data.size <= 0) return err(new ValidationError('Object size must be greater than 0'));
    if (!data.sha256 || data.sha256.length !== 64) return err(new ValidationError('Invalid SHA-256 hash'));
    if (!data.contentType) return err(new ValidationError('Content type is required'));

    return ok(new ObjectMetadata({
      ...data,
      version: (data.version || 1) as StorageVersion,
      createdAt: data.createdAt || new Date()
    }));
  }
}

export interface IObjectStorage {
  /** Retrieves the binary stream and its metadata. */
  getStream(id: ObjectId, version?: StorageVersion): Promise<Result<{ metadata: ObjectMetadata; stream: AsyncIterable<Uint8Array> }, Error>>;
  
  /** Stores a binary stream, returning the fully populated metadata. Immutably versions on conflict. */
  putStream(stream: AsyncIterable<Uint8Array>, metadataParams: Omit<StorageMetadata, 'id' | 'version' | 'createdAt'>): Promise<Result<ObjectMetadata, Error>>;
  
  /** Fetches just the metadata without the payload. */
  getMetadata(id: ObjectId, version?: StorageVersion): Promise<Result<ObjectMetadata, Error>>;
}
