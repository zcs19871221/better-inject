import { IncomingMessage } from 'http';
import RequestKeyValueCondition from './request_key_value_condition';

export default class RequestHeaderCondition extends RequestKeyValueCondition<
  RequestHeaderCondition
> {
  protected createhashCode() {
    return 'headers:' + this.contents.join('&&');
  }

  protected getValue(key: string, req: IncomingMessage) {
    return req.headers[key];
  }
}
