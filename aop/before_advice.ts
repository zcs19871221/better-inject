import Advice from './advice';
import Invoker from './invoker_implement';

export default class Beforeadvice extends Advice {
  invoke(invoker: Invoker) {
    this.invokeAdvice(invoker);
    return invoker.invoke();
  }
}
