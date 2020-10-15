import { IncomingMessage, ServerResponse } from 'http';
import RequestMapping from './handle_request_mapping';
import ModelView from './model_view';
import WebRequest from './webrequest';
import Context from '../';

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
    this.mapping = <RequestMapping>this.context.getBean(RequestMapping.beanId);
  }

  async doDispatch(request: IncomingMessage, response: ServerResponse) {
    let exception: Error | null = null;
    let modelView: ModelView | null = null;
    const webRequest = new WebRequest(request, response);
    try {
      const handler = this.mapping.getHandler(request);
      modelView = await handler.handle(webRequest);
    } catch (error) {
      exception = error;
    }
    if (modelView === null) {
      return;
    }
    this.processResult(modelView, webRequest, exception);
  }

  private processResult(
    mv: ModelView,
    webRequest: WebRequest,
    error: Error | null,
  ) {
    if (error) {
      mv = new ModelView();
      mv.setModel('stack', error.stack);
      mv.setModel('message', error.message);
      mv.setView('error');
      return;
    }

    this.render(mv, request, response, error);
  }

  private render() {}
}
