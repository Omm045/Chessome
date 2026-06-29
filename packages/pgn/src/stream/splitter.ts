export class PgnGameSplitter {
  /**
   * Consumes an AsyncIterable of raw PGN text chunks and yields individual PGN game strings.
   * This allows us to process 10GB PGN files without blowing up memory.
   */
  static async *split(stream: AsyncIterable<string | Buffer>): AsyncIterableIterator<string> {
    let buffer = '';

    for await (const chunk of stream) {
      buffer += chunk.toString();

      // PGN games usually start with [Event "..."].
      // Or they are separated by double newlines.
      // A robust approach: look for the start of a new tag block after the game moves.
      
      let splitIndex;
      while ((splitIndex = this.findNextGameBoundary(buffer)) !== -1) {
        const gameStr = buffer.slice(0, splitIndex).trim();
        if (gameStr) {
          yield gameStr;
        }
        buffer = buffer.slice(splitIndex);
      }
    }

    // Yield any remaining text as the last game
    const finalGame = buffer.trim();
    if (finalGame) {
      yield finalGame;
    }
  }

  /**
   * Finds the index of the next PGN game in the buffer.
   * Returns -1 if no complete boundary is found yet.
   */
  private static findNextGameBoundary(buffer: string): number {
    // A new game typically starts with `[Event ` (or any tag really) 
    // preceded by a blank line and followed by moves.
    // Since we just need to isolate game text for the parser, splitting on `\n\n[` or `\n[` is common.
    // For safety, let's search for `[Event ` that is not at the start of the string.
    

    
    // There are edge cases where [Event is inside a comment, but it's very rare at the start of a line.
    // A robust heuristic: `\n[Event `
    const robustIndex = buffer.indexOf('\n[Event ', 1);
    
    if (robustIndex !== -1) {
      // +1 to skip the newline and keep it in the next chunk
      return robustIndex + 1; 
    }
    
    return -1;
  }
}
