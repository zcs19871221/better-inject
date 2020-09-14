import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from '.';

export default class CookieValue extends KeyValueParamResolver {
  constructor() {
    super('PathVariable');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    const req = resolveParamArgs.webRequest.getRequest();
    return req.requestMappingInfo.getPathVariableMap();
  }
}
