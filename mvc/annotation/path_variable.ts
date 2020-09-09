import { helper, checkInjectType } from '.';

const key = 'pathVariable';
const PathVariable = (name: string = '', isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  name = name.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  checkInjectType(ctr, methodName, index, key);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.argsResolverInfo.push({
    type: key,
    key: name,
    index,
    isRequired,
    targetType: helper.getMethodParamTypes(ctr, methodName, index),
  });
};

export default PathVariable;
