import BeforeAdvisor from './before_advisor';
import AfterAdvisor from './after_advice';
import AroundAdvisor from './around_advice';
import ErrorCatchAdvisor from './error_catch_advisor';
import Advice from './advice';

const JOIN_POINT = ['after', 'errorCatch', 'around', 'before'] as const;
type Matcher = String | RegExp;
interface AspectOpt {
  advice: any;
  order?: number;
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
  joinPoint: [typeof JOIN_POINT[number], string?][];
}
export { AspectOpt };
export default class Aspect {
  private classMatcher: Matcher[];
  private methodMatcher: Matcher[];
  private order: number;
  private advices: Advice[] = [];

  constructor({
    classMatcher,
    methodMatcher,
    advice,
    joinPoint,
    order = 0,
  }: AspectOpt) {
    if (!Array.isArray(classMatcher)) {
      classMatcher = [classMatcher];
    }
    if (!Array.isArray(methodMatcher)) {
      methodMatcher = [methodMatcher];
    }
    this.classMatcher = classMatcher;
    this.methodMatcher = methodMatcher;
    this.order = order;
    const advices: {
      [key in typeof JOIN_POINT[number]]?: Advice;
    } = {};
    joinPoint.forEach(point => {
      let [position, methodName] = point;
      if (methodName === undefined) {
        methodName = position;
      }
      switch (position) {
        case 'before':
          advices.before = new BeforeAdvisor({
            methodMatcher,
            adviceMethod: methodName,
            advice,
            order,
          });
          break;
        case 'after':
          advices.after = new AfterAdvisor({
            methodMatcher,
            adviceMethod: methodName,
            advice,
            order,
          });
          break;
        case 'around':
          advices.around = new AroundAdvisor({
            methodMatcher,
            adviceMethod: methodName,
            advice,
            order,
          });
          break;
        case 'errorCatch':
          advices.errorCatch = new ErrorCatchAdvisor({
            methodMatcher,
            adviceMethod: methodName,
            advice,
            order,
          });
          break;
        default:
          throw new Error('错误连接点' + position);
      }
    });
    const adviceGroup: Advice[] = [];
    JOIN_POINT.forEach(value => {
      if (advices[value] !== undefined) {
        adviceGroup.push(<Advice>advices[value]);
      }
    });
    if (adviceGroup.length > 0) {
      this.advices = adviceGroup;
    }
  }

  getOrder() {
    return this.order;
  }

  getAdvice() {
    return this.advices;
  }

  private match(target: string, matcherList: Matcher[]) {
    return matcherList.some(matcher => {
      if (typeof matcher === 'string') {
        return matcher === target;
      }
      return matcher;
    });
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }
}
