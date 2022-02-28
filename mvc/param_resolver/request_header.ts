import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
  KeyValueAnnotaionInfo,
} from './key_value';
import { ResolveParamArgs, ParamAnnotationInfo, ParamInfo } from './resolver';

export default class RequestHeaderResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestHeader');
  }

  private guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is KeyValueAnnotaionInfo {
    return annotationInfo.type === 'RequestHeader';
  }

  getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      throw new Error('CookieValue注解错误');
    }
    return t[0];
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestHeaderMap();
  }
}
export const instance = new RequestHeaderResolver();
export const Annotation = AnnotationFactory('RequestHeader');
