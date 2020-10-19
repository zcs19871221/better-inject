import ModelView from './model_view';
import helper, {
  MethodMeta,
  MvcMeta,
  ModelMetaInfo,
  ParamInfo,
} from './meta_helper';
import { DataBinder } from './data_binder';
import BeanFactory from 'factory';
import paramResolvers from './param_resolver';
import returnValueHandlers, {
  ReturnValueHandler,
} from './return_value_handler';
import WebRequest from './webrequest';

type HandlerMethodArgs = Pick<
  MvcMeta,
  'initBinder' | 'modelIniter' | 'execptionHandlerInfo'
> &
  Omit<MethodMeta, 'info'> & {
    bean: any;
    beanMethod: string;
    model?: ModelView;
  };

export default class HandlerMethod {
  private args: HandlerMethodArgs;
  private dataBinder: DataBinder;
  private factory: BeanFactory;
  private returnValueHandlers: ReturnValueHandler[] = returnValueHandlers;
  constructor(args: HandlerMethodArgs, factory: BeanFactory) {
    this.args = args;
    this.factory = factory;
    this.dataBinder = new DataBinder(this.args.initBinder, this.factory);
  }

  getMethod() {
    return this.args.beanMethod;
  }

  async handle(webRequest: WebRequest): Promise<ModelView | null> {
    const model = await this.initModel(webRequest, this.args.modelIniter);
    const returnValue = await this.invokeMethod({
      webRequest,
      model,
      paramInfos: this.args.paramInfos,
      bean: this.args.bean,
      beanMethod: this.args.beanMethod,
    });
    return await this.handleReturnValue(model, webRequest, returnValue);
  }

  async handleException(
    exception: Error,
    webRequest: WebRequest,
  ): Promise<ModelView | null> {
    const info = this.args.execptionHandlerInfo.find(e => {
      return e.errorMsgMatcher.test(exception.message);
    });
    if (info) {
      const { beanClass, methodName } = info;
      const metaData = helper.get(beanClass);
      if (metaData) {
        const model = new ModelView();
        const bean: any = this.factory.getBeanFromClass(beanClass);
        const returnValue = await this.invokeMethod({
          webRequest,
          model,
          paramInfos: metaData.methods[methodName]
            ? metaData.methods[methodName].paramInfos
            : [],
          bean,
          beanMethod: methodName,
          exception,
        });
        return await this.handleReturnValue(model, webRequest, returnValue);
      }
    }
    return null;
  }

  private async handleReturnValue(
    model: ModelView,
    webRequest: WebRequest,
    returnValue: any,
  ): Promise<ModelView | null> {
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
      }
    }
    if (webRequest.isRequestHandled()) {
      return null;
    }
    return model;
  }

  private async initModel(webRequest: WebRequest, modelInfos: ModelMetaInfo[]) {
    const model: ModelView = new ModelView();
    for (const { modelKey, methodName, beanClass } of modelInfos) {
      const metaData = helper.get(beanClass);
      if (metaData) {
        const bean: any = this.factory.getBeanFromClass(beanClass);
        const returnValue = await this.invokeMethod({
          webRequest,
          model,
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
    paramInfos,
    bean,
    beanMethod,
    exception,
  }: {
    webRequest: WebRequest;
    model: ModelView;
    paramInfos: ParamInfo[];
    bean: any;
    beanMethod: any;
    exception?: Error;
  }) {
    const args = await this.createArgs(
      webRequest,
      model,
      paramInfos,
      exception,
    );
    return await Reflect.apply(Reflect.get(bean, beanMethod), bean, args);
  }

  private async createArgs(
    webRequest: WebRequest,
    model: ModelView,
    paramInfos: ParamInfo[],
    exception?: Error,
  ): Promise<any[]> {
    return Promise.all(
      paramInfos.map(param => {
        if (param.type === Error && exception) {
          return exception;
        }
        const paramResolver = paramResolvers.find(e => e.isSupport(param));
        if (!paramResolver) {
          throw new Error(param.type + param.name + '不匹配参数解析器');
        }
        return paramResolver.resolve({
          webRequest,
          model,
          param,
          dataBinder: this.dataBinder,
        });
      }),
    );
  }
}
