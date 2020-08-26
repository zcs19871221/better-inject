import { ClientRequest, ServerResponse } from 'http';
import ModelView from './model_view';

export default class Interceptor {
  constructor(request: ClientRequest) {}
  applyPre(request: ClientRequest, response: ServerResponse): boolean {
    return false;
  }

  applyPost(request: ClientRequest, response: ServerResponse, mv: ModelView) {}

  applyAfter(request: ClientRequest, response: ServerResponse, error?: Error) {}
}
