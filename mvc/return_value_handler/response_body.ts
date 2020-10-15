import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
} from './return_value_handler';
import helper from '../meta_helper';

const ResponseBody = (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
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
      !input.webRequest.isRequestHandled()
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
