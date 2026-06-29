export * from './IChessBoard';
// We export MailboxBoard internally so the PositionBuilder can use it,
// but we will NOT export it from the public packages/chess/src/index.ts.
export * from './MailboxBoard';
