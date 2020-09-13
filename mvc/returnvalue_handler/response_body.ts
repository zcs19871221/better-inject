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
  methodMeta.returnValueHandler.push(new ResponseBodyHandler());
  helper.set(ctr, mvcMeta);
};
class ResponseBodyHandler implements ReturnValueHandler {
  async handleReturnValue(input: ReturnValueHandlerInput) {
    if (
      [String, Buffer].includes(input.param.type) &&
      !input.webRequest.canResponse()
    ) {
      await input.webRequest.response(input.returnValue);
      return;
    }
    if (input.webRequest.isReqContentTypeJson()) {
      await input.webRequest.response(JSON.stringify(input.returnValue));
      return;
    }
    throw new Error(
      'returnValue:' +
        input.returnValue +
        '不是字符串或Buffer且无对应contentType无法转换',
    );
  }
}
export { ResponseBodyHandler };
export default ResponseBody;
