import Advisor from './adivsor';
import Invoker from './Invoker';

export default class ErrorCatchAdvisor extends Advisor {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } catch (error) {
      this.invokeAdvice(invoker, error);
    }
  }
}
