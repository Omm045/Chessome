export type Color = 'White' | 'Black';

export const flipColor = (color: Color): Color => color === 'White' ? 'Black' : 'White';
