import Advice, { Advice_Position } from './advice';
import Invoker from './invoker_implement';

export default class Afteradvice extends Advice {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } finally {
      this.invokeAdvice(invoker);
    }
  }

  getPosition(): typeof Advice_Position[number] {
    return 'after';
  }
}
