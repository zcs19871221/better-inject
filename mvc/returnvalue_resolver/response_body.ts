import ReturnValueHandler, {
  ReturnValueHandlerInput,
} from './return_value_handler';
import helper from '../annotation/helper';

const ResponseBody = (ctr: any, methodName: string) => {
  const returnType = helper.getMethodReturnType(ctr, methodName);
  if (![String, Buffer, Object].includes(returnType)) {
    throw new Error(
      'ResponseBody注解的函数返回类型必须设置成string Buffer 或 普通对象之一',
    );
  }
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.returnValueResolvers.push(new ResponseBodyHandler());
  helper.set(ctr, mvcMeta);
};
class ResponseBodyHandler implements ReturnValueHandler {
  handleReturnValue(input: ReturnValueHandlerInput) {
    if (
      [String, Buffer].includes(input.param.type) &&
      !input.res.writableEnded
    ) {
      input.res.end(input.returnValue);
      return;
    }
    if (input.req.headers['content-type']?.includes('application/json')) {
      input.res.setHeader('content-type', 'application/json');
      input.res.end(JSON.parse(input.returnValue));
    }
  }
}
