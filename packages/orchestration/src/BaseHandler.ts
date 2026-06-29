export abstract class BaseHandler<TRequest, TResponse> {
  abstract handle(request: TRequest): Promise<TResponse>;

  // Optional lifecycle hooks
  async preProcess?(request: TRequest): Promise<void>;
  async postProcess?(request: TRequest, result: TResponse): Promise<void>;
  async onError?(request: TRequest, error: Error): Promise<void>;
}
