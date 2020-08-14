import Advice from './advice';

export default class Advisor {
  private advice: Advice;
  private aspectId: string;
  private classMatcher;
  private methodMatcher;
  constructor({
    advice,
    aspectId,
    classMatcher,
    methodMatcher,
  }: {
    advice: Advice;
    aspectId: string;
  }) {
    this.advice = advice;
    this.aspectId = aspectId;
    this.classMatcher = classMatcher;
    this.methodMatcher = methodMatcher;
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }

  private match(target: string, matcherList: Matcher[]) {
    return matcherList.some(matcher => {
      if (typeof matcher === 'string') {
        return matcher === target;
      }
      return (<RegExp>matcher).test(target);
    });
  }

  getAspectId() {
    return this.aspectId;
  }

  getAdvice() {
    return this.advice;
  }
}
