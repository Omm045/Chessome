import { AuthProvider, UserRole, UserStatus } from './types';
import { UserPreferences } from './UserPreferences';
import { UserStatistics } from './UserStatistics';
import { AnalysisSession } from './AnalysisSession';

export interface UserProps {
  id: string;
  authProvider: AuthProvider;
  authProviderId: string;
  email: string | null;
  emailVerified: boolean;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private _preferences: UserPreferences | null = null;
  private _statistics: UserStatistics | null = null;
  private _sessions: AnalysisSession[] = [];

  private constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string { return this.props.id; }
  get authProvider(): AuthProvider { return this.props.authProvider; }
  get authProviderId(): string { return this.props.authProviderId; }
  get email(): string | null { return this.props.email; }
  get emailVerified(): boolean { return this.props.emailVerified; }
  get username(): string | null { return this.props.username; }
  get displayName(): string | null { return this.props.displayName; }
  get avatarUrl(): string | null { return this.props.avatarUrl; }
  get role(): UserRole { return this.props.role; }
  get status(): UserStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  get preferences(): UserPreferences | null { return this._preferences; }
  get statistics(): UserStatistics | null { return this._statistics; }
  get sessions(): ReadonlyArray<AnalysisSession> { return this._sessions; }

  setPreferences(prefs: UserPreferences): void {
    this._preferences = prefs;
  }

  setStatistics(stats: UserStatistics): void {
    this._statistics = stats;
  }

  addSession(session: AnalysisSession): void {
    this._sessions.push(session);
  }

  verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.updatedAt = new Date();
  }

  updateRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  updateStatus(status: UserStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  updateProfile(updates: { displayName?: string, avatarUrl?: string, username?: string }): void {
    if (updates.displayName !== undefined) this.props.displayName = updates.displayName;
    if (updates.avatarUrl !== undefined) this.props.avatarUrl = updates.avatarUrl;
    if (updates.username !== undefined) this.props.username = updates.username;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      ...this.props,
      preferences: this._preferences?.toJSON() || null,
      statistics: this._statistics?.toJSON() || null,
      sessions: this._sessions.map(s => s.toJSON())
    };
  }
}
