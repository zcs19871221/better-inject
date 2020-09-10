import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../model_view';

export interface ResolveArgs {
  param: { type: any; name: string };
  req: IncomingMessage;
  res: ServerResponse;
  model: ModelView;
}
export default interface ArgsResolver {
  resolve(input: ResolveArgs): any;
  getIndex(): number;
}
