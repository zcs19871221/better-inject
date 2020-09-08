import { helper } from '.';

const RequestBody = (isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  if (!mvcMeta[methodName]) {
    mvcMeta[methodName] = {
      argsResolverInfo: [],
      returnValueResolvers: [],
    };
  }
  mvcMeta[methodName].argsResolverInfo.push({
    type: 'requestBody',
    isRequired,
    index,
  });
};
export default RequestHeader;
