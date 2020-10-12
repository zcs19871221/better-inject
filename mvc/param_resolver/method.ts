import ParamResolver, {
  ResolveParamArgs,
  ParamInfo,
  ParamAnnotationInfo,
} from './resolver';
import helper from '../meta_helper';
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

  async resolve(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestMethod();
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === 'Method');
  }
}

export const Annotation = (ctr: any, methodName: string, index: number) => {
  const param = helper.getMethodParam(ctr, methodName)[index];
  if (param.type !== String) {
    throw new Error('Method注解目标类型必须是string');
  }
  return AnnotationFactory<MethodAnnotationInfo>(ctr, methodName, index, {
    type: 'Method',
  });
};
