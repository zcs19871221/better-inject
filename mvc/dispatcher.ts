import { IncomingMessage, ServerResponse } from 'http';
import pug from 'pug';
import RequestMapping from './handle_request_mapping';
import ModelView from './model_view';
import WebRequest from './webrequest';
import Context from '../';
import HandlerMethod from './handler_method';

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
    let modelView: ModelView | null = null;
    let handler: null | HandlerMethod = null;
    const webRequest = new WebRequest(request, response);
    try {
      handler = this.mapping.getHandler(request);
      modelView = await handler.handle(webRequest);
    } catch (error) {
      modelView = await this.processExcetion(error, webRequest, handler);
    }
    if (modelView === null) {
      return;
    }
    await this.render(modelView, webRequest);
  }

  private async processExcetion(
    error: Error,
    webRequest: WebRequest,
    handler: HandlerMethod | null,
  ): Promise<ModelView> {
    if (handler) {
      const mv = await handler.handleException(error, webRequest);
      if (mv) {
        return mv;
      }
    }
    const mv = new ModelView();
    mv.setModel('stack', error.stack);
    mv.setModel('message', error.message);
    mv.setView('error');
    return mv;
  }

  private async render(modelView: ModelView, webRequest: WebRequest) {
    await webRequest.response(
      pug.renderFile(modelView.getView(), modelView.getModel()),
    );
  }
}
