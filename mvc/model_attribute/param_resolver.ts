import ParamResolver, {
  ResolveParamArgs,
  ParamInfo,
  ParamAnnotationInfo,
} from '../param_resolver/resolver';
import ModelAttributeAnnotationInfo from './info';

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
