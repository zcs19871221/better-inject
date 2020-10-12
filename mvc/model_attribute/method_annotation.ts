import { isClass, classToId } from '../../annotation/class_utils';
import helper from '../meta_helper';
import ModelMetaInfo from './metainfo';

const ModelAttribute = (key: string, ctr: any, methodName: string) => {
  key = key.trim();
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const returnType = helper.getMethodReturnType(ctr, methodName);
  if (returnType === undefined && key) {
    throw new Error('modelAttribute设置key了返回值类型不能是void');
  }
  if (!key && isClass(returnType)) {
    key = classToId(returnType);
  }
  const info: ModelMetaInfo = {
    methodName,
    modelKey: key,
    beanClass: ctr.constructor,
  };
  mvcMeta.modelIniter.push(info);
  helper.set(ctr, mvcMeta);
};

export default ModelAttribute;
