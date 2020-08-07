import Invoker from './Invoker';

export default abstract class Advice {
  private aopObject: any;
  private adviceMethod: string;

  constructor({
    advice,
    adviceMethod,
  }: {
    methodMatcher: (String | RegExp) | (String | RegExp)[];
    advice: any;
    adviceMethod: string;
    order: number;
  }) {
    this.aopObject = advice;
    this.adviceMethod = adviceMethod;
  }

  protected invokeAdvice(invoker: Invoker, ...args: any[]): any {
    return this.aopObject[this.adviceMethod](invoker, args);
  }

  abstract invoke(invoker: Invoker): any;
}
