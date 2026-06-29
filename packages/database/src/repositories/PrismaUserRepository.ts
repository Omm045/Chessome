import { User, AuthProvider } from '@chessome/core';
import { IUserRepository } from '@chessome/ports';
import { PrismaClient, AuthProvider as PrismaAuthProvider } from '@prisma/client';
import { UserMapper } from '../mappers/UserMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        statistics: true,
        sessions: true
      }
    });

    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findByAuthProvider(provider: AuthProvider, providerId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        idx_users_provider: {
          authProvider: provider as unknown as PrismaAuthProvider,
          authProviderId: providerId
        }
      },
      include: {
        preferences: true,
        statistics: true,
        sessions: true
      }
    });

    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    const prefs = user.preferences;
    const stats = user.statistics;

    await this.prisma.$transaction(async (tx) => {
      // Upsert User
      await tx.user.upsert({
        where: { id: data.id },
        update: data,
        create: data
      });

      // Upsert Preferences
      if (prefs) {
        await tx.userPreferences.upsert({
          where: { userId: user.id },
          update: prefs.toJSON(),
          create: {
            ...prefs.toJSON(),
            userId: user.id
          } as any
        });
      }

      // Upsert Statistics
      if (stats) {
        await tx.userStatistics.upsert({
          where: { userId: user.id },
          update: stats.toJSON(),
          create: {
            ...stats.toJSON(),
            userId: user.id
          } as any
        });
      }
      
      // Note: AnalysisSession saving would be handled by a dedicated AnalysisSessionRepository in a fully featured system,
      // but if we want to save them here, we can. For Phase 3.3, we'll keep it simple.
    });
  }
}
