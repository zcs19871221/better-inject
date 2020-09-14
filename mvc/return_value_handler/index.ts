import { ResponseBody, responseBodyHandler } from './response_body';
import { returnModelViewTypeHandler } from './return_modelview_type_handler';
import { returnStringTypeHandler } from './return_string_type_handler';
import returnValueHandler from './return_value_handler';

const returnValueHandlers: returnValueHandler[] = [
  responseBodyHandler,
  returnModelViewTypeHandler,
  returnStringTypeHandler,
];
export { ResponseBody, returnValueHandlers };
