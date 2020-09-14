import ModelView from '../model_view';
import { Param } from '..';
import WebRequest from '../webrequest';

interface ResponseBodyAnnotationInfo {
  type: 'ResponseBody';
}
type ReturnAnnotationInfo = ResponseBodyAnnotationInfo;
interface ReturnInfo {
  type: any;
  annotations: ReturnAnnotationInfo[];
}

interface ReturnValueHandlerArguments {
  returnValue: any;
  returnInfo: ReturnInfo;
  webRequest: WebRequest;
  model: ModelView;
  param: Param;
}
export { ReturnValueHandlerArguments, ReturnInfo };
export default interface ReturnValueHandler {
  handleReturnValue(input: ReturnValueHandlerArguments): any;
  isSupport(input: ReturnInfo): boolean;
}
