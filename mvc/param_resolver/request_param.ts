import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
  KeyValueAnnotaionInfo,
} from './key_value';
import { ResolveParamArgs, ParamAnnotationInfo, ParamInfo } from './resolver';

export default class RequestParamResolver extends KeyValueParamResolver {
  constructor() {
    super('RequestParam');
  }

  private guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is KeyValueAnnotaionInfo {
    return annotationInfo.type === 'RequestParam';
  }

  getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      throw new Error('CookieValue注解错误');
    }
    return t[0];
  }

  getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestParamMap();
  }
}

export const instance = new RequestParamResolver();
export const Annotation = AnnotationFactory('RequestParam');
