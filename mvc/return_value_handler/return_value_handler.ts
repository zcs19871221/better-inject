import ModelView from '../model_view';
import { ParamInfo } from '..';
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
  paramInfos: ParamInfo[];
}
export { ReturnValueHandlerArguments, ReturnInfo };
export default interface ReturnValueHandler {
  handleReturnValue(input: ReturnValueHandlerArguments): Promise<any>;
  isSupport(input: ReturnInfo): boolean;
}
