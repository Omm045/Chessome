import { Theme, BoardTheme, EvalDisplay } from './types';

export interface UserPreferencesProps {
  id: string;
  preferencesVersion: number;
  theme: Theme;
  boardTheme: BoardTheme;
  pieceTheme: string;
  engineDepth: number;
  multiPv: number;
  preferredEngine: string;
  evalDisplay: EvalDisplay;
  animationSpeed: string;
  keyboardShortcuts: boolean;
}

export class UserPreferences {
  private constructor(private props: UserPreferencesProps) {}

  static create(props: UserPreferencesProps): UserPreferences {
    return new UserPreferences(props);
  }

  static createDefault(id: string): UserPreferences {
    return new UserPreferences({
      id,
      preferencesVersion: 1,
      theme: Theme.DARK,
      boardTheme: BoardTheme.DEFAULT,
      pieceTheme: 'default',
      engineDepth: 18,
      multiPv: 1,
      preferredEngine: 'stockfish',
      evalDisplay: EvalDisplay.GRAPH,
      animationSpeed: 'normal',
      keyboardShortcuts: true
    });
  }

  get id(): string { return this.props.id; }
  get preferencesVersion(): number { return this.props.preferencesVersion; }
  get theme(): Theme { return this.props.theme; }
  get boardTheme(): BoardTheme { return this.props.boardTheme; }
  get pieceTheme(): string { return this.props.pieceTheme; }
  get engineDepth(): number { return this.props.engineDepth; }
  get multiPv(): number { return this.props.multiPv; }
  get preferredEngine(): string { return this.props.preferredEngine; }
  get evalDisplay(): EvalDisplay { return this.props.evalDisplay; }
  get animationSpeed(): string { return this.props.animationSpeed; }
  get keyboardShortcuts(): boolean { return this.props.keyboardShortcuts; }

  updateTheme(theme: Theme): void { 
    this.props.theme = theme; 
    this.props.preferencesVersion += 1;
  }
  updateBoardTheme(boardTheme: BoardTheme): void {
    this.props.boardTheme = boardTheme;
    this.props.preferencesVersion += 1;
  }
  updatePieceTheme(pieceTheme: string): void {
    this.props.pieceTheme = pieceTheme;
    this.props.preferencesVersion += 1;
  }
  updateEngineDepth(depth: number): void { 
    this.props.engineDepth = Math.max(1, depth); 
    this.props.preferencesVersion += 1;
  }
  updateMultiPv(multiPv: number): void {
    this.props.multiPv = Math.max(1, multiPv);
    this.props.preferencesVersion += 1;
  }
  updatePreferredEngine(engine: string): void {
    this.props.preferredEngine = engine;
    this.props.preferencesVersion += 1;
  }
  updateEvalDisplay(evalDisplay: EvalDisplay): void {
    this.props.evalDisplay = evalDisplay;
    this.props.preferencesVersion += 1;
  }
  updateAnimationSpeed(speed: string): void {
    this.props.animationSpeed = speed;
    this.props.preferencesVersion += 1;
  }
  updateKeyboardShortcuts(enabled: boolean): void {
    this.props.keyboardShortcuts = enabled;
    this.props.preferencesVersion += 1;
  }
  
  toJSON() {
    return { ...this.props };
  }
}
