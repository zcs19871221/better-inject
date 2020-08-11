import Advice from './advice';
import Invoker from './Invoker';

export default class Aroundadvice extends Advice {
  invoke(invoker: Invoker) {
    return this.invokeAdvice(invoker);
  }
}
