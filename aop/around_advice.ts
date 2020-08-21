import Advice, { ADVICE_POSITION } from './advice';
import Invoker from './invoker_implement';

export default class Aroundadvice extends Advice {
  invoke(invoker: Invoker) {
    return this.invokeAdvice(invoker);
  }

  getPosition(): ADVICE_POSITION {
    return 'around';
  }
}
