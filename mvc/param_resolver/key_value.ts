import ParamResolver, {
  ResolveParamArgs,
  // KeyValueType,
  // KeyValueAnnotaionInfo,
  ParamAnnotationInfo,
  AnnotationFactory,
  ParamInfo,
} from './resolver';

enum KeyValueEnum {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
}

type KeyValueType = keyof typeof KeyValueEnum;
interface KeyValueAnnotaionInfo extends ParamAnnotationInfo {
  type: KeyValueType;
  key: string;
  isRequired: boolean;
}

export default abstract class KeyValue
  implements ParamResolver<KeyValueAnnotaionInfo> {
  private type: KeyValueType;
  constructor(type: KeyValueType) {
    this.type = type;
  }

  isSupport(paramInfo: ParamInfo) {
    return paramInfo.annotations.some(e => e.type === this.type);
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

export const Annotation = (type: KeyValueType) => (
  key: string = '',
  isRequired = true,
) => {
  return (ctr: any, methodName: string, index: number) => {
    const info = {
      type,
      isRequired,
      key,
    };
    return AnnotationFactory<KeyValueAnnotaionInfo>([String, Map, Object])(
      ctr,
      methodName,
      index,
      info,
    );
  };
};
