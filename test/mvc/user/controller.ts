import {
  Controller,
  RequestMapping,
  RequestParam,
  ModelView,
} from '../../../mvc';

@Controller
@RequestMapping({ path: '/user' })
export default class User {
  private base: string = 'test/mvc/user';

  @RequestMapping({
    path: '/index.html',
  })
  index(
    @RequestParam() name: string,
    @RequestParam() gender: string,
    model: ModelView,
  ): string {
    model.setModel('name', name);
    model.setModel('gender', gender);
    return this.base + '/index.pug';
  }
}
