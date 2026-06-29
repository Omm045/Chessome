import { PrismaClient, Prisma } from '@prisma/client';
import { ILibraryQueryService, LibraryQueryParams, PaginatedLibraryResult, LibrarySessionView } from '@chessome/ports';

export class PrismaLibraryQueryService implements ILibraryQueryService {
  constructor(private readonly prisma: PrismaClient) {}

  async querySessions(params: LibraryQueryParams): Promise<PaginatedLibraryResult> {
    const { userId, folder, collectionId, searchQuery, page = 1, limit = 20 } = params;

    const where: Prisma.AnalysisSessionWhereInput = {
      userId,
      isTrash: false,
      isArchived: false,
    };

    if (folder === 'trash') {
      where.isTrash = true;
      where.isArchived = undefined;
    } else if (folder === 'archived') {
      where.isArchived = true;
    } else if (folder === 'favorites') {
      where.isFavorite = true;
    }

    if (collectionId) {
      where.collection = collectionId;
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { tags: { has: searchQuery } },
        { notes: { contains: searchQuery, mode: 'insensitive' } },
        { game: { white: { contains: searchQuery, mode: 'insensitive' } } },
        { game: { black: { contains: searchQuery, mode: 'insensitive' } } },
        { game: { opening: { contains: searchQuery, mode: 'insensitive' } } },
      ];
    }

    const [total, sessions] = await Promise.all([
      this.prisma.analysisSession.count({ where }),
      this.prisma.analysisSession.findMany({
        where,
        include: {
          game: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const data: LibrarySessionView[] = sessions.map((s) => ({
      id: s.id,
      gameId: s.gameId,
      title: s.title,
      category: s.category,
      isShared: s.isShared,
      analysisType: s.analysisType,
      engineVersion: s.engineVersion,
      engineDepth: s.engineDepth,
      status: s.status,
      accuracy: s.accuracy,
      lastOpened: s.lastOpened,
      lastViewedAt: s.lastViewedAt,
      viewCount: s.viewCount,
      isFavorite: s.isFavorite,
      tags: s.tags,
      notes: s.notes,
      collection: s.collection,
      isArchived: s.isArchived,
      isTrash: s.isTrash,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      // Joined Game
      white: s.game.white,
      black: s.game.black,
      result: s.game.result,
      date: s.game.date,
      eco: s.game.eco,
      opening: s.game.opening,
      moveCount: s.game.moveCount,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
