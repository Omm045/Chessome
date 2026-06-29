import { AnalysisType } from './types';

export interface AnalysisSessionProps {
  id: string;
  gameId: string;
  title: string | null;
  category: string;
  isShared: boolean;
  analysisType: AnalysisType;
  engineVersion: string;
  engineDepth: number;
  status: string;
  accuracy: number | null;
  lastOpened: Date;
  lastViewedAt: Date;
  viewCount: number;
  isFavorite: boolean;
  tags: string[];
  notes: string | null;
  collection: string | null;
  isArchived: boolean;
  isTrash: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AnalysisSession {
  private constructor(private props: AnalysisSessionProps) {}

  static create(props: AnalysisSessionProps): AnalysisSession {
    return new AnalysisSession(props);
  }

  get id(): string { return this.props.id; }
  get gameId(): string { return this.props.gameId; }
  get title(): string | null { return this.props.title; }
  get category(): string { return this.props.category; }
  get isShared(): boolean { return this.props.isShared; }
  get analysisType(): AnalysisType { return this.props.analysisType; }
  get engineVersion(): string { return this.props.engineVersion; }
  get engineDepth(): number { return this.props.engineDepth; }
  get status(): string { return this.props.status; }
  get accuracy(): number | null { return this.props.accuracy; }
  get lastOpened(): Date { return this.props.lastOpened; }
  get lastViewedAt(): Date { return this.props.lastViewedAt; }
  get viewCount(): number { return this.props.viewCount; }
  get isFavorite(): boolean { return this.props.isFavorite; }
  get tags(): string[] { return this.props.tags; }
  get notes(): string | null { return this.props.notes; }
  get collection(): string | null { return this.props.collection; }
  get isArchived(): boolean { return this.props.isArchived; }
  get isTrash(): boolean { return this.props.isTrash; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  changeCategory(category: string): void {
    this.props.category = category;
    this.props.updatedAt = new Date();
  }

  toggleFavorite(): void {
    this.props.isFavorite = !this.props.isFavorite;
    this.props.updatedAt = new Date();
  }

  updateTags(tags: string[]): void {
    this.props.tags = tags;
    this.props.updatedAt = new Date();
  }

  updateNotes(notes: string | null): void {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }

  moveToTrash(): void {
    this.props.isTrash = true;
    this.props.updatedAt = new Date();
  }

  restoreFromTrash(): void {
    this.props.isTrash = false;
    this.props.updatedAt = new Date();
  }

  toggleArchive(): void {
    this.props.isArchived = !this.props.isArchived;
    this.props.updatedAt = new Date();
  }

  updateLastOpened(): void {
    this.props.lastOpened = new Date();
  }

  recordView(): void {
    this.props.lastViewedAt = new Date();
    this.props.viewCount += 1;
    this.props.updatedAt = new Date();
  }

  setCollection(collectionId: string | null): void {
    this.props.collection = collectionId;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
