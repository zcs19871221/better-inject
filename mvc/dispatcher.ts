import { IncomingMessage, ServerResponse } from 'http';
import RequestMappingHandler from './request_mapping_handler';
import Intercepter from './interceptor';
import ModelView from './model_view';
import Context from 'index';

export default class Dispatch {
  private mapping: RequestMappingHandler;
  private context: Context;
  constructor() {
    this.mapping = this.context.getBean('request_mapping');
  }

  doDispatch(request: IncomingMessage, response: ServerResponse) {
    let exception = null;
    let modelView = null;
    let interceptor;
    try {
      const handler = this.mapping.getHandler();
      interceptor = new Intercepter(request);
      if (!interceptor.applyPre(request, response)) {
        return;
      }
      modelView = handler.handle(request, response);
      interceptor.applyPost(request, response, modelView);
    } catch (error) {
      exception = error;
    } finally {
      interceptor?.applyAfter(request, response, exception);
    }
    try {
      this.processResult(modelView, request, response, exception);
    } catch (error) {
      response.end('error');
    }
  }

  private processResult(
    mv: ModelView | null,
    request: IncomingMessage,
    response: ServerResponse,
    error?: Error,
  ) {}
}
