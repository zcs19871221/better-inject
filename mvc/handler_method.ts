import { IncomingMessage, ServerResponse } from 'http';
import { MethodMeta, MvcMeta, ModelIniterInfo, BinderInfo } from '.';
import ModelView from './model_view';
import helper from './annotation/helper';
import DataBinder from './data_binder';
import BeanFactory from 'factory';

type HandlerMethodArgs = Pick<MvcMeta, 'initBinder' | 'modelIniter'> &
  Omit<MethodMeta, 'info'> & {
    bean: any;
    beanMethod: string;
    model?: ModelView;
  };

export default class HandlerMethod {
  private args: HandlerMethodArgs;
  private model?: ModelView;
  private factory: BeanFactory;
  constructor(args: HandlerMethodArgs, factory: BeanFactory) {
    this.args = args;
    this.model = args.model;
    this.factory = factory;
  }

  getMethod() {
    return this.args.beanMethod;
  }

  handle(req: IncomingMessage, res: ServerResponse): any {
    const model = this.initModel(req, res, this.args.modelIniter);
    const dataBinder = new DataBinder(this.args.initBinder, this.factory);
    const args = this.createArgs(req, res, model, dataBinder);
    const returnValue = this.args.bean[this.args.beanMethod](...args);
    return this.initReturnValue(returnValue);
  }

  private initModel(
    req: IncomingMessage,
    res: ServerResponse,
    modelInfos: ModelIniterInfo[],
  ) {
    let model: ModelView;
    if (!this.model) {
      model = new ModelView();
    } else {
      model = this.model;
    }
    modelInfos.forEach(({ modelKey, methodName, beanClass }) => {
      const metaData = helper.get(beanClass);
      const bean: any = this.factory.getBeanFromClass(beanClass);
      if (metaData && metaData.methods[methodName]) {
        const methodData = metaData.methods[methodName];
        const handlerMethod = new HandlerMethod(
          {
            ...methodData,
            initBinder: [],
            modelIniter: [],
            bean,
            beanMethod: methodName,
            model,
          },
          this.factory,
        );
        model = handlerMethod.handle(req, res);
      }
    });
    return model;
  }

  private createArgs(
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
    dataBinder: DataBinder,
  ): any[] {
    return this.args.params.map(({ type, name }, index) => {
      const resolver = this.args.argsResolver.find(e => e.getIndex() === index);
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
