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
} from '../../mvc/annotation';
import ModelView from '../../mvc/model_view';
import { DataBinder } from '../../mvc/data_binder';
import { ServerResponse, IncomingMessage } from 'http';
import WebRequest from '../../mvc/webrequest';

class User {
  public userId: string;
  public userName: string;
  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }
}
class XX {}
@RequestMapping({ path: '/{base}' })
@Controller
export default class userController {
  args: any[] = [];
  @Initbinder
  toDate(dataBinder: DataBinder) {
    dataBinder.addConveter({ type: Date }, date => {
      return new Date(Number(date));
    });
  }
  @Initbinder
  toUser(dataBinder: DataBinder) {
    dataBinder.addConveter({ type: User }, (data: any) => {
      return new User(data.userId, data.userName);
    });
  }

  @ModelAttribute('gender')
  initModelGender(): string {
    return '男';
  }

  @ModelAttribute()
  initXX(): XX {
    return new XX();
  }

  @ModelAttribute('age')
  initModelAge(): number {
    return 13;
  }

  @RequestMapping({
    path: '/{name}/{operation}',
  })
  @ResponseBody
  get(
    model: ModelView,
    req: IncomingMessage,
    res: ServerResponse,
    webRequest: WebRequest,
    @ModelAttribute() xx: ModelView,
    @ModelAttribute('gender') genderModel: string,
    @CookieValue() allCookie: Map<any, any>,
    @CookieValue('jsessionid') sessionCookie: string,
    @CookieValue() token: string,
    @PathVariable() allPath: Map<any, any>,
    @PathVariable('operation') pathOperation: string,
    @PathVariable() name: string,
    @RequestParam() allParams: Map<any, any>,
    @RequestParam('time') timeParam: string,
    @RequestParam() time: Date,
    @RequestParam() level: string,
    @Method method: string,
    @RequestHeader() allHeader: Map<any, any>,
    @RequestHeader('content-type') contentTypeHeader: string,
    @RequestHeader() accept: Map<any, any>,
    @RequestBody bodyBuffer: Buffer,
    @RequestBody bodyString: string,
    @RequestBody bodyObject: object,
    @RequestBody bodyUser: User,
  ): string {
    const args = {
      model,
      xx,
      req,
      res,
      webRequest,
      genderModel,
      allCookie,
      sessionCookie,
      token,
      allPath,
      pathOperation,
      name,
      allParams,
      timeParam,
      level,
      method,
      allHeader,
      contentTypeHeader,
      accept,
      time,
      bodyBuffer,
      bodyString,
      bodyObject,
      bodyUser,
    };
    console.log(args);
    return '';
  }

  getArgs() {}
}
