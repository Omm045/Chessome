import { BaseError } from '@chessome/shared';

export class EngineProtocolError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ENGINE_PROTOCOL_ERROR', context);
    this.name = 'EngineProtocolError';
  }
}

export class EngineStateError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ENGINE_STATE_ERROR', context);
    this.name = 'EngineStateError';
  }
}

export class EngineParseError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ENGINE_PARSE_ERROR', context);
    this.name = 'EngineParseError';
  }
}

export class EngineTimeoutError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ENGINE_TIMEOUT_ERROR', context);
    this.name = 'EngineTimeoutError';
  }
}

export class UnsupportedOptionError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'UNSUPPORTED_OPTION_ERROR', context);
    this.name = 'UnsupportedOptionError';
  }
}
