import ParamResolver, {
  ResolveParamArgs,
  // MethodAnnotationInfo,
  ParamInfo,
  ParamAnnotationInfo,
} from './resolver';
import AnnotationFactory from './annotation_factory';

interface MethodAnnotationInfo extends ParamAnnotationInfo {
  type: 'Method';
}
export default class MethodParamResolver
  implements ParamResolver<MethodAnnotationInfo> {
  isMethod(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is MethodAnnotationInfo {
    return annotationInfo.type === 'Method';
  }
  getAnnotationInfo(paramInfo: ParamInfo): MethodAnnotationInfo | null {
    const t = paramInfo.annotations.filter(this.isMethod);
    if (t.length === 0) {
      return null;
    }
    return t[0];
  }

  resolve(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestMethod();
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === 'Method');
  }
}

export const Annotation = (ctr: any, methodName: string, index: number) =>
  AnnotationFactory<MethodAnnotationInfo>(ctr, methodName, index, {
    type: 'Method',
  });
