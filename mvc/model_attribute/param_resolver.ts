import {
  ParamResolver,
  ResolveParamArgs,
  ParamInfo,
  ParamAnnotationInfo,
} from '../param_resolver';
import ModelAttributeAnnotationInfo from './annotationinfo';

export default class ModelAttributeResolver
  implements ParamResolver<ModelAttributeAnnotationInfo> {
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
    if (annotationInfo.isRequired && !map.has(modelKey)) {
      throw new Error('model' + modelKey + '不存在');
    }
    return map.get(modelKey);
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === 'ModelAttribute');
  }
}
