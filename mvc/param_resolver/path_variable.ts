import KeyValueParamResolver, { AnnotationFactory } from './key_value';
import { ResolveParamArgs } from '.';

export const Annotation = AnnotationFactory('PathVariable');
export default class CookieValue extends KeyValueParamResolver {
  constructor() {
    super('PathVariable');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    const req = resolveParamArgs.webRequest.getRequest();
    return req.requestMappingInfo.getPathVariableMap();
  }
}
