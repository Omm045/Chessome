import { PrismaClient } from '@prisma/client';
import { IUnitOfWork, ITransaction } from '@chessome/core';
import { prisma } from '../client';

export type PrismaTransaction = ITransaction & { tx: unknown };

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly client: PrismaClient = prisma) {}

  async execute<T>(work: (tx: ITransaction) => Promise<T>): Promise<T> {
    return this.client.$transaction(async (prismaTx) => {
      const transactionWrapper = { tx: prismaTx } as unknown as PrismaTransaction;
      return work(transactionWrapper);
    });
  }
}
