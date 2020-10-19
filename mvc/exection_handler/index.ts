import helper from '../meta_helper';

const Annotation = (errorMsgMatcher: RegExp) => (
  ctr: any,
  methodName: string,
) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  mvcMeta.execptionHandlerInfo.push({
    methodName,
    beanClass: ctr.constructor,
    errorMsgMatcher,
  });
  helper.set(ctr, mvcMeta);
};
export default Annotation;
