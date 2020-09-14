import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from '.';

export default class RequestHeader extends KeyValueParamResolver {
  constructor() {
    super('RequestHeader');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestHeaderMap();
  }
}
