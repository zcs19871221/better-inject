import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
} from './return_value_handler';

class ReturnStringTypeHandler implements ReturnValueHandler {
  isSupport(returnInfo: ReturnInfo) {
    return returnInfo.type === String;
  }

  async handleReturnValue(input: ReturnValueHandlerArguments) {
    input.model.setView(input.returnValue);
  }
}
export default ReturnStringTypeHandler;
const returnStringTypeHandler = new ReturnStringTypeHandler();
export { returnStringTypeHandler };
