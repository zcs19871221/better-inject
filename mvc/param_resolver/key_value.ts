import ParamResolver, {
  ResolveParamArgs,
  KeyValueType,
  KeyValueAnnotaionInfo,
  ParamAnnotationInfo,
  ParamInfo,
} from './param_resolver';

export default abstract class KeyValue extends ParamResolver<
  KeyValueAnnotaionInfo
> {
  private type: KeyValueType;
  constructor(type: KeyValueType) {
    super([String, Map, Object]);
    this.type = type;
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === this.type);
  }

  Annotation(key: string = '', isRequired = true) {
    return (ctr: any, methodName: string, index: number) => {
      const info = {
        type: this.type,
        isRequired,
        key,
      };
      return this.AnnotationFactory(ctr, methodName, index, info);
    };
  }

  private guard(
    annotationInfo: ParamAnnotationInfo,
  ): annotationInfo is KeyValueAnnotaionInfo {
    return annotationInfo.type === 'ModelAttribute';
  }

  getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo | null {
    const t = paramInfo.annotations.filter(this.guard);
    if (t.length === 0) {
      return null;
    }
    return t[0];
  }

  resolve(
    resolveParamArgs: ResolveParamArgs,
    annotationInfo: KeyValueAnnotaionInfo,
  ): any {
    const map = this.getMap(resolveParamArgs);
    const key = annotationInfo.key.trim();
    if (key) {
      if (annotationInfo.isRequired && !map.has(key)) {
        throw new Error(this.type + '的键' + key + '对应值不存在');
      }
      return map.get(key);
    }
    return map;
  }

  protected abstract getMap(
    resolveParamArgs: ResolveParamArgs,
  ): Map<string, string | string[]>;
}
