import { ValidationError, Result, ok, Brand } from '@chessome/shared';

export type StudyId = Brand<string, 'StudyId'>;
export type NodeId = Brand<string, 'NodeId'>;

export class StudyNode {
  private constructor(
    public readonly id: NodeId,
    public readonly fen: string,
    public readonly moveFromParent: string | null,
    public readonly parentId: NodeId | null
  ) {}

  public static create(id: NodeId, fen: string, moveFromParent: string | null, parentId: NodeId | null): Result<StudyNode, ValidationError> {
    // Invariants regarding root node needing no parent, etc.
    return ok(new StudyNode(id, fen, moveFromParent, parentId));
  }
}

export class Study {
  private constructor(
    public readonly id: StudyId,
    public readonly title: string,
    private readonly nodes: Map<NodeId, StudyNode>
  ) {}

  public static create(id: StudyId, title: string): Result<Study, ValidationError> {
    return ok(new Study(id, title, new Map()));
  }

  // Study domain logic like addNode, checking for cycles, etc.
}

export interface IStudyRepository {
  findById(id: StudyId): Promise<Result<Study, Error>>;
  save(study: Study): Promise<Result<void, Error>>;
}
