import * as AnalysisSchemas from './analysis';
import * as ApiSchemas from './api';
import * as AuthSchemas from './auth';
import * as ChessSchemas from './chess';
import * as CommonSchemas from './common';
import * as EngineSchemas from './engine';
import * as EventsSchemas from './events';
import * as UserSchemas from './user';

export const Registry = {
  Analysis: AnalysisSchemas,
  Api: ApiSchemas,
  Auth: AuthSchemas,
  Chess: ChessSchemas,
  Common: CommonSchemas,
  Engine: EngineSchemas,
  Events: EventsSchemas,
  User: UserSchemas,
};
