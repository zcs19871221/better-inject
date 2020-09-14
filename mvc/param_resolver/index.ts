import { CookieValue, instance as cookieValueResolver } from './cookie_value';
import { Method, instance as methodResolver } from './method';
import {
  ModelAttribute,
  instance as modelAttributeResolver,
} from './model_attribute';
import {
  PathVariable,
  instance as pathVariableResolver,
} from './path_variable';
import { RequestBody, instance as requestBodyResolver } from './request_body';
import {
  RequestHeader,
  instance as requestHeaderResolver,
} from './request_header';
import {
  RequestParam,
  instance as requestParamResolver,
} from './request_param';
import { instance as paramTypeResolver } from './resolve_by_type';
import ParamResolver, { ParamAnnotationInfo } from './param_resolver';

const paramResolvers: ParamResolver<ParamAnnotationInfo>[] = [
  cookieValueResolver,
  methodResolver,
  modelAttributeResolver,
  pathVariableResolver,
  requestBodyResolver,
  requestHeaderResolver,
  requestParamResolver,
  paramTypeResolver,
];

export {
  paramResolvers,
  CookieValue,
  Method,
  RequestParam,
  RequestHeader,
  RequestBody,
  ModelAttribute,
  PathVariable,
};
