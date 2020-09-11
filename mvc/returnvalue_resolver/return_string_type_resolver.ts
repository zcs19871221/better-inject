import { ServerResponse } from 'http';
import ModelView from 'mvc/model_view';

class ReturnStringTypeResolver {
  resolve(
    returnValue: string,
    req: IncomingMessage,
    res: ServerResponse,
    model: ModelView,
  ) {
    model.setView(returnValue);
  }
}
