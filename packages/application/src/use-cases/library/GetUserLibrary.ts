import { ILibraryQueryService, LibraryQueryParams, PaginatedLibraryResult } from '@chessome/ports';
import { Result, ok, err } from '@chessome/shared';

export class GetUserLibrary {
  constructor(private readonly libraryQueryService: ILibraryQueryService) {}

  async execute(params: LibraryQueryParams): Promise<Result<PaginatedLibraryResult, Error>> {
    try {
      const result = await this.libraryQueryService.querySessions(params);
      return ok(result);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to fetch user library'));
    }
  }
}
