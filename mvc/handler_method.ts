import { IncomingMessage, ServerResponse } from 'http';

export default class HandlerMethod {
  private bean: any;
  private beanMethod: string;
  private argsResolvers;
  private returnValueResolvers;
  constructor({ bean, beanMethod, argsResolvers, returnValueResolvers }) {
    this.bean = bean;
    this.beanMethod = beanMethod;
    this.argsResolvers = argsResolvers;
    this.returnValueResolvers = returnValueResolvers;
  }

  handle(request: IncomingMessage, response: ServerResponse): ModelView {
    const args = this.argsResolver.map(resolve =>
      resolve(info, req, modelView),
    );
    const res = bean[this.method](...args);
    return this.returnValueResolver.reduce((acc, cur) => cur(acc));
  }
}
