import ReturnValueHandler, {
  ReturnValueHandlerInput,
} from './return_value_handler';

class ReturnStringTypeHandler implements ReturnValueHandler {
  async handleResponseBodyAnn(input: ReturnValueHandlerInput) {
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
  async handleReturnValue(input: ReturnValueHandlerInput) {
    if (input.returnType === String) {
      input.model.setView(input.returnValue);
    }
  }
}
export default ReturnStringTypeHandler;
