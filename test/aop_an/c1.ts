import { Resource } from '../../';

@Resource()
export default class C1 {
  getName(args: string) {
    return args + 'zcs';
  }

  getError() {
    throw new Error('throw error');
  }
}
