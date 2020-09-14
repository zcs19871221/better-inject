import ReturnValueHandler, {
  ReturnValueHandlerArguments,
  ReturnInfo,
} from './return_value_handler';
import ModelView from '../model_view';

class ReturnModelViewTypeHandler implements ReturnValueHandler {
  isSupport(returnInfo: ReturnInfo) {
    return returnInfo.type === ModelView;
  }

  async handleReturnValue(returnValueHandlerArgs: ReturnValueHandlerArguments) {
    if (returnValueHandlerArgs.model !== returnValueHandlerArgs.returnValue) {
      returnValueHandlerArgs.model.combine(returnValueHandlerArgs.returnValue);
    }
  }
}
export default ReturnModelViewTypeHandler;

const returnModelViewTypeHandler = new ReturnModelViewTypeHandler();
export { returnModelViewTypeHandler };
