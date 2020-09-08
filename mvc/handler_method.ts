import { IncomingMessage, ServerResponse } from 'http';
import { helper, ArgsResolverInfo } from './annotation';
import ModelView from './model_view';
export default class HandlerMethod {
  private bean: any;
  private beanClass: any;
  private methodName: string;
  private argsInfos: ArgsResolverInfo[];
  constructor({
    bean,
    beanClass,
    methodName,
    argsInfos,
  }: {
    bean: any;
    beanClass: any;
    methodName: string;
    argsInfos: ArgsResolverInfo[];
  }) {
    this.bean = bean;
    this.beanClass = beanClass;
    this.methodName = methodName;
    this.argsInfos = argsInfos;
  }

  getMethod() {
    return this.methodName;
  }
  handle(req: IncomingMessage, res: ServerResponse): any {
    const model = this.initModel(modelInitInfo);
    const args = this.createArgs(req, res, model);
    const returnValue = this.bean[this.methodName](...args);
    return this.initReturnValue(returnValue);
  }

  private createArgs(
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
  ): any[] {
    const args: any[] = [];
    this.argsInfos.forEach(each => {
      let arg: any;
      switch (each.type) {
        case 'request':
          arg = req;
          break;
        case 'response':
          arg = req;
          break;
        case 'model':
          arg = model;
          break;
        case 'pathVariable':
          arg = req.requestMappingInfo
            .getPathVariableMap()
            .get(each.pathVariableName);
          break;
        default:
          throw new Error('argsInfo错误类型');
      }
      arg = this.converter(arg);
      args[index] = arg;
    });
    return args;
  }

  private initReturnValue(): any {}
}
