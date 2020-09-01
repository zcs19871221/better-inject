import { IncomingMessage, ServerResponse } from 'http';
import ModelView from './model_view.tts';

export default class Interceptor {
  constructor(request: IncomingMessage) {}
  applyPre(request: IncomingMessage, response: ServerResponse): boolean {
    return false;
  }

  applyPost(
    request: IncomingMessage,
    response: ServerResponse,
    mv: ModelView,
  ) {}

  applyAfter(
    request: IncomingMessage,
    response: ServerResponse,
    error?: Error,
  ) {}
}
