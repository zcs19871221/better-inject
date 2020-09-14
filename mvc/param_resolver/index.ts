import ModelView from '../model_view';
import WebRequest from '../webrequest';
import helper from '../annotation/helper';

interface MethodAnnotationInfo {
  type: 'Method';
}
interface RequestBodyAnnotationInfo {
  type: 'RequestBody';
}
interface ModelAttributeAnnotationInfo {
  type: 'ModelAttribute';
  modelKey: string;
  isRequired: boolean;
}
enum KeyValueEnum {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
}

type KeyValueType = keyof typeof KeyValueEnum;
interface KeyValueAnnotaionInfo {
  type: KeyValueType;
  key: string;
  isRequired: boolean;
}
type ParamAnnotationInfo =
  | KeyValueAnnotaionInfo
  | RequestBodyAnnotationInfo
  | ModelAttributeAnnotationInfo
  | MethodAnnotationInfo;
interface ParamInfo {
  type: any;
  name: string;
  annotations: ParamAnnotationInfo[];
}

abstract class ParamResolverAnnotation<T extends ParamAnnotationInfo> {
  protected requiredTypes: any[] | null;
  constructor(requiredTypes: any[] | null) {
    this.requiredTypes = requiredTypes;
  }

  AnnotationFactory(
    ctr: any,
    methodName: string,
    index: number,
    annotationInfo: T,
  ) {
    const param = helper.getMethodParam(ctr, methodName)[index];
    if (
      this.requiredTypes !== null &&
      !this.requiredTypes.includes(param.type)
    ) {
      throw new Error(
        annotationInfo.type +
          '注解参数必须是' +
          this.requiredTypes.join(',') +
          '类型',
      );
    }
    const mvcMeta = helper.getIfNotExisisInit(ctr, true);
    const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
    if (!methodMeta.paramInfos[index]) {
      methodMeta.paramInfos[index] = {
        ...param,
        annotations: [],
      };
    }
    methodMeta.paramInfos[index].annotations.push(annotationInfo);
    helper.set(ctr, mvcMeta);
  }

  abstract Annotation(...args: any[]): any;
  abstract resolve(
    resolveParamArgs: ResolveParamArgs,
    annotationInfo: T | null,
  ): any;
  abstract isSupport(paramInfo: ParamInfo): boolean;
  abstract getAnnotationInfo(paramInfo: ParamInfo): T | null;
}
interface ResolveParamArgs {
  param: Omit<ParamInfo, 'annotations'>;
  webRequest: WebRequest;
  model: ModelView;
}
export {
  ParamAnnotationInfo,
  ResolveParamArgs,
  KeyValueAnnotaionInfo,
  ModelAttributeAnnotationInfo,
  RequestBodyAnnotationInfo,
  ParamInfo,
  KeyValueType,
  MethodAnnotationInfo,
};

export default ParamResolverAnnotation;
