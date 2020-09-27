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

  async resolve(resolveParamArgs: ResolveParamArgs) {
    const map = resolveParamArgs.model.getModel();
    const annotationInfo = this.getAnnotationInfo(resolveParamArgs.param);
    if (!annotationInfo) {
      throw new Error('model attribute没有设置key');
    }
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
