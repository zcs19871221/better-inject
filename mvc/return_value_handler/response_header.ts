import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
  ResponseHeaderAnnotationInfo,
  ReturnAnnotationInfo,
} from './return_value_handler';
import helper from '../meta_helper';

const ResponseHeader = (key: string, value: string) => (
  ctr: any,
  methodName: string,
) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
  methodMeta.returnInfo.annotations.push({
    type: 'ResponseHeader',
    key,
    value,
  });
  helper.set(ctr, mvcMeta);
};

class ResponseHeaderHandler implements ReturnValueHandler {
  isSupport(args: ReturnInfo) {
    if (args.annotations.find(e => e.type === 'ResponseHeader')) {
      return true;
    }
    return false;
  }

  private guard(
    annotationInfo: ReturnAnnotationInfo,
  ): annotationInfo is ResponseHeaderAnnotationInfo {
    return annotationInfo.type === 'ResponseHeader';
  }

  async handleReturnValue(input: ReturnValueHandlerArguments) {
    const t = input.returnInfo.annotations.filter(this.guard);
    input.webRequest.setHeader(
      t.reduce((acc: { [key: string]: string }, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {}),
    );
  }
}
const responseHeaderHandler = new ResponseHeaderHandler();
export { responseHeaderHandler, ResponseHeader };
