import WebRequest from '../webrequest';
import HandlerMethod from '../handler_method';
import ModelView from '../model_view';
import helper, { ExecptionHandlerInfo } from '../meta_helper';

interface ExceptionHandler {
  resolve(
    webRequest: WebRequest,
    handler: HandlerMethod,
    exception: Error,
  ): ModelView | null;
}
const Annotation = (exceptionType: any) => (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  mvcMeta.execptionHandlerInfo.push({
    methodName,
    beanClass: ctr.constructor,
    exceptionType,
  });
  helper.set(ctr, mvcMeta);
};

class ExceptionHandler implements ExceptionHandler {
  async resolve(
    webRequest: WebRequest,
    handler: HandlerMethod,
    exception: any,
  ): ModelView | null {
    const info = handler.getExceptionHandlerInfo().find(e => {
      return exception.constructor === e.exceptionType;
    });
    if (info) {
      const factory = handler.getFactory();
      const { beanClass, methodName } = info;
      const metaData = helper.get(beanClass);
      if (metaData) {
        const bean: any = factory.getBeanFromClass(beanClass);
        const returnValue = await handler.invokeMethod({
          webRequest,
          model: new ModelView(),
          dataBinder: handler.dataBinder,
          paramInfos: metaData.methods[methodName]
            ? metaData.methods[methodName].paramInfos
            : [],
          bean,
          beanMethod: methodName,
        });
      }
    }
  }
}
