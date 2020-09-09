import { IncomingMessage, ServerResponse } from 'http';
import {
  ModelResolverInfo,
  ArgsResolverInfo,
  BinderInfo,
  KeyValueInfo,
} from './annotation';
import ModelView from './model_view';
import { ArgsResolver } from './args_resolver';
export default class HandlerMethod {
  private initBinder: BinderInfo[];
  private params: [any, string][];
  private argsResolverInfo: ArgsResolver[];
  constructor({
    argsResolverInfo,
    initBinder,
    params,
  }: {
    argsResolverInfo: ArgsResolverInfo[];
    initBinder: BinderInfo[];
    params: [any, string][];
  }) {
    this.params = params;
    this.initBinder = initBinder;
    this.argsResolverInfo = argsResolverInfo;
  }

  createArgs(
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
  ): any[] {
    return this.params.map(([type, name], index) => {
      const resolver = this.argsResolvers.find(e => e.support());
      if (resolver) {
        return resolver.resolve();
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
