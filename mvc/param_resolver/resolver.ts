import ModelView from '../model_view';
import WebRequest from '../webrequest';
import { DataBinder } from '../data_binder';

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
  resolve(resolveParamArgs: ResolveParamArgs): Promise<any>;
  isSupport(paramInfo: ParamInfo): boolean;
  getAnnotationInfo(paramInfo: ParamInfo): T | null;
}

interface ResolveParamArgs {
  param: ParamInfo;
  webRequest: WebRequest;
  model: ModelView;
  dataBinder: DataBinder;
}

export { ParamAnnotationInfo, ResolveParamArgs, ParamInfo };

export default ParamResolver;
