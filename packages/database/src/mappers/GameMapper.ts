import { Game as PrismaGame, GameResult as PrismaGameResult } from '@prisma/client';
import { Game as CoreGame } from '@chessome/core';
import { GameId, Result } from '@chessome/shared';

export class GameMapper {
  static toDomain(prismaGame: PrismaGame): Result<CoreGame, Error> {
    const fenStr = prismaGame.initialFen;

    let domainResultStr = '*';
    if (prismaGame.result === PrismaGameResult.WHITE_WIN) domainResultStr = '1-0';
    if (prismaGame.result === PrismaGameResult.BLACK_WIN) domainResultStr = '0-1';
    if (prismaGame.result === PrismaGameResult.DRAW) domainResultStr = '1/2-1/2';

    const gameResult = CoreGame.create(
      prismaGame.id as GameId,
      {
        white: prismaGame.white,
        black: prismaGame.black,
        date: prismaGame.date.toISOString(),
        result: domainResultStr,
        eco: prismaGame.eco || undefined,
        opening: prismaGame.opening || undefined,
      },
      fenStr
    );

    if (gameResult.isOk && prismaGame.userId) {
      gameResult.value.attachToUser(prismaGame.userId);
    }

    return gameResult;
  }

  static toPersistence(coreGame: CoreGame): Omit<PrismaGame, 'createdAt' | 'deletedAt'> {
    let prismaResult: PrismaGameResult = PrismaGameResult.ONGOING;
    if (coreGame.metadata.result === '1-0') prismaResult = PrismaGameResult.WHITE_WIN;
    if (coreGame.metadata.result === '0-1') prismaResult = PrismaGameResult.BLACK_WIN;
    if (coreGame.metadata.result === '1/2-1/2') prismaResult = PrismaGameResult.DRAW;

    return {
      id: coreGame.id,
      userId: coreGame.userId,
      white: coreGame.metadata.white || 'Unknown',
      black: coreGame.metadata.black || 'Unknown',
      date: coreGame.metadata.date ? new Date(coreGame.metadata.date) : new Date(),
      result: prismaResult,
      initialFen: coreGame.currentFen,
      pgnText: '', // This should ideally be stored in CoreGame, but for now empty
      moveCount: coreGame.moveCount,
      eco: coreGame.metadata.eco || null,
      opening: coreGame.metadata.opening || null,
    };
  }
}
