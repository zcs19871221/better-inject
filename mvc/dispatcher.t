import { IncomingMessage, ServerResponse } from 'http';
import RequestMapping from './handle_request_mapping';
import Intercepter from './interceptor';
import ModelView from './model_view';
import Context from 'index';

export default class Dispatch {
  private mapping: RequestMapping;
  private context: Context;
  constructor(context: Context) {
    this.context = context;
    this.context.regist({
      type: 'single',
      beanClass: RequestMapping,
      id: RequestMapping.beanId,
    });
    this.mapping = this.context.getBean(RequestMapping.beanId)
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
    mv: ModelView | null,
    request: IncomingMessage,
    response: ServerResponse,
    error?: Error,
  ) {
    if (error) {
      console.log('404 or somae error');
      return;
    }
    this.render(mv, request, response, error);
  }

  private render() {}
}
