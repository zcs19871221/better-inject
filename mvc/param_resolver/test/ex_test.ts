import {
  Controller,
  RequestMapping,
  ModelAttribute,
  CookieValue,
  PathVariable,
  RequestHeader,
  RequestParam,
  RequestBody,
  Method,
} from '../..';
import { ServerResponse, IncomingMessage } from 'http';
import ModelView from '../../model_view';
import WebRequest from '../../webrequest';

@Controller
@RequestMapping({ path: '/{base}' })
export default class paramResolverController {
  public args: any = {};

  @ModelAttribute('name')
  initName(): string {
    return 'zcs';
  }

  @RequestMapping({ path: '/cookie' })
  getCookie(
    @CookieValue() allCookie: Map<any, any>,
    @CookieValue('jsessionid') sessionid: string,
  ): string {
    this.args.cookie = {
      allCookie,
      sessionid,
    };
    return '';
  }

  @RequestMapping({ path: '/{sub}/go{sub2}.html' })
  getPathVariable(
    @PathVariable() allPath: Map<any, any>,
    @PathVariable('base') base: string,
    @PathVariable('sub') sub: string,
    @PathVariable('sub2') sub2: string,
  ): string {
    this.args.pathVariable = {
      allPath,
      base,
      sub,
      sub2,
    };
    return '';
  }

  @RequestMapping({ path: '/requestHeader' })
  getRequestHeader(
    @RequestHeader() allHeader: Map<any, any>,
    @RequestHeader('content-type') contentType: string,
    @RequestHeader('accept') accept: string,
  ): string {
    this.args.requestHeader = {
      allHeader,
      contentType,
      accept,
    };
    return '';
  }

  @RequestMapping({ path: '/requestParam' })
  getRequestParam(
    @RequestParam() allParam: Map<any, any>,
    @RequestParam('name') name: string,
    @RequestParam('name') name2: string,
    @RequestParam('id') id: string,
  ): string {
    this.args.requestParam = {
      name,
      name2,
      id,
      allParam,
    };
    return '';
  }

  @RequestMapping({ path: '/requestMethod' })
  getRequestMethod(@Method method: string): string {
    this.args.requestMethod = method;
    return '';
  }

  @RequestMapping({ path: '/requestBody', contentType: 'application/json' })
  getRequestBody(
    @RequestBody bodyBuffer: Buffer,
    @RequestBody bodyBuffer2: Buffer,
    @RequestBody body: Object,
  ): string {
    this.args.body = {
      bodyBuffer,
      bodyBuffer2,
      body,
    };
    return '';
  }

  @RequestMapping({
    path: '/requestBody',
    contentType: 'application/x-www-form-urlencoded',
  })
  getRequestBodyUrlEncoded(@RequestBody body: Object): string {
    this.args.bodyEncoded = body;
    return '';
  }

  @RequestMapping({
    path: '/requestBodyGbk',
  })
  getRequestBodyAndCharSetDecode(@RequestBody body: string): string {
    this.args.decodeGbk = body;
    return '';
  }

  @RequestMapping({
    path: '/typeParam',
  })
  typeParam(
    req: IncomingMessage,
    res: ServerResponse,
    wr: WebRequest,
    modelView: ModelView,
  ): string {
    this.args.typeParam = {
      req,
      res,
      wr,
      modelView,
    };
    return '';
  }
}
