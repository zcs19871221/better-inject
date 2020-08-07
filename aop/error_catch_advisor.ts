import Advice from './advice';
import Invoker from './Invoker';

export default class ErrorCatchAdvisor extends Advice {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } catch (error) {
      this.invokeAdvice(invoker, error);
    }
  }
}
