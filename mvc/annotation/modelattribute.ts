import { helper, MvcMeta } from '.';

const handleMethod = (mvcData: MvcMeta, methodName: string, name: string) => {
  mvcData.modelIniter.push({
    methodName,
    modelKey: name,
  });
};
const handleParam = (
  mvcData: MvcMeta,
  ctr: any,
  methodName: string,
  index: number,
  name: string,
  isRequired: boolean,
) => {
  const methodData = helper.getOrInitMethodData(mvcData, methodName);
  methodData.argsResolverInfo.push({
    type: 'model',
    index,
    key: name,
    targetType: helper.getMethodParamTypes(ctr, methodName, index),
    isRequired,
  });
};
const ModelAttribute = (name: string = '', isRequired = true) => (
  ctr: any,
  methodName: string,
  index?: number,
) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  if (index === undefined) {
    handleMethod(mvcMeta, methodName, name);
  } else {
    handleParam(mvcMeta, ctr, methodName, index, name, isRequired);
  }
};

export default ModelAttribute;
