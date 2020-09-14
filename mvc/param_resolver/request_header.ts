import KeyValueParamResolver, { AnnotationFactory } from './key_value';
import { ResolveParamArgs } from '.';

export const Annotation = AnnotationFactory('RequestHeader');
export default class RequestHeader extends KeyValueParamResolver {
  constructor() {
    super('RequestHeader');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestHeaderMap();
  }
}
