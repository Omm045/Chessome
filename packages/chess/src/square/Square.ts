import { File, isValidFile } from './File';
import { Rank, isValidRank } from './Rank';

export type SquareIndex = number; // 0..63

export const makeSquare = (file: File, rank: Rank): SquareIndex => rank * 8 + file;

export const fileOf = (square: SquareIndex): File => (square % 8) as File;
export const rankOf = (square: SquareIndex): Rank => Math.floor(square / 8) as Rank;

export const isValidSquare = (square: number): square is SquareIndex => square >= 0 && square <= 63;
