import { IncomingMessage, ServerResponse } from 'http';
import RequestMapping from './request_mapping';
import Intercepter from './interceptor.tts';
import ModelView from './model_view.tts';
import Context from 'index';

export default class Dispatch {
  private mapping: RequestMapping;
  private context: Context;
  constructor(context: Context) {
    this.context = context;
    this.mapping = new RequestMapping();
    this.context.regist({
      type: 'single',
      beanClass: RequestMapping,
      id: RequestMapping.beanId,
    });
  }

  doDispatch(request: IncomingMessage, response: ServerResponse) {
    let exception = null;
    let modelView = null;
    let interceptor;
    try {
      const handler = this.mapping.getHandler(request);
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
    _mv: ModelView | null,
    _request: IncomingMessage,
    _response: ServerResponse,
    _error?: Error,
  ) {}
}
