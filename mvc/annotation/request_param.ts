import { helper, checkInjectType } from '.';

const key = 'requestParam';
const RequestParam = (name: string, isRequired = true) => (
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
    isRequired,
    index,
    targetType: helper.getMethodParamTypes(ctr, methodName, index),
  });
};
export default RequestParam;
