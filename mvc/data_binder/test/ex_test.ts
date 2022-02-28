import {
  Controller,
  RequestMapping,
  RequestParam,
  Initbinder,
  DataBinder,
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
export default class initBinderController {
  public args: any = {};

  @Initbinder
  initName(binder: DataBinder) {
    binder.addConveter(
      {
        type: Date,
      },
      data => {
        return new Date(Number(data));
      },
    );
    binder.addConveter(
      {
        type: User,
      },
      data => {
        return new User(data);
      },
    );
  }

  @RequestMapping({
    path: '/initbinder',
  })
  getRequestBodyAndCharSetDecode(
    @RequestParam() publishTime: Date,
    @RequestParam() user: User,
  ): string {
    this.args = { publishTime, user };
    return '';
  }
}
