import ModelView from '../model_view';
import WebRequest from '../webrequest';

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

export { ParamAnnotationInfo, ResolveParamArgs, ParamInfo };

export default ParamResolver;
