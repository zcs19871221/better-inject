import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from '.';

export default class CookieValue extends KeyValueParamResolver {
  constructor() {
    super('CookieValue');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
