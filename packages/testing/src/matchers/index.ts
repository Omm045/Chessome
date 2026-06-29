// Custom matchers conceptual stubs
export function toBeValidFen(received: string): { message: () => string; pass: boolean } {
  // extremely basic regex for demonstration of structure
  const pass = /^\s*([pnbrqkPNBRQK1-8]+\/){7}([pnbrqkPNBRQK1-8]+)\s+[wb-]\s+[KQkq-]+\s+[a-h3-6-]+\s+\d+\s+\d+\s*$/.test(received);
  return {
    message: () => `expected ${received} to be a valid FEN`,
    pass,
  };
}
