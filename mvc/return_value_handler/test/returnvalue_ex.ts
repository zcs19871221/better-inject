import {
  Controller,
  RequestMapping,
  ResponseBody,
  ResponseHeader,
  ResponseStatus,
} from '../..';
export class User {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
@Controller
export default class returnValueHandlerController {
  public args: any = {};

  @RequestMapping({
    path: '/responseJson',
    contentType: 'application/json',
  })
  @ResponseBody
  responseJson(): User {
    return new User('zcs');
  }

  @RequestMapping({
    path: '/responseBuffer',
  })
  @ResponseBody
  responseBuffer(): Buffer {
    return Buffer.from('a buffer');
  }
  @RequestMapping({
    path: '/responseString',
  })
  @ResponseBody
  responseString(): string {
    return 'a string';
  }

  @RequestMapping({
    path: '/responseHeader',
  })
  @ResponseHeader('content-type', 'text/plain')
  @ResponseBody
  @ResponseHeader('date', '1602739429672')
  responseHeader(): string {
    return 'abcd';
  }

  @ResponseStatus(404)
  @RequestMapping({
    path: '/response404',
  })
  @ResponseBody
  response404(): string {
    return 'abcd';
  }
}
