export interface UserStatisticsProps {
  id: string;
  totalAnalyses: number;
  totalGames: number;
  averageAccuracy: number | null;
  hoursAnalyzed: number;
  lastActive: Date;
}

export class UserStatistics {
  private constructor(private props: UserStatisticsProps) {}

  static create(props: UserStatisticsProps): UserStatistics {
    return new UserStatistics(props);
  }

  static createDefault(id: string): UserStatistics {
    return new UserStatistics({
      id,
      totalAnalyses: 0,
      totalGames: 0,
      averageAccuracy: null,
      hoursAnalyzed: 0,
      lastActive: new Date()
    });
  }

  get id(): string { return this.props.id; }
  get totalAnalyses(): number { return this.props.totalAnalyses; }
  get totalGames(): number { return this.props.totalGames; }
  get averageAccuracy(): number | null { return this.props.averageAccuracy; }
  get hoursAnalyzed(): number { return this.props.hoursAnalyzed; }
  get lastActive(): Date { return this.props.lastActive; }

  recordAnalysis(durationHours: number): void {
    this.props.totalAnalyses += 1;
    this.props.hoursAnalyzed += durationHours;
    this.props.lastActive = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
