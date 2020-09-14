import ParamResolver, { ResolveParamArgs } from '.';
import helper from '../annotation/helper';

class Method implements ParamResolver {
  resolve(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.webRequest.getRequestMethod();
  }

  isSupport(resolveParamArgs: ResolveParamArgs) {
    return resolveParamArgs.paramInfo.annotations.some(
      e => e.type === 'Method',
    );
  }
}

export const Annotation = (ctr: any, methodName: string, index: number) => {
  const param = helper.getMethodParam(ctr, methodName)[index];
  if (param.type !== String) {
    throw new Error('Method注解参数必须是string类型');
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
    type: 'Method',
  });
  helper.set(ctr, mvcMeta);
};

export default Method;
