import { IObjectStorage, ObjectId, StorageVersion } from '@chessome/ports';
// Using standard assertion libraries or test runners here eventually

export class StorageContract {
  constructor(private readonly storage: IObjectStorage) {}

  async testWriteAndRead(): Promise<boolean> {
    // 1. Create a dummy AsyncIterable<Uint8Array>
    const chunks = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])];
    async function* dummyStream() {
      for (const chunk of chunks) yield chunk;
    }

    // 2. Put stream
    const putResult = await this.storage.putStream(dummyStream(), {
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // dummy valid sha256 length
      size: 6,
      contentType: 'application/octet-stream',
      owner: 'sys'
    });

    if (!putResult.isOk) throw new Error('Failed to put stream: ' + putResult.error.message);

    const storedMeta = putResult.value.data;
    
    // 3. Get Metadata
    const getMetaResult = await this.storage.getMetadata(storedMeta.id as ObjectId, storedMeta.version as StorageVersion);
    if (!getMetaResult.isOk) throw new Error('Failed to get metadata');
    
    if (getMetaResult.value.data.size !== 6) throw new Error('Metadata corruption');

    // 4. Get Stream
    const getStreamResult = await this.storage.getStream(storedMeta.id as ObjectId, storedMeta.version as StorageVersion);
    if (!getStreamResult.isOk) throw new Error('Failed to get stream');

    const resultChunks: Uint8Array[] = [];
    for await (const chunk of getStreamResult.value.stream) {
      resultChunks.push(chunk);
    }
    
    if (resultChunks.length === 0) throw new Error('Stream read failed or empty');

    return true;
  }
}
