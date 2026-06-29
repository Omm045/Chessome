// 0-7 represents 1-8
export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const isValidRank = (rank: number): rank is Rank => rank >= 0 && rank <= 7;
