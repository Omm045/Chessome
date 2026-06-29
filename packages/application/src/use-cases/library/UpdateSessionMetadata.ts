import { IUserRepository } from '@chessome/ports';
import { Result, ok, err } from '@chessome/shared';

export interface UpdateSessionMetadataCommand {
  userId: string;
  sessionId: string;
  isFavorite?: boolean;
  tags?: string[];
  notes?: string | null;
  collection?: string | null;
  isArchived?: boolean;
  isTrash?: boolean;
  title?: string;
}

export class UpdateSessionMetadata {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: UpdateSessionMetadataCommand): Promise<Result<void, Error>> {
    try {
      const user = await this.userRepository.findById(command.userId);
      if (!user) {
        return err(new Error('User not found'));
      }

      const session = user.sessions.find(s => s.id === command.sessionId);
      if (!session) {
        return err(new Error('Session not found'));
      }

      if (command.isFavorite !== undefined) {
        if (command.isFavorite !== session.isFavorite) {
          session.toggleFavorite();
        }
      }
      
      if (command.tags !== undefined) {
        session.updateTags(command.tags);
      }
      
      if (command.notes !== undefined) {
        session.updateNotes(command.notes);
      }
      
      if (command.collection !== undefined) {
        session.setCollection(command.collection);
      }
      
      if (command.isArchived !== undefined) {
        if (command.isArchived !== session.isArchived) {
          session.toggleArchive();
        }
      }
      
      if (command.isTrash !== undefined) {
        if (command.isTrash && !session.isTrash) {
          session.moveToTrash();
        } else if (!command.isTrash && session.isTrash) {
          session.restoreFromTrash();
        }
      }

      if (command.title !== undefined) {
        session.updateTitle(command.title);
      }

      await this.userRepository.save(user);

      return ok(undefined);
    } catch (error) {
      return err(error instanceof Error ? error : new Error('Failed to update session metadata'));
    }
  }
}
