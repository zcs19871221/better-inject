import { ResponseBody, responseBodyHandler } from './response_body';
import { returnModelViewTypeHandler } from './return_modelview_type_handler';
import { returnStringTypeHandler } from './return_string_type_handler';
import ReturnValueHandler from './return_value_handler';

const returnValueHandlers: ReturnValueHandler[] = [
  responseBodyHandler,
  returnModelViewTypeHandler,
  returnStringTypeHandler,
];
export default returnValueHandlers;
export { ResponseBody, ReturnValueHandler };
