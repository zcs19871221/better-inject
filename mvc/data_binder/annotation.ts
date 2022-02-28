import helper from '../meta_helper';
import BinderInfo from './binder_info';

const Initbinder = (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const bindInfo: BinderInfo = {
    methodName,
    beanClass: ctr.constructor,
  };
  mvcMeta.initBinder.push(bindInfo);
  helper.set(ctr, mvcMeta);
};

export default Initbinder;
