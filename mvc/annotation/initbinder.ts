import helper from './helper';

const Initbinder = (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr, true);
  mvcMeta.initBinder.push({
    methodName,
  });
};

export default Initbinder;
