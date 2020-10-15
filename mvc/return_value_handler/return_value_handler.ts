import ModelView from '../model_view';
import { ParamInfo } from '../meta_helper';
import WebRequest from '../webrequest';

interface ResponseBodyAnnotationInfo {
  type: 'ResponseBody';
}
interface ResponseHeaderAnnotationInfo {
  type: 'ResponseHeader';
  key: string;
  value: string;
}
interface ResponseStatusAnnotationInfo {
  type: 'ResponseStatus';
  status: number;
}
type ReturnAnnotationInfo =
  | ResponseBodyAnnotationInfo
  | ResponseStatusAnnotationInfo
  | ResponseHeaderAnnotationInfo;
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
export {
  ReturnValueHandlerArguments,
  ReturnInfo,
  ResponseHeaderAnnotationInfo,
  ResponseStatusAnnotationInfo,
  ReturnAnnotationInfo,
};
export default interface ReturnValueHandler {
  handleReturnValue(input: ReturnValueHandlerArguments): Promise<any>;
  isSupport(input: ReturnInfo): boolean;
}
