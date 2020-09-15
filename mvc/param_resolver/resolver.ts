import ModelView from '../model_view';
import WebRequest from '../webrequest';
import helper from '../meta_helper';

enum ParamAnnotationEnum {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  ModelAttribute,
  Method,
  TypeAnnotation,
}

interface ParamAnnotationInfo {
  type: keyof typeof ParamAnnotationEnum;
}

interface ParamInfo {
  type: any;
  name: string;
  annotations: ParamAnnotationInfo[];
}

interface ParamResolver<T extends ParamAnnotationInfo> {
  resolve(resolveParamArgs: ResolveParamArgs, annotationInfo: T | null): any;
  isSupport(paramInfo: ParamInfo): boolean;
  getAnnotationInfo(paramInfo: ParamInfo): T | null;
}

interface ResolveParamArgs {
  param: Omit<ParamInfo, 'annotations'>;
  webRequest: WebRequest;
  model: ModelView;
}

function AnnotationFactory<T extends ParamAnnotationInfo>(
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

export { ParamAnnotationInfo, ResolveParamArgs, ParamInfo, AnnotationFactory };

export default ParamResolver;
