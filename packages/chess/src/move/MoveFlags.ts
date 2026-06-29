export enum MoveFlags {
  None = 0,
  Capture = 1 << 0,
  EnPassant = 1 << 1,
  Castling = 1 << 2,
  Promotion = 1 << 3
}
