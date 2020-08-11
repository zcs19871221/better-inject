import Advice from './advice';
import Invoker from './invoker_implement';

export default class Afteradvice extends Advice {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } finally {
      this.invokeAdvice(invoker);
    }
  }
}
