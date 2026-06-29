export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export interface IPolicy<T, R> {
  evaluate(context: T): R;
}

export interface IDomainEventDispatcher {
  dispatch(event: unknown): void;
}

// Marker interface for database transactions (implementation hidden from core)
export interface ITransaction {
  readonly _brand: unique symbol;
}

export interface IUnitOfWork {
  // Scoped execution to automatically handle commit/rollback
  execute<T>(work: (tx: ITransaction) => Promise<T>): Promise<T>;
}

