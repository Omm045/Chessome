import { Result, ok, Brand } from '@chessome/shared';

export type PuzzleId = Brand<string, 'PuzzleId'>;

export class Puzzle {
  private constructor(
    public readonly id: PuzzleId,
    public readonly initialFen: string,
    public readonly solution: string[],
    public readonly rating: number
  ) {}

  public static create(id: PuzzleId, initialFen: string, solution: string[], rating: number): Result<Puzzle, Error> {
    return ok(new Puzzle(id, initialFen, solution, rating));
  }
}
