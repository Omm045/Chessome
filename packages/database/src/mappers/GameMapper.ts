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

    return CoreGame.create(
      prismaGame.id as GameId,
      {
        white: prismaGame.white,
        black: prismaGame.black,
        date: prismaGame.date.toISOString(),
        result: domainResultStr,
      },
      fenStr
    );
  }

  static toPersistence(coreGame: CoreGame): Omit<PrismaGame, 'createdAt' | 'deletedAt'> {
    let prismaResult: PrismaGameResult = PrismaGameResult.ONGOING;
    if (coreGame.metadata.result === '1-0') prismaResult = PrismaGameResult.WHITE_WIN;
    if (coreGame.metadata.result === '0-1') prismaResult = PrismaGameResult.BLACK_WIN;
    if (coreGame.metadata.result === '1/2-1/2') prismaResult = PrismaGameResult.DRAW;

    return {
      id: coreGame.id,
      white: coreGame.metadata.white || 'Unknown',
      black: coreGame.metadata.black || 'Unknown',
      date: coreGame.metadata.date ? new Date(coreGame.metadata.date) : new Date(),
      result: prismaResult,
      initialFen: coreGame.currentFen,
      pgnText: '', // This would typically be passed in or constructed from move history
      moveCount: coreGame.moveCount,
    };
  }
}
