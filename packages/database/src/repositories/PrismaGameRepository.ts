import { IGameRepository, Game as CoreGame, ITransaction } from '@chessome/core';
import { GameId, Result, ok, err, InfrastructureError, NotFoundError } from '@chessome/shared';

import { PrismaTransaction } from '../uow';
import { GameMapper } from '../mappers/GameMapper';
import { PrismaClient } from '@prisma/client';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export class PrismaGameRepository implements IGameRepository {
  constructor(private readonly client: PrismaClient) {}

  async findById(id: GameId, tx?: ITransaction): Promise<Result<CoreGame, Error>> {
    try {
      const client = tx ? (tx as PrismaTransaction).tx as TransactionClient : this.client;
      const row = await client.game.findUnique({ where: { id, deletedAt: null } });
      
      if (!row) {
        return err(new NotFoundError(`Game with id ${id} not found`));
      }
      
      return GameMapper.toDomain(row);
    } catch (e) {
      return err(new InfrastructureError('Failed to fetch game', e));
    }
  }

  async save(game: CoreGame, tx?: ITransaction): Promise<Result<void, Error>> {
    try {
      const client = tx ? (tx as PrismaTransaction).tx as TransactionClient : this.client;
      const data = GameMapper.toPersistence(game);
      
      await client.game.upsert({
        where: { id: data.id },
        update: data,
        create: data,
      });
      
      return ok(undefined);
    } catch (e) {
      return err(new InfrastructureError('Failed to save game', e));
    }
  }
}
