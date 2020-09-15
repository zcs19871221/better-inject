import helper from '../annotation/meta_helper';
import { ParamAnnotationInfo } from './resolver';

export default function AnnotationFactory<T extends ParamAnnotationInfo>(
  requiredTypes: any[],
) {
  return (ctr: any, methodName: string, index: number, annotationInfo: T) => {
    const param = helper.getMethodParam(ctr, methodName)[index];
    if (requiredTypes !== null && !requiredTypes.includes(param.type)) {
      throw new Error(
        annotationInfo.type +
          '注解参数必须是' +
          requiredTypes.join(',') +
          '类型',
      );
    }
    const mvcMeta = helper.getIfNotExisisInit(ctr.constructor);
    const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
    methodMeta.paramInfos[index].annotations.push(annotationInfo);
    helper.set(ctr.constructor, mvcMeta);
  };
}
