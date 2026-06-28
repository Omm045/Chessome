export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Not authenticated', details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = 'Permission denied', details?: unknown) {
    super(message, 'AUTHORIZATION_ERROR', details);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFLICT_ERROR', details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_FOUND_ERROR', details);
  }
}

export class EngineError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'ENGINE_ERROR', details);
  }
}

export class InfrastructureError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'INFRASTRUCTURE_ERROR', details);
  }
}
