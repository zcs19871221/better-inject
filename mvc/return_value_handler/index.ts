import { ResponseBody, responseBodyHandler } from './response_body';
import { ResponseHeader, responseHeaderHandler } from './response_header';
import { responseStatusHandler, ResponseStatus } from './response_status';
import { returnModelViewTypeHandler } from './return_modelview_type_handler';
import { returnStringTypeHandler } from './return_string_type_handler';
import ReturnValueHandler from './return_value_handler';

const returnValueHandlers: ReturnValueHandler[] = [
  responseStatusHandler,
  responseHeaderHandler,
  responseBodyHandler,
  returnModelViewTypeHandler,
  returnStringTypeHandler,
];
export default returnValueHandlers;
export { ResponseBody, ReturnValueHandler, ResponseStatus, ResponseHeader };
