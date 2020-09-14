import ParamResolver, {
  ResolveParamArgs,
  ModelAttributeAnnotationInfo,
  ParamInfo,
  ParamAnnotationInfo,
} from './param_resolver';
import helper from '../annotation/helper';

export default class ModelAttributeResolver extends ParamResolver<
  ModelAttributeAnnotationInfo
> {
  constructor() {
    super(null);
  }

  Annotation(modelKey: string = '', isRequired = true) {
    return (ctr: any, methodName: string, index: number) => {
      const returnType = helper.getMethodParamTypes(ctr, methodName)[index];
      if (!modelKey && returnType !== Map) {
        throw new Error('modelAttribute不设置key时，类型必须为Map');
      }
      return this.AnnotationFactory(ctr, methodName, index, {
        modelKey,
        type: 'ModelAttribute',
        isRequired,
      });
    };
  }

  guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is ModelAttributeAnnotationInfo {
    return annotationInfo.type === 'ModelAttribute';
  }

  getAnnotationInfo(paramInfo: ParamInfo): ModelAttributeAnnotationInfo | null {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      return null;
    }
    return t[0];
  }

  resolve(
    resolveParamArgs: ResolveParamArgs,
    annotationInfo: ModelAttributeAnnotationInfo,
  ) {
    const map = resolveParamArgs.model.getModel();
    const modelKey = annotationInfo.modelKey;
    if (modelKey) {
      if (annotationInfo.isRequired && !map.has(modelKey)) {
        throw new Error('model' + modelKey + '不存在');
      }
      return map.get(modelKey);
    }
    return map;
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === 'Method');
  }
}
export const instance = new ModelAttributeResolver();
export const ModelAttribute = instance.Annotation;
