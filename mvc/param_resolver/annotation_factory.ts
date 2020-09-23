import helper from '../annotation/meta_helper';
import { ParamAnnotationInfo } from './resolver';

export default function AnnotationFactory<T extends ParamAnnotationInfo>(
  ctr: any,
  methodName: string,
  index: number,
  annotationInfo: T,
  requiredTypes?: any[],
) {
  if (requiredTypes !== undefined) {
    const param = helper.getMethodParam(ctr, methodName)[index];
    if (!requiredTypes.includes(param.type)) {
      throw new Error(
        annotationInfo.type +
          '注解参数必须是' +
          requiredTypes.join(',') +
          '类型',
      );
    }
  }
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
  methodMeta.paramInfos[index].annotations.push(annotationInfo);
  helper.set(ctr, mvcMeta);
}
