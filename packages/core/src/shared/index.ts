export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export interface IPolicy<T, R> {
  evaluate(context: T): R;
}

// Domain events dispatcher interface if needed
export interface IDomainEventDispatcher {
  dispatch(event: unknown): void;
}
