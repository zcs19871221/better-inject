import { ClientRequest, ServerResponse } from 'http';
import RequestMappingHandler from './request_mapping_handler';
import Intercepter from './interceptor';
import ModelView from './model_view';

export default class Dispatch {
  private mapping: RequestMappingHandler;
  constructor() {
    this.mapping = new RequestMappingHandler();
  }

  doDispatch(request: ClientRequest, response: ServerResponse) {
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
    request: ClientRequest,
    response: ServerResponse,
    error?: Error,
  ) {}
}
