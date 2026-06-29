export type PgnNodeType = 
  | 'Game' 
  | 'Tag' 
  | 'Move' 
  | 'Variation' 
  | 'Comment' 
  | 'Nag' 
  | 'Result';

export interface BaseNode {
  readonly type: PgnNodeType;
}

export interface TagNode extends BaseNode {
  readonly type: 'Tag';
  readonly key: string;
  readonly value: string;
}

export interface CommentNode extends BaseNode {
  readonly type: 'Comment';
  readonly text: string;
  readonly commands?: Record<string, string>; // for [%clk 1:00:00], [%eval 0.5]
}

export interface NagNode extends BaseNode {
  readonly type: 'Nag';
  readonly code: number; // e.g. 1 for $1
}

export interface VariationNode extends BaseNode {
  readonly type: 'Variation';
  readonly nodes: Array<MoveNode | CommentNode | NagNode | VariationNode>;
}

export interface MoveNode extends BaseNode {
  readonly type: 'Move';
  readonly moveNumber?: number; // e.g. 1
  readonly san: string;         // e.g. "e4", "Nf3"
  readonly turn?: 'w' | 'b';    // optional explicit turn context
  readonly comments: CommentNode[];
  readonly nags: NagNode[];
  readonly variations: VariationNode[];
}

export interface ResultNode extends BaseNode {
  readonly type: 'Result';
  readonly result: '1-0' | '0-1' | '1/2-1/2' | '*';
}

export interface GameNode extends BaseNode {
  readonly type: 'Game';
  readonly tags: TagNode[];
  readonly moves: Array<MoveNode | CommentNode | NagNode | VariationNode>;
  readonly result?: ResultNode;
}
