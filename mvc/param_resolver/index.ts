import CookieValueResolver, { Annotation as CookieValue } from './cookie_value';
import MethodResolver, { Annotation as Method } from './method';
import PathVariableResolver, {
  Annotation as PathVariable,
} from './path_variable';
import RequestBodyResolver, { Annotation as RequestBody } from './request_body';
import RequestHeaderResolver, {
  Annotation as RequestHeader,
} from './request_header';
import RequestParamResolver, {
  Annotation as RequestParam,
} from './request_param';
import ParamTypeResolver from './resolve_by_type';
import ModelAttributeResolver from '../model_attribute';
import ParamResolver, {
  ParamAnnotationInfo,
  ParamInfo,
  ResolveParamArgs,
} from './resolver';

const paramResolvers: ParamResolver<ParamAnnotationInfo>[] = [
  new RequestBodyResolver(),
  new CookieValueResolver(),
  new MethodResolver(),
  new ModelAttributeResolver(),
  new RequestParamResolver(),
  new PathVariableResolver(),
  new RequestHeaderResolver(),
  new ParamTypeResolver(),
];
const Annotation = {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
};
export default paramResolvers;
export {
  Annotation,
  ParamResolver,
  ParamAnnotationInfo,
  ParamInfo,
  ResolveParamArgs,
};
