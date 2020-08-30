import { IncomingMessage } from 'http';
import RequestCondition from './request_condition';

export default class RequestParamCondition extends RequestCondition {
  private params: ParamExpression;
  constructor(params: string | ParamExpression) {
    super();
    this.params = typeof each === 'string' : new ParamExpression(each) : each;
  }

  isEmpty() {
    return this.params.length > 0;
  }

  getContent() {
    return this.params;
  }

  getMatchingCondition(req: IncomingMessage) {
    if (this.isEmpty()) {
      return this;
    }
    const matched = this.params.every(method => method === req.method)
    if (matched) {
      return new RequestParamCondition(matched);
    }
    return null;
  }

  combine(other: RequestParamCondition) {
    return new RequestParamCondition(this.params.concat(other.params));
  }

  compareTo(other: RequestParamCondition) {
    const compare = other.params.length - this.params.length;
    if (compare !== 0) {
      return compare;
    }
    return this.params.compareTo(other)
  }
}
