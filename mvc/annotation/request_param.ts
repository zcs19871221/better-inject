import { helper, checkInjectType } from '.';

const key = 'requestParam';
const RequestParam = (name: string, isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  name = name.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const type = checkInjectType(ctr, methodName, index, key);
  if (!mvcMeta[methodName]) {
    mvcMeta[methodName] = {
      argsResolverInfo: [],
      returnValueResolvers: [],
    };
  }
  mvcMeta[methodName].argsResolverInfo.push({
    type: key,
    requestParamName: name,
    isRequired,
    index,
    isConvertToArray: type === 'array',
  });
};
export default RequestParam;
