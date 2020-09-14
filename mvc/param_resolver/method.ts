import ParamResolver, {
  ResolveParamArgs,
  MethodAnnotationInfo,
  ParamInfo,
  ParamAnnotationInfo,
} from '.';

export default class Method extends ParamResolver<MethodAnnotationInfo> {
  constructor() {
    super([String, Object]);
  }

  Annotation(ctr: any, methodName: string, index: number) {
    return this.AnnotationFactory(ctr, methodName, index, {
      type: 'Method',
    });
  }

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
