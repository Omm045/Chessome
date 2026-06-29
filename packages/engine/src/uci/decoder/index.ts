import { EngineResponse, InfoMetrics } from '../responses';

export class UciDecoder {
  static decode(line: string): EngineResponse {
    const tokens = line.trim().split(/\s+/);
    if (tokens.length === 0 || tokens[0] === '') return { type: 'UNKNOWN', raw: line };

    const command = tokens[0];

    switch (command) {
      case 'id':
        return UciDecoder.parseId(tokens);
      case 'uciok':
        return { type: 'UCIOK' };
      case 'readyok':
        return { type: 'READYOK' };
      case 'bestmove':
        return UciDecoder.parseBestMove(tokens);
      case 'option':
        return UciDecoder.parseOption(tokens, line);
      case 'info':
        return UciDecoder.parseInfo(tokens);
      default:
        return { type: 'UNKNOWN', raw: line };
    }
  }

  private static parseId(tokens: string[]): EngineResponse {
    if (tokens.length >= 3 && (tokens[1] === 'name' || tokens[1] === 'author')) {
      return { type: 'ID', idType: tokens[1], value: tokens.slice(2).join(' ') };
    }
    return { type: 'UNKNOWN', raw: tokens.join(' ') };
  }

  private static parseBestMove(tokens: string[]): EngineResponse {
    if (tokens.length >= 2) {
      const bestMove = tokens[1];
      let ponder: string | undefined = undefined;
      if (tokens.length >= 4 && tokens[2] === 'ponder') {
        ponder = tokens[3];
      }
      return { type: 'BESTMOVE', bestMove, ponder };
    }
    return { type: 'UNKNOWN', raw: tokens.join(' ') };
  }

  private static parseOption(tokens: string[], raw: string): EngineResponse {
    // Basic option parsing. For production this would need a more robust parser 
    // to handle spaces in names, default strings, etc.
    // Example: option name Hash type spin default 16 min 1 max 33554432
    try {
      const nameMatch = raw.match(/name\s+(.+?)\s+type/);
      const typeMatch = raw.match(/type\s+(\w+)/);
      if (!nameMatch || !typeMatch) return { type: 'UNKNOWN', raw };

      const name = nameMatch[1];
      const optionType = typeMatch[1] as 'check' | 'spin' | 'combo' | 'button' | 'string';
      
      const option: Record<string, unknown> = { type: 'OPTION', name, optionType };

      const defaultMatch = raw.match(/default\s+([^\s]+)/);
      if (defaultMatch) option.default = defaultMatch[1];

      const minMatch = raw.match(/min\s+(-?\d+)/);
      if (minMatch) option.min = parseInt(minMatch[1], 10);

      const maxMatch = raw.match(/max\s+(-?\d+)/);
      if (maxMatch) option.max = parseInt(maxMatch[1], 10);

      // Extract vars if type is combo
      if (optionType === 'combo') {
        const vars = [...raw.matchAll(/var\s+([^\s]+)/g)].map(m => m[1]);
        if (vars.length > 0) option.vars = vars;
      }

      return option as unknown as EngineResponse;
    } catch {
      return { type: 'UNKNOWN', raw };
    }
  }

  private static parseInfo(tokens: string[]): EngineResponse {
    if (tokens.length < 2 || tokens[1] === 'string') {
      if (tokens[1] === 'string') return { type: 'INFO', metrics: { string: tokens.slice(2).join(' ') } };
      return { type: 'UNKNOWN', raw: tokens.join(' ') };
    }

    const metrics: InfoMetrics = {};
    let i = 1;

    while (i < tokens.length) {
      const key = tokens[i];
      i++;

      switch (key) {
        case 'depth':
        case 'seldepth':
        case 'time':
        case 'nodes':
        case 'multipv':
        case 'nps':
        case 'hashfull':
        case 'tbhits':
          if (i < tokens.length) {
            metrics[key] = parseInt(tokens[i], 10);
            i++;
          }
          break;
        case 'score':
          if (i + 1 < tokens.length) {
            const type = tokens[i];
            const value = parseInt(tokens[i + 1], 10);
            if (type === 'cp' || type === 'mate') {
              metrics.score = { type, value };
            }
            i += 2;
          }
          break;
        case 'pv':
          metrics.pv = tokens.slice(i);
          i = tokens.length; // PV consumes the rest of the line
          break;
        default:
          // Skip unknown tokens
          break;
      }
    }

    return { type: 'INFO', metrics };
  }
}
