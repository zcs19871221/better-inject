import { isClass, classToId } from '../../annotation/class_utils';
import helper from '../annotation/helper';

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
    mvcMeta.modelIniter.push({
      methodName,
      modelKey: key,
      beanClass: ctr,
    });
  };
};

export default ModelAttribute;
