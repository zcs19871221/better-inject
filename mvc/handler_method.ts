import { IncomingMessage, ServerResponse } from 'http';
import { MethodMeta, MvcMeta } from '.';
import ModelView from './model_view';

type HandlerMethodArgs = Pick<MvcMeta, 'initBinder' | 'modelIniter'> &
  Omit<MethodMeta, 'info'> & { bean: any } & { beanMethod: string };
export default class HandlerMethod {
  private args: HandlerMethodArgs;
  constructor(args: HandlerMethodArgs) {
    this.args = args;
  }

  getMethod() {
    return this.args.beanMethod;
  }

  handle(req: IncomingMessage, res: ServerResponse): any {
    const model = this.initModel(this.args.modelIniter);
    const dataBinder = this.initDataBinder(this.initBinder);
    const args = this.createArgs(req, res, model, initBinder, argsResolverInfo);
    const returnValue = this.bean[this.methodName](...args);
    return this.initReturnValue(returnValue);
  }

  private createArgs(
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
  ): any[] {
    return this.args.params.map(({ type, name }, index) => {
      const resolver = this.args.argsResolver.find(e => e.getIndex() === index);
      if (resolver) {
        return resolver.resolve({
          req,
          res,
          model,
          param: {
            type,
            name,
          },
          binder: this.args.initBinder,
        });
      } else if (type === IncomingMessage) {
        return req;
      } else if (type === ServerResponse) {
        return res;
      } else if (type === ModelView) {
        return model;
      }
    });
  }
}
