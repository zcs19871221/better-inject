import { IncomingMessage, ServerResponse } from 'http';
import { MethodMeta, MvcMeta, ModelIniterInfo, Param } from '.';
import ModelView from './model_view';
import helper from './annotation/helper';
import DataBinder from './data_binder';
import BeanFactory from 'factory';
import ArgsResolver from './param_resolver/index2';
import ReturnValueHandler from './return_value_handler';
import WebRequest from './webrequest';

type HandlerMethodArgs = Pick<MvcMeta, 'initBinder' | 'modelIniter'> &
  Omit<MethodMeta, 'info'> & {
    bean: any;
    beanMethod: string;
    model?: ModelView;
  };

export default class HandlerMethod {
  private args: HandlerMethodArgs;
  private factory: BeanFactory;
  private returnValueHandlers: ReturnValueHandler[];
  constructor(
    args: HandlerMethodArgs,
    factory: BeanFactory,
    returnValueHandlers: ReturnValueHandler[],
  ) {
    this.args = args;
    this.factory = factory;
    this.returnValueHandlers = returnValueHandlers;
  }

  getMethod() {
    return this.args.beanMethod;
  }

  handle(req: IncomingMessage, res: ServerResponse): any {
    const webRequest = new WebRequest(req, res);
    const dataBinder = new DataBinder(this.args.initBinder, this.factory);
    const model = this.initModel(req, res, this.args.modelIniter, dataBinder);
    const returnValue = this.invokeMethod({
      req,
      res,
      model,
      dataBinder,
      params: this.args.params,
      argsResolver: this.args.argsResolver,
      bean: this.args.bean,
      beanMethod: this.args.beanMethod,
    });
    return this.handleReturnValue(model, webRequest, returnValue);
  }

  handleReturnValue(
    model: ModelView,
    webRequest: WebRequest,
    returnValue: any,
  ): ModelView {
    this.returnValueHandlers.forEach(returnValueHandler => {
      if (returnValueHandler.isSupport(this.args.returnInfo)) {
        returnValueHandler.handleReturnValue({
          returnValue,
          returnInfo: this.args.returnInfo,
          webRequest,
          model,
          paramInfos: this.args.paramInfos,
        });
      }
    });
    return model;
  }

  private initModel(
    req: IncomingMessage,
    res: ServerResponse,
    modelInfos: ModelIniterInfo[],
    dataBinder: DataBinder,
  ) {
    const model: ModelView = new ModelView();
    for (const { modelKey, methodName, beanClass } of modelInfos) {
      const metaData = helper.get(beanClass);
      if (metaData && metaData.methods[methodName]) {
        const bean: any = this.factory.getBeanFromClass(beanClass);
        const methodMeta = metaData.methods[methodName];
        const returnValue = this.invokeMethod({
          req,
          res,
          model,
          dataBinder,
          params: methodMeta.params,
          argsResolver: methodMeta.argsResolver,
          bean,
          beanMethod: methodName,
        });
        if (returnValue !== undefined && modelKey) {
          model.setModel(modelKey, returnValue);
        }
      }
    }
    return model;
  }

  private async invokeMethod({
    req,
    res,
    model,
    dataBinder,
    params,
    argsResolver,
    bean,
    beanMethod,
  }: {
    req: IncomingMessage;
    res: ServerResponse;
    model: ModelView;
    dataBinder: DataBinder;
    params: Param[];
    argsResolver: ArgsResolver[];
    bean: any;
    beanMethod: any;
  }) {
    const args = this.createArgs(
      req,
      res,
      model,
      dataBinder,
      params,
      argsResolver,
    );
    return await Reflect.apply(Reflect.get(bean, beanMethod), bean, args);
  }

  private createArgs(
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
    dataBinder: DataBinder,
    params: Param[],
    argsResolver: ArgsResolver[],
  ): any[] {
    return params.map(({ type, name }, index) => {
      const resolver = argsResolver.find(e => e.getIndex() === index);
      let value: any;
      if (resolver) {
        value = resolver.resolve({
          req,
          res,
          model,
          param: {
            type,
            name,
          },
        });
      } else if (type === IncomingMessage) {
        return req;
      } else if (type === ServerResponse) {
        return res;
      } else if (type === ModelView) {
        return model;
      }
      return dataBinder.convert(value, { type, name });
    });
  }
}
