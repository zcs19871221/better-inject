import {
  Controller,
  ModelAttribute,
  RequestMapping,
  RequestHeader,
  RequestParam,
  PathVariable,
} from '../..';
import User from './user';
import { IncomingMessage } from 'http';

@Controller
@RequestMapping({ path: '/{base}' })
export default class userController {
  public args: any;

  @ModelAttribute('gender')
  initModelGender(req: IncomingMessage): string {
    return '男' + req.headers.custom;
  }

  @ModelAttribute()
  initUser(
    @RequestHeader() id: string,
    @RequestParam() name: string,
    @PathVariable() alias: string,
  ): User {
    return new User(id, name, alias);
  }

  @ModelAttribute('age')
  initModelAge(): number {
    return 13;
  }

  @RequestMapping({ path: '/{alias}/{operate}' })
  get(
    @ModelAttribute() age: number,
    @ModelAttribute() user: User,
    @ModelAttribute('gender') genderModel: string,
  ): string {
    this.args = {
      age,
      user,
      genderModel,
    };
    return '';
  }
}
