import Advice from './advice';
import Invoker from './Invoker';

export default class Beforeadvice extends Advice {
  invoke(invoker: Invoker) {
    this.invokeAdvice(invoker);
    return invoker.invoke();
  }
}
