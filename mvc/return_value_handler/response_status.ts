import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
  ResponseStatusAnnotationInfo,
  ReturnAnnotationInfo,
} from './return_value_handler';
import helper from '../meta_helper';

const ResponseStatus = (status: number) => {
  if (status < 100 || status > 599) {
    throw new Error('status code范围[100,599]');
  }
  return (ctr: any, methodName: string) => {
    const mvcMeta = helper.getIfNotExisisInit(ctr);
    const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
    methodMeta.returnInfo.annotations.push({
      type: 'ResponseStatus',
      status,
    });
    helper.set(ctr, mvcMeta);
  };
};

class ResponseStatusHandler implements ReturnValueHandler {
  isSupport(args: ReturnInfo) {
    if (args.annotations.find(e => e.type === 'ResponseStatus')) {
      return true;
    }
    return false;
  }

  private guard(
    annotationInfo: ReturnAnnotationInfo,
  ): annotationInfo is ResponseStatusAnnotationInfo {
    return annotationInfo.type === 'ResponseStatus';
  }

  async handleReturnValue(input: ReturnValueHandlerArguments) {
    const t = input.returnInfo.annotations.filter(this.guard);
    input.webRequest.setStatusCode(t[0].status);
  }
}
const responseStatusHandler = new ResponseStatusHandler();
export { ResponseStatus, responseStatusHandler };
