import { helper } from '.';

const Method = (ctr: any, methodName: string, index: number) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  if (!mvcMeta.methods[methodName]) {
    mvcMeta.methods[methodName] = {
      argsResolverInfo: [],
      returnValueResolvers: [],
    };
  }
  mvcMeta.methods[methodName].argsResolverInfo.push({
    type: 'httpMethod',
    index,
  });
};
export default Method;
