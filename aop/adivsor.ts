import Invoker from './Invoker';

type Matcher = RegExp | string;

export { Matcher };
export default abstract class Advisor {
  private classMatcher: Matcher | Matcher[];
  private methodMatcher: Matcher | Matcher[];
  private advice: any;
  private adviceMethod: string;

  constructor({
    classMatcher,
    methodMatcher,
    advice,
    adviceMethod,
  }: {
    classMatcher: RegExp | string;
    methodMatcher: RegExp | string;
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

  private match(target: string, matcher: Matcher | Matcher[]) {
    if (!Array.isArray(matcher)) {
      matcher = [matcher];
    }
    return matcher.every(eachMatcher => {
      if (typeof eachMatcher === 'string') {
        return eachMatcher === target;
      }
      return eachMatcher.test(target);
    });
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }
}
