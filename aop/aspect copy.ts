import Advice, { AdviceCtr } from './advice';
import BeforeAdvice from './before_advice';
import AfterAdvice from './after_advice';
import AroundAdvice from './around_advice';
import AfterReturnAdvice from './after_return_advice';
import AfterThrowAdvice from './after_throw_advice';

const JOIN_POINT = [
  'afterReturn',
  'afterThrow',
  'after',
  'around',
  'before',
] as const;
type Matcher = String | RegExp;
interface AspectOpt {
  advice: any;
  order?: number;
  classMatcher: Matcher | Matcher[];
  methodMatcher: Matcher | Matcher[];
  joinPoint: [typeof JOIN_POINT[number], string?][];
}
export { AspectOpt, Matcher, JOIN_POINT };
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
      [key in typeof JOIN_POINT[number]]?: Advice[];
    } = {};
    const insertAdvices = (
      method: typeof JOIN_POINT[number],
      AdviceConstructor: AdviceCtr,
    ) => {
      advices[method] = advices[method] || [];
      advices[method]?.push(
        new AdviceConstructor({
          adviceMethod: method,
          advice,
        }),
      );
    };
    joinPoint.forEach(point => {
      let [position, methodName, pointCut] = point;
      if (methodName === undefined) {
        methodName = position;
      }
      switch (position) {
        case 'before':
          insertAdvices('before', BeforeAdvice);
          break;
        case 'after':
          insertAdvices('after', AfterAdvice);
          break;
        case 'around':
          insertAdvices('around', AroundAdvice);
          break;
        case 'afterThrow':
          insertAdvices('afterThrow', AfterThrowAdvice);
          break;
        case 'afterReturn':
          insertAdvices('afterReturn', AfterReturnAdvice);
          break;
        default:
          throw new Error('错误连接点' + position);
      }
    });
    const adviceGroup: Advice[] = [];
    JOIN_POINT.forEach(value => {
      if (advices[value] !== undefined) {
        adviceGroup.push(...(<Advice[]>advices[value]));
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
      return (<RegExp>matcher).test(target);
    });
  }

  matchClass(beanId: string): boolean {
    return this.match(beanId, this.classMatcher);
  }

  matchMethod(method: string): boolean {
    return this.match(method, this.methodMatcher);
  }
}
