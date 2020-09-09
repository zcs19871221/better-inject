import { helper } from '.';

const RequestBody = (isRequired = true) => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
  methodMeta.argsResolverInfo.push({
    type: 'requestBody',
    isRequired,
    index,
    targetType: helper.getMethodParamTypes(ctr, methodName, index),
  });
};
export default RequestBody;
