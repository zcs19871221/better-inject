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
export interface KeyValueAnnotaionInfo extends ParamAnnotationInfo {
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

  abstract getAnnotationInfo(paramInfo: ParamInfo): KeyValueAnnotaionInfo;

  resolve(resolveParamArgs: ResolveParamArgs): any {
    const map = this.getMap(resolveParamArgs);
    const annotationInfo = this.getAnnotationInfo(resolveParamArgs.param);
    const key = annotationInfo.key.trim();
    if (key) {
      if (annotationInfo.isRequired && !map.has(key)) {
        throw new Error(this.type + '的键' + key + '对应值不存在');
      }
      const type = resolveParamArgs.param.type;
      const value = map.get(key);
      if (type === String) {
        return String(value);
      }
      if (type === Boolean) {
        return Boolean(value);
      }
      if (type === Number) {
        return Number(value);
      }
      if (type === Array) {
        if (Array.isArray(value)) {
          return value;
        }
        return [value];
      }
      return resolveParamArgs.dataBinder.convert(
        map.get(key),
        resolveParamArgs.param,
      );
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
    return AnnotationFactory<KeyValueAnnotaionInfo>(ctr, methodName, index, {
      type,
      isRequired,
      key: targetKey,
    });
  };
};
