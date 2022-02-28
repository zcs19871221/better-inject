import { Resource } from '../..';
import B from './b';

@Resource({ auto: 'byType' })
export default class A {
  private fuckB: B;
  constructor(fuckB: B) {
    this.fuckB = fuckB;
  }

  showB() {
    return 'a invoker b:' + this.fuckB.name();
  }
}
