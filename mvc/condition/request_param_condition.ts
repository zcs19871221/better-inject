import { IncomingMessage } from 'http';
import RequestKeyValueCondition from './request_key_value_condition';

export default class RequestParamCondition extends RequestKeyValueCondition<
  RequestParamCondition
> {
  protected createhashCode() {
    return 'param:' + this.contents.join('&&');
  }

  protected getValue(key: string, req: IncomingMessage) {
    return req.params[key];
  }
}
