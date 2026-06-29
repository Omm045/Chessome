import { User, AuthProvider, UserPreferences, UserStatistics, UserRole, UserStatus } from '@chessome/core';
import { IUserRepository, AuthenticatedIdentity } from '@chessome/ports';
import { v4 as uuidv4 } from 'uuid';

export interface SyncUserIdentityRequest {
  identity: AuthenticatedIdentity;
  provider: AuthProvider;
}

export class SyncUserIdentity {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: SyncUserIdentityRequest): Promise<User> {
    const { identity, provider } = request;

    // Check if user already exists
    let user = await this.userRepository.findByAuthProvider(provider, identity.providerId);

    if (user) {
      // Update profile if things changed
      user.updateProfile({
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
        username: identity.username
      });
      await this.userRepository.save(user);
      return user;
    }

    // Create new user
    const userId = uuidv4();
    user = User.create({
      id: userId,
      authProvider: provider,
      authProviderId: identity.providerId,
      email: identity.email || null,
      emailVerified: false,
      username: identity.username || null,
      displayName: identity.displayName || null,
      avatarUrl: identity.avatarUrl || null,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Initialize defaults
    user.setPreferences(UserPreferences.createDefault(uuidv4()));
    user.setStatistics(UserStatistics.createDefault(uuidv4()));

    await this.userRepository.save(user);

    // Note: Merging anonymous analyses would be triggered as a separate domain event
    // or called explicitly after this use case returns.
    
    return user;
  }
}
