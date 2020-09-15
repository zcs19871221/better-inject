import helper from '../annotation/meta_helper';
import BinderInfo from './binder_info';

const Initbinder = (ctr: any, methodName: string) => {
  const mvcMeta = helper.getIfNotExisisInit(ctr.constructor);
  const bindInfo: BinderInfo = {
    methodName,
    beanClass: ctr.constructor,
  };
  mvcMeta.initBinder.push(bindInfo);
  helper.set(ctr.constructor, mvcMeta);
};

export default Initbinder;
