import Advice, { Advice_Position } from './advice';
import Invoker from './invoker_implement';

export default class Aroundadvice extends Advice {
  invoke(invoker: Invoker) {
    return this.invokeAdvice(invoker);
  }

  getPosition(): typeof Advice_Position[number] {
    return 'around';
  }
}
