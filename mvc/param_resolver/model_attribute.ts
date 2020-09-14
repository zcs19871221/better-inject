import KeyValueParamResolver, { AnnotationFactory } from './key_value';
import { ResolveParamArgs } from '.';

export const Annotation = AnnotationFactory('ModelAttribute');
export default class CookieValue extends KeyValueParamResolver {
  constructor() {
    super('ModelAttribute');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
