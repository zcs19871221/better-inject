import KeyValueParamResolver, {
  Annotation as AnnotationFactory,
  KeyValueAnnotaionInfo,
} from './key_value';
import { ResolveParamArgs, ParamAnnotationInfo, ParamInfo } from './resolver';

export default class CookieValueResolver extends KeyValueParamResolver {
  constructor() {
    super('CookieValue');
  }

  private guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is KeyValueAnnotaionInfo {
    return annotationInfo.type === 'CookieValue';
  }

  getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      throw new Error('CookieValue注解错误');
    }
    return t[0];
  }

  protected getMap(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestCookie();
  }
}
export const Annotation = AnnotationFactory('CookieValue');
