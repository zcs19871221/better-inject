import { ServerResponse } from 'http';
import ModelView from 'mvc/model_view';

class ReturnStringTypeResolver {
  resolve(
    returnValue: any,
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
  ) {}
}
