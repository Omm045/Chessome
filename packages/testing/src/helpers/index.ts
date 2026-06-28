// Abstract testing helpers that don't fit into domain objects
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
