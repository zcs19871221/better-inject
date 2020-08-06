import Advisor from './adivsor';
import Invoker from './Invoker';

export default class BeforeAdvisor extends Advisor {
  invoke(invoker: Invoker) {
    this.invokeAdvice(invoker);
    return invoker.invoke();
  }
}
