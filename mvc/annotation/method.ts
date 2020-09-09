import { helper } from '.';

const Method = (ctr: any, methodName: string, index: number) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  const methodData = helper.getOrInitMethodData(mvcMeta, methodName);
  methodData.argsResolverInfo.push({
    type: 'httpMethod',
    index,
  });
};
export default Method;
