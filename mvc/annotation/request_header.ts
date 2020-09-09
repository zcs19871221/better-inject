import { helper, checkInjectType } from '.';

const key = 'requestHeader';
const RequestHeader = (keyOrAll: string = '', isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  keyOrAll = keyOrAll.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  checkInjectType(ctr, methodName, index, key);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.argsResolverInfo.push({
    type: key,
    key: keyOrAll,
    isRequired,
    index,
    targetType: helper.getMethodParamTypes(ctr, methodName, index),
  });
};
export default RequestHeader;
