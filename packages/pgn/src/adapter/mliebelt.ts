import { parse } from '@mliebelt/pgn-parser';
import { GameNode, MoveNode, TagNode, CommentNode, NagNode, VariationNode, ResultNode } from '../ast';
import { PgnParseError } from '../diagnostic';

/**
 * Adapter that wraps the external @mliebelt/pgn-parser library.
 * Converts its proprietary AST into our strong Chessome AST.
 */
export class MliebeltPgnAdapter {
  /**
   * Parses a single PGN game string into our explicit AST.
   */
  static parseGame(pgnString: string): GameNode {
    try {
      // The mliebelt parser returns an array of games, even if there's only one.
      const parsedGames = parse(pgnString, { startRule: 'games' }) as any[];
      
      if (!parsedGames || parsedGames.length === 0) {
        throw new Error('No game found in PGN string');
      }

      // We only care about the first game (since the Splitter separated them)
      const rawGame = parsedGames[0];
      
      return this.mapGame(rawGame);
    } catch (e: any) {
      // Map SyntaxError to our PgnParseError
      const line = e.location?.start?.line || 1;
      const column = e.location?.start?.column || 1;
      
      throw new PgnParseError(e.message, [{
        line,
        column,
        severity: 'error',
        message: e.message,
        recoveryAttempted: false
      }]);
    }
  }

  private static mapGame(rawGame: any): GameNode {
    const tags: TagNode[] = [];
    if (rawGame.tags) {
      for (const [key, value] of Object.entries(rawGame.tags)) {
        if (key === 'messages') continue;
        
        let strValue = String(value);
        if (value && typeof value === 'object' && 'value' in value) {
            strValue = String((value as any).value);
        }
        
        tags.push({ type: 'Tag', key, value: strValue });
      }
    }

    const moves = this.mapMoves(rawGame.moves || []);
    
    let result: ResultNode | undefined = undefined;
    
    // Check if the last element in rawGame.moves is a result (mliebelt puts it there or in tags)
    const resultTag = tags.find(t => t.key === 'Result');
    if (resultTag && ['1-0', '0-1', '1/2-1/2', '*'].includes(resultTag.value)) {
      result = { type: 'Result', result: resultTag.value as any };
    }

    return {
      type: 'Game',
      tags,
      moves,
      result
    };
  }

  private static mapMoves(rawMoves: any[]): Array<MoveNode | CommentNode | NagNode | VariationNode> {
    const mapped: Array<MoveNode | CommentNode | NagNode | VariationNode> = [];
    
    for (const token of rawMoves) {
      if (token.notation) {
        // It's a move
        
        // Extract preceding comments if any
        const comments = token.commentMove ? [this.mapComment(token.commentMove)] : [];
        const postComments = token.commentAfter ? [this.mapComment(token.commentAfter)] : [];
        
        const allComments = [...comments, ...postComments];
        
        // Handle commentDiag (like [%clk 1:00:00])
        if (token.commentDiag) {
          const diagCommands: Record<string, string> = {};
          if (token.commentDiag.clk) diagCommands['clk'] = String(token.commentDiag.clk);
          if (token.commentDiag.eval !== undefined) diagCommands['eval'] = String(token.commentDiag.eval);
          // Combine back into a fake comment or keep in commands
          const text = Object.entries(diagCommands).map(([k, v]) => `[%${k} ${v}]`).join(' ');
          allComments.push({ type: 'Comment', text, commands: diagCommands });
        }
        const nags = (token.nag || []).map((code: string) => ({ type: 'Nag', code: parseInt(code.replace('$', ''), 10) } as NagNode));
        
        const variations = (token.variations || []).map((v: any[]) => ({
          type: 'Variation',
          nodes: this.mapMoves(v)
        } as VariationNode));

        mapped.push({
          type: 'Move',
          moveNumber: token.turn === 'w' ? token.moveNumber : undefined, // mliebelt provides moveNumber
          san: token.notation.notation,
          turn: token.turn,
          comments: allComments,
          nags,
          variations
        });
      }
    }
    
    return mapped;
  }

  private static mapComment(rawText: string): CommentNode {
    // Attempt to extract extensions like [%clk 1:00:00]
    const commands: Record<string, string> = {};
    // TODO: implement command extraction correctly without regex escaping issues
    
    return {
      type: 'Comment',
      text: rawText,
      commands
    };
  }
}
