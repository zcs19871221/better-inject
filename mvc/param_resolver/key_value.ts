import ParamResolver, {
  ResolveParamArgs,
  ParamAnnotationInfo,
  ParamInfo,
} from './resolver';
import AnnotationFactory from './annotation_factory';
import helper from '../annotation/meta_helper';
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
    let targetKey = key;
    const param = helper.getMethodParam(ctr, methodName)[index];
    if (param.type === Map && key !== '') {
      throw new Error(type + '注解:Map类型不能传具体key');
    }
    if (param.type === String && key === '') {
      targetKey = param.name;
    }
    return AnnotationFactory<KeyValueAnnotaionInfo>([String, Map, Object])(
      ctr,
      methodName,
      index,
      {
        type,
        isRequired,
        key: targetKey,
      },
    );
  };
};
