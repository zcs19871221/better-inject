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
type METHOD = keyof typeof HTTP_METHOD;
export default class RequestMethodCondition extends RequestCondition {
  private methods: METHOD[];
  constructor(methods: METHOD[]) {
    super();
    this.methods = [...new Set(methods)];
  }

  isEmpty() {
    return this.methods.length > 0;
  }

  getContent() {
    return this.methods;
  }

  getMatchingCondition(req: IncomingMessage) {
    if (this.isEmpty()) {
      return this;
    }
    return new RequestMethodCondition(
      this.methods.filter(method => method === req.method),
    );
  }

  combine(other: RequestMethodCondition) {
    return new RequestMethodCondition(this.methods.concat(other.methods));
  }

  compareTo(other: RequestMethodCondition) {
    return other.methods.length - this.methods.length;
  }
}
