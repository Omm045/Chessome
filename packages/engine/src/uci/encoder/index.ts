import { EngineCommand, GoParams } from '../commands';

export class UciEncoder {
  static encode(command: EngineCommand): string {
    switch (command.type) {
      case 'UCI':
        return 'uci';
      case 'IS_READY':
        return 'isready';
      case 'UCINEWGAME':
        return 'ucinewgame';
      case 'POSITION':
        return UciEncoder.encodePosition(command.fen, command.moves);
      case 'SET_OPTION':
        return `setoption name ${command.name} value ${command.value}`;
      case 'GO':
        return UciEncoder.encodeGo(command.searchParams);
      case 'STOP':
        return 'stop';
      case 'QUIT':
        return 'quit';
      default:
        throw new Error(`Unsupported command type: ${(command as Record<string, unknown>).type}`);
    }
  }

  private static encodePosition(fen: string, moves?: string[]): string {
    let result = fen === 'startpos' ? 'position startpos' : `position fen ${fen}`;
    if (moves && moves.length > 0) {
      result += ` moves ${moves.join(' ')}`;
    }
    return result;
  }

  private static encodeGo(params: GoParams): string {
    if (params.infinite) return 'go infinite';

    const parts = ['go'];
    if (params.depth !== undefined) parts.push(`depth ${params.depth}`);
    if (params.nodes !== undefined) parts.push(`nodes ${params.nodes}`);
    if (params.movetime !== undefined) parts.push(`movetime ${params.movetime}`);
    if (params.wtime !== undefined) parts.push(`wtime ${params.wtime}`);
    if (params.btime !== undefined) parts.push(`btime ${params.btime}`);
    if (params.winc !== undefined) parts.push(`winc ${params.winc}`);
    if (params.binc !== undefined) parts.push(`binc ${params.binc}`);
    if (params.movestogo !== undefined) parts.push(`movestogo ${params.movestogo}`);

    return parts.join(' ');
  }
}
