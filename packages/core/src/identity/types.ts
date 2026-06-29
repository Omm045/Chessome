export enum AuthProvider {
  SUPABASE = 'SUPABASE',
  CHESSCOM = 'CHESSCOM',
  LICHESS = 'LICHESS'
}

export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  SYSTEM = 'SYSTEM'
}

export enum BoardTheme {
  DEFAULT = 'DEFAULT',
  GREEN = 'GREEN',
  WOOD = 'WOOD'
}

export enum EvalDisplay {
  GRAPH = 'GRAPH',
  BAR = 'BAR',
  NONE = 'NONE'
}

export enum AnalysisType {
  GAME = 'GAME',
  POSITION = 'POSITION',
  PUZZLE = 'PUZZLE',
  STUDY = 'STUDY'
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}
