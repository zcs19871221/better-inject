import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../model_view';
import { Param } from '../';

export interface ReturnValueHandlerInput {
  returnValue: any;
  req: IncomingMessage;
  res: ServerResponse;
  model: ModelView;
  param: Param;
}
export default interface ReturnValueResolver {
  handleReturnValue(input: ReturnValueHandlerInput): any;
}
