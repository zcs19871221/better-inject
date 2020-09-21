import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
} from './return_value_handler';
import helper from '../annotation/meta_helper';

const ResponseBody = (ctr: any, methodName: string) => {
  const returnType = helper.getMethodReturnType(ctr, methodName);
  if (![String, Buffer, Object].includes(returnType)) {
    throw new Error(
      'ResponseBody注解的函数返回类型必须设置成string Buffer 或 普通对象之一',
    );
  }
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
  methodMeta.returnInfo.type = returnType;
  methodMeta.returnInfo.annotations.push({ type: 'ResponseBody' });
  helper.set(ctr, mvcMeta);
};

class ResponseBodyHandler implements ReturnValueHandler {
  isSupport(args: ReturnInfo) {
    if (args.annotations.find(e => e.type === 'ResponseBody')) {
      return true;
    }
    return false;
  }

  async handleReturnValue(input: ReturnValueHandlerArguments) {
    if (
      [String, Buffer].includes(input.returnInfo.type) &&
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
const responseBodyHandler = new ResponseBodyHandler();
export { responseBodyHandler, ResponseBody };