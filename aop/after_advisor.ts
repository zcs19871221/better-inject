import Advisor from './adivsor';
import Invoker from './Invoker';

export default class AfterAdvisor extends Advisor {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } finally {
      this.invokeAdvice(invoker);
    }
  }
}
