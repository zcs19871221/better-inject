import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
} from './key_value';
import { ResolveParamArgs } from './resolver';

export default class RequestHeaderResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestHeader');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestHeaderMap();
  }
}
export const instance = new RequestHeaderResolver();
export const Annotation = AnnotationFactory('RequestHeader');
