import { User, AuthProvider } from '@chessome/core';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByAuthProvider(provider: AuthProvider, providerId: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
