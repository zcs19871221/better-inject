import { isClass, classToId } from '../../annotation/class_utils';
import helper from '../annotation/meta_helper';
import ModelMetaInfo from './metainfo';

const ModelAttribute = (key: string) => {
  key = key.trim();
  return (ctr: any, methodName: string) => {
    const mvcMeta = helper.getIfNotExisisInit(ctr);
    const returnType = helper.getMethodReturnType(ctr, methodName);
    if (returnType === undefined && key) {
      throw new Error('modelAttribute设置key了必须设置返回值');
    }
    if (!key && isClass(returnType)) {
      key = classToId(returnType);
    }
    helper.getOrInitMethodData(mvcMeta, methodName, ctr);
    const info: ModelMetaInfo = {
      methodName,
      modelKey: key,
      beanClass: ctr,
    };
    mvcMeta.modelIniter.push(info);
    helper.set(ctr, mvcMeta);
  };
};

export default ModelAttribute;
