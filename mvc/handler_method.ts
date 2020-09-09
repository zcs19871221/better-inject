import { IncomingMessage, ServerResponse } from 'http';
import { ModelIniterInfo, ArgsResolverInfo, BinderInfo } from './annotation';
import ModelView from './model_view';
export default class HandlerMethod {
  private bean: any;
  private beanClass: any;
  private methodName: string;
  private argsInfos: ArgsResolverInfo[];
  public model: ModelView;
  constructor({
    argsResolverInfo,
    returnValueResolvers,
    beanClass,
    beanMethod,
    bean,
    modelIniter,
    initBinder,
    params,
  }: {
    argsResolverInfo: ArgsResolverInfo[];
    beanClass: any;
    bean: any;
    beanMethod: string;
    returnValueResolvers: any;
    modelIniter: ModelIniterInfo[];
    initBinder: BinderInfo[];
    params: [any, string][];
  }) {
    this.bean = bean;
    this.beanClass = beanClass;
    this.params = params;
    this.argsResolverInfo = argsResolverInfo;
  }

  getMethod() {
    return this.methodName;
  }

  handle(req: IncomingMessage, res: ServerResponse): any {
    const model = this.initModel(modelInitInfo);
    const dataBinder = this.initDataBinder(this.initBinder);
    const args = this.createArgs(req, res, model, initBinder, argsResolverInfo);
    const returnValue = this.bean[this.methodName](...args);
    return this.initReturnValue(returnValue);
  }
}
