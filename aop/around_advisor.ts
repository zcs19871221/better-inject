import Advisor from './adivsor';
import Invoker from './Invoker';

export default class AroundAdvisor extends Advisor {
  invoke(invoker: Invoker) {
    return this.invokeAdvice(invoker);
  }
}
