import { Theme, BoardTheme, EvalDisplay } from '@chessome/core';

export class UpdatePreferencesDto {
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
