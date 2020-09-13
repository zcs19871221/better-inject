import ModelView from '../model_view';
import { Param } from '..';
import WebRequest from '../webrequest';

export interface ReturnValueHandlerInput {
  returnValue: any;
  returnType: any;
  webRequest: WebRequest;
  model: ModelView;
  param: Param;
}
export default interface ReturnValueHandler {
  handleReturnValue(input: ReturnValueHandlerInput): any;
}
