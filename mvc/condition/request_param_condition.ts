import { IncomingMessage } from 'http';
import RequestKeyValueCondition from './request_key_value_condition';

export default class RequestParamCondition extends RequestKeyValueCondition {
  protected extracObject(req: IncomingMessage) {}
}
