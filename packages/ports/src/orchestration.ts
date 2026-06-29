export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
  onCancel(callback: () => void): void;
}
