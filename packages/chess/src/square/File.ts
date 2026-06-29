// 0-7 represents A-H
export type File = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const isValidFile = (file: number): file is File => file >= 0 && file <= 7;
