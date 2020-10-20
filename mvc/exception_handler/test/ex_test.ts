import {
  Controller,
  RequestMapping,
  RequestParam,
  ExceptionHandler,
} from '../..';

@Controller
export default class exceptionhandlercontroller {
  public args: any = {};

  @ExceptionHandler(/其他错误/)
  handleError(error: Error) {
    this.args.other = error.message;
  }

  @ExceptionHandler(/值不存在/)
  handleParamNotExists(error: Error) {
    this.args.notExists = error.message;
  }

  @RequestMapping({
    path: '/errorHandler',
  })
  getRequestBodyAndCharSetDecode(@RequestParam() key: string): string {
    if (key) {
      throw new Error('其他错误');
    }
    return '';
  }
}
