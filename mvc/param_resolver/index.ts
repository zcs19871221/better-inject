import ModelView from '../model_view';
import WebRequest from '../webrequest';
import helper from '../annotation/helper';

interface MethodAnnotationInfo {
  type: 'Method';
}
interface RequestBodyAnnotationInfo {
  type: 'RequestBody';
}
enum KeyValueEnum {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  ModelAttribute,
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
  | MethodAnnotationInfo;
interface ParamInfo {
  type: any;
  name: string;
  annotations: ParamAnnotationInfo[];
}

interface ResolveParamArgs {
  paramInfo: ParamInfo;
  webRequest: WebRequest;
  model: ModelView;
}
abstract class ParamResolverAnnotation {
  protected type: ParamAnnotationInfo['type'];
  constructor(name: ParamAnnotationInfo['type']) {
    this.type = name;
  }

  AnnotationFactory(ctr: any, methodName: string, index: number) {
    const param = helper.getMethodParam(ctr, methodName)[index];
    if (param.type !== String) {
      throw new Error(this.type + '注解参数必须是string类型');
    }
    const mvcMeta = helper.getIfNotExisisInit(ctr, true);
    const methodMeta = helper.getOrInitMethodData(mvcMeta, methodName);
    if (!methodMeta.paramInfos[index]) {
      methodMeta.paramInfos[index] = {
        ...param,
        annotations: [],
      };
    }
    methodMeta.paramInfos[index].annotations.push(this.creatAnnotationInfo());
    helper.set(ctr, mvcMeta);
  }

  abstract creatAnnotationInfo(): ParamAnnotationInfo;
}

export {
  ParamAnnotationInfo,
  ResolveParamArgs,
  KeyValueAnnotaionInfo,
  ParamInfo,
  KeyValueType,
  ParamResolverAnnotation,
};
export default interface ParamResolver {
  resolve(input: ResolveParamArgs): any;
  isSupport(input: ResolveParamArgs): boolean;
}
