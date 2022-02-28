import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

enum HTTP_METHOD {
  'GET',
  'POST',
  'HEAD',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH',
}
export type METHOD = keyof typeof HTTP_METHOD;
export default class RequestMethodCondition extends RequestCondition<
  METHOD,
  RequestMethodCondition
> {
  constructor(methods: METHOD[]) {
    super([...new Set(methods)]);
  }

  protected createhashCode() {
    return 'method:' + this.contents.join('||');
  }

  doGetMatchingCondition(req: IncomingMessage) {
    return this.contents.filter(method => method === req.method);
  }

  doCombine(other: RequestMethodCondition) {
    return this.contents.concat(other.contents);
  }

  doCompareTo(other: RequestMethodCondition) {
    return other.contents.length - this.contents.length;
  }
}
