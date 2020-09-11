import helper from './helper';

const Initbinder = (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  mvcMeta.initBinder.push({
    methodName,
    beanClass: ctr.constructor,
  });
  helper.set(ctr, mvcMeta);
};

export default Initbinder;
