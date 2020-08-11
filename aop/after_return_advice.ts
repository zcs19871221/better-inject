import Advice from './advice';
import Invoker from './Invoker';

export default class AfterReturn extends Advice {
  invoke(invoker: Invoker) {
    const res = invoker.invoke();
    this.invokeAdvice(invoker, res);
    return res;
  }
}
