import Advice, { ADVICE_POSITION } from './advice';
import Invoker from './invoker_implement';

export default class AfterThrow extends Advice {
  invoke(invoker: Invoker) {
    try {
      return invoker.invoke();
    } catch (error) {
      this.invokeAdvice(invoker, error);
      throw error;
    }
  }

  getPosition(): ADVICE_POSITION {
    return 'afterThrow';
  }
}
