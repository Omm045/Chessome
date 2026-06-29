import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { GetUserLibrary, UpdateSessionMetadata, RecordSessionView } from '@chessome/application';
import { PrismaLibraryQueryService, PrismaUserRepository } from '@chessome/database';
import { DatabaseModule } from '../database/database.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [DatabaseModule],
  controllers: [LibraryController],
  providers: [
    {
      provide: GetUserLibrary,
      useFactory: (prisma: PrismaClient) => {
        const queryService = new PrismaLibraryQueryService(prisma);
        return new GetUserLibrary(queryService);
      },
      inject: [PrismaClient],
    },
    {
      provide: UpdateSessionMetadata,
      useFactory: (prisma: PrismaClient) => {
        const userRepository = new PrismaUserRepository(prisma);
        return new UpdateSessionMetadata(userRepository);
      },
      inject: [PrismaClient],
    },
    {
      provide: RecordSessionView,
      useFactory: (prisma: PrismaClient) => {
        const userRepository = new PrismaUserRepository(prisma);
        return new RecordSessionView(userRepository);
      },
      inject: [PrismaClient],
    },
  ],
})
export class LibraryModule {}
