import { InfrastructureError } from '../errors';

export function assertExists<T>(
  val: T | null | undefined,
  message = 'Value must exist'
): asserts val is T {
  if (val === null || val === undefined) {
    throw new InfrastructureError(message);
  }
}

export function assertNever(value: never, message = 'Unreachable code path'): never {
  throw new InfrastructureError(`${message}: ${value}`);
}

export function assertUnreachable(message = 'Unreachable code path'): never {
  throw new InfrastructureError(message);
}
