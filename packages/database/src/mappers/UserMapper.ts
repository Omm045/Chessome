import { User as PrismaUser, UserPreferences as PrismaPreferences, UserStatistics as PrismaStats, AuthProvider as PrismaAuthProvider, AnalysisSession as PrismaAnalysisSession, UserRole as PrismaUserRole, UserStatus as PrismaUserStatus } from '@prisma/client';
import { User, UserPreferences, UserStatistics, AuthProvider, AnalysisSession, Theme, BoardTheme, EvalDisplay, AnalysisType, UserRole, UserStatus } from '@chessome/core';

type PrismaUserWithRelations = PrismaUser & {
  preferences?: PrismaPreferences | null;
  statistics?: PrismaStats | null;
  sessions?: PrismaAnalysisSession[];
};

export class UserMapper {
  static toDomain(prismaUser: PrismaUserWithRelations): User {
    const authProvider = this.mapAuthProvider(prismaUser.authProvider);
    
    const user = User.create({
      id: prismaUser.id,
      authProvider,
      authProviderId: prismaUser.authProviderId,
      email: prismaUser.email,
      emailVerified: prismaUser.emailVerified,
      username: prismaUser.username,
      displayName: prismaUser.displayName,
      avatarUrl: prismaUser.avatarUrl,
      role: prismaUser.role as UserRole,
      status: prismaUser.status as UserStatus,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    });

    if (prismaUser.preferences) {
      user.setPreferences(UserPreferences.create({
        id: prismaUser.preferences.id,
        preferencesVersion: prismaUser.preferences.preferencesVersion,
        theme: prismaUser.preferences.theme as Theme,
        boardTheme: prismaUser.preferences.boardTheme as BoardTheme,
        pieceTheme: prismaUser.preferences.pieceTheme,
        engineDepth: prismaUser.preferences.engineDepth,
        multiPv: prismaUser.preferences.multiPv,
        preferredEngine: prismaUser.preferences.preferredEngine,
        evalDisplay: prismaUser.preferences.evalDisplay as EvalDisplay,
        animationSpeed: prismaUser.preferences.animationSpeed,
        keyboardShortcuts: prismaUser.preferences.keyboardShortcuts
      }));
    }

    if (prismaUser.statistics) {
      user.setStatistics(UserStatistics.create({
        id: prismaUser.statistics.id,
        totalAnalyses: prismaUser.statistics.totalAnalyses,
        totalGames: prismaUser.statistics.totalGames,
        averageAccuracy: prismaUser.statistics.averageAccuracy,
        hoursAnalyzed: prismaUser.statistics.hoursAnalyzed,
        lastActive: prismaUser.statistics.lastActive
      }));
    }

    if (prismaUser.sessions) {
      prismaUser.sessions.forEach(session => {
        user.addSession(AnalysisSession.create({
          id: session.id,
          gameId: session.gameId,
          title: session.title,
          category: session.category,
          isShared: session.isShared,
          analysisType: session.analysisType as AnalysisType,
          engineVersion: session.engineVersion,
          engineDepth: session.engineDepth,
          status: session.status,
          accuracy: session.accuracy,
          lastOpened: session.lastOpened,
          lastViewedAt: session.lastViewedAt,
          viewCount: session.viewCount,
          isFavorite: session.isFavorite,
          tags: session.tags,
          notes: session.notes,
          collection: session.collection,
          isArchived: session.isArchived,
          isTrash: session.isTrash,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }));
      });
    }

    return user;
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      authProvider: user.authProvider as PrismaAuthProvider,
      authProviderId: user.authProviderId,
      email: user.email,
      emailVerified: user.emailVerified,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role as PrismaUserRole,
      status: user.status as PrismaUserStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private static mapAuthProvider(provider: PrismaAuthProvider): AuthProvider {
    switch(provider) {
      case 'SUPABASE': return AuthProvider.SUPABASE;
      case 'CHESSCOM': return AuthProvider.CHESSCOM;
      case 'LICHESS': return AuthProvider.LICHESS;
      default: return AuthProvider.SUPABASE;
    }
  }
}
