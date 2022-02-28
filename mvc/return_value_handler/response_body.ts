import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
} from './return_value_handler';
import { ReadStream } from 'fs';
import * as fs from 'better-fs';
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
    if (input.webRequest.isRequestHandled()) {
      return;
    }

    if (
      [String, Buffer, ReadStream, fs.ReadStream].includes(
        input.returnInfo.type,
      ) &&
      !input.webRequest.isRequestHandled()
    ) {
      await input.webRequest.response(input.returnValue);
      return;
    }
    if (
      input.webRequest.isReqContentTypeJson() ||
      String(input.webRequest.getResponseHeader('content-type')).includes(
        'application/json',
      )
    ) {
      await input.webRequest.response(JSON.stringify(input.returnValue));
      return;
    }
    await input.webRequest.response(input.returnValue);
    return;
  }
}
const responseBodyHandler = new ResponseBodyHandler();
export { responseBodyHandler, ResponseBody };
