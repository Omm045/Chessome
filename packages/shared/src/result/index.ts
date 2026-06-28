export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E = Error> {
  public readonly isOk = true;
  public readonly isErr = false;

  constructor(public readonly value: T) {}

  unwrap(): T {
    return this.value;
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    return new Ok<U, E>(fn(this.value));
  }

  mapErr<U>(fn: (err: E) => U): Result<T, U> {
    void fn;
    return new Ok<T, U>(this.value);
  }

  match<U>(patterns: { ok: (val: T) => U; err: (err: E) => U }): U {
    return patterns.ok(this.value);
  }
}

export class Err<T, E = Error> {
  public readonly isOk = false;
  public readonly isErr = true;

  constructor(public readonly error: E) {}

  unwrap(): never {
    throw this.error;
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    void fn;
    return new Err<U, E>(this.error);
  }

  mapErr<U>(fn: (err: E) => U): Result<T, U> {
    return new Err<T, U>(fn(this.error));
  }

  match<U>(patterns: { ok: (val: T) => U; err: (err: E) => U }): U {
    return patterns.err(this.error);
  }
}

export const ok = <T, E = Error>(value: T): Result<T, E> => new Ok(value);
export const err = <T, E = Error>(error: E): Result<T, E> => new Err(error);
