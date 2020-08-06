import Invoker from './Invoker';

export default abstract class Advisor {
  private classMatcher: RegExp|string;
  private methodMatcher: RegExp|string;
  private advice: any;
  private adviceMethod: string;

  constructor({
    classMatcher,
    methodMatcher,
    advice,
    adviceMethod,
  }: {
    classMatcher: RegExp|string;
    methodMatcher: RegExp|string;
    advice: any;
    adviceMethod: string;
  }) {
    this.classMatcher = classMatcher;
    this.methodMatcher = methodMatcher;
    this.advice = advice;
    this.adviceMethod = adviceMethod;
  }

  protected invokeAdvice(invoker: Invoker, ...args: any[]): any {
    return this.advice[this.adviceMethod](invoker, args);
  }

  abstract invoke(invoker: Invoker): any;

  matchClass(beanId: string): boolean {
    if (typeof this.classMatcher === 'string') {
      return this.classMatcher === beanId;
    }
    return this.classMatcher.test(beanId);
  }

  matchMethod(method: string): boolean {
    if (typeof this.methodMatcher === 'string') {
      return this.methodMatcher === method;
    }
    return this.methodMatcher.test(method);
  }
}
