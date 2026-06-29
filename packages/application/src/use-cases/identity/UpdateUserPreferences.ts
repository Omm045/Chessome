import { IUserRepository } from '@chessome/ports';
import { User, Theme, BoardTheme, EvalDisplay } from '@chessome/core';

export interface UpdateUserPreferencesDTO {
  theme?: Theme;
  boardTheme?: BoardTheme;
  pieceTheme?: string;
  engineDepth?: number;
  multiPv?: number;
  preferredEngine?: string;
  evalDisplay?: EvalDisplay;
  animationSpeed?: string;
  keyboardShortcuts?: boolean;
}

export class UpdateUserPreferences {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, updates: UpdateUserPreferencesDTO): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const preferences = user.preferences;
    if (!preferences) {
      throw new Error('User preferences not found');
    }

    // Apply updates
    if (updates.theme !== undefined) preferences.updateTheme(updates.theme);
    if (updates.boardTheme !== undefined) preferences.updateBoardTheme(updates.boardTheme);
    if (updates.pieceTheme !== undefined) preferences.updatePieceTheme(updates.pieceTheme);
    if (updates.engineDepth !== undefined) preferences.updateEngineDepth(updates.engineDepth);
    if (updates.multiPv !== undefined) preferences.updateMultiPv(updates.multiPv);
    if (updates.preferredEngine !== undefined) preferences.updatePreferredEngine(updates.preferredEngine);
    if (updates.evalDisplay !== undefined) preferences.updateEvalDisplay(updates.evalDisplay);
    if (updates.animationSpeed !== undefined) preferences.updateAnimationSpeed(updates.animationSpeed);
    if (updates.keyboardShortcuts !== undefined) preferences.updateKeyboardShortcuts(updates.keyboardShortcuts);

    await this.userRepository.save(user);

    return user;
  }
}
