import helper from '../meta_helper';
import { ParamAnnotationInfo } from './resolver';

export default function AnnotationFactory<T extends ParamAnnotationInfo>(
  ctr: any,
  methodName: string,
  index: number,
  annotationInfo: T,
) {
  const mvcMeta = helper.getIfNotExisisInit(ctr);
  const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName, ctr);
  methodMeta.paramInfos[index].annotations.push(annotationInfo);
  helper.set(ctr, mvcMeta);
}
