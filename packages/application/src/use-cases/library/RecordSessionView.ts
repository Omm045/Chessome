import { IUserRepository } from '@chessome/ports';

export class RecordSessionView {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, sessionId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const session = user.sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.recordView();
    await this.userRepository.save(user);
  }
}
