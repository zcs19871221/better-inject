import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
  KeyValueAnnotaionInfo,
} from './key_value';
import { ResolveParamArgs, ParamAnnotationInfo, ParamInfo } from './resolver';

export default class PathVariableResolver extends KeyValueParamResolver {
  constructor() {
    super('PathVariable');
  }

  private guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is KeyValueAnnotaionInfo {
    return annotationInfo.type === 'PathVariable';
  }

  getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      throw new Error('CookieValue注解错误');
    }
    return t[0];
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    const req = resolveParamArgs.webRequest.getRequest();
    return req.requestMappingInfo.getPathVariableMap();
  }
}

export const instance = new PathVariableResolver();
export const Annotation = AnnotationFactory('PathVariable');
