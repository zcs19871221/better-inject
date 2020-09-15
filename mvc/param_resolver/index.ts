import CookieValueResolver from './cookie_value';
import MethodResolver from './method';
import PathVariableResolver from './path_variable';
import RequestBodyResolver from './request_body';
import RequestHeaderResolver from './request_header';
import RequestParamResolver from './request_param';
import ParamTypeResolver from './resolve_by_type';
import ModelAttributeResolver from '../model_attribute';
import ParamResolver, { ParamAnnotationInfo } from './resolver';

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

export { paramResolvers };
