import KeyValueParamResolver from './key_value';
import { ResolveParamArgs } from './param_resolver';

export default class CookieValueResolver extends KeyValueParamResolver {
  constructor() {
    super('CookieValue');
  }

  protected getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
export const instance = new CookieValueResolver();
export const CookieValue = instance.Annotation;
