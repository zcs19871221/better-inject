import Advice, { Advice_Position } from './advice';
import { MatcherGroup, POINT_CUT_MATCHER } from './point_cut';
import Aspect from './aspect';

export default class Advisor {
  private advice: Advice;
  private aspect: Aspect;
  private classMatcher: MatcherGroup;
  private methodMatcher: MatcherGroup;
  constructor({
    advice,
    aspect,
    classMatcher,
    methodMatcher,
  }: {
    advice: Advice;
    aspect: Aspect;
  } & POINT_CUT_MATCHER) {
    this.advice = advice;
    this.aspect = aspect;
    this.classMatcher = classMatcher;
    this.methodMatcher = methodMatcher;
  }

  static groupSort(advisors: Advisor[]) {
    const byOrderAndPosition: {
      [key in typeof Advice_Position[number]]?: Advisor[];
    }[] = [];
    advisors.forEach(advisor => {
      const order = advisor.getOrder();
      const position = advisor.getAdvicePosition();
      byOrderAndPosition[order] = byOrderAndPosition[order] || {};
      byOrderAndPosition[order][position] =
        byOrderAndPosition[order][position] || [];
      byOrderAndPosition[order][position]?.push(advisor);
    });
    return byOrderAndPosition.filter(e => e);
  }

  getOrder() {
    return this.aspect.getOrder();
  }

  getAspectId() {
    return this.aspect.getId();
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }

  getAdvicePosition() {
    return this.advice.getPosition();
  }

  private match(target: string, matchers: MatcherGroup) {
    if (!Array.isArray(matchers)) {
      matchers = [matchers];
    }
    return matchers.some(matcher => {
      if (typeof matcher === 'string') {
        return matcher === target;
      }
      return (<RegExp>matcher).test(target);
    });
  }

  getAdvice() {
    return this.advice;
  }
}
