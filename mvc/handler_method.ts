import { IncomingMessage, ServerResponse } from 'http';
import { MethodMeta, MvcMeta, ModelIniterInfo, ParamInfo } from '.';
import ModelView from './model_view';
import helper from './annotation/helper';
import DataBinder from './data_binder';
import BeanFactory from 'factory';
import ParamResolver, {
  ParamAnnotationInfo,
} from './param_resolver/param_resolver';
import { paramResolvers } from './param_resolver';
import ReturnValueHandler from './return_value_handler/return_value_handler';
import { returnValueHandlers } from './return_value_handler';
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
  private paramResolvers: ParamResolver<ParamAnnotationInfo>[] = paramResolvers;
  private returnValueHandlers: ReturnValueHandler[] = returnValueHandlers;
  constructor(args: HandlerMethodArgs, factory: BeanFactory) {
    this.args = args;
    this.factory = factory;
  }

  getMethod() {
    return this.args.beanMethod;
  }

  handle(req: IncomingMessage, res: ServerResponse): any {
    const webRequest = new WebRequest(req, res);
    const dataBinder = new DataBinder(this.args.initBinder, this.factory);
    const model = this.initModel(webRequest, this.args.modelIniter, dataBinder);
    const returnValue = this.invokeMethod({
      webRequest,
      model,
      dataBinder,
      paramInfos: this.args.paramInfos,
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
    if (
      !this.returnValueHandlers.some(e => e.isSupport(this.args.returnInfo))
    ) {
      throw new Error('没有找到返回值处理器');
    }
    for (const returnValueHandler of this.returnValueHandlers) {
      if (returnValueHandler.isSupport(this.args.returnInfo)) {
        returnValueHandler.handleReturnValue({
          returnValue,
          returnInfo: this.args.returnInfo,
          webRequest,
          model,
          paramInfos: this.args.paramInfos,
        });
        break;
      }
    }
    return model;
  }

  private initModel(
    webRequest: WebRequest,
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
          webRequest,
          model,
          dataBinder,
          paramInfos: methodMeta.paramInfos,
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
    webRequest,
    model,
    dataBinder,
    paramInfos,
    bean,
    beanMethod,
  }: {
    webRequest: WebRequest;
    model: ModelView;
    dataBinder: DataBinder;
    paramInfos: ParamInfo[];
    bean: any;
    beanMethod: any;
  }) {
    const args = this.createArgs(webRequest, model, dataBinder, paramInfos);
    return await Reflect.apply(Reflect.get(bean, beanMethod), bean, args);
  }

  private createArgs(
    webRequest: WebRequest,
    model: ModelView,
    dataBinder: DataBinder,
    paramInfos: ParamInfo[],
  ): any[] {
    return paramInfos.map(param => {
      const paramResolver = this.paramResolvers.find(e => e.isSupport(param));
      if (!paramResolver) {
        throw new Error(param.type + param.name + '不匹配参数解析器');
      }
      const annotationInfo = paramResolver.getAnnotationInfo(param);
      const value = paramResolver.resolve(
        {
          webRequest,
          model,
          param,
        },
        annotationInfo,
      );
      return dataBinder.convert(value, param);
    });
  }
}
