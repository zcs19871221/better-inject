import HandlerMethod from './handler_method';
import Factory from '../factory';
import {
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
} from './annotation';

@Controller
class userController {
  @Initbinder
  toDate() {}

  @ModelAttribute()
  initModel() {}

  @RequestMapping()
  @ResponseBody
  get(
    @CookieValue() cookie: string,
    @PathVariable() name: string,
    @RequestParam() id: string,
    @Method method: string,
    @RequestHeader() header: Map<any, any>,
    @RequestBody
    body: Buffer,
  ) {}
}
