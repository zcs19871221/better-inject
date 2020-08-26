import { ClientRequest, ServerResponse } from 'http';
import ModelView from './model_view';

export default class HandlerMethod {
  private beanId: string;
  private method: string;
  private argsResolver;
  private returnValueResolver;
  handle(request: ClientRequest, response: ServerResponse): ModelView {
    const bean = factory.getBean('beanId');
    const args = this.argsResolver.map(resolve =>
      resolve(info, req, modelView),
    );
    const res = bean[this.method](...args);
    return this.returnValueResolver.reduce((acc, cur) => cur(acc));
  }
}
