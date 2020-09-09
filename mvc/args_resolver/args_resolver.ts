import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../model_view';
import DataBinder from '../data_binder';

export interface ResolveArgs {
  param: { type: any; name: string };
  req: IncomingMessage;
  res: ServerResponse;
  model: ModelView;
  binder: DataBinder;
}
export default interface ArgsResolver {
  resolve(input: ResolveArgs): any;
  getIndex(): number;
}
