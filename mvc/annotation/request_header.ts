import { helper, checkInjectType } from '.';

const key = 'requestHeader';
const RequestHeader = (keyOrAll: string = '', isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  keyOrAll = keyOrAll.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  checkInjectType(ctr, methodName, index, key);
  if (!mvcMeta[methodName]) {
    mvcMeta[methodName] = {
      argsResolverInfo: [],
      returnValueResolvers: [],
    };
  }
  mvcMeta[methodName].argsResolverInfo.push({
    type: key,
    headerKey: keyOrAll,
    isRequired,
    index,
  });
};
export default RequestHeader;
