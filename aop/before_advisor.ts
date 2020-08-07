import Advice from './advice';
import Invoker from './Invoker';

export default class BeforeAdvisor extends Advice {
  invoke(invoker: Invoker) {
    this.invokeAdvice(invoker);
    return invoker.invoke();
  }
}
