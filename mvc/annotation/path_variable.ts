import { helper, checkInjectType } from '.';

const key = 'pathVariable';
const PathVariable = (name: string = '') => (
  ctr: any,
  methodName: string,
  index: number,
) => {
  name = name.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  checkInjectType(ctr, methodName, index, key);
  if (!mvcMeta.methods[methodName]) {
    mvcMeta.methods[methodName] = {
      argsResolverInfo: [],
      returnValueResolvers: [],
    };
  }
  mvcMeta.methods[methodName].argsResolverInfo.push({
    type: key,
    pathVariableName: name,
    index,
  });
};

const handleArgs = (req, res, model, converter) => {
  args = args;
  if (converter) {
  }
};
export default PathVariable;
