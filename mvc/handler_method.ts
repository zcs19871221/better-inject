import { IncomingMessage, ServerResponse } from 'http';
import { MethodMeta, MvcMeta, ModelMetaInfo, ParamInfo } from '.';
import ModelView from './model_view';
import helper from './annotation/meta_helper';
import { DataBinder } from './data_binder';
import BeanFactory from 'factory';
import paramResolvers, {
  ParamResolver,
  ParamAnnotationInfo,
} from './param_resolver';
import returnValueHandlers, {
  ReturnValueHandler,
} from './return_value_handler';
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

  async handle(req: IncomingMessage, res: ServerResponse): Promise<any> {
    const webRequest = new WebRequest(req, res);
    const dataBinder = new DataBinder(this.args.initBinder, this.factory);
    const model = await this.initModel(
      webRequest,
      this.args.modelIniter,
      dataBinder,
    );
    const returnValue = await this.invokeMethod({
      webRequest,
      model,
      dataBinder,
      paramInfos: this.args.paramInfos,
      bean: this.args.bean,
      beanMethod: this.args.beanMethod,
    });
    return await this.handleReturnValue(model, webRequest, returnValue);
  }

  private async handleReturnValue(
    model: ModelView,
    webRequest: WebRequest,
    returnValue: any,
  ): Promise<ModelView> {
    if (
      !this.returnValueHandlers.some(e => e.isSupport(this.args.returnInfo))
    ) {
      throw new Error('没有找到返回值处理器');
    }
    for (const returnValueHandler of this.returnValueHandlers) {
      if (returnValueHandler.isSupport(this.args.returnInfo)) {
        await returnValueHandler.handleReturnValue({
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

  private async initModel(
    webRequest: WebRequest,
    modelInfos: ModelMetaInfo[],
    dataBinder: DataBinder,
  ) {
    const model: ModelView = new ModelView();
    for (const { modelKey, methodName, beanClass } of modelInfos) {
      const metaData = helper.get(beanClass);
      if (metaData) {
        const bean: any = this.factory.getBeanFromClass(beanClass);
        const returnValue = await this.invokeMethod({
          webRequest,
          model,
          dataBinder,
          paramInfos: metaData.methods[methodName]
            ? metaData.methods[methodName].paramInfos
            : [],
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
      const value = paramResolver.resolve({
        webRequest,
        model,
        param,
        dataBinder,
      });
      return dataBinder.convert(value, param);
    });
  }
}
