import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from './param_resolver';

export default class RequestHeaderResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestHeader');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestHeaderMap();
  }
}
export const instance = new RequestHeaderResolver();
export const RequestHeader = instance.Annotation;
