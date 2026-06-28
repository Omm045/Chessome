import { PrismaClient } from '@prisma/client';
import { IUnitOfWork, ITransaction } from '@chessome/core';
import { prisma } from '../index';

export type PrismaTransaction = ITransaction & { tx: unknown };

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly client: PrismaClient = prisma) {}

  async startTransaction(): Promise<ITransaction> {
    throw new Error('Manual transaction management is not directly supported by Prisma without Interactive Transactions API. Use execute() instead.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async commit(_tx: ITransaction): Promise<void> {
    // Handled by Prisma internally inside execute()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rollback(_tx: ITransaction): Promise<void> {
    // Handled by Prisma internally inside execute()
  }

  async execute<T>(work: (tx: ITransaction) => Promise<T>): Promise<T> {
    return this.client.$transaction(async (prismaTx) => {
      const transactionWrapper = { tx: prismaTx } as unknown as PrismaTransaction;
      return work(transactionWrapper);
    });
  }
}
