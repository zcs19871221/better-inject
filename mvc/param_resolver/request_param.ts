import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from './param_resolver';

export default class RequestParamResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestParam');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestParamMap();
  }
}

export const instance = new RequestParamResolver();
export const RequestParam = instance.Annotation;
