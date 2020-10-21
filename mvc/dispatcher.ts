import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import pug from 'pug';
import { readFile } from 'better-fs';
import RequestMapping from './handle_request_mapping';
import ModelView from './model_view';
import WebRequest from './webrequest';
import Context from '../';
import HandlerMethod from './handler_method';

interface ErrorHandler {
  isSupport: (message: string) => boolean;
  handle: (webrequest: WebRequest) => void;
}

export default class Dispatch {
  private mapping: RequestMapping;
  private context: Context;
  constructor(context: Context) {
    this.context = context;
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
    webRequest.clear();
    webRequest.setStatusCode(500);
    if (handler) {
      const mv = await handler.handleException(error, webRequest);
      if (mv) {
        return mv;
      }
    }
    const mv = new ModelView();
    mv.setModel('stack', error.stack);
    mv.setModel('message', error.message);
    return mv;
  }

  private async render(modelView: ModelView, webRequest: WebRequest) {
    let template = '';
    if (modelView.hasView()) {
      template = await readFile(
        path.join(this.context.getRoot(), modelView.getView()),
        'utf-8',
      );
    } else {
      template = `p #{message}\np #{stack}`;
    }
    await webRequest.response(pug.render(template, modelView.getModelObject()));
  }
}
