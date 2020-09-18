import Controller from '../controller';
import RequestMapping from '../request_mapping';
import { Initbinder } from '../data_binder';
import { Annotation as ModelAttribute } from '../model_attribute';
import { Annotation } from '../param_resolver';
import { ResponseBody } from '../return_value_handler';

const {
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
} = Annotation;
export {
  Controller,
  Initbinder,
  ModelAttribute,
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
  ResponseBody,
  RequestMapping,
};
