/// <reference path="./index.d.ts" />
import { IncomingMessage } from 'http';
import RequestKeyValueCondition from './request_key_value_condition';

export default class RequestParamCondition extends RequestKeyValueCondition {
  protected getValue(key: string, req: IncomingMessage) {
    return req.params[key];
  }
}
