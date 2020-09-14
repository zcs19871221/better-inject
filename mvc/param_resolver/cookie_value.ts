import KeyValueParamResolver, { AnnotationFactory } from './key_value';
import { ResolveParamArgs } from '.';

export const Annotation = AnnotationFactory('CookieValue');
export default class CookieValue extends KeyValueParamResolver {
  constructor() {
    super('CookieValue');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
