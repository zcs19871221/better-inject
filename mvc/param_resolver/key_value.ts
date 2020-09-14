import ParamResolver, { ResolveParamArgs, KeyValueType } from '.';
import helper from '../annotation/helper';

export const AnnotationFactory = (type: KeyValueType) => {
  return (key: string = '', isRequired = true) => {
    return (ctr: any, methodName: string, index: number) => {
      const param = helper.getMethodParam(ctr, methodName)[index];
      if (![String, Map, Object].includes(param.type)) {
        throw new Error(
          `${type}不支持注入类型${param.type},只支持String Map Object`,
        );
      }
      const mvcMeta = helper.getIfNotExisisInit(ctr, true);
      const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
      if (!methodMeta.paramInfos[index]) {
        methodMeta.paramInfos[index] = {
          ...param,
          annotations: [],
        };
      }
      methodMeta.paramInfos[index].annotations.push({
        type,
        isRequired,
        key,
      });
      helper.set(ctr, mvcMeta);
    };
  };
};

export default abstract class KeyValue implements ParamResolver {
  private type: KeyValueType;
  constructor(type: KeyValueType) {
    this.type = type;
  }
  isSupport(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.paramInfo.annotations.some(
      e => e.type === this.type,
    );
  }

  resolve(resolveParamArgs: ResolveParamArgs): any {
    const map = this.getMap(resolveParamArgs);
    for (const each of resolveParamArgs.paramInfo.annotations) {
      if (each.type === this.type) {
        const key = each.key.trim();
        if (key) {
          if (each.isRequired && !map.has(key)) {
            throw new Error(this.type + '的键' + key + '对应值不存在');
          }
          return map.get(key);
        }
        return map;
      }
    }
    throw new Error(this.type + '错误');
  }

  abstract getMap(
    resolveParamArgs: ResolveParamArgs,
  ): Map<string, string | string[]>;
}
