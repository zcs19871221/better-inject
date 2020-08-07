import Advice from './advice';
import Invoker from './invoker';

export default class AfterAdvisor extends Advice {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } finally {
      this.invokeAdvice(invoker);
    }
  }
}
