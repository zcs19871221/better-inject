import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
} from './key_value';
import { ResolveParamArgs } from './resolver';

export default class PathVariableResolver extends KeyValueParamResolver {
  constructor() {
    super('PathVariable');
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    const req = resolveParamArgs.webRequest.getRequest();
    return req.requestMappingInfo.getPathVariableMap();
  }
}

export const instance = new PathVariableResolver();
export const Annotation = AnnotationFactory('PathVariable');
